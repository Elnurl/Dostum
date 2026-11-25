import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PawMark } from '@/components/PawMark';
import { ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { successTap, tap } from '@/src/lib/haptics';
import { colors } from '@/src/theme';

type Provider = 'google' | 'apple' | 'email';

function AuthPill({
  label,
  icon,
  variant,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant: 'dark' | 'light';
  onPress: () => void;
}) {
  const dark = variant === 'dark';
  return (
    <Tap
      onPress={onPress}
      className={`rounded-full py-4 px-5 flex-row items-center justify-center mb-3 ${
        dark ? 'bg-forest-dark' : 'bg-moss'
      }`}>
      <Ionicons name={icon} size={20} color={dark ? '#fff' : colors.forestDark} />
      <Text className={`font-semibold text-base ml-3 ${dark ? 'text-white' : 'text-forest-dark'}`}>{label}</Text>
    </Tap>
  );
}

export default function GirisScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useApp();

  function enter(provider: Provider) {
    void tap();
    signIn(provider);
    void successTap();
    router.replace('/(owner)');
  }

  return (
    <ScreenPad className="bg-white">
      <View
        style={{ paddingTop: insets.top + 24, paddingBottom: Math.max(insets.bottom, 24) }}
        className="flex-1 px-6 justify-between">
        <View className="items-center mt-8">
          <PawMark size={88} />
          <Text className="text-muted text-center mt-6 px-4 leading-5">
            Bakıda etibarlı baxıcı tapın. Google, Apple və ya e-poçt ilə daxil olun (sınaq rejimi).
          </Text>
        </View>

        <View>
          <AuthPill
            label="Google ilə davam et"
            icon="logo-google"
            variant="dark"
            onPress={() => enter('google')}
          />
          <AuthPill label="Apple ilə daxil ol" icon="logo-apple" variant="dark" onPress={() => enter('apple')} />
          <AuthPill
            label="E-poçt ilə davam et"
            icon="mail-outline"
            variant="light"
            onPress={() => enter('email')}
          />
          <Text className="text-muted text-xs text-center mt-2 px-2">
            Davam etməklə Platforma zəmanəti və istifadə qaydalarını qəbul edirsiniz.
          </Text>
        </View>
      </View>
    </ScreenPad>
  );
}