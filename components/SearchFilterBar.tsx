import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Tap } from '@/components/ui';
import { colors } from '@/src/theme';

/** Sittsy üst filter kartı — yalnız başlıq + tarix alt sətri */
export function SearchFilterBar({
  dateLabel,
  onPress,
  floating,
}: {
  dateLabel: string;
  onPress: () => void;
  floating?: boolean;
}) {
  const card = (
    <Tap
      onPress={onPress}
      className="bg-white rounded-3xl px-4 py-3.5 flex-row items-center border border-line/90">
      <View className="w-11 h-11 rounded-2xl border border-line items-center justify-center bg-white">
        <Ionicons name="search" size={22} color={colors.forest} />
      </View>
      <View className="flex-1 ml-3 pr-1">
        <Text className="text-ink font-bold text-[17px]">Filtrlər</Text>
        <Text className="text-muted text-sm mt-0.5">{dateLabel}</Text>
      </View>
      <Ionicons name="chevron-down" size={20} color={colors.muted} />
    </Tap>
  );

  return (
    <View
      className={floating ? undefined : 'px-4'}
      style={
        floating
          ? {
              shadowColor: '#0f172a',
              shadowOpacity: 0.12,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }
          : undefined
      }>
      {card}
    </View>
  );
}