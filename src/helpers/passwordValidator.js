export function passwordValidator(password) {
  if (!password) return "Нууц үгээ оруулна уу.";
  if (password.length < 6)
    return "Password must be at least 5 characters long.";
  return "";
}
