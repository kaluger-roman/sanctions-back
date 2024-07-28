import {
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from "effector";
import { authApi } from "../../api";
import { createGate } from "effector-react";
import { navigation } from "shared/navigate";
import { Notification } from "@master_kufa/client-tools";
import { Paths } from "../../shared/paths";
import { validateINN, validatePassword } from "shared/auth.helpers";
import { ClientCategory } from "shared/billing";

export const emailTextChanged = createEvent<string>();
export const passwordTextChanged = createEvent<string>();
export const passwordConfirmTextChanged = createEvent<string>();
export const changeclientCategory = createEvent<ClientCategory>();

export const changeName = createEvent<string>();
export const changeSurname = createEvent<string>();
export const changeSecondName = createEvent<string>();
export const changePhone = createEvent<string>();
export const changeCompanyName = createEvent<string>();
export const changeINN = createEvent<string>();

export const registerClicked = createEvent();

export const $emailText = restore(emailTextChanged, "");
export const $passwordText = restore(passwordTextChanged, "");
export const $passwordConfirmText = restore(passwordConfirmTextChanged, "");

export const $clientCategory = createStore<ClientCategory>(
  ClientCategory.private,
);
export const $emailTextError = createStore("");
export const $passwordTextError = createStore("");
export const $passwordConfirmTextError = createStore("");
export const $phoneError = createStore("");
export const $INNError = createStore("");
export const $companyNameError = createStore("");
export const $nameError = createStore("");
export const $surnameError = createStore("");
export const $isRegisterStarted = createStore<boolean>(false);

export const $name = createStore("");
export const $surname = createStore("");
export const $secondName = createStore("");
export const $phone = createStore("");

export const $companyName = createStore("");
export const $INN = createStore("");

export const $registerPending = authApi.registerFx.pending;

export const PageGate = createGate();

export const redirectToAuthFx = createEffect(() =>
  navigation.navigate(Paths.auth),
);

sample({
  clock: changeclientCategory,
  target: $clientCategory,
});

sample({
  clock: changeName,
  target: $name,
});

sample({
  clock: changeSurname,
  target: $surname,
});

sample({
  clock: changeSecondName,
  target: $secondName,
});

sample({
  clock: changePhone,
  target: $phone,
});

sample({
  clock: changeCompanyName,
  target: $companyName,
});

sample({
  clock: changeINN,
  target: $INN,
});

sample({
  clock: registerClicked,
  source: $emailText,
  fn: (email) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)
      ? ""
      : "Некорректный email.",
  target: $emailTextError,
});

sample({
  clock: registerClicked,
  source: $phone,
  fn: (phone) =>
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/g.test(phone)
      ? ""
      : "Некорректный номер телефона",

  target: $phoneError,
});

sample({
  clock: registerClicked,
  source: [$clientCategory, $INN] as const,
  fn: ([clientCategory, INN]) =>
    clientCategory === ClientCategory.company ? validateINN(INN) : "",
  target: $INNError,
});

sample({
  clock: registerClicked,
  source: $name,
  fn: (name) => (name ? "" : "Поле обязательно для заполнения"),
  target: $nameError,
});

sample({
  clock: registerClicked,
  source: $surname,
  fn: (surname) => (surname ? "" : "Поле обязательно для заполнения"),
  target: $surnameError,
});

sample({
  clock: registerClicked,
  source: $companyName,
  fn: (companyName) => (companyName ? "" : "Поле обязательно для заполнения"),
  target: $companyNameError,
});

sample({
  clock: registerClicked,
  source: $passwordText,
  fn: (password) => validatePassword(password),
  target: $passwordTextError,
});

sample({
  clock: registerClicked,
  source: [$passwordText, $passwordConfirmText],
  fn: ([password, confirmation]) =>
    password === confirmation ? "" : "Пароли не совпадают",
  target: $passwordConfirmTextError,
});

sample({
  clock: registerClicked,
  source: {
    email: $emailText,
    password: $passwordText,
    emailTextError: $emailTextError,
    passwordTextError: $passwordTextError,
    passwordConfirmTextError: $passwordConfirmTextError,
    name: $name,
    surname: $surname,
    secondName: $secondName,
    phone: $phone,
    companyName: $companyName,
    companyNameError: $companyNameError,
    INN: $INN,
    nameError: $nameError,
    surnameError: $surnameError,
    phoneError: $phoneError,
    INNError: $INNError,
    clientCategory: $clientCategory,
  },
  filter: ({
    emailTextError,
    passwordTextError,
    passwordConfirmTextError,
    nameError,
    surnameError,
    phoneError,
    INNError,
    clientCategory,
    companyNameError,
  }) =>
    !emailTextError &&
    !passwordTextError &&
    !passwordConfirmTextError &&
    !nameError &&
    !surnameError &&
    !companyNameError &&
    !phoneError &&
    !(INNError && clientCategory === ClientCategory.company),
  fn: ({
    email,
    password,
    name,
    surname,
    INN,
    phone,
    secondName,
    clientCategory,
    companyName,
  }) => ({
    email,
    password,
    name,
    surname,
    INN,
    phone,
    secondName,
    companyName,
    clientCategory,
  }),
  target: authApi.registerFx,
});

sample({
  clock: authApi.registerFx.doneData,
  target: redirectToAuthFx,
});

sample({
  clock: authApi.registerFx.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message:
      "Пользователь успешно создан. На почту отправлено письмо для подтверждения регистрации.",
  }),
  target: Notification.add,
});

sample({
  clock: authApi.registerFx.failData,
  fn: (message: string): Notification.PayloadType => ({
    type: "error",
    message,
  }),
  target: Notification.add,
});

sample({
  clock: authApi.registerFx.done,
  fn: () => true,
  target: $isRegisterStarted,
});

$emailText.reset(PageGate.close, $clientCategory);
$passwordText.reset(PageGate.close, $clientCategory);
$passwordConfirmText.reset(PageGate.close, $clientCategory);
$emailTextError.reset(PageGate.close, $clientCategory);
$passwordTextError.reset(PageGate.close, $clientCategory);
$passwordConfirmTextError.reset(PageGate.close, $clientCategory);

$name.reset(PageGate.close, $clientCategory);
$surname.reset(PageGate.close, $clientCategory);
$secondName.reset(PageGate.close, $clientCategory);
$phone.reset(PageGate.close, $clientCategory);
$companyName.reset(PageGate.close, $clientCategory);
$INN.reset(PageGate.close, $clientCategory);
$INNError.reset(PageGate.close, $clientCategory);
$nameError.reset(PageGate.close, $clientCategory);
$surnameError.reset(PageGate.close, $clientCategory);
$phoneError.reset(PageGate.close, $clientCategory);
$companyNameError.reset(PageGate.close, $clientCategory);
$isRegisterStarted.reset(PageGate.close);

$clientCategory.reset(PageGate.close);
