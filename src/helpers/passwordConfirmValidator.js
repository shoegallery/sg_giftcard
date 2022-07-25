export function passwordConfirmValidator(passwordConfirm) {
  if (!passwordConfirm) return "Нууц үгээ оруулна уу.";
  if (passwordConfirm.length < 6)
    return "6 болон түүнээс их тэмдэгт оруулна уу";
  return "";
}
