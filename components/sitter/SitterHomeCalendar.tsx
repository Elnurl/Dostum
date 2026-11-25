import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Card, PrimaryButton, Tap } from '@/components/ui';
import { useApp, upcomingDays } from '@/src/context/AppContext';
import { toIso, weekdayShort } from '@/src/lib/format';
import { colors } from '@/src/theme';
import type { DayStatus } from '@/src/types';

export function SitterHomeCalendar({ onUpdate }: { onUpdate?: () => void }) {
  const { availability, toggleDay, touchSitterCalendar } = useApp();
  const week = useMemo(() => upcomingDays(7), []);
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const months = useMemo(() => {
    const out: { label: string; cells: { iso?: string; day?: number }[] }[] = [];
    for (let m = 0; m < 2; m += 1) {
      const base = new Date(cursor.getFullYear(), cursor.getMonth() + m, 1);
      const year = base.getFullYear();
      const month = base.getMonth();
      const first = new Date(year, month, 1);
      const startPad = (first.getDay() + 6) % 7;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const cells: { iso?: string; day?: number }[] = [];
      for (let i = 0; i < startPad; i += 1) cells.push({});
      for (let d = 1; d <= daysInMonth; d += 1) {
        cells.push({ iso: toIso(new Date(year, month, d)), day: d });
      }
      out.push({
        label: base.toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' }),
        cells,
      });
    }
    return out;
  }, [cursor]);

  const freeCount = week.filter((iso) => (availability[iso] ?? 'free') === 'free').length;

  function dayStyle(iso: string): DayStatus {
    return availability[iso] ?? 'free';
  }

  return (
    <View>
      <Card className="p-4 mb-4 flex-row items-center">
        <View className="w-12 h-12 rounded-2xl bg-moss items-center justify-center">
          <Ionicons name="flame" size={22} color={colors.forest} />
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-ink font-bold text-lg">{freeCount} gün</Text>
          <Text className="text-muted italic">Müsaitsiniz?</Text>
        </View>
      </Card>

      <ScrollWeek week={week} availability={availability} onToggle={toggleDay} />

      <Card className="p-4 mb-3">
        <View className="flex-row mb-3 gap-4">
          <Legend label="Müsait" className="bg-moss border-forest/20" />
          <Legend label="Dolu" className="bg-line" stripe />
        </View>
        {months.map((mo) => (
          <View key={mo.label} className="mb-4">
            <Text className="text-ink font-bold capitalize mb-2">{mo.label}</Text>
            <View className="flex-row flex-wrap">
              {mo.cells.map((cell, i) => {
                if (!cell.iso) {
                  return <View key={`e-${mo.label}-${i}`} className="w-[14.28%] aspect-square" />;
                }
                const free = dayStyle(cell.iso) === 'free';
                return (
                  <Tap key={cell.iso} onPress={() => toggleDay(cell.iso!)} className="w-[14.28%] aspect-square p-0.5">
                    <View
                      className={`flex-1 rounded-lg items-center justify-center border ${
                        free ? 'bg-moss border-forest/15' : 'bg-line border-line'
                      }`}>
                      <Text className={`text-xs font-semibold ${free ? 'text-forest' : 'text-muted'}`}>{cell.day}</Text>
                    </View>
                  </Tap>
                );
              })}
            </View>
          </View>
        ))}
        <View className="relative">
          <PrimaryButton
            label="Təqvimi yenilə"
            onPress={() => {
              touchSitterCalendar();
              onUpdate?.();
            }}
          />
          <View className="absolute -top-2 -right-1 bg-danger min-w-[20px] h-5 rounded-full items-center justify-center px-1">
            <Text className="text-white text-[10px] font-bold">1</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

function ScrollWeek({
  week,
  availability,
  onToggle,
}: {
  week: string[];
  availability: Record<string, DayStatus>;
  onToggle: (d: string) => void;
}) {
  return (
    <View className="flex-row justify-between mb-4 px-1">
      {week.map((iso, i) => {
        const d = new Date(iso);
        const free = (availability[iso] ?? 'free') === 'free';
        return (
          <Tap key={iso} onPress={() => onToggle(iso)} className="items-center flex-1">
            <Text className="text-muted text-[10px] font-semibold">{weekdayShort(d.getDay())}</Text>
            <View
              className={`mt-1 w-9 h-9 rounded-full items-center justify-center border ${
                free ? 'bg-moss border-forest/20' : 'bg-white border-line'
              }`}>
              {free ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.forest} />
              ) : (
                <Text className="text-muted text-sm font-semibold">{d.getDate()}</Text>
              )}
            </View>
            {i === 3 ? <View className="w-1.5 h-1.5 rounded-full bg-danger mt-1" /> : null}
          </Tap>
        );
      })}
    </View>
  );
}

function Legend({ label, className, stripe }: { label: string; className: string; stripe?: boolean }) {
  return (
    <View className="flex-row items-center">
      <View className={`w-4 h-4 rounded border ${className} ${stripe ? 'opacity-70' : ''}`} />
      <Text className="text-muted text-xs ml-2">{label}</Text>
    </View>
  );
}