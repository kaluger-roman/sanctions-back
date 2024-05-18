import { contactUsApi } from "api";
import { createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { Notification } from "@master_kufa/client-tools";

export const $organizationName = createStore("");
export const $name = createStore("");
export const $email = createStore("");
export const $phoneNumber = createStore("");
export const $message = createStore("");
export const $phoneError = createStore("");
export const $emailError = createStore("");

export const PageGate = createGate();

export const changeOrganizationName = createEvent<string>();
export const changeName = createEvent<string>();
export const changeEmail = createEvent<string>();
export const changePhoneNumber = createEvent<string>();
export const changeMessage = createEvent<string>();

export const isNameEmpty = $name.map((name) => !name);
export const isEmailEmpty = $email.map((email) => !email);
export const isPhoneNumberEmpty = $phoneNumber.map(
  (phoneNumber) => !phoneNumber,
);
export const isMessageEmpty = $message.map((message) => !message);

export const submit = createEvent();

sample({
  clock: changeOrganizationName,
  target: $organizationName,
});

sample({
  clock: changeName,
  target: $name,
});

sample({
  clock: changeEmail,
  target: $email,
});

sample({
  clock: changePhoneNumber,
  target: $phoneNumber,
});

sample({
  clock: changeMessage,
  target: $message,
});

sample({
  clock: submit,
  source: $phoneNumber,
  fn: (phoneNumber) =>
    phoneNumber.match(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g,
    )
      ? ""
      : "Номер телефона введен некорректно",
  target: $phoneError,
});

sample({
  clock: submit,
  source: $email,
  fn: (email) =>
    email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
      ? ""
      : "Email введен некорректно",
  target: $emailError,
});

sample({
  clock: submit,
  source: {
    emailError: $emailError,
    phoneError: $phoneError,
    organizationName: $organizationName,
    name: $name,
    email: $email,
    phoneNumber: $phoneNumber,
    message: $message,
  },
  filter: ({ emailError, phoneError }) => !emailError && !phoneError,
  fn: ({ organizationName, name, email, phoneNumber, message }) => ({
    organizationName,
    name,
    email,
    phoneNumber,
    message,
  }),
  target: contactUsApi.submitForm,
});

sample({
  clock: contactUsApi.submitForm.done,
  fn: (): Notification.PayloadType => ({
    type: "success",
    message: "Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.",
  }),
  target: Notification.add,
});

$organizationName.reset(PageGate.close, contactUsApi.submitForm.done);
$name.reset(PageGate.close, contactUsApi.submitForm.done);
$email.reset(PageGate.close, contactUsApi.submitForm.done);
$phoneNumber.reset(PageGate.close, contactUsApi.submitForm.done);
$message.reset(PageGate.close, contactUsApi.submitForm.done);
$phoneError.reset(PageGate.close);
$emailError.reset(PageGate.close);
