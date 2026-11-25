import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomFilterSheet } from '@/components/BottomFilterSheet';
import { SearchMapView } from '@/components/SearchMapView';
import { SitterCard } from '@/components/SitterCard';
import { TrustStrip } from '@/components/TrustStrip';
import { Chip, EmptyState, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { SERVICES } from '@/src/data/catalog';
import { upcomingDays, useApp } from '@/src/context/AppContext';
import { formatDate, PET_TYPE_LABEL, SERVICE_LABEL } from '@/src/lib/format';
import { petTypeFitsSitter, sitterFreeOnDate } from '@/src/lib/search';
import { tap } from '@/src/lib/haptics';
import { colors } from '@/src/theme';
import { DISTRICTS, type District, type PetType, type ServiceId } from '@/src/types';

const PRICE_PRESETS = [
  { id: 'all', label: 'Hamısı' },
  { id: 'low', label: '0–15 ₼' },
  { id: 'mid', label: '15–25 ₼' },
  { id: 'high', label: '25+ ₼' },
] as const;

const RATING_FILTERS = [
  { id: 'all', label: 'Bütün reytinqlər' },
  { id: '4', label: '4.0+' },
  { id: '45', label: '4.5+' },
] as const;

const REPEAT_FILTERS = [
  { id: 'all', label: 'Hamısı' },
  { id: 'once', label: 'Birdəfəlik' },
  { id: 'recurring', label: 'Müntəzəm' },
] as const;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ service?: string | string[] }>();
  const { sitters, sendFreeInquiry, ensureChatWithSitter } = useApp();
  const paramService = Array.isArray(params.service) ? params.service[0] : params.service;
  const [service, setService] = useState<ServiceId | 'all'>(
    (paramService as ServiceId | undefined) ?? 'all',
  );
  const [district, setDistrict] = useState<District | 'all'>('all');
  const [petType, setPetType] = useState<PetType | 'all'>('all');
  const [date, setDate] = useState<string>('all');
  const [price, setPrice] = useState<(typeof PRICE_PRESETS)[number]['id']>('all');
  const [minRating, setMinRating] = useState<(typeof RATING_FILTERS)[number]['id']>('all');
  const [repeat, setRepeat] = useState<(typeof REPEAT_FILTERS)[number]['id']>('all');
  const [timeSlot, setTimeSlot] = useState<'all' | 'sabah' | 'gunorta' | 'axsam'>('all');
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState<'results' | 'map'>('results');
  const [picked, setPicked] = useState<string[]>([]);
  const days = upcomingDays(8);

  useEffect(() => {
    if (!paramService) return;
    const valid = SERVICES.some((s) => s.id === paramService);
    if (valid) setService(paramService as ServiceId);
  }, [paramService]);

  const filtered = useMemo(() => {
    return sitters.filter((s) => {
      if (district !== 'all' && s.district !== district) return false;
      if (service !== 'all' && !s.services.some((x) => x.serviceId === service)) return false;
      if (!petTypeFitsSitter(s, petType)) return false;
      if (date !== 'all' && !sitterFreeOnDate(s.id, date)) return false;
      if (minRating === '4' && s.rating < 4) return false;
      if (minRating === '45' && s.rating < 4.5) return false;
      if (repeat === 'recurring' && !s.acceptsRecurring) return false;
      const offered = service !== 'all' ? s.services.find((x) => x.serviceId === service) : s.services[0];
      const p = offered?.price ?? 0;
      if (price === 'low' && p > 15) return false;
      if (price === 'mid' && (p < 15 || p > 25)) return false;
      if (price === 'high' && p < 25) return false;
      if (timeSlot !== 'all') {
        const bucket = s.id.charCodeAt(0) % 3;
        const slotIndex = { sabah: 0, gunorta: 1, axsam: 2 }[timeSlot];
        if (bucket !== slotIndex) return false;
      }
      return true;
    });
  }, [sitters, district, service, petType, price, date, minRating, repeat, timeSlot]);

  const dateLabel = date !== 'all' ? formatDate(date) : 'Tarix əlavə et';
  const serviceLabel =
    service === 'all' ? 'Bütün xidmətlər' : (SERVICES.find((s) => s.id === service)?.title ?? 'Xidmət');

  function togglePick(id: string) {
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) {
        Alert.alert('Limit', 'Ən çox 5 baxıcı seçə bilərsiniz.');
        return prev;
      }
      return [...prev, id];
    });
  }

  return (
    <ScreenPad className="bg-sheet">
      <View style={{ paddingTop: insets.top + 6 }} className="px-4 pb-3 bg-white border-b border-line">
        <Tap
          onPress={() => setOpen(true)}
          className="bg-white border border-line rounded-2xl px-4 py-3 flex-row items-center">
          <Ionicons name="search" size={22} color={colors.forest} />
          <View className="flex-1 ml-3">
            <Text className="text-forest font-bold text-base">Filtrlər</Text>
            <Text className="text-muted text-sm">
              {serviceLabel} · {dateLabel} · {filtered.length} baxıcı
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color={colors.muted} />
        </Tap>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12, paddingRight: 8, alignItems: 'center' }}>
          <Chip label="Hamısı" active={service === 'all'} onPress={() => setService('all')} />
          {SERVICES.map((s) => (
            <Chip key={s.id} label={s.title} active={service === s.id} onPress={() => setService(s.id)} />
          ))}
        </ScrollView>
        <View className="flex-row gap-2 mt-3">
          <Tap
            onPress={() => setView('results')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${
              view === 'results' ? 'bg-moss border-forest' : 'bg-white border-line'
            }`}>
            <Ionicons name="list" size={18} color={view === 'results' ? colors.forest : colors.muted} />
            <Text className={`ml-2 font-semibold text-sm ${view === 'results' ? 'text-forest' : 'text-muted'}`}>
              Siyahı
            </Text>
          </Tap>
          <Tap
            onPress={() => setView('map')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${
              view === 'map' ? 'bg-moss border-forest' : 'bg-white border-line'
            }`}>
            <Ionicons name="map" size={18} color={view === 'map' ? colors.forest : colors.muted} />
            <Text className={`ml-2 font-semibold text-sm ${view === 'map' ? 'text-forest' : 'text-muted'}`}>
              Xəritə
            </Text>
          </Tap>
        </View>
      </View>

      {view === 'map' ? (
        <SearchMapView
          sitters={filtered}
          serviceId={service}
          districtLabel={district !== 'all' ? district : undefined}
          onOpenProfile={(s) =>
            router.push({
              pathname: '/baxici/[id]',
              params: { id: s.id, service: service === 'all' ? s.services[0].serviceId : service },
            })
          }
        />
      ) : (
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: picked.length ? 100 : 28,
            flexGrow: 1,
          }}
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
          <TrustStrip compact />
          <Text className="text-muted text-xs mb-3 px-1">
            Sifarişdən əvvəl mesaj yazın · kart tələb olunmur · + ilə 5 baxıcıya sorğu
          </Text>
          {filtered.length === 0 ? (
            <EmptyState title="Baxıcı tapılmadı" text="Filtrləri yumşaldın və tarix seçin." />
          ) : (
            filtered.map((s, i) => (
              <SitterCard
                key={s.id}
                sitter={s}
                index={i}
                serviceId={service}
                selected={picked.includes(s.id)}
                onToggleSelect={() => togglePick(s.id)}
                onPress={() =>
                  router.push({
                    pathname: '/baxici/[id]',
                    params: { id: s.id, service: service === 'all' ? s.services[0].serviceId : service },
                  })
                }
                onMessage={() => {
                  const chatId = ensureChatWithSitter(s.id);
                  router.push(`/chat/${chatId}`);
                }}
              />
            ))
          )}
        </ScrollView>
      )}

      {picked.length > 0 ? (
        <View className="absolute left-4 right-4 bottom-20 bg-white border border-amber/30 rounded-2xl px-4 py-3 flex-row items-center shadow-sm">
          <Ionicons name="add-circle-outline" size={20} color={colors.amber} />
          <Text className="text-ink text-sm ml-2 flex-1">
            {picked.length} baxıcı seçildi — kim boşdur, soruşun
          </Text>
          <Tap
            onPress={() => {
              sendFreeInquiry(picked, '');
              Alert.alert('Mesaj göndərildi', `${picked.length} baxıcıya pulsuz sorğu göndərildi. Mesajlar bölməsinə keçin.`);
              setPicked([]);
              router.navigate('/(owner)/mesajlar');
            }}>
            <Text className="text-forest font-semibold">Göndər</Text>
          </Tap>
        </View>
      ) : null}

      <BottomFilterSheet open={open} onClose={() => setOpen(false)}>
        <Text className="text-forest font-bold text-lg mb-3">Filtrlər</Text>
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
        <Text className="text-muted text-xs font-semibold mb-2 mt-2">REYTİNQ</Text>
        <View className="flex-row flex-wrap">
          {RATING_FILTERS.map((r) => (
            <Chip key={r.id} label={r.label} active={minRating === r.id} onPress={() => setMinRating(r.id)} />
          ))}
        </View>
        <Text className="text-muted text-xs font-semibold mb-2 mt-2">XİDMƏT</Text>
        <View className="flex-row flex-wrap">
          {REPEAT_FILTERS.map((r) => (
            <Chip key={r.id} label={r.label} active={repeat === r.id} onPress={() => setRepeat(r.id)} />
          ))}
        </View>
        <Text className="text-muted text-xs font-semibold mb-2 mt-2">VAXT</Text>
        <View className="flex-row flex-wrap">
          <Chip label="Hamısı" active={timeSlot === 'all'} onPress={() => setTimeSlot('all')} />
          <Chip label="Səhər" active={timeSlot === 'sabah'} onPress={() => setTimeSlot('sabah')} />
          <Chip label="Günorta" active={timeSlot === 'gunorta'} onPress={() => setTimeSlot('gunorta')} />
          <Chip label="Axşam" active={timeSlot === 'axsam'} onPress={() => setTimeSlot('axsam')} />
        </View>
        <Text className="text-muted text-xs font-semibold mb-2 mt-2">QİYMƏT</Text>
        <View className="flex-row flex-wrap mb-4">
          {PRICE_PRESETS.map((p) => (
            <Chip key={p.id} label={p.label} active={price === p.id} onPress={() => setPrice(p.id)} />
          ))}
        </View>
        <PrimaryButton label={`Göstər · ${filtered.length} baxıcı`} onPress={() => setOpen(false)} />
      </BottomFilterSheet>
    </ScreenPad>
  );
}