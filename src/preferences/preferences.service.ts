import { UserService } from "../user/user.service";
import { Request, PreferencesResponse } from "../types";
import { prisma } from "../../prisma";

class PreferencesService {
  loadPreferences = async ({
    token,
  }: Request<void>): Promise<PreferencesResponse> => {
    const preferences = await prisma.preferences.findFirst();

    if (!preferences) {
      throw new Error("Preferences not found");
    }

    // If user is authenticated, return user reports limit status
    if (!token) {
      return {
        maxWebViewTagsCount: preferences.maxWebViewTagsCount,
      };
    }

    try {
      const user = await UserService.getUserByToken(token);

      const currentReportsCount = await prisma.report.count({
        where: { userId: user.id, isDeleted: false },
      });

      return {
        currentReportsCount,
        maxUserReports: preferences.maxUserReports,
        maxWebViewTagsCount: preferences.maxWebViewTagsCount,
      };
    } catch (error) {
      // If token is invalid or user not found, return null
      console.log("Could not load user reports status:", error);
    }

    return null;
  };
}

export const preferencesService = new PreferencesService();
