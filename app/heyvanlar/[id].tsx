import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';

import { Header } from '@/components/Header';
import { PetEditor } from '@/components/PetEditor';
import { GhostButton, PrimaryButton, ScreenPad } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { successTap } from '@/src/lib/haptics';
import type { Pet } from '@/src/types';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets, savePet, removePet } = useApp();
  const found = pets.find((p) => p.id === id);
  const [pet, setPet] = useState<Pet | undefined>(found);

  useEffect(() => {
    setPet(found);
  }, [found]);

  if (!pet) {
    return (
      <ScreenPad>
        <Header title="Dost" />
        <Text className="px-5 text-muted">Profil tapılmadı.</Text>
      </ScreenPad>
    );
  }

  return (
    <ScreenPad>
      <Header title={pet.name} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <PetEditor pet={pet} onChange={setPet} />
        <PrimaryButton
          label="Dəyişiklikləri saxla"
          onPress={() => {
            savePet(pet);
            void successTap();
            Alert.alert('Saxlanıldı', `${pet.name} profili yeniləndi.`);
          }}
        />
        <GhostButton
          label="Profili sil"
          onPress={() => {
            Alert.alert('Silinsin?', `${pet.name} profili silinəcək.`, [
              { text: 'Bağla', style: 'cancel' },
              {
                text: 'Sil',
                style: 'destructive',
                onPress: () => {
                  removePet(pet.id);
                  router.back();
                },
              },
            ]);
          }}
        />
      </ScrollView>
    </ScreenPad>
  );
}
