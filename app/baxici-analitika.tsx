import { useState } from 'react';
import { Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { Card, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { type Href, router } from 'expo-router';

type Tab = 'ümumi' | 'ulduz';

export default function SitterInsightsScreen() {
  const [tab, setTab] = useState<Tab>('ümumi');

  return (
    <ScreenPad>
      <Header title="Analitika" />
      <View className="px-5 pb-10">
        <View className="flex-row border-b border-line mb-4">
          {(
            [
              ['ümumi', 'Ümumi'],
              ['ulduz', 'Ulduz baxıcı'],
            ] as const
          ).map(([id, label]) => (
            <Tap key={id} onPress={() => setTab(id)} className="mr-6 pb-3">
              <Text className={`font-semibold ${tab === id ? 'text-forest border-b-2 border-forest' : 'text-muted'}`}>
                {label}
              </Text>
            </Tap>
          ))}
        </View>

        {tab === 'ümumi' ? (
          <>
            <Text className="text-muted text-sm mb-4">Profiliniz və rezervasiyalarınız necə gedir — yalnız siz görürsünüz.</Text>
            <Card className="p-4 mb-4">
              <Text className="text-ink font-bold text-lg mb-2">Təqvim</Text>
              <Text className="text-muted text-sm mb-3">Son yeniləmədən bəri: 0 gün</Text>
              <Text className="text-muted leading-5 mb-4">
                Növbəti 2 həftə üçün təqviminiz hazırdır? Müsait günləri açıq saxlayın ki, uyğun sorğu gəlsin.
              </Text>
              <PrimaryButton label="Müsaitliyi yoxla" onPress={() => router.push('/(sitter)/teqvim' as Href)} />
            </Card>
            <Card className="p-4">
              <Text className="text-ink font-bold text-lg mb-2">Axtarışda görünmə</Text>
              <Text className="text-muted text-sm">Profiliniz nə qədər göstərilib.</Text>
              <View className="flex-row justify-between mt-4">
                <Stat label="Cəmi" value="0" />
                <Stat label="Son 30 gün" value="0" />
              </View>
              <View className="h-24 mt-4 border-t border-line justify-end">
                <View className="h-px bg-ink w-full" />
              </View>
            </Card>
          </>
        ) : (
          <StarSitterPanel />
        )}
      </View>
    </ScreenPad>
  );
}

function StarSitterPanel() {
  const rows = [
    { title: 'Son müştərilər', value: '0', need: 'Son 6 ayda ən azı 5 fərqli müştəri.', ok: false },
    { title: 'Təkrar müştərilər', value: '0', need: 'Son 6 ayda ən azı 2 təkrar müştəri.', ok: false },
    { title: 'Yeni müştəri qəbulu', value: '0%', need: 'Son 25 sorğunun ən azı 33%-i.', ok: false },
    { title: 'Ulduz reytinq', value: '5.0 ★', need: '4.9+ reytinq.', ok: true },
  ];
  return (
    <View>
      <Text className="text-ink font-bold text-xl mb-2">Ulduz baxıcı ol</Text>
      <View className="h-2 bg-line rounded-full mb-6 overflow-hidden">
        <View className="h-2 bg-forest rounded-full" style={{ width: '50%' }} />
      </View>
      <Text className="text-muted text-sm mb-4 text-right -mt-4">3/6</Text>
      {rows.map((r) => (
        <View key={r.title} className="py-4 border-b border-line">
          <Text className="text-muted text-sm">{r.title}</Text>
          <Text className="text-ink font-bold text-2xl mt-1">{r.value}</Text>
          <Text className={`text-sm mt-1 ${r.ok ? 'text-forest' : 'text-muted'}`}>
            {r.ok ? '✓ Yolda' : '⚠ Diqqət lazımdır'} — {r.need}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-muted text-xs">{label}</Text>
      <Text className="text-ink font-bold text-xl">{value}</Text>
    </View>
  );
}