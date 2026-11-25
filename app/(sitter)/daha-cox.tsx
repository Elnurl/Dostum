import { Ionicons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Divider, ScreenPad, Tap } from '@/components/ui';
import { colors } from '@/src/theme';

type Row = { icon: keyof typeof Ionicons.glyphMap; label: string; href: Href; badge?: boolean };

const ROWS: Row[] = [
  { icon: 'person-circle-outline', label: 'Profilim', href: '/(sitter)/profil' as Href },
  { icon: 'construct-outline', label: 'Xidmətləri idarə et', href: '/(sitter)/profil' as Href },
  { icon: 'people-circle-outline', label: 'Ortaq baxıcılar', href: '/tezlikle' as Href },
  { icon: 'chatbubble-ellipses-outline', label: 'Avtomatik cavab', href: '/baxici-avtomatik-cavab' as Href, badge: true },
  { icon: 'pricetag-outline', label: 'Qiymət və endirimlər', href: '/baxici-qiymetler' as Href },
  { icon: 'wallet-outline', label: 'Cüzdanım', href: '/cuzdan' as Href, badge: true },
  { icon: 'bar-chart-outline', label: 'Analitika', href: '/baxici-analitika' as Href },
  { icon: 'search-outline', label: 'Axtarış', href: '/(owner)/axtaris' as Href },
  { icon: 'megaphone-outline', label: 'Biznesinizi böyüdün', href: '/tezlikle' as Href },
  { icon: 'school-outline', label: 'Dostum Akademiyası', href: '/tezlikle' as Href, badge: true },
];

export default function SitterMoreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScreenPad className="bg-white">
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 40, paddingHorizontal: 20 }}>
        <Text className="text-ink font-bold text-3xl mb-6">Biznesiniz</Text>
        <View className="bg-white rounded-2xl border border-line overflow-hidden">
          {ROWS.map((row, i) => (
            <View key={row.label}>
              <Tap onPress={() => router.push(row.href)} className="flex-row items-center px-4 py-4">
                <Ionicons name={row.icon} size={22} color={colors.ink} />
                <Text className="text-ink font-medium text-base flex-1 ml-3">{row.label}</Text>
                {row.badge ? <View className="w-2 h-2 rounded-full bg-danger mr-2" /> : null}
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Tap>
              {i < ROWS.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenPad>
  );
}