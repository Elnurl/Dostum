import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { Tap } from '@/components/ui';
import { sitterDistanceKm, sitterStreetLine } from '@/src/lib/sitterProfile';
import { BAKU_MAP_LABELS, sitterMapPin } from '@/src/lib/mapMock';
import { colors } from '@/src/theme';
import type { Sitter } from '@/src/types';

export function SitterMapPreview({
  sitter,
  onShowNearby,
}: {
  sitter: Sitter;
  onShowNearby?: () => void;
}) {
  const { x, y } = sitterMapPin(sitter.id, 0);

  return (
    <View className="mb-2">
      <View className="h-44 rounded-2xl overflow-hidden border border-line bg-moss">
        <View className="absolute inset-0 bg-moss" />
        {BAKU_MAP_LABELS.map((l) => (
          <Text
            key={l.label}
            className="absolute text-[9px] text-forest/45 font-semibold"
            style={{ left: `${l.x * 100}%`, top: `${l.y * 100}%` }}>
            {l.label}
          </Text>
        ))}
        <View
          className="absolute items-center"
          style={{ left: `${x * 100}%`, top: `${y * 100}%`, marginLeft: -20, marginTop: -40 }}>
          <View className="bg-white rounded-2xl px-2 py-1 border border-forest shadow-sm mb-1">
            <Text className="text-forest text-[10px] font-bold">{sitter.district}</Text>
          </View>
          <View className="w-10 h-10 rounded-full border-2 border-forest overflow-hidden bg-white">
            <Image source={{ uri: sitter.photo }} style={{ width: 40, height: 40 }} contentFit="cover" />
          </View>
        </View>
      </View>
      <Text className="text-ink font-semibold mt-2">{sitterStreetLine(sitter)}</Text>
      <Text className="text-muted text-sm">Sizdən təxminən {sitterDistanceKm(sitter.id)}</Text>
      {sitter.verified ? (
        <View className="flex-row items-center mt-2">
          <Text className="text-forest font-semibold text-sm">✓ Telefon nömrəsi təsdiqlənib</Text>
        </View>
      ) : null}
      {onShowNearby ? (
        <Tap onPress={onShowNearby} className="mt-3 py-2">
          <Text className="text-forest font-semibold text-center">Yaxınlıqdakı digər baxıcılar</Text>
        </Tap>
      ) : null}
    </View>
  );
}