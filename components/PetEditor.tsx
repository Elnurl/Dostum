import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { PhotoSheet } from '@/components/PhotoSheet';
import { Chip, Tap } from '@/components/ui';
import { PET_TYPE_LABEL } from '@/src/lib/format';
import { colors } from '@/src/theme';
import type { Pet, PetSex, PetType } from '@/src/types';

const TYPES: PetType[] = ['it', 'pisik', 'qus', 'dovsan', 'diger'];

export function PetEditor({ pet, onChange }: { pet: Pet; onChange: (pet: Pet) => void }) {
  const [open, setOpen] = useState(false);

  function set<K extends keyof Pet>(key: K, value: Pet[K]) {
    onChange({ ...pet, [key]: value });
  }

  return (
    <View>
      <Text className="text-muted text-xs font-semibold mb-2">FOTO QALEREYA</Text>
      <View className="flex-row flex-wrap mb-3">
        {pet.photos.map((uri) => (
          <Image
            key={uri}
            source={{ uri }}
            style={{ width: 88, height: 88, borderRadius: 14, marginRight: 8, marginBottom: 8, backgroundColor: colors.moss }}
            contentFit="cover"
          />
        ))}
        <Tap
          onPress={() => setOpen(true)}
          className="w-[88px] h-[88px] rounded-[14px] bg-white border border-dashed border-line items-center justify-center">
          <Ionicons name="camera-outline" size={22} color={colors.amber} />
        </Tap>
      </View>

      <Field label="Ad" value={pet.name} onChangeText={(v) => set('name', v)} />
      <Text className="text-muted text-xs font-semibold mb-2">NÖV</Text>
      <View className="flex-row flex-wrap mb-2">
        {TYPES.map((t) => (
          <Chip key={t} label={PET_TYPE_LABEL[t]} active={pet.type === t} onPress={() => set('type', t)} />
        ))}
      </View>
      <Field label="Cins (breed)" value={pet.breed} onChangeText={(v) => set('breed', v)} />
      <Field
        label="Yaş"
        value={String(pet.ageYears)}
        keyboard="numeric"
        onChangeText={(v) => set('ageYears', Number(v) || 0)}
      />
      <Field
        label="Çəki (kq)"
        value={String(pet.weightKg)}
        keyboard="numeric"
        onChangeText={(v) => set('weightKg', Number(v) || 0)}
      />
      <Text className="text-muted text-xs font-semibold mb-2">CİNSİYYƏT</Text>
      <View className="flex-row flex-wrap mb-2">
        <Chip label="Erkək" active={pet.sex === 'erkek'} onPress={() => set('sex', 'erkek' as PetSex)} />
        <Chip label="Dişi" active={pet.sex === 'disi'} onPress={() => set('sex', 'disi' as PetSex)} />
      </View>
      <Chip
        label={pet.sterilized ? 'Sterilizasiya olunub' : 'Sterilizasiya olunmayıb'}
        active={pet.sterilized}
        onPress={() => set('sterilized', !pet.sterilized)}
      />
      <Field label="Peyvənd məlumatları" value={pet.vaccines} onChangeText={(v) => set('vaccines', v)} multiline />
      <Field label="Allergiyalar" value={pet.allergies} onChangeText={(v) => set('allergies', v)} multiline />
      <Field label="Xüsusi dərmanlar" value={pet.medications} onChangeText={(v) => set('medications', v)} multiline />
      <Field label="Yemək rejimi" value={pet.feeding} onChangeText={(v) => set('feeding', v)} multiline />
      <Field
        label="Digər heyvanlar və uşaqlarla davranışı"
        value={pet.behavior}
        onChangeText={(v) => set('behavior', v)}
        multiline
      />
      <Field label="Baytar həkimi" value={pet.vetName} onChangeText={(v) => set('vetName', v)} />
      <Field label="Baytar telefonu" value={pet.vetPhone} onChangeText={(v) => set('vetPhone', v)} />
      <PhotoSheet open={open} onClose={() => setOpen(false)} onPicked={(uri) => set('photos', [...pet.photos, uri])} />
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  multiline,
  keyboard,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  keyboard?: 'numeric';
}) {
  return (
    <View className="mb-3">
      <Text className="text-muted text-xs font-semibold mb-1">{label.toUpperCase()}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboard}
        className="bg-white border border-line rounded-2xl px-4 py-3 text-ink"
        placeholder={label}
      />
    </View>
  );
}
