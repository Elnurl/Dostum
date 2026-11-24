import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { EmptyState, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { PET_TYPE_LABEL } from '@/src/lib/format';
import { colors } from '@/src/theme';

export default function PetsScreen() {
  const { pets } = useApp();
  return (
    <ScreenPad>
      <Header title="Mənim dostlarım" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {pets.length === 0 ? (
          <EmptyState title="Hələ dost yoxdur" text="Sifariş üçün heyvan profili əlavə edin — peyvənd, yemək və xarakter." />
        ) : (
          pets.map((pet) => (
            <Tap
              key={pet.id}
              onPress={() => router.push(`/heyvanlar/${pet.id}`)}
              className="bg-white rounded-2xl p-3 mb-3 flex-row items-center">
              {pet.photos[0] ? (
                <Image
                  source={{ uri: pet.photos[0] }}
                  style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: colors.moss }}
                  contentFit="cover"
                />
              ) : (
                <View className="w-[72px] h-[72px] rounded-2xl bg-moss items-center justify-center">
                  <Text className="text-3xl">🐾</Text>
                </View>
              )}
              <View className="ml-3 flex-1">
                <Text className="text-ink font-semibold text-base">{pet.name}</Text>
                <Text className="text-muted text-sm">
                  {PET_TYPE_LABEL[pet.type]} · {pet.breed} · {pet.ageYears} yaş · {pet.weightKg} kq
                </Text>
                <Text className="text-forest text-xs mt-1">
                  {pet.sex === 'erkek' ? 'Erkək' : 'Dişi'} · {pet.sterilized ? 'sterilizasiya olunub' : 'olunmayıb'}
                </Text>
              </View>
            </Tap>
          ))
        )}
        <PrimaryButton label="Dost əlavə et" onPress={() => router.push('/heyvanlar/yeni')} />
      </ScrollView>
    </ScreenPad>
  );
}
