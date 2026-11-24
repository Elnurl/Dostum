import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { Chip, PrimaryButton, ScreenPad } from '@/components/ui';
import { PLATFORM_FEE, SERVICES } from '@/src/data/catalog';
import { quotePrice, upcomingDays, useApp } from '@/src/context/AppContext';
import { addDaysIso, formatDate, manat, PET_TYPE_LABEL } from '@/src/lib/format';
import { successTap } from '@/src/lib/haptics';
import type { ServiceId } from '@/src/types';

export default function BookingScreen() {
  const { sitterId, service } = useLocalSearchParams<{ sitterId: string; service?: ServiceId }>();
  const { sitterById, pets, createBooking } = useApp();
  const sitter = sitterById(sitterId);
  const days = upcomingDays(8);
  const [serviceId, setServiceId] = useState<ServiceId>((service as ServiceId) || 'geceleme');
  const [start, setStart] = useState(days[1] ?? days[0]);
  const [nights, setNights] = useState(1);
  const [hours, setHours] = useState(1);
  const [petIds, setPetIds] = useState<string[]>(pets[0] ? [pets[0].id] : []);

  const hourly = serviceId === 'it-gezdirme' || serviceId === 'eve-bas-cekme';
  const end = hourly ? start : addDaysIso(start, nights);

  const quote = useMemo(() => {
    if (!sitter) return null;
    return quotePrice(sitter, serviceId, start, end, hours);
  }, [sitter, serviceId, start, end, hours]);

  if (!sitter || !quote) {
    return (
      <ScreenPad>
        <Header title="Sifariş" />
        <Text className="px-5 text-muted">Baxıcı tapılmadı.</Text>
      </ScreenPad>
    );
  }

  const offered = sitter.services.some((s) => s.serviceId === serviceId);

  function togglePet(id: string) {
    setPetIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function submit() {
    if (!offered) {
      Alert.alert('Xidmət yoxdur', 'Bu baxıcı seçilmiş xidməti təklif etmir.');
      return;
    }
    if (petIds.length === 0) {
      Alert.alert('Dost seçin', 'Sifariş üçün ən azı bir heyvan seçin və ya əlavə edin.');
      return;
    }
    const booking = createBooking({ sitterId: sitter!.id, serviceId, petIds, startDate: start, endDate: end, hours });
    void successTap();
    Alert.alert(
      'Məbləğ bloklandı',
      `${manat(booking.total)} escrow-da saxlanılır. Xidmət tamamlanana qədər pul baxıcıya keçməyəcək.`,
      [{ text: 'Rezervasiyaya bax', onPress: () => router.replace(`/rezervasiya/${booking.id}`) }],
    );
  }

  return (
    <ScreenPad>
      <Header title="Sifariş et" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text className="text-ink font-bold text-xl">{sitter.name}</Text>
        <Text className="text-muted mb-4">{sitter.district} · şəxsiyyəti {sitter.verified ? 'təsdiqlənib' : 'gözləmədə'}</Text>

        <Text className="text-muted text-xs font-semibold mb-2">XİDMƏT</Text>
        <View className="flex-row flex-wrap mb-3">
          {SERVICES.filter((s) => sitter.services.some((x) => x.serviceId === s.id)).map((s) => (
            <Chip key={s.id} label={s.title} active={serviceId === s.id} onPress={() => setServiceId(s.id)} />
          ))}
        </View>

        <Text className="text-muted text-xs font-semibold mb-2">DOSTLARINIZ</Text>
        {pets.length === 0 ? (
          <Chip label="Dost əlavə et" active onPress={() => router.push('/heyvanlar/yeni')} />
        ) : (
          <View className="flex-row flex-wrap mb-3">
            {pets.map((p) => (
              <Chip
                key={p.id}
                label={`${p.name} · ${PET_TYPE_LABEL[p.type]}`}
                active={petIds.includes(p.id)}
                onPress={() => togglePet(p.id)}
              />
            ))}
          </View>
        )}

        <Text className="text-muted text-xs font-semibold mb-2">TARİX</Text>
        <View className="flex-row flex-wrap mb-3">
          {days.map((d) => (
            <Chip key={d} label={formatDate(d)} active={start === d} onPress={() => setStart(d)} />
          ))}
        </View>

        {hourly ? (
          <>
            <Text className="text-muted text-xs font-semibold mb-2">MÜDDƏT (saat)</Text>
            <View className="flex-row flex-wrap mb-3">
              {[1, 2, 3, 4].map((h) => (
                <Chip key={h} label={`${h} saat`} active={hours === h} onPress={() => setHours(h)} />
              ))}
            </View>
          </>
        ) : (
          <>
            <Text className="text-muted text-xs font-semibold mb-2">GECƏ / GÜN SAYI</Text>
            <View className="flex-row flex-wrap mb-3">
              {[1, 2, 3, 5, 7].map((n) => (
                <Chip key={n} label={`${n}`} active={nights === n} onPress={() => setNights(n)} />
              ))}
            </View>
          </>
        )}

        <View className="bg-white rounded-2xl p-4 mb-4">
          <Row label={`Xidmət (${quote.qty} × ${manat(quote.price)})`} value={manat(quote.subtotal)} />
          <Row label={`Platforma xidmət haqqı (${Math.round(PLATFORM_FEE * 100)}%)`} value={manat(quote.fee)} />
          <View className="h-px bg-line my-2" />
          <Row label="Cəmi" value={manat(quote.total)} bold />
          <Text className="text-muted text-xs mt-3 leading-5">
            Ödəniş xidmət tamamlanana qədər dostum escrow-unda bloklanır. Baxıcı yalnız iş bitəndən sonra məbləği görür.
          </Text>
        </View>

        <PrimaryButton label={`${manat(quote.total)} ödə və blokla`} onPress={submit} />
      </ScrollView>
    </ScreenPad>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className={bold ? 'text-ink font-bold' : 'text-muted'}>{label}</Text>
      <Text className={bold ? 'text-ink font-bold' : 'text-ink'}>{value}</Text>
    </View>
  );
}
