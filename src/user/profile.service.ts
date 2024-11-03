import { prisma } from "../../prisma";
import { ClientCategory, Profile } from "./types";
import { Request } from "../types";

import { UserService } from "./user.service";

class ProfileService {
  async loadProfile(token): Promise<Profile> {
    const user = await UserService.getUserByToken(token, {
      tarrifs: {
        include: {
          tarrif: true,
        },
        orderBy: {
          end: "asc",
        },
      } as any,
    });

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
      tarrifs: user.tarrifs,
    };
  }
  async changeProfile(profile: Request<Profile>) {
    const user = await UserService.getUserByToken(profile.token);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: profile.name,
        surname: profile.surname,
        secondName: profile.secondName,
        phone: profile.phone,
        INN: profile.INN,
        companyName: profile.companyName,
      },
    });

    return "success";
  }
}

export const profileService = new ProfileService();
