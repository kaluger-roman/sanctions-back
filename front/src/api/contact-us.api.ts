import { createEffect } from "effector";
import { socket } from "./app.api";
import { ACTIONS } from "./actions";

type ContactUsForm = {
  organizationName: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
};

export const submitForm = createEffect<void, ContactUsForm, string>(() =>
  socket.emitWithAnswer<void, ContactUsForm>(ACTIONS.SUBMIT_CONTACT_FORM),
);
