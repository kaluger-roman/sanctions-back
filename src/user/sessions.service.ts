import { AuthPayload, FORCE_LOGOUT_REASON, LastActivityPayload } from "./types";
import * as jwt from "jsonwebtoken";
import { SocketErrors } from "@master_kufa/server-tools";
import { prisma } from "../../prisma";
import { Request } from "../types";
import {
  ActiveConnections,
  deleteActiveUserConnection,
} from "../active-connections";
import { ACTIONS } from "../actions";
import { buildPasswordHash } from "./helpers";
import { UserService } from "./user.service";
import { Preferences } from "@prisma/client";
import { Socket } from "socket.io";

export class SessionsService {
  constructor() {
    this.autoLogoutWatch();
  }
  async auth(payload: Request<AuthPayload>) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) throw new Error("Пользователь не существует");

    if (buildPasswordHash(payload.password) !== user.passwordHash)
      throw new Error("Неверный логин или пароль");

    const activeUserSession = await prisma.userSession.findFirst({
      where: { userId: user.id, destroyedAt: null },
    });

    if (activeUserSession && !payload.forceLogin) {
      throw new Error("SESSION_ALREADY_EXISTS");
    }

    if (activeUserSession && payload.forceLogin) {
      await prisma.userSession.update({
        where: { id: activeUserSession.id },
        data: { destroyedAt: new Date() },
      });

      ActiveConnections[user.id]?.forEach((socket) =>
        socket.emit(ACTIONS.FORCE_LOGOUT, {
          reason: FORCE_LOGOUT_REASON.NEW_SESSION,
        }),
      );
    }

    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
        isAdmin: user.isAdmin,
        isConfirmed: user.isConfirmed,
        deviceId: payload.deviceId,
      },
      process.env.JWT_SECRET,
    );

    await prisma.userSession.create({
      data: {
        user: { connect: { id: user.id } },
        deviceId: payload.deviceId,
        token,
      },
    });

    return token;
  }

  async verifySession(payload: Request<object>) {
    await this.verifyToken(payload);

    const { id: userId } = await UserService.getUserByToken(payload.token);

    const preferences = await prisma.preferences.findFirst();

    const expiredSession = await prisma.userSession.findFirst({
      where: {
        userId,
        deviceId: payload.deviceId,
        destroyedAt: null,
        lastActivityTime: {
          lte: new Date(Date.now() - preferences.autoLogoutTime),
        },
      },
    });

    if (expiredSession) {
      await prisma.userSession.update({
        where: { id: expiredSession.id },
        data: { destroyedAt: new Date() },
      });

      throw new Error("SESSION_EXPIRED");
    }

    const otherActiveSessions = await prisma.userSession.findFirst({
      where: {
        userId,
        deviceId: { not: payload.deviceId },
        destroyedAt: null,
      },
    });

    if (otherActiveSessions) {
      throw new Error("SESSION_ALREADY_EXISTS");
    }

    await prisma.$transaction(async () => {
      const activeUserSession = await prisma.userSession.findFirst({
        where: { userId, destroyedAt: null, deviceId: payload.deviceId },
      });

      if (activeUserSession) {
        await this.recordLastActivity({ ...payload, timestamp: Date.now() });
      }
    });
  }

  async verifyToken(payload: Request<object>) {
    try {
      jwt.verify(payload.token, process.env.JWT_SECRET);

      const decoded = jwt.decode(payload.token);

      return decoded;
    } catch (e) {
      throw new Error(SocketErrors.UNAUTHORIZED);
    }
  }

  async recordLastActivity(payload: Request<LastActivityPayload>) {
    const user = await UserService.getUserByToken(payload.token);

    await prisma.userSession.updateMany({
      where: { userId: user.id, destroyedAt: null, deviceId: payload.deviceId },
      data: {
        lastActivityTime: new Date(payload.timestamp),
      },
    });

    return "success";
  }
  async logout(payload: Request<void>, socket: Socket) {
    const user = await UserService.getUserByToken(payload.token);

    await prisma.userSession.updateMany({
      where: { userId: user.id, deviceId: payload.deviceId },
      data: { destroyedAt: new Date() },
    });

    deleteActiveUserConnection(socket);

    return "success";
  }
  async autoLogoutWatch() {
    const preferences = await prisma.preferences.findFirst();

    setInterval(
      () => this.autoLogout(preferences),
      preferences.autoLogoutCheckTime,
    );
  }
  async autoLogout(preferences: Preferences) {
    const userSessions = await prisma.userSession.findMany({
      where: {
        destroyedAt: null,
        lastActivityTime: {
          lte: new Date(Date.now() - preferences.autoLogoutTime),
        },
      },
    });

    for (const session of userSessions) {
      ActiveConnections[session.userId]?.forEach((socket) => {
        socket.emit(ACTIONS.INACTIVITY_LOGOUT);

        setTimeout(async () => {
          const updatedSession = await prisma.userSession.findFirst({
            where: { id: session.id },
          });

          const isStillInactive =
            updatedSession.lastActivityTime.getTime() <=
            Date.now() - preferences.autoLogoutTime;

          if (isStillInactive) {
            await prisma.userSession.update({
              where: { id: session.id },
              data: { destroyedAt: new Date() },
            });

            socket.emit(ACTIONS.FORCE_LOGOUT, {
              reason: FORCE_LOGOUT_REASON.INACTIVITY,
            });
          }
        }, 60000);
      });
    }
  }
}

export const sessionsService = new SessionsService();
