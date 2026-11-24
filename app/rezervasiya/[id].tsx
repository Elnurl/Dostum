import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { WalkMap } from '@/components/WalkMap';
import { Card, GhostButton, PrimaryButton, ScreenPad, StatusPill } from '@/components/ui';
import { Image } from 'expo-image';
import { useApp } from '@/src/context/AppContext';
import { formatDateLong, manat, SERVICE_LABEL } from '@/src/lib/format';
import { colors } from '@/src/theme';

export default function ReservationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings, sitterById, pets, reports, walks, setBookingStatus, chats } = useApp();
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
            <PrimaryButton label="Mesajlara keç" tone="forest" onPress={() => router.push(`/chat/${chat.id}`)} />
          </View>
        ) : null}

        {booking.status === 'gozlemede' && booking.forUserAs === 'owner' ? (
          <View className="mt-3 gap-2">
            <PrimaryButton
              label="Baxıcı qəbulunu simulyasiya et"
              onPress={() => {
                setBookingStatus(booking.id, 'aktiv');
                Alert.alert('Qəbul olundu', 'Sifariş aktivdir. Canlı izləmə açıldı.');
              }}
            />
            <GhostButton
              label="Ləğv et və escrow-u qaytar"
              onPress={() => {
                setBookingStatus(booking.id, 'imtina');
                Alert.alert('Ləğv edildi', 'Məbləğ balansınıza qaytarıldı.');
              }}
            />
          </View>
        ) : null}

        {booking.status === 'aktiv' ? (
          <View className="mt-3">
            <PrimaryButton
              label="Xidməti tamamla"
              onPress={() => {
                setBookingStatus(booking.id, 'tamamlanmis');
                Alert.alert('Tamamlandı', 'Escrow açıldı.');
              }}
            />
          </View>
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
