export function formatCurrency(amount, currencySymbol = "₦") {
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${currencySymbol}0.00`;

  return `${currencySymbol}${new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)}`;
}

export function formatPercent(value, decimals = 2) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "0.00%";
  return `${numericValue.toFixed(decimals)}%`;
}
