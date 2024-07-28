export const validatePassword = (value: string) =>
  value.length >= 6 &&
  /[a-z]/g.test(value) &&
  /[A-Z]/g.test(value) &&
  /[0-9]/g.test(value)
    ? ""
    : "Пароль должен содержать более 6 символов, включая прописные/строчные буквы и цифры.";

export const required = (value: string) =>
  value ? "" : "Поле обязательно для заполнения";

export const validatePhone = (phoneNumber: string) =>
  phoneNumber.match(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g,
  )
    ? ""
    : "Номер телефона введен некорректно";

export const validateINN = (INN: string) =>
  !/^\d{10}$/g.test(INN) ? "Некорректный ИНН" : "";
