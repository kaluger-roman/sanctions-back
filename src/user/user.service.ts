import { AuthPayload, RegisterPayload } from "./types";
import { createHash } from "crypto";
import * as jwt from "jsonwebtoken";
import { SocketErrors } from "@master_kufa/server-tools";
import { prisma } from "../../prisma";

class UserService {
  buildPasswordHash(password: string) {
    return createHash("sha256").update(password).digest("hex");
  }
  async recordUser(email?: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("User does not exist");
    }

    delete user.passwordHash;

    return user;
  }
  async create(payload: RegisterPayload) {
    const existedUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existedUser) throw new Error("User already exists");

    await prisma.user.create({
      data: {
        email: payload.email,
        passwordHash: this.buildPasswordHash(payload.password),
      },
    });

    return payload.email;
  }

  async auth(payload: AuthPayload) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) throw new Error("User does not exist");

    if (this.buildPasswordHash(payload.password) !== user.passwordHash)
      throw new Error("Wrong password");

    return jwt.sign(
      { email: user.email, id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
    );
  }

  verify(token: string) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);

      return jwt.decode(token);
    } catch (e) {
      throw new Error(SocketErrors.UNAUTHORIZED);
    }
  }
}

export const userService = new UserService();
