export const validatePassword = (value: string) =>
  value.length >= 6 &&
  /[a-z]/g.test(value) &&
  /[A-Z]/g.test(value) &&
  /[0-9]/g.test(value);
