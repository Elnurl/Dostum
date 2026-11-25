import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

import { Header } from '@/components/Header';
import { PhotoSheet } from '@/components/PhotoSheet';
import { Card, Chip, GhostButton, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { successTap } from '@/src/lib/haptics';

export default function BecomeSitterScreen() {
  const { sitter, setSitter, setMode } = useApp();
  const [step, setStep] = useState(1);
  const [fin, setFin] = useState(sitter.fin);
  const [idOpen, setIdOpen] = useState(false);
  const [selfieOpen, setSelfieOpen] = useState(false);

  function finish() {
    if (!sitter.planActive) {
      Alert.alert('Plan seçin', 'Aktivləşmə planını seçməlisiniz.');
      return;
    }
    if (!sitter.qualityPassed) {
      Alert.alert('Keyfiyyət yoxlaması', 'Nəzəri yoxlamanı tamamlayın.');
      return;
    }
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
          Addım {step}/3 — kimlik, keyfiyyət və aktivləşmə. Qeyd: aktivləşmə sifarişə avtomatik zəmanət vermir.
        </Text>

        {step === 1 ? (
          <Card className="p-4 mb-4">
            <Text className="text-ink font-semibold mb-2">1. Kimlik təsdiqi</Text>
            <Text className="text-muted text-sm mb-3">Şəxsiyyət vəsiqəsi və canlı selfi simulyasiya edilir.</Text>
            <Text className="text-muted text-xs mb-1">FİN</Text>
            <TextInput
              value={fin}
              onChangeText={setFin}
              autoCapitalize="characters"
              placeholder="1ABC2DE"
              className="bg-white border border-line rounded-xl px-3 py-3 text-ink mb-3"
            />
            <GhostButton label={sitter.idPhoto ? 'Vəsiqə əlavə olunub ✓' : 'Şəxsiyyət vəsiqəsi şəkli'} onPress={() => setIdOpen(true)} />
            <View className="h-2" />
            <GhostButton label={sitter.selfie ? 'Selfi əlavə olunub ✓' : 'Canlı selfi'} onPress={() => setSelfieOpen(true)} />
            <PrimaryButton label="Növbəti: keyfiyyət" onPress={() => setStep(2)} />
          </Card>
        ) : null}

        {step === 2 ? (
          <Card className="p-4 mb-4">
            <Text className="text-ink font-semibold mb-2">2. Keyfiyyət yoxlaması</Text>
            <Text className="text-muted text-sm mb-3">
              Qısa təlimat videosu və təhlükəsizlik sualları (sınaq rejimində düymə ilə təsdiqlənir).
            </Text>
            <Text className="text-ink mb-2">• İlk yardım və stress siqnalları</Text>
            <Text className="text-ink mb-2">• Ev təhlükəsizliyi və qaçma riski</Text>
            <Text className="text-ink mb-3">• Hesabat və sahiblə ünsiyyət</Text>
            <Chip
              label={sitter.qualityPassed ? 'Yoxlama keçildi ✓' : 'Yoxlamanı tamamla'}
              active={sitter.qualityPassed}
              onPress={() => setSitter({ ...sitter, qualityPassed: true })}
            />
            <View className="h-3" />
            <PrimaryButton label="Növbəti: plan" onPress={() => setStep(3)} />
            <Tap onPress={() => setStep(1)} className="mt-3">
              <Text className="text-muted text-center">Geri</Text>
            </Tap>
          </Card>
        ) : null}

        {step === 3 ? (
          <Card className="p-4 mb-4">
            <Text className="text-ink font-semibold mb-2">3. Aktivləşmə planı</Text>
            <Text className="text-muted text-sm mb-3">
              Seçilmiş planda <Text className="font-semibold text-amber">sifarişlərdən 0% komissiya</Text> (sınaq).
              Platforma xidmət haqqı sahib tərəfindən ödənilir.
            </Text>
            <Tap
              onPress={() => setSitter({ ...sitter, planActive: true })}
              className={`rounded-2xl border p-4 mb-2 ${sitter.planActive ? 'border-forest bg-moss' : 'border-line bg-white'}`}>
              <Text className="text-ink font-bold">Dostum Baxıcı — 0% komissiya</Text>
              <Text className="text-muted text-sm mt-1">Aylıq simulyasiya · limitsiz sorğu · təqvim idarəsi</Text>
            </Tap>
            <Text className="text-amber text-xs mt-2">
              Diqqət: Plan aktiv olsa belə, sifarişləri qəbul etmək üçün paneldə &quot;Sifariş qəbul edirəm&quot; açıq olmalıdır.
            </Text>
            <View className="h-3" />
            <PrimaryButton label="Baxıcı rejimini aç" onPress={finish} />
            <Tap onPress={() => setStep(2)} className="mt-3">
              <Text className="text-muted text-center">Geri</Text>
            </Tap>
          </Card>
        ) : null}

        {sitter.verified ? (
          <Tap
            onPress={() => {
              setMode('sitter');
              router.replace('/(sitter)');
            }}
            className="mt-2">
            <Text className="text-forest font-semibold text-center">Artıq təsdiqlisiniz — panelə keç</Text>
          </Tap>
        ) : null}
      </ScrollView>
      <PhotoSheet open={idOpen} onClose={() => setIdOpen(false)} onPicked={(idPhoto) => setSitter({ ...sitter, idPhoto })} />
      <PhotoSheet open={selfieOpen} onClose={() => setSelfieOpen(false)} onPicked={(selfie) => setSitter({ ...sitter, selfie })} />
    </ScreenPad>
  );
}