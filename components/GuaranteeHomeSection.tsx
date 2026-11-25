import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Tap } from '@/components/ui';
import { colors } from '@/src/theme';

const ITEMS = [
  {
    icon: 'shield-checkmark' as const,
    title: 'dostum zəmanəti',
    text: '2 000 ₼-dək kömək (sınaq) — vet və zərər hallarında.',
    color: colors.forest,
  },
  {
    icon: 'id-card' as const,
    title: 'Kimlik təsdiqi',
    text: 'Şəxsiyyəti təsdiqlənib nişanı yalnız yoxlamadan keçənlərdə.',
    color: colors.forest,
  },
  {
    icon: 'card' as const,
    title: 'App içi ödəniş',
    text: 'Escrow ilə — xidmət bitənə qədər pul təhlükəsiz qalır.',
    color: colors.amber,
  },
] as const;

const STEPS = [
  { n: '1', title: 'Pulsuz mesaj', text: 'Baxıcıya yazın — kart tələb olunmur.' },
  { n: '2', title: 'Görüş və ya zəng', text: 'Tanış olun, suallarınızı verin.' },
  { n: '3', title: 'Yalnız razı olanda sifariş', text: 'Hər şey uyğundursa ödənişi bloklayın.' },
] as const;

export function GuaranteeHomeSection() {
  return (
    <View className="mt-6">
      <Text className="text-ink font-bold text-lg mb-1">Rezervasiyanız qorunur</Text>
      <Text className="text-muted text-sm mb-3">Etibarlı baxıcı və təhlükəsiz ödəniş — Bakı üçün dostum.</Text>
      {ITEMS.map((item) => (
        <View key={item.title} className="bg-white border border-line rounded-2xl px-4 py-3 mb-2 flex-row">
          <View className="w-10 h-10 rounded-full bg-moss items-center justify-center mr-3">
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <View className="flex-1">
            <Text className="text-ink font-semibold">{item.title}</Text>
            <Text className="text-muted text-sm mt-0.5 leading-5">{item.text}</Text>
          </View>
        </View>
      ))}
      <Tap onPress={() => router.push('/zemanet')} className="mb-6">
        <Text className="text-forest font-semibold text-center">Zəmanət şərtlərinə bax →</Text>
      </Tap>

      <Text className="text-ink font-bold text-lg mb-3">Necə işləyir?</Text>
      {STEPS.map((step) => (
        <View key={step.n} className="flex-row mb-3">
          <View className="w-8 h-8 rounded-full bg-forest items-center justify-center mr-3">
            <Text className="text-white font-bold">{step.n}</Text>
          </View>
          <View className="flex-1 pt-0.5">
            <Text className="text-ink font-semibold">{step.title}</Text>
            <Text className="text-muted text-sm">{step.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}