import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { PrimaryButton, ScreenPad } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function TezlikleScreen() {
  const { accountKind } = useApp();
  const label = accountKind === 'baytar' ? 'Baytar kabineti' : 'Dükan kabineti';

  return (
    <ScreenPad>
      <Header title={label} />
      <View className="flex-1 px-6 justify-center pb-20">
        <Text className="text-5xl text-center mb-4">🚧</Text>
        <Text className="text-ink font-bold text-xl text-center">Tezliklə</Text>
        <Text className="text-muted text-center mt-3 leading-6">
          Bu bölmə hazırlanır. İndilik heyvan sahibi və ya baxıcı kimi davam edə bilərsiniz.
        </Text>
        <View className="mt-8">
          <PrimaryButton label="Rol seçiminə qayıt" onPress={() => router.replace('/rol-secimi')} />
        </View>
      </View>
    </ScreenPad>
  );
}