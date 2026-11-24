import type { BookingStatus, PetSize, PetType, ServiceId } from '@/src/types';

export function manat(n: number) {
  const rounded = Math.round(n * 100) / 100;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace('.', ',');
  return `${text} ₼`;
}

const MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avqust',
  'sentyabr',
  'oktyabr',
  'noyabr',
  'dekabr',
];

const WEEKDAYS = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];
const WEEKDAYS_SHORT = ['B', 'Be', 'Ça', 'Ç', 'Ca', 'C', 'Ş'];

export function weekdayShort(index: number) {
  return WEEKDAYS_SHORT[index] ?? '';
}

export function parseDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function toIso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDate(iso: string) {
  const date = parseDate(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatDateLong(iso: string) {
  const date = parseDate(iso);
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatTime(iso: string) {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function nightsBetween(start: string, end: string) {
  const a = parseDate(start).getTime();
  const b = parseDate(end).getTime();
  return Math.max(1, Math.round((b - a) / 86400000));
}

export const PET_TYPE_LABEL: Record<PetType, string> = {
  it: 'İt',
  pisik: 'Pişik',
  qus: 'Quş',
  dovsan: 'Dovşan',
  diger: 'Digər',
};

export const SIZE_LABEL: Record<PetSize, string> = {
  kicik: 'Kiçik',
  orta: 'Orta',
  boyuk: 'Böyük',
};

export const STATUS_LABEL: Record<BookingStatus, string> = {
  gozlemede: 'Gözləmədə',
  aktiv: 'Aktiv',
  tamamlanmis: 'Tamamlanmış',
  imtina: 'İmtina',
};

export const SERVICE_LABEL: Record<ServiceId, string> = {
  geceleme: 'Gecələmə',
  gunduz: 'Gündüz baxımı',
  'eve-bas-cekme': 'Evə baş çəkmə',
  'it-gezdirme': 'İt gəzdirmə',
  'evde-gece-gunduz': 'Evdə gecə-gündüz baxım',
};

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function todayIso() {
  return toIso(new Date());
}

export function addDaysIso(iso: string, days: number) {
  const date = parseDate(iso);
  date.setDate(date.getDate() + days);
  return toIso(date);
}
