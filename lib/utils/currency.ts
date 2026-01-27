/**
 * Currency formatting utility that uses environment variable for currency symbol
 */
export function formatCurrency(amount: number): string {
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "USD"

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currencySymbol,
  }).format(amount)
}

/**
 * Get the current currency symbol from environment
 */
export function getCurrencySymbol(): string {
  return process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "USD"
}
