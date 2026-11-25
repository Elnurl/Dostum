import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Tap } from '@/components/ui';
import { tap } from '@/src/lib/haptics';
import { colors } from '@/src/theme';

export function SearchMapDock({
  mode,
  onMode,
  onBack,
}: {
  mode: 'results' | 'map';
  onMode: (m: 'results' | 'map') => void;
  onBack: () => void;
}) {
  return (
    <View className="bg-white border-t border-line px-2 pt-2 pb-2 flex-row justify-around">
      <DockItem icon="chevron-back" label="Geri" onPress={onBack} />
      <DockItem
        icon="sparkles-outline"
        label="Köməkçi"
        onPress={() => {
          void tap();
          router.push('/(owner)/komekci');
        }}
      />
      <DockItem icon="list" label="Nəticələr" active={mode === 'results'} onPress={() => onMode('results')} />
      <DockItem icon="map" label="Xəritə" active={mode === 'map'} onPress={() => onMode('map')} />
    </View>
  );
}

function DockItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const color = active ? colors.forest : colors.muted;
  return (
    <Tap onPress={() => { void tap(); onPress(); }} className="items-center flex-1 py-1">
      <Ionicons name={icon} size={22} color={color} />
      <Text className={`text-[11px] font-semibold mt-0.5 ${active ? 'text-forest' : 'text-muted'}`}>{label}</Text>
    </Tap>
  );
}