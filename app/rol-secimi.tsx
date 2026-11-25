import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PawMark } from '@/components/PawMark';
import { ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { tap } from '@/src/lib/haptics';
import type { AccountKind } from '@/src/types';
import { colors } from '@/src/theme';

type Option = { kind: AccountKind; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap };

const OPTIONS: Option[] = [
  {
    kind: 'sahib',
    title: 'Heyvan sahibiyəm',
    subtitle: 'Etibarlı baxıcı tapıb rezervasiya edirəm',
    icon: 'heart-outline',
  },
  {
    kind: 'baxici',
    title: 'Baxıcı olmaq istəyirəm',
    subtitle: 'Profil açıb qazanc əldə edirəm — yalnız təsdiqlənmiş baxıcılar',
    icon: 'paw-outline',
  },
  {
    kind: 'baytar',
    title: 'Baytar',
    subtitle: 'Klinika / müayinə xidmətləri (tezliklə)',
    icon: 'medkit-outline',
  },
  {
    kind: 'dukan',
    title: 'Heyvanlar üçün dükan',
    subtitle: 'Məhsul və xidmət (tezliklə)',
    icon: 'storefront-outline',
  },
];

export default function RolSecimiScreen() {
  const insets = useSafeAreaInsets();
  const { setAccountKind } = useApp();

  function pick(kind: AccountKind) {
    void tap();
    setAccountKind(kind);
    router.replace('/giris');
  }

  return (
    <ScreenPad className="bg-white">
      <View
        style={{ paddingTop: insets.top + 20, paddingBottom: Math.max(insets.bottom, 20) }}
        className="flex-1 px-5">
        <View className="items-center mb-8">
          <PawMark size={72} />
          <Text className="text-ink font-bold text-2xl mt-5 text-center">Dostuma xoş gəlmisiniz</Text>
          <Text className="text-muted text-center mt-2 leading-5 px-2">
            Əvvəlcə sizin üçün uyğun rejimi seçin. Bütün məzmun azərbaycanca olacaq.
          </Text>
        </View>
        {OPTIONS.map((o) => (
          <Tap
            key={o.kind}
            onPress={() => pick(o.kind)}
            className="rounded-2xl border border-line bg-sheet px-4 py-4 mb-3 flex-row items-center active:border-forest">
            <View className="w-12 h-12 rounded-full bg-moss items-center justify-center">
              <Ionicons name={o.icon} size={24} color={colors.forestDark} />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-ink font-bold text-base">{o.title}</Text>
              <Text className="text-muted text-sm mt-0.5 leading-4">{o.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Tap>
        ))}
      </View>
    </ScreenPad>
  );
}