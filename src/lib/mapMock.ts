import type { Sitter } from '@/src/types';

/** Bakı xəritəsi üzrə mock koordinatlar (0–1, yuxarıdan-aşağı / soldan-sağa) */
export function sitterMapPin(sitterId: string, index: number) {
  const bucket = sitterId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const x = 0.12 + ((bucket + index * 17) % 76) / 100;
  const y = 0.14 + ((bucket * 3 + index * 11) % 68) / 100;
  return { x, y };
}

export const BAKU_MAP_LABELS = [
  { x: 0.08, y: 0.22, label: 'Nəsimi' },
  { x: 0.42, y: 0.18, label: 'Yasamal' },
  { x: 0.78, y: 0.28, label: 'Səbail' },
  { x: 0.55, y: 0.52, label: 'Xətai' },
  { x: 0.25, y: 0.62, label: 'Dənizkənarı' },
];

export type MapPin = { sitter: Sitter; x: number; y: number };

export function sittersToMapPins(sitters: Sitter[]): MapPin[] {
  return sitters.map((sitter, index) => {
    const { x, y } = sitterMapPin(sitter.id, index);
    return { sitter, x, y };
  });
}