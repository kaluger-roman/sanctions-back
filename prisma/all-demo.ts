import { TarrifKind } from "../src/billing/types";
import { prisma } from "./prisma";

const start = async () => {
  await prisma.tarrif.create({
    data: {
      identifier: TarrifKind.demoPro,
      duration: 0.17,
      price: 0,
      allowedCountries: [
        "Южная Корея",
        "ЕС",
        "Австралия",
        "Великобритания",
        "США",
        "Китай",
      ],
    },
  });

  const freeUsers = await prisma.user.findMany({
    where: {
      tarrifs: {
        none: { end: { gte: new Date() } },
      },
    },
    include: { tarrifs: true },
  });

  console.log(freeUsers);

  for (const user of freeUsers) {
    await prisma.userTarrif.create({
      data: {
        start: new Date(),
        end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
        userId: user.id,
        tarrifId: 8,
      },
    });
  }
};

start();
