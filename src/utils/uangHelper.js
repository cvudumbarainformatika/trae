export function formatRupiahNumber(value) {
  if (typeof value !== 'number') {
    value = Number(value)
    if (isNaN(value)) return '0'
  }

  return value
    .toFixed(0) // bulatkan tanpa desimal
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
