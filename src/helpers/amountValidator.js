export function amountValidator(receiverAmount) {
  if (!receiverAmount) return "Мөнгөн дүнгээ оруулна уу";
  if (!/^[0-9]+$/.test(receiverAmount)) return "Зөвхөн тоог оруулна";

  if (receiverAmount <= 0) return "Тэгээс эрс их байх ёстой";
  return "";
}
