import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/src/theme';

export function TabIcon({
  name,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: unknown;
}) {
  const tint = typeof color === 'string' ? color : colors.muted;
  return <Ionicons name={name} size={22} color={tint} />;
}
