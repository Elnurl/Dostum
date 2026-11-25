import { SERVICES } from '@/src/data/catalog';
import { SERVICE_LABEL } from '@/src/lib/format';
import type { Booking } from '@/src/types';

export const AI_SUGGESTIONS = [
  'Hansı xidmət Leo üçün uyğundur?',
  'Escrow necə işləyir?',
  'Baxıcı ilə necə ünsiyyət saxlayım?',
  'Rezervasiya ləğv qaydası',
  'İt gəzdirmə neçə saat olmalıdır?',
] as const;

export function answerAssistant(question: string, activeBooking?: Booking): string {
  const q = question.trim().toLowerCase();

  if (activeBooking) {
    return `Aktiv sifarişiniz (${SERVICE_LABEL[activeBooking.serviceId]}) qəbuldan sonra çatdan izlənilir. Baxıcı hesabat göndərdikcə burada da xatırlatma verəcəyik. Dəstək: zəmanət ekranından qaydaları oxuya bilərsiniz.`;
  }

  if (q.includes('escrow') || q.includes('ödəniş') || q.includes('pul')) {
    return 'Sifariş zamanı məbləğ + 15% platforma haqqı escrow-da bloklanır. Xidmət tamamlanana qədər baxıcıya ödəniş keçmir. Ləğvdə və ya imtinada məbləğ balansınıza qayıdır.';
  }

  if (q.includes('ləğv') || q.includes('imtina')) {
    return 'Gözləmədə olan sifarişi siz ləğv edə bilərsiniz — escrow qaytarılır. Baxıcı qəbul etdikdən sonra ləğv qaydalarına görə cüzdanda qeyd görünür.';
  }

  if (q.includes('gəz') || q.includes('gəzdirm')) {
    return 'İt gəzdirmə üçün çox vaxt 45–60 dəqiqə seçilir. Baxıcı GPS ilə marşrutu paylaşır. Aktiv sifarişdə çatda canlı izləyə bilərsiniz.';
  }

  if (q.includes('gecə') || q.includes('gecələm') || q.includes('boarding')) {
    return 'Gecələmə xidmətində heyvan baxıcının evində qalır. Uzun qalış üçün pişik və ya it profilində peyvənd və yemək rejimini əvvəlcədən doldurun.';
  }

  if (q.includes('pişik') || q.includes('it') || q.includes('leo') || q.includes('xidmət')) {
    const lines = SERVICES.slice(0, 3).map((s) => `• ${s.title}: ${s.description}`).join('\n');
    return `Xidmət seçərkən əvvəlcə ehtiyacınıza baxın:\n${lines}\n\nAxtarışda rayon, tarix və heyvan növü filtrindən istifadə edin.`;
  }

  if (q.includes('baxıcı') || q.includes('mesaj') || q.includes('çat')) {
    return 'Baxıcı profilində "Mesaj yaz" ilə ilkin sual göndərə bilərsiniz. Sifarişdən sonra eyni çatda foto, video və GPS hesabatları gəlir.';
  }

  if (q.includes('baxıcı ol') || q.includes('komissiya')) {
    return 'Baxıcı rejimində aktivləşmə planında sifarişlərdən 0% komissiya simulyasiya edilir (platforma haqqı sahib tərəfindən ödənilir). Aktivləşmə avtomatik sifarişə zəmanət vermir — təqvimdə boş günləri açıq saxlayın.';
  }

  return 'Salam! Mən dostum köməkçiyəm. Xidmət seçimi, escrow, rezervasiya və baxım tövsiyələri barədə soruşun. Aktiv sifarişiniz varsa, onu da izləyə bilərəm.';
}