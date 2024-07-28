import { prisma } from "../../prisma";
import { ClientCategory, Profile } from "./types";

import * as jwt from "jsonwebtoken";
import { UserService } from "./user.service";

class ProfileService {
  async loadProfile(token): Promise<Profile> {
    const user = await UserService.getUserByToken(token);

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
      lastPasswordChangeTime: user.lastPasswordChangeTime.toISOString(),
    };
  }
}

export const profileService = new ProfileService();
