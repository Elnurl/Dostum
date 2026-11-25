import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

import { Header } from '@/components/Header';
import { WalkMap } from '@/components/WalkMap';
import { Card, GhostButton, PrimaryButton, ScreenPad, StatusPill, Tap } from '@/components/ui';
import { Image } from 'expo-image';
import { useApp } from '@/src/context/AppContext';
import { formatDateLong, manat, SERVICE_LABEL } from '@/src/lib/format';
import { colors } from '@/src/theme';

export default function ReservationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings, sitterById, pets, reports, walks, setBookingStatus, chats, rateBooking } = useApp();
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState('');
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <ScreenPad>
        <Header title="Rezervasiya" />
        <Text className="px-5 text-muted">Sifariş tapılmadı.</Text>
      </ScreenPad>
    );
  }

  const sitter = sitterById(booking.sitterId);
  const petNames = pets.filter((p) => booking.petIds.includes(p.id)).map((p) => p.name).join(', ');
  const relatedReports = reports.filter((r) => r.bookingId === booking.id);
  const walk = walks.find((w) => w.bookingId === booking.id);
  const chat = chats.find((c) => c.bookingId === booking.id);

  return (
    <ScreenPad>
      <Header title="Rezervasiya" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-ink font-bold text-xl flex-1">{sitter?.name ?? booking.ownerName}</Text>
          <StatusPill status={booking.status} />
        </View>
        <Text className="text-muted">
          {SERVICE_LABEL[booking.serviceId]} · {petNames || booking.guestPetName || 'dost'}
        </Text>
        <Text className="text-ink mt-1">{formatDateLong(booking.startDate)}</Text>

        <Card className="p-4 mt-4">
          <Text className="text-muted text-xs font-semibold mb-2">ESCROW</Text>
          <Row label="Xidmət" value={manat(booking.subtotal)} />
          <Row label="Platforma (15%)" value={manat(booking.fee)} />
          <Row label="Bloklanan məbləğ" value={manat(booking.total)} />
          <Text className="text-muted text-xs mt-2">
            {booking.status === 'tamamlanmis'
              ? 'Xidmət bitdi, ödəniş baxıcıya keçdi.'
              : 'Pul xidmət tamamlanana qədər təhlükəsiz saxlanılır.'}
          </Text>
        </Card>

        {walk ? (
          <View className="mt-4">
            <WalkMap walk={walk} />
          </View>
        ) : null}

        {relatedReports.length > 0 ? (
          <>
            <Text className="text-ink font-bold text-lg mt-4 mb-2">Canlı hesabatlar</Text>
            {relatedReports.map((r) => (
              <Card key={r.id} className="p-3 mb-2">
                {r.photoUri ? (
                  <Image
                    source={{ uri: r.photoUri }}
                    style={{ width: '100%', height: 160, borderRadius: 12, marginBottom: 8, backgroundColor: colors.moss }}
                    contentFit="cover"
                  />
                ) : null}
                <Text className="text-ink">{r.note}</Text>
                {r.tasks.length > 0 ? (
                  <Text className="text-forest text-sm mt-1">{r.tasks.join(' · ')}</Text>
                ) : null}
              </Card>
            ))}
          </>
        ) : null}

        {chat ? (
          <View className="mt-3">
            <PrimaryButton label="Mesajlara keç" onPress={() => router.push(`/chat/${chat.id}`)} />
          </View>
        ) : null}

        {booking.status === 'gozlemede' && booking.forUserAs === 'owner' ? (
          <Card className="p-4 mt-3">
            <Text className="text-ink font-semibold">Baxıcının cavabı gözlənilir</Text>
            <Text className="text-muted text-sm mt-1">
              Pul escrow-da bloklanıb. Baxıcı panelindən (Baxıcı ol → Panel) sorğu qəbul olunanda aktiv olacaq.
            </Text>
            <View className="mt-3">
              <GhostButton
                label="Ləğv et və escrow-u qaytar"
                onPress={() => {
                  setBookingStatus(booking.id, 'imtina');
                  Alert.alert('Ləğv edildi', 'Məbləğ balansınıza qaytarıldı.');
                }}
              />
            </View>
          </Card>
        ) : null}

        {booking.status === 'aktiv' ? (
          <View className="mt-3">
            <PrimaryButton
              label="Xidməti tamamla"
              onPress={() => {
                setBookingStatus(booking.id, 'tamamlanmis');
                Alert.alert('Tamamlandı', 'Escrow açıldı. İndi rəy yaza bilərsiniz.');
              }}
            />
          </View>
        ) : null}

        {booking.status === 'tamamlanmis' && !booking.ownerReview ? (
          <Card className="p-4 mt-4">
            <Text className="text-ink font-bold text-lg mb-2">Baxıcıya rəy verin</Text>
            <View className="flex-row mb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Tap key={n} onPress={() => setStars(n)} className="mr-2">
                  <Text className={`text-2xl ${n <= stars ? 'text-amber' : 'text-line'}`}>★</Text>
                </Tap>
              ))}
            </View>
            <TextInput
              value={review}
              onChangeText={setReview}
              placeholder="Təcrübənizi qısaca yazın..."
              className="bg-white border border-line rounded-xl px-3 py-3 text-ink mb-3"
              multiline
            />
            <PrimaryButton
              label="Rəyi göndər"
              disabled={!review.trim()}
              onPress={() => {
                rateBooking(booking.id, stars, review.trim());
                Alert.alert('Təşəkkürlər', 'Rəyiniz qeydə alındı.');
                setReview('');
              }}
            />
          </Card>
        ) : null}

        {booking.ownerReview ? (
          <Card className="p-4 mt-4">
            <Text className="text-ink font-semibold">Sizin rəyiniz · ★ {booking.ownerReview.rating}</Text>
            <Text className="text-muted mt-1">{booking.ownerReview.text}</Text>
          </Card>
        ) : null}
      </ScrollView>
    </ScreenPad>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className="text-muted">{label}</Text>
      <Text className="text-ink font-semibold">{value}</Text>
    </View>
  );
}
