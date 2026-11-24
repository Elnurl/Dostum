import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { Header } from '@/components/Header';
import { PetEditor } from '@/components/PetEditor';
import { PrimaryButton, ScreenPad } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { uid } from '@/src/lib/format';
import { successTap } from '@/src/lib/haptics';
import type { Pet } from '@/src/types';

const BLANK: Pet = {
  id: '',
  name: '',
  type: 'it',
  breed: '',
  ageYears: 1,
  weightKg: 5,
  sex: 'erkek',
  sterilized: false,
  photos: [],
  vaccines: '',
  allergies: 'Yoxdur',
  medications: 'Yoxdur',
  feeding: '',
  behavior: '',
  vetName: '',
  vetPhone: '',
};

export default function NewPetScreen() {
  const { savePet } = useApp();
  const [pet, setPet] = useState<Pet>({ ...BLANK, id: uid('p') });

  return (
    <ScreenPad>
      <Header title="Yeni dost" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <PetEditor pet={pet} onChange={setPet} />
        <PrimaryButton
          label="Yadda saxla"
          onPress={() => {
            if (!pet.name.trim()) {
              Alert.alert('Ad lazımdır', 'Dostunuzun adını yazın.');
              return;
            }
            savePet(pet);
            void successTap();
            router.back();
          }}
        />
      </ScrollView>
    </ScreenPad>
  );
}
