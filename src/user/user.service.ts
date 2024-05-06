import { prisma } from "../../prisma";

class UserService {
  async recordUser(id?: number) {
    if (!(await prisma.user.findUnique({ where: { id } }))) {
      await prisma.user.create({ data: { id } });
    }
  }
}

export const userService = new UserService();
