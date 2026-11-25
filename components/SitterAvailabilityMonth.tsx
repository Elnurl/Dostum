import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { sitterFreeOnDate } from '@/src/lib/search';
import { formatDate, todayIso } from '@/src/lib/format';

function monthLabel(d: Date): string {
  return d.toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' });
}

export function SitterAvailabilityMonth({ sitterId }: { sitterId: string }) {
  const { title, days, weekStarts } = useMemo(() => {
    const start = new Date();
    start.setHours(12, 0, 0, 0);
    const year = start.getFullYear();
    const month = start.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const weekStarts = (first.getDay() + 6) % 7;
    const cells: { iso: string; day: number; free: boolean }[] = [];
    for (let d = 1; d <= last.getDate(); d++) {
      const iso = new Date(year, month, d).toISOString().slice(0, 10);
      cells.push({ iso, day: d, free: sitterFreeOnDate(sitterId, iso) });
    }
    return { title: monthLabel(first), days: cells, weekStarts };
  }, [sitterId]);

  return (
    <View>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-ink font-bold text-base">{title}</Text>
        <View className="flex-row items-center gap-3">
          <Legend dot="bg-moss border-forest" label="Boş" />
          <Legend dot="bg-white border-line" label="Dolu" />
        </View>
      </View>
      <View className="flex-row mb-1">
        {['B.e', 'Ç.a', 'Ç', 'C.a', 'C', 'Ş', 'B'].map((w) => (
          <Text key={w} className="flex-1 text-center text-muted text-[10px] font-semibold">
            {w}
          </Text>
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {Array.from({ length: weekStarts }).map((_, i) => (
          <View key={`pad-${i}`} className="w-[14.28%] aspect-square p-0.5" />
        ))}
        {days.map((cell) => (
          <View key={cell.iso} className="w-[14.28%] aspect-square p-0.5">
            <View
              className={`flex-1 rounded-lg items-center justify-center border ${
                cell.free ? 'bg-moss border-forest/30' : 'bg-white border-line'
              }`}>
              <Text className={`text-xs font-semibold ${cell.free ? 'text-forest' : 'text-muted'}`}>{cell.day}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text className="text-muted text-xs mt-2">
        Növbəti boş gün:{' '}
        {(() => {
          const next = days.find((d) => d.free && d.iso >= todayIso());
          return next ? formatDate(next.iso) : '—';
        })()}
      </Text>
    </View>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <View className="flex-row items-center">
      <View className={`w-3 h-3 rounded-full border ${dot}`} />
      <Text className="text-muted text-[10px] ml-1">{label}</Text>
    </View>
  );
}