export function passwordConfirmValidator(passwordConfirm) {
  if (!passwordConfirm) return "Нууц үгээ оруулна уу.";
  if (passwordConfirm.length < 6)
    return "Password must be at least 5 characters long.";
  return "";
}
