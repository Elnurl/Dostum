import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { Chip, EmptyState, ScreenPad, StatusPill, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatDate, manat, SERVICE_LABEL } from '@/src/lib/format';
import type { BookingStatus } from '@/src/types';

const TABS: { id: BookingStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Hamısı' },
  { id: 'gozlemede', label: 'Gözləmədə' },
  { id: 'aktiv', label: 'Aktiv' },
  { id: 'tamamlanmis', label: 'Tamamlanmış' },
];

export default function ReservationsScreen() {
  const { bookings, sitterById, pets } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('all');
  const list = useMemo(
    () =>
      bookings.filter((b) => b.forUserAs === 'owner' && (tab === 'all' || b.status === tab)),
    [bookings, tab],
  );

  return (
    <ScreenPad>
      <Header title="Rezervasiyalarım" />
      <View className="px-5 flex-row flex-wrap mb-2">
        {TABS.map((t) => (
          <Chip key={t.id} label={t.label} active={tab === t.id} onPress={() => setTab(t.id)} />
        ))}
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        {list.length === 0 ? (
          <EmptyState title="Rezervasiya yoxdur" text="Xidmət seçib baxıcı tapın — sifarişlər burada görünəcək." />
        ) : (
          list.map((b) => {
            const sitter = sitterById(b.sitterId);
            const petNames = pets.filter((p) => b.petIds.includes(p.id)).map((p) => p.name).join(', ');
            return (
              <Tap
                key={b.id}
                onPress={() => router.push(`/rezervasiya/${b.id}`)}
                className="bg-white rounded-2xl p-4 mb-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-ink font-semibold flex-1">{sitter?.name ?? 'Baxıcı'}</Text>
                  <StatusPill status={b.status} />
                </View>
                <Text className="text-muted mt-1">
                  {SERVICE_LABEL[b.serviceId]} · {petNames || 'dost'} · {formatDate(b.startDate)}
                </Text>
                <Text className="text-amber font-bold mt-1">{manat(b.total)}</Text>
                {b.status === 'aktiv' ? (
                  <Text className="text-forest text-sm mt-1">Canlı izləməyə keçin →</Text>
                ) : null}
              </Tap>
            );
          })
        )}
      </ScrollView>
    </ScreenPad>
  );
}
