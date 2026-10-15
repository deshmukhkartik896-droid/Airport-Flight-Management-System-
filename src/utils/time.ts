export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

export function isoAt(date: string, hours: number, minutes: number): string {
  return `${date}T${pad2(hours)}:${pad2(minutes)}:00`
}

export function addMinutes(iso: string, minutes: number): string {
  const d = new Date(iso)
  d.setMinutes(d.getMinutes() + minutes)
  const y = d.getFullYear()
  const m = pad2(d.getMonth() + 1)
  const day = pad2(d.getDate())
  return `${y}-${m}-${day}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:00`
}

export function formatTime(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

export function formatDateTime(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

export function todayIsoDate(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function intervalsOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd
}
