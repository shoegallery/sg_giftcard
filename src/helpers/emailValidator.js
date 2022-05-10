export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/;
  if (!email) return "Утасны дугаараа оруулна уу.";
  if (!re.test(email)) return "Ooops! We need a valid email address.";
  return "";
}
