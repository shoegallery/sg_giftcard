export function tokenCodeValidator(tokenCode) {
  const re = "/^(?(d{3}))?[- ]?(d{3})[- ]?(d{4})$/";
  if (!tokenCode) return "Мессежээр ирсэн сэргээх кодоо оруулна уу";
  if (!/^[0-9]+$/.test(tokenCode)) return "Сэргээх код тоо байх ёстой";
  if (phone.length < 6) return "Сэргээх код 6 оронтой байна";
  if (phone.length > 6) return "Сэргээх код 6 оронтой байна";
  return "";
}
