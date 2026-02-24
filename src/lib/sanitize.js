export function sanitizeText(value, max = 500) {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, max);
}

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function normalizePlate(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}
