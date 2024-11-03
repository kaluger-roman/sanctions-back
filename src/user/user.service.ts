import {
  AuthPayload,
  ChangePasswordPayload,
  RecoverConfirmPayload,
  RecoverTokenRequestPayload,
  RegisterPayload,
  RegistrationConfirmPayload,
} from "./types";
import { createHash } from "crypto";
import * as jwt from "jsonwebtoken";
import { SocketErrors } from "@master_kufa/server-tools";
import { prisma } from "../../prisma";
import { nanoid } from "nanoid";
import { transporter } from "../shared/email-transporter";
import { Request } from "../types";
import { TarrifKind } from "src/billing/types";

export class UserService {
  static async getUserByToken(
    token: string,
    include?: { tarrifs: boolean | { include: { tarrif: boolean } } },
  ) {
    const userCreds = jwt.decode(token);
    const user = await prisma.user.findUnique({
      where: { id: userCreds.id },
      include,
    });

    return user;
  }
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

    if (existedUser)
      throw new Error("Пользователь с таким Email уже существует");

    const registrationConfirmToken = nanoid();

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        passwordHash: this.buildPasswordHash(payload.password),
        name: payload.name,
        surname: payload.surname,
        secondName: payload.secondName,
        phone: payload.phone,
        category: payload.clientCategory,
        isConfirmed: false,
        registrationConfirmToken,
        INN: payload.INN,
        companyName: payload.companyName,
      },
    });

    const freeTariff = await prisma.tarrif.findFirst({
      where: { identifier: TarrifKind.free },
    });

    await prisma.userTarrif.create({
      data: {
        userId: user.id,
        tarrifId: freeTariff.id,
      },
    });

    await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          to: payload.email,
          subject: "Регистрация на сайте GoodSanctionCheck",
          text: `Вы зарегистрировались на сайте GoodSanctionCheck. Для подтверждения перейдите по ссылке: https://goodsanctioncheck.com/registration_confirm/${registrationConfirmToken}`,
          textEncoding: "base64",
        },
        (err, info) => {
          if (err) return reject(err);

          resolve(info);
        },
      );
    });

    return payload.email;
  }

  async registrationConfirm(payload: RegistrationConfirmPayload) {
    const user =
      payload.confirmToken &&
      (await prisma.user.findFirst({
        where: { registrationConfirmToken: payload.confirmToken },
      }));

    if (!user) {
      throw new Error("Нет активной сессии подтверждения регистрации");
    }

    await prisma.user.updateMany({
      where: { registrationConfirmToken: payload.confirmToken },
      data: {
        isConfirmed: true,
        registrationConfirmToken: null,
      },
    });

    return "success";
  }

  async auth(payload: AuthPayload) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) throw new Error("Пользователь не существует");

    if (this.buildPasswordHash(payload.password) !== user.passwordHash)
      throw new Error("Неверный логин или пароль");

    return jwt.sign(
      {
        email: user.email,
        id: user.id,
        isAdmin: user.isAdmin,
        isConfirmed: user.isConfirmed,
      },
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

  async recoverTokenRequest({ email }: RecoverTokenRequestPayload) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Пользователь не найден");

    const recoverPasswordToken = nanoid();

    await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          to: email,
          subject: "Заявка на восстановление пароля GoodSanctionCheck",
          text: `Вы запросили восстановление пароля для аккаунта на сайте GoodSanctionCheck. Для продолжения перейдите по ссылке: https://goodsanctioncheck.com/recover_password_confirm/${recoverPasswordToken}`,
          textEncoding: "base64",
        },
        (err, info) => {
          if (err) return reject(err);

          resolve(info);
        },
      );
    });

    await prisma.user.update({
      where: { email },
      data: { recoverPasswordToken, recoverPasswordRequestTime: new Date() },
    });

    return "success";
  }

  async verifyRecoverTokenRequest(recoverPasswordToken: string) {
    const user =
      recoverPasswordToken &&
      (await prisma.user.findFirst({
        where: { recoverPasswordToken },
      }));

    if (!user) {
      throw new Error("Нет активной сессии восстановления пароля");
    }

    if (
      user.recoverPasswordRequestTime.getTime() + 1000 * 60 * 60 <
      Date.now()
    ) {
      prisma.user.updateMany({
        where: { recoverPasswordToken },
        data: { recoverPasswordToken: null, recoverPasswordRequestTime: null },
      });

      throw new Error(
        "Сессия восстановления пароля истекла, повторите попытку",
      );
    }

    return recoverPasswordToken;
  }

  async recoverPasswordConfirm(payload: RecoverConfirmPayload) {
    await this.verifyRecoverTokenRequest(payload.recoverPasswordToken);

    await prisma.user.updateMany({
      where: { recoverPasswordToken: payload.recoverPasswordToken },
      data: {
        passwordHash: this.buildPasswordHash(payload.password),
        recoverPasswordToken: null,
        recoverPasswordRequestTime: null,
      },
    });

    return "success";
  }
  async changePassword({
    token,
    oldPassword,
    newPassword,
  }: Request<ChangePasswordPayload>) {
    const user = await UserService.getUserByToken(token);

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    if (this.buildPasswordHash(oldPassword) !== user.passwordHash) {
      throw new Error("Старый пароль был введен неверно");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: this.buildPasswordHash(newPassword),
        lastPasswordChangeTime: new Date(),
      },
    });

    return "success";
  }
}

export const userService = new UserService();
