import { prisma } from "../../prisma";
import { ClientCategory, Profile } from "./types";
import { Request } from "../types";
import * as jwt from "jsonwebtoken";

import { UserService } from "./user.service";
import { searchQuotasService } from "../search-app/search-quotas.service";
import { UserTarrifsInclude } from "../billing/constants";

class ProfileService {
  async loadProfile(token): Promise<
    Profile & {
      isUnlimitedRequests: boolean;
      isUnlimitedDevices: boolean;
    }
  > {
    const userCreds = jwt.decode(token);
    const user = await prisma.user.findUnique({
      where: { id: userCreds.id },
      include: {
        tarrifs: UserTarrifsInclude,
      },
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
      tarrifs: user.tarrifs as any,
      isUnlimitedRequests: searchQuotasService.isUserUnlimitedRequests(
        user.tarrifs as any,
      ),
      isUnlimitedDevices: searchQuotasService.isUserUnlimitedDevices(
        user.tarrifs as any,
      ),
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
