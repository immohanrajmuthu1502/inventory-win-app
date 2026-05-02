export const normalizePaymentMode = (value) => {
  if (value === "card") return "upi";
  return value || "-";
};

export const formatPaymentMode = (value) => {
  const mode = normalizePaymentMode(value);

  if (mode === "cash") return "Cash";
  if (mode === "upi") return "UPI";
  return mode;
};
