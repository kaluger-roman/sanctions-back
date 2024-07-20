import { PrismaClient } from "@prisma/client";
import { userService } from "../src/user";
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_USER },
    update: {},
    create: {
      email: process.env.ADMIN_USER,
      passwordHash: userService.buildPasswordHash(process.env.ADMIN_PASSWORD),
      isAdmin: true,
      name: "Admin",
      surname: "Admin",
      phone: "123456789",
      category: "private",
    },
  });
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
