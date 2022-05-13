export function tokenCodeValidator(tokenCode) {
  if (!tokenCode) return "Мессежээр ирсэн сэргээх кодоо оруулна уу";
  if (!/^[0-9]+$/.test(tokenCode)) return "Сэргээх код тоо байх ёстой";
  if (tokenCode.length < 6) return "Сэргээх код 6 оронтой байна";
  if (tokenCode.length > 6) return "Сэргээх код 6 оронтой байна";
  return "";
}
