import { ACTIONS } from "../actions";

import { Api } from "../api.service";
import { Request } from "src/types";
import { ContactForm } from "./types";
import { contactService } from "./contact.service";

export const contactApiHandlers = {
  [ACTIONS.SUBMIT_CONTACT_FORM]: (payload: Request<ContactForm>) =>
    contactService.processContactForm(payload),
};

export const contactApi = new Api(contactApiHandlers);
