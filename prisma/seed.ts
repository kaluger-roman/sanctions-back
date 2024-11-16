import { PrismaClient } from "@prisma/client";
import { TarrifKind } from "../src/billing/types";
import { buildPasswordHash } from "../src/user/helpers";

const prisma = new PrismaClient();

const countries = ["Южная Корея", "ЕС", "Австралия", "Великобритания", "США"];
const baseTariffs = [
  {
    id: 1,
    identifier: TarrifKind.free,
    allowedCountries: countries,
  },
  {
    identifier: TarrifKind.physBasic,
    duration: 1,
    allowedRequests: 300,
    allowedDevices: 3,
    price: 5000,
    allowedCountries: countries,
  },
  {
    identifier: TarrifKind.physUpper,
    duration: 6,
    allowedDevices: 3,
    price: 25000,
    allowedCountries: countries,
  },
  {
    identifier: TarrifKind.physPro,
    duration: 12,
    allowedDevices: 3,
    price: 45000,
    allowedCountries: countries,
  },
  {
    identifier: TarrifKind.jurBasic,
    duration: 1,
    allowedRequests: 1000,
    price: 15000,
    allowedCountries: countries,
  },
  {
    identifier: TarrifKind.jurUpper,
    duration: 6,
    price: 75000,
    allowedCountries: countries,
  },
  {
    identifier: TarrifKind.jurPro,
    duration: 12,
    price: 135000,
    allowedCountries: countries,
  },
];

async function main() {
  if (!(await prisma.tarrif.count())) {
    await prisma.tarrif.createMany({ data: baseTariffs });
  }

  if (!(await prisma.user.count())) {
    const admin = await prisma.user.upsert({
      where: { email: process.env.ADMIN_USER },
      update: {},
      create: {
        email: process.env.ADMIN_USER,
        passwordHash: buildPasswordHash(process.env.ADMIN_PASSWORD),
        isAdmin: true,
        name: "Admin",
        surname: "Admin",
        phone: "123456789",
        category: "private",
      },
    });

    const freeTariff = await prisma.tarrif.findFirst({
      where: { identifier: TarrifKind.free },
    });

    await prisma.userTarrif.create({
      data: {
        userId: admin.id,
        tarrifId: freeTariff.id,
      },
    });
  }

  if (!(await prisma.preferences.count())) {
    await prisma.preferences.create({});
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
