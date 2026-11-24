import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, ScreenPad, StatusPill, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatDateLong, SERVICE_LABEL, toIso, weekdayShort } from '@/src/lib/format';
import { colors } from '@/src/theme';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { availability, toggleDay, bookings } = useApp();
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const grid = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { iso?: string; day?: number }[] = [];
    for (let i = 0; i < startPad; i += 1) cells.push({});
    for (let d = 1; d <= daysInMonth; d += 1) {
      cells.push({ iso: toIso(new Date(year, month, d)), day: d });
    }
    return cells;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' });
  const monthBookings = bookings.filter((b) => b.status !== 'imtina' && b.forUserAs === 'sitter');

  return (
    <ScreenPad>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 32, paddingHorizontal: 20 }}>
        <Text className="text-ink font-bold text-2xl">Təqvim</Text>
        <Text className="text-muted text-sm mt-1 mb-4">Günə toxunun: boş / məşğul</Text>

        <Card className="p-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Tap
              onPress={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="px-3 py-1">
              <Text className="text-forest font-semibold">‹</Text>
            </Tap>
            <Text className="text-ink font-semibold capitalize">{monthLabel}</Text>
            <Tap
              onPress={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="px-3 py-1">
              <Text className="text-forest font-semibold">›</Text>
            </Tap>
          </View>
          <View className="flex-row mb-2">
            {Array.from({ length: 7 }, (_, i) => (
              <Text key={i} className="flex-1 text-center text-[11px] text-muted font-semibold">
                {weekdayShort(i)}
              </Text>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {grid.map((cell, i) => {
              if (!cell.iso) {
                return <View key={`e-${i}`} className="w-[14.28%] aspect-square" />;
              }
              const busy = (availability[cell.iso] ?? 'free') === 'busy';
              const hasBooking = bookings.some(
                (b) => b.status !== 'imtina' && b.startDate <= cell.iso! && b.endDate >= cell.iso!,
              );
              return (
                <Tap key={cell.iso} onPress={() => toggleDay(cell.iso!)} className="w-[14.28%] aspect-square p-0.5">
                  <View
                    className={`flex-1 rounded-xl items-center justify-center ${
                      busy ? 'bg-amber/20' : 'bg-moss'
                    }`}>
                    <Text className={`text-sm font-semibold ${busy ? 'text-amber' : 'text-forest'}`}>{cell.day}</Text>
                    {hasBooking ? <View className="w-1 h-1 rounded-full bg-forest mt-0.5" /> : null}
                  </View>
                </Tap>
              );
            })}
          </View>
          <View className="flex-row mt-3 gap-3">
            <Text className="text-xs text-forest">● Boş</Text>
            <Text className="text-xs text-amber">● Məşğul</Text>
          </View>
        </Card>

        <Text className="text-ink font-bold text-lg mb-2">Rezervasiyalar</Text>
        {monthBookings.length === 0 ? (
          <Text className="text-muted">Bu ay üçün qəbul edilmiş sifariş yoxdur.</Text>
        ) : (
          monthBookings.map((b) => (
            <Card key={b.id} className="p-4 mb-2 flex-row items-center">
              <View className="flex-1">
                <Text className="text-ink font-semibold">{b.ownerName}</Text>
                <Text className="text-muted text-sm">
                  {SERVICE_LABEL[b.serviceId]} · {formatDateLong(b.startDate)}
                </Text>
              </View>
              <StatusPill status={b.status} />
            </Card>
          ))
        )}
      </ScrollView>
    </ScreenPad>
  );
}
