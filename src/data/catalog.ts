import type { ServiceId } from '@/src/types';

export type ServiceInfo = {
  id: ServiceId;
  title: string;
  description: string;
  emoji: string;
  group: 'sitter-home' | 'owner-home';
};

export const SERVICES: ServiceInfo[] = [
  {
    id: 'geceleme',
    title: 'Gecələmə',
    description: 'Heyvanınız baxıcının evində gecə-gündüz qalır.',
    emoji: '🌃',
    group: 'sitter-home',
  },
  {
    id: 'gunduz',
    title: 'Gündüz baxımı',
    description: 'Gün ərzində baxıcının evində qayğı.',
    emoji: '🌞',
    group: 'sitter-home',
  },
  {
    id: 'eve-bas-cekme',
    title: 'Evə baş çəkmə',
    description: 'Baxıcı evə gəlib yemək verir, oynayır və nəzarət edir.',
    emoji: '🔑',
    group: 'owner-home',
  },
  {
    id: 'it-gezdirme',
    title: 'İt gəzdirmə',
    description: 'Müəyyən müddətlik gəzinti — canlı GPS ilə.',
    emoji: '🐾',
    group: 'owner-home',
  },
  {
    id: 'evde-gece-gunduz',
    title: 'Evdə gecə-gündüz baxım',
    description: 'Baxıcı sizin evinizdə qalaraq baxır.',
    emoji: '🏠',
    group: 'owner-home',
  },
];

export const PLATFORM_FEE = 0.15;

export const TASKS = ['Yemək verildi', 'Su dəyişdirildi', 'Gəzintiyə çıxdı'] as const;

export const BAKU_WALK: { lat: number; lng: number }[] = [
  { lat: 40.3662, lng: 49.8358 },
  { lat: 40.3674, lng: 49.8381 },
  { lat: 40.3686, lng: 49.8406 },
  { lat: 40.3699, lng: 49.8432 },
  { lat: 40.3712, lng: 49.8455 },
  { lat: 40.3728, lng: 49.8479 },
  { lat: 40.3741, lng: 49.8504 },
  { lat: 40.3755, lng: 49.853 },
  { lat: 40.3768, lng: 49.8552 },
  { lat: 40.3779, lng: 49.8574 },
  { lat: 40.379, lng: 49.8598 },
  { lat: 40.3801, lng: 49.8622 },
];
