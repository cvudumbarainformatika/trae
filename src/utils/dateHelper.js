// Mengubah string atau Date jadi format 'YYYY-MM-DD'
export function toISODate(dateInput) {
  const date = new Date(dateInput)
  return date.toISOString().split('T')[0]
}

export function toLocalDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Format tanggal dalam bahasa Indonesia, contoh: 14 Jun 2025
export function formatDateIndo(dateInput) {
  const date = new Date(dateInput)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function formatTimeIndo(dateInput) {
  const date = new Date(dateInput)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })?.replace('.', ':')
}

// Format rentang tanggal bahasa Indonesia
export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return ''
  return `${formatDateIndo(startDate)} - ${formatDateIndo(endDate)}`
}

// Dapatkan rentang awal & akhir bulan ini dalam ISO format
export function getCurrentMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return {
    start: toISODate(start),
    end: toISODate(end)
  }
}

// Cek apakah tanggal yang diberikan adalah 1 bulan ini
export function isFullCurrentMonth(startDate, endDate) {
  const { start, end } = getCurrentMonthRange()
  return toISODate(startDate) === start && toISODate(endDate) === end
}

export function getMonthStartDate() {
  const now = new Date()
  return toLocalDateString(new Date(now.getFullYear(), now.getMonth(), 1))
}

export function getMonthEndDate() {
  const now = new Date()
  return toLocalDateString(new Date(now.getFullYear(), now.getMonth() + 1, 0))
}

export function formatWaktuLalu(dateInput) {
  const now = new Date()
  const date = new Date(dateInput)
  const diff = (now - date) / 1000 // dalam detik

  if (diff < 60) return `${Math.floor(diff)} detik yang lalu`
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari yang lalu`
  if (diff < 31104000) return `${Math.floor(diff / 2592000)} bulan yang lalu`
  return `${Math.floor(diff / 31104000)} tahun yang lalu`
}
