const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export const formatCurrency = (amount: number): string => currencyFormatter.format(amount)

export const formatDate = (isoDate: string): string => dateFormatter.format(new Date(isoDate))
