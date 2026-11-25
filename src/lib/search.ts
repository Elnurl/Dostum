import type { PetType, Sitter } from '@/src/types';

/** Mock təqvim: hər baxıcıya görə təxmini məşğul günlər */
export function sitterFreeOnDate(sitterId: string, date: string): boolean {
  if (date === 'all') return true;
  const day = new Date(`${date}T12:00:00`).getDate();
  const bucket = sitterId.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return (bucket + day) % 5 !== 0;
}

export function petTypeFitsSitter(sitter: Sitter, petType: PetType | 'all'): boolean {
  if (petType === 'all') return true;
  const sizes = sitter.acceptedSizes;
  if (sizes.length === 0) return false;
  if (petType === 'it') return true;
  if (petType === 'pisik') return sizes.some((s) => s === 'kicik' || s === 'orta');
  if (petType === 'qus' || petType === 'dovsan') return sizes.includes('kicik');
  return sizes.includes('kicik') || sizes.includes('orta');
}