import { Text, View } from 'react-native';

import type { Walk } from '@/src/types';

export function WalkMap({ walk }: { walk: Walk }) {
  const last = walk.points[walk.points.length - 1];
  const progress = Math.min(1, walk.points.length / 12);
  return (
    <View className="bg-moss rounded-2xl p-4 overflow-hidden">
      <Text className="text-forest font-semibold mb-1">Canlı gəzinti — Bakı, Dənizkənarı</Text>
      <Text className="text-muted text-xs mb-3">
        {walk.active ? 'GPS izləmə aktivdir' : 'Gəzinti bitib'} · {walk.points.length} nöqtə
      </Text>
      <View className="h-28 rounded-xl bg-white/70 overflow-hidden justify-center px-3">
        <View className="h-1.5 bg-line rounded-full">
          <View className="h-1.5 bg-forest rounded-full" style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </View>
        <View className="flex-row justify-between mt-3">
          <Text className="text-[11px] text-muted">Azneft dairəsi</Text>
          <Text className="text-[11px] text-muted">Dənizkənarı park</Text>
        </View>
        <Text className="text-ink text-xs mt-3">
          İndi: {last ? `${last.lat.toFixed(4)}, ${last.lng.toFixed(4)}` : 'gözlənilir'}
        </Text>
      </View>
    </View>
  );
}
