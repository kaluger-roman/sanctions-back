import { transporter } from "../shared/email-transporter";
import { ContactForm } from "./types";

const options = {
  to: process.env.EMAIL_USER,
  subject: "Заявка GoodSanctionCheck",
  text: "Заявка GoodSanctionCheck",
  textEncoding: "base64",
};

class ContactService {
  async processContactForm(payload: ContactForm) {
    try {
      await new Promise((resolve, reject) => {
        transporter.sendMail(
          {
            ...options,
            html: `Имя: ${payload.name};<br/>Email: ${
              payload.email
            };<br/>Организация: ${
              payload.organizationName || "Не указано"
            };<br/>Телефон: ${payload.phoneNumber};<br/>Текст заявки:<br/>${
              payload.message
            }`,
          },
          (err, info) => {
            if (err) return reject(err);

            resolve(info);
          },
        );
      });

      return "success";
    } catch (error) {
      throw new Error("Ошибка. Попробуйте позже.");
    }
  }
}

export const contactService = new ContactService();
