import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Tap } from '@/components/ui';
import { colors } from '@/src/theme';

export function HomeServiceRow({
  emoji,
  title,
  description,
  onPress,
}: {
  emoji: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Tap onPress={onPress} className="flex-row items-center px-4 py-4">
      <View className="w-[52px] h-[52px] rounded-xl bg-cream border border-line/80 items-center justify-center mr-3 overflow-hidden">
        <Text className="text-[26px] leading-8">{emoji}</Text>
      </View>
      <View className="flex-1 pr-2">
        <Text className="text-ink font-bold text-base">{title}</Text>
        <Text className="text-muted text-sm mt-1 leading-5">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Tap>
  );
}