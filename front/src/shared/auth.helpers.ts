export const validatePassword = (value: string) =>
  value.length >= 6 &&
  /[a-z]/g.test(value) &&
  /[A-Z]/g.test(value) &&
  /[0-9]/g.test(value)
    ? ""
    : "Пароль должен содержать более 6 символов, включая прописные/строчные буквы и цифры.";
