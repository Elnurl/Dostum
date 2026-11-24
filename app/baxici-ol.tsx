import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

import { Header } from '@/components/Header';
import { PhotoSheet } from '@/components/PhotoSheet';
import { Card, GhostButton, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { successTap } from '@/src/lib/haptics';

export default function BecomeSitterScreen() {
  const { sitter, setSitter, setMode } = useApp();
  const [fin, setFin] = useState(sitter.fin);
  const [idOpen, setIdOpen] = useState(false);
  const [selfieOpen, setSelfieOpen] = useState(false);

  function activate() {
    if (!sitter.verified) {
      if (fin.trim().length < 5) {
        Alert.alert('FİN lazımdır', 'Şəxsiyyət vəsiqəsindəki FİN-i yazın.');
        return;
      }
      if (!sitter.idPhoto || !sitter.selfie) {
        Alert.alert('Sənəd lazımdır', 'Vəsiqə şəkli və canlı selfi əlavə edin.');
        return;
      }
    }
    setSitter({ ...sitter, fin: fin.trim().toUpperCase() || sitter.fin, verified: true });
    setMode('sitter');
    void successTap();
    router.replace('/(sitter)');
  }

  return (
    <ScreenPad>
      <Header title="Baxıcı ol" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text className="text-ink font-bold text-xl mb-2">Bakıda dostlara qayğı göstərin</Text>
        <Text className="text-muted mb-4">
          Profili aktivləşdirin, qiymətlərinizi yazın və sifariş qəbul edin. Ödəniş escrow ilə qorunur.
        </Text>
        <Card className="p-4 mb-4">
          <Text className="text-ink font-semibold mb-2">Kimlik təsdiqi</Text>
          <Text className="text-muted text-xs mb-1">FİN</Text>
          <TextInput
            value={fin}
            onChangeText={setFin}
            autoCapitalize="characters"
            placeholder="1ABC2DE"
            className="bg-cream rounded-xl px-3 py-3 text-ink mb-3"
          />
          <GhostButton label={sitter.idPhoto ? 'Vəsiqə şəkli əlavə olunub' : 'Şəxsiyyət vəsiqəsi şəkli'} onPress={() => setIdOpen(true)} />
          <View className="h-2" />
          <GhostButton label={sitter.selfie ? 'Selfi əlavə olunub' : 'Canlı selfi'} onPress={() => setSelfieOpen(true)} />
          {sitter.verified ? (
            <Text className="text-forest font-semibold mt-3">Status: təsdiqlənib</Text>
          ) : (
            <Text className="text-amber font-semibold mt-3">Status: yoxlama gözlənilir</Text>
          )}
        </Card>
        <PrimaryButton label="Baxıcı rejimini aç" onPress={activate} />
        {sitter.verified ? (
          <Tap
            onPress={() => {
              setMode('sitter');
              router.replace('/(sitter)');
            }}
            className="mt-3">
            <Text className="text-forest font-semibold text-center">Sənədsiz keç (artıq təsdiqlisiniz)</Text>
          </Tap>
        ) : null}
      </ScrollView>
      <PhotoSheet
        open={idOpen}
        onClose={() => setIdOpen(false)}
        onPicked={(idPhoto) => setSitter({ ...sitter, idPhoto })}
      />
      <PhotoSheet
        open={selfieOpen}
        onClose={() => setSelfieOpen(false)}
        onPicked={(selfie) => setSitter({ ...sitter, selfie })}
      />
    </ScreenPad>
  );
}
