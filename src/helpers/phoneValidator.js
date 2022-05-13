export function phoneValidator(phone) {
  if (!phone) return "Утасны дугаараа оруулна уу.";
  if (!/^[0-9]+$/.test(phone)) return "Утасны дугаараа оруулна уу";
  if (phone.length < 8) return "Утасны дугаарны орон дутуу байна";
  if (phone.length > 8) return "Утасны дугаарны орон илүү байна";
  return "";
}
