import { Socket } from "socket.io";
import { UserService } from "./user/user.service";
import {
  ActiveConnections,
  addActiveUserConnection,
} from "./active-connections";
import { billingService } from "./billing/billing.service";
import { ACTIONS } from "./actions";
import { TarrifKind } from "./billing/types";
import { prisma } from "../prisma/prisma";

export const beforeAction = async (token: string, socket: Socket) => {
  if (!token) return;

  addActiveUserConnection(token, socket);
};

export const afterAction = async (token: string, socket: Socket) => {
  if (!token) return;

  const user = await UserService.getUserByToken(token);

  if (!user) return;

  const tarrifs = await prisma.userTarrif.findMany({
    where: { userId: user.id },
  });

  if (tarrifs.some((x) => x.isUserNoticed === false)) {
    await prisma.userTarrif.updateMany({
      where: {
        userId: user.id,
        isUserNoticed: false,
      },
      data: {
        isUserNoticed: true,
      },
    });
    ActiveConnections[user.id]?.forEach(async (socket) => {
      socket.emit(ACTIONS.BILLING_TARRIF_USER_NOTICED, {
        isUserNoticed: false,
      });
    });
  }
};
