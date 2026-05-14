export function formatClp(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseClp(value: string) {
  const numericValue = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function parseNumericText(value: string) {
  const normalized = value.replace(",", ".").trim();
  const numericValue = Number(normalized);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function parseStockText(value: string) {
  if (value.toLowerCase().includes("pedido")) {
    return 0;
  }

  const numericValue = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
}
