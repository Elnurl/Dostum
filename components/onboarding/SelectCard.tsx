import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Tap } from '@/components/ui';
import { colors } from '@/src/theme';

export function SelectCard({
  selected,
  title,
  subtitle,
  icon,
  onPress,
  multi,
}: {
  selected: boolean;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onPress: () => void;
  multi?: boolean;
}) {
  return (
    <Tap
      onPress={onPress}
      className={`rounded-2xl border px-4 py-4 mb-3 flex-row items-center ${
        selected ? 'border-forest bg-moss' : 'border-line bg-white'
      }`}>
      {icon ? <View className="mr-3">{icon}</View> : null}
      <View className="flex-1">
        <Text className={`font-semibold text-base ${selected ? 'text-forest-dark' : 'text-ink'}`}>{title}</Text>
        {subtitle ? <Text className="text-muted text-sm mt-1">{subtitle}</Text> : null}
      </View>
      {multi ? (
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            selected ? 'border-forest bg-forest' : 'border-line'
          }`}>
          {selected ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
        </View>
      ) : selected ? (
        <Ionicons name="checkmark-circle" size={22} color={colors.forest} />
      ) : null}
    </Tap>
  );
}