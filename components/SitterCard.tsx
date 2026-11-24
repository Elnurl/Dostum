import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Tap } from '@/components/ui';
import { manat } from '@/src/lib/format';
import { colors } from '@/src/theme';
import type { ServiceId, Sitter } from '@/src/types';

export function SitterCard({
  sitter,
  serviceId,
  onPress,
}: {
  sitter: Sitter;
  serviceId?: ServiceId | 'all';
  onPress: () => void;
}) {
  const offered = serviceId && serviceId !== 'all' ? sitter.services.find((s) => s.serviceId === serviceId) : sitter.services[0];
  return (
    <Tap onPress={onPress} className="bg-white rounded-2xl p-3 mb-3 flex-row">
      <Image
        source={{ uri: sitter.photo }}
        style={{ width: 84, height: 84, borderRadius: 16, backgroundColor: colors.moss }}
        contentFit="cover"
      />
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-ink font-semibold text-base flex-1" numberOfLines={1}>
            {sitter.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color={colors.amber} />
            <Text className="text-ink text-xs font-semibold ml-1">
              {sitter.rating} ({sitter.reviewCount})
            </Text>
          </View>
        </View>
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={13} color={colors.muted} />
          <Text className="text-muted text-xs ml-1">{sitter.district}</Text>
          {sitter.verified ? (
            <View className="flex-row items-center ml-2">
              <Ionicons name="shield-checkmark" size={13} color={colors.forest} />
              <Text className="text-forest text-[11px] font-semibold ml-0.5">Təsdiqlənib</Text>
            </View>
          ) : null}
        </View>
        <Text className="text-muted text-xs mt-1" numberOfLines={2}>
          {sitter.short}
        </Text>
        {offered ? (
          <Text className="text-amber font-bold mt-1">
            {manat(offered.price)}/{offered.unit}
          </Text>
        ) : (
          <Text className="text-muted text-xs mt-1">Bu xidməti təklif etmir</Text>
        )}
      </View>
    </Tap>
  );
}
