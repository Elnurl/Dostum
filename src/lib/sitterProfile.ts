import type { Sitter } from '@/src/types';
import { SIZE_LABEL } from '@/src/lib/format';

const STREETS: Record<string, string> = {
  Nəsimi: 'Cəlil Məmmədquluzadə',
  Yasamal: 'Abbas Mirzə Şərifzadə',
  Səbail: 'Neftçilər prospekti',
  Xətai: 'Ziya Bünyadov',
  'Dənizkənarı': 'Bülbül prospekti',
  Binəqədi: 'Məhəmməd Hadi',
  Suraxanı: 'Hövsan',
  Nərimanov: 'Kaspi',
  Xəzər: 'Buzovna',
  Sabunçu: 'Ramana',
  Əhmədli: 'Məhəmməd Əziz Bəy oğlu',
  Nizami: '8 Noyabr',
  Qaradağ: 'Lökbatan',
};

export function sitterStreetLine(sitter: Sitter): string {
  const street = STREETS[sitter.district] ?? sitter.district;
  return `${street} küç., ${sitter.district}, Bakı`;
}

export function sitterDistanceKm(sitterId: string): string {
  const bucket = sitterId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const km = (0.8 + (bucket % 47) / 10).toFixed(1);
  return `${km} km`;
}

export function sitterAiSummary(sitter: Sitter): string {
  const home = sitter.homeType === 'heyet' ? 'istili, həyətlı mühitdə' : 'sakit mənzildə';
  const pets = sitter.hasOwnPets ? 'öz heyvanı ilə ünsiyyətə öyrəşib' : 'tam diqqət evdə başqa heyvan yoxdur';
  return (
    `Profilə əsasən ${sitter.name} dostunuzu ${home} qəbul edir; ${pets}. ${sitter.short}`
  );
}

export function sitterBestFor(sitter: Sitter): string[] {
  const lines: string[] = [];
  if (!sitter.hasOwnPets) {
    lines.push('Evində başqa heyvan yoxdur — tam diqqət.');
  } else {
    lines.push('Öz heyvanı ilə sosial ünsiyyətə öyrəşib.');
  }
  if (sitter.homeType === 'heyet') {
    lines.push('Həyət və əlavə gəzinti məkanları yaxındadır.');
  }
  const sizes = sitter.acceptedSizes.map((s) => SIZE_LABEL[s]).join(', ');
  lines.push(`Uyğun ölçülər: ${sizes} itlər və kiçik dostlar.`);
  if (sitter.acceptsRecurring) {
    lines.push('Müntəzəm, uzunmüddətli qayğı qəbul edir.');
  }
  return lines.slice(0, 4);
}

export function sitterGoodFitTitle(sitter: Sitter): string {
  if (!sitter.hasOwnPets) {
    return 'Öz sahəsini üstün tutan dostlar üçün uyğundur';
  }
  return 'Digər heyvanlarla harmoniya axtaranlar üçün uyğundur';
}

export function sitterGoodFitBody(sitter: Sitter): string {
  if (!sitter.hasOwnPets) {
    return 'Evində başqa heyvan yoxdur — minimal stress, maksimum diqqət.';
  }
  return sitter.ownPetsNote || 'Ev şəraiti barədə qısa qeyd profildə var.';
}

export function petTypesAcceptedNote(sitter: Sitter): string {
  return sitter.acceptedSizes.includes('kicik')
    ? `Pişiklər və ${SIZE_LABEL.kicik} itlər`
    : 'Əsasən itlər — ölçüyə uyğun qəbul';
}