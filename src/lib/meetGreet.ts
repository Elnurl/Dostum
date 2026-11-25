import type { MeetGreetStage } from '@/src/types';

export function meetGreetLabel(stage?: MeetGreetStage): string | null {
  switch (stage) {
    case 'mesaj':
      return 'Pulsuz mesaj';
    case 'gorus':
      return 'Görüş';
    case 'hazir':
      return 'Sifarişə hazır';
    case 'sifaris':
      return 'Sifariş var';
    default:
      return null;
  }
}