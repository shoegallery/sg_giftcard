export function passwordValidator(password) {
  if (!password) return "Нууц үгээ оруулна уу.";
  if (password.length < 6) return "6 болон түүнээс их тэмдэгт оруулна уу";
  return "";
}
