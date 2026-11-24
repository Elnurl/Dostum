import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Tap } from '@/components/ui';
import { colors } from '@/src/theme';

export function Header({ title, right }: { title: string; right?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 6 }} className="bg-cream px-4 pb-3 flex-row items-center">
      <Tap
        onPress={() => router.back()}
        className="w-10 h-10 rounded-full bg-white border border-line items-center justify-center mr-3">
        <Ionicons name="chevron-back" size={22} color={colors.ink} />
      </Tap>
      <Text className="text-ink font-bold text-lg flex-1" numberOfLines={1}>
        {title}
      </Text>
      {right}
    </View>
  );
}
