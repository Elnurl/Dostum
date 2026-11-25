import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/src/theme';

const ROWS = [
  { icon: 'shield-checkmark-outline' as const, text: 'Şəxsiyyəti təsdiqlənmiş baxıcılar' },
  { icon: 'card-outline' as const, text: 'App içi ödəniş — escrow qorunması' },
  { icon: 'medal-outline' as const, text: 'dostum zəmanəti (sınaq)' },
];

export function TrustStrip({ compact }: { compact?: boolean }) {
  return (
    <View className={`bg-moss border border-forest/15 rounded-2xl px-3 ${compact ? 'py-2 mb-2' : 'py-3 mb-3'}`}>
      {ROWS.map((row, i) => (
        <View key={row.text} className={`flex-row items-center ${i > 0 ? 'mt-1.5' : ''}`}>
          <Ionicons name={row.icon} size={15} color={colors.forest} />
          <Text className="text-forest text-xs font-medium ml-2 flex-1">{row.text}</Text>
        </View>
      ))}
    </View>
  );
}