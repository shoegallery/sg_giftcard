export function passwordValidator(password) {
  if (!password) return "Нууц үгээ оруулна уу.";
  if (password.length < 6) return "Нууц үгний орон дутуу байна.";
  return "";
}
