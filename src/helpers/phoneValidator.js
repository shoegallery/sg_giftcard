export function phoneValidator(phone) {
  const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  if (!phone) return "Утасны дугаараа оруулна уу.";
  if (!re.test(phone)) return "Ooops! We need a valid email address.";
  return "";
}
