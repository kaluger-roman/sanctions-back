import { prisma } from "../../prisma";
import { ClientCategory, Profile } from "./types";

import * as jwt from "jsonwebtoken";

class ProfileService {
  async getUserByToken(token: string) {
    const userCreds = jwt.decode(token);
    const user = await prisma.user.findUnique({ where: { id: userCreds.id } });

    return user;
  }
  async loadProfile(token): Promise<Profile> {
    const user = await this.getUserByToken(token);

    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      name: user.name,
      surname: user.surname,
      secondName: user.secondName,
      phone: user.phone,
      INN: user.INN,
      category: user.category as ClientCategory,
      isConfirmed: user.isConfirmed,
      companyName: user.companyName,
    };
  }
}

export const profileService = new ProfileService();
