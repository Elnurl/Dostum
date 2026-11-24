import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

import { Header } from '@/components/Header';
import { Chip, PrimaryButton, ScreenPad } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { successTap } from '@/src/lib/haptics';
import { DISTRICTS } from '@/src/types';

export default function ProfileScreen() {
  const { user, setUser } = useApp();
  const [form, setForm] = useState(user);

  return (
    <ScreenPad>
      <Header title="Profilim" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Field label="Ad" value={form.firstName} onChangeText={(firstName) => setForm({ ...form, firstName })} />
        <Field label="Soyad" value={form.lastName} onChangeText={(lastName) => setForm({ ...form, lastName })} />
        <Field label="Telefon" value={form.phone} onChangeText={(phone) => setForm({ ...form, phone })} />
        <Field label="Ünvan" value={form.address} onChangeText={(address) => setForm({ ...form, address })} />
        <Text className="text-muted text-xs font-semibold mb-2">RAYON</Text>
        <View className="flex-row flex-wrap mb-3">
          {DISTRICTS.map((d) => (
            <Chip key={d} label={d} active={form.district === d} onPress={() => setForm({ ...form, district: d })} />
          ))}
        </View>
        <Field
          label="Təcili əlaqə şəxsi"
          value={form.emergencyName}
          onChangeText={(emergencyName) => setForm({ ...form, emergencyName })}
        />
        <Field
          label="Təcili telefon"
          value={form.emergencyPhone}
          onChangeText={(emergencyPhone) => setForm({ ...form, emergencyPhone })}
        />
        <PrimaryButton
          label="Yadda saxla"
          onPress={() => {
            setUser(form);
            void successTap();
            Alert.alert('Saxlanıldı', 'Profil məlumatlarınız yeniləndi.');
          }}
        />
      </ScrollView>
    </ScreenPad>
  );
}

function Field({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View className="mb-3">
      <Text className="text-muted text-xs font-semibold mb-1">{label.toUpperCase()}</Text>
      <TextInput value={value} onChangeText={onChangeText} className="bg-white rounded-2xl px-4 py-3 text-ink" />
    </View>
  );
}
