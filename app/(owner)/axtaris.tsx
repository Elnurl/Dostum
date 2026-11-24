import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SitterCard } from '@/components/SitterCard';
import { Sheet } from '@/components/Sheet';
import { Chip, EmptyState, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { SERVICES } from '@/src/data/catalog';
import { upcomingDays } from '@/src/context/AppContext';
import { useApp } from '@/src/context/AppContext';
import { formatDate, PET_TYPE_LABEL, SERVICE_LABEL } from '@/src/lib/format';
import { tap } from '@/src/lib/haptics';
import { colors } from '@/src/theme';
import { DISTRICTS, type District, type PetType, type ServiceId } from '@/src/types';

const PRICE_PRESETS = [
  { id: 'all', label: 'Hamısı' },
  { id: 'low', label: '0–15 ₼' },
  { id: 'mid', label: '15–25 ₼' },
  { id: 'high', label: '25+ ₼' },
] as const;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ service?: string }>();
  const { sitters } = useApp();
  const initial = (params.service as ServiceId | undefined) ?? 'all';
  const [service, setService] = useState<ServiceId | 'all'>(initial);
  const [district, setDistrict] = useState<District | 'all'>('all');
  const [petType, setPetType] = useState<PetType | 'all'>('all');
  const [date, setDate] = useState<string>('all');
  const [price, setPrice] = useState<(typeof PRICE_PRESETS)[number]['id']>('all');
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const days = upcomingDays(8);

  const filtered = useMemo(() => {
    return sitters.filter((s) => {
      if (district !== 'all' && s.district !== district) return false;
      if (service !== 'all' && !s.services.some((x) => x.serviceId === service)) return false;
      if (petType === 'it' && !s.acceptedSizes.includes('orta') && !s.acceptedSizes.includes('boyuk') && !s.acceptedSizes.includes('kicik'))
        return false;
      const offered = service !== 'all' ? s.services.find((x) => x.serviceId === service) : s.services[0];
      const p = offered?.price ?? 0;
      if (price === 'low' && p > 15) return false;
      if (price === 'mid' && (p < 15 || p > 25)) return false;
      if (price === 'high' && p < 25) return false;
      return true;
    });
  }, [sitters, district, service, petType, price]);

  const summary = [
    service !== 'all' ? SERVICE_LABEL[service] : null,
    district !== 'all' ? district : null,
    date !== 'all' ? formatDate(date) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <ScreenPad>
      <View style={{ paddingTop: insets.top + 8 }} className="px-5 pb-3">
        <Text className="text-ink font-bold text-2xl">Axtarış</Text>
        <Text className="text-muted text-sm mt-1">{summary || 'Bakı üzrə bütün baxıcılar'}</Text>
        <Tap
          onPress={() => setOpen(true)}
          className="mt-3 bg-white border border-line rounded-2xl px-4 py-3 flex-row items-center">
          <Ionicons name="options-outline" size={18} color={colors.forest} />
          <Text className="text-ink font-medium ml-2 flex-1">Filtrlər · rayon, tarix, qiymət</Text>
          <Ionicons name="chevron-down" size={16} color={colors.muted} />
        </Tap>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          <Chip label="Hamısı" active={service === 'all'} onPress={() => setService('all')} />
          {SERVICES.map((s) => (
            <Chip key={s.id} label={s.title} active={service === s.id} onPress={() => setService(s.id)} />
          ))}
        </ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={colors.forest}
            onRefresh={() => {
              void tap();
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 600);
            }}
          />
        }>
        {filtered.length === 0 ? (
          <EmptyState title="Baxıcı tapılmadı" text="Filtrləri yumşaldın — başqa rayon və ya xidmət seçin." />
        ) : (
          filtered.map((s) => (
            <SitterCard
              key={s.id}
              sitter={s}
              serviceId={service}
              onPress={() =>
                router.push({
                  pathname: '/baxici/[id]',
                  params: { id: s.id, service: service === 'all' ? s.services[0].serviceId : service },
                })
              }
            />
          ))
        )}
      </ScrollView>

      <Sheet open={open} onClose={() => setOpen(false)}>
        <Text className="text-ink font-bold text-lg mb-3">Filtrlər</Text>
        <Text className="text-muted text-xs font-semibold mb-2">RAYON</Text>
        <View className="flex-row flex-wrap">
          <Chip label="Hamısı" active={district === 'all'} onPress={() => setDistrict('all')} />
          {DISTRICTS.map((d) => (
            <Chip key={d} label={d} active={district === d} onPress={() => setDistrict(d)} />
          ))}
        </View>
        <Text className="text-muted text-xs font-semibold mb-2 mt-2">TARİX</Text>
        <View className="flex-row flex-wrap">
          <Chip label="Fərqi yoxdur" active={date === 'all'} onPress={() => setDate('all')} />
          {days.map((d) => (
            <Chip key={d} label={formatDate(d)} active={date === d} onPress={() => setDate(d)} />
          ))}
        </View>
        <Text className="text-muted text-xs font-semibold mb-2 mt-2">HEYVAN</Text>
        <View className="flex-row flex-wrap">
          <Chip label="Hamısı" active={petType === 'all'} onPress={() => setPetType('all')} />
          {(Object.keys(PET_TYPE_LABEL) as PetType[]).map((t) => (
            <Chip key={t} label={PET_TYPE_LABEL[t]} active={petType === t} onPress={() => setPetType(t)} />
          ))}
        </View>
        <Text className="text-muted text-xs font-semibold mb-2 mt-2">QİYMƏT</Text>
        <View className="flex-row flex-wrap mb-4">
          {PRICE_PRESETS.map((p) => (
            <Chip key={p.id} label={p.label} active={price === p.id} onPress={() => setPrice(p.id)} />
          ))}
        </View>
        <PrimaryButton label={`Göstər · ${filtered.length} baxıcı`} onPress={() => setOpen(false)} />
      </Sheet>
    </ScreenPad>
  );
}
