import { type Href, router } from 'expo-router';
import { Switch, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { Card, Divider, ScreenPad, Tap } from '@/components/ui';
import { SERVICES } from '@/src/data/catalog';
import { useApp } from '@/src/context/AppContext';
import { manat } from '@/src/lib/format';
import { colors } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SitterPricingScreen() {
  const { sitterBiz, patchSitterBiz, sitter } = useApp();

  const toggles = [
    ['smartPricing', 'Ağıllı qiymət', 'Tələbat və mövsümə görə tarif təklifi (sınaq).'],
    ['newClientDiscount', 'Yeni müştəri endirimi', 'İlk rezervasiyaya bonus.'],
    ['returningClientOffer', 'Geri qayıdan müştəri', 'Təkrar sifariş üçün təklif.'],
    ['holidaySurcharge', 'Bayram əlavəsi', 'Ölkənizdə bayram günlərində artım.'],
    ['busyDaySurcharge', 'Məşğul gün əlavəsi', 'Seçdiyiniz günlərdə yüksək tarif.'],
  ] as const;

  return (
    <ScreenPad>
      <Header title="Qiymət və endirimlər" />
      <View className="px-5 pb-10">
        <Card className="rounded-2xl border border-line overflow-hidden mb-6">
          {toggles.map(([key, title, sub], i) => (
            <View key={key}>
              <View className="px-4 py-4 flex-row items-center">
                <View className="flex-1 pr-3">
                  <Text className="text-ink font-semibold">{title}</Text>
                  <Text className="text-muted text-sm mt-0.5">{sub}</Text>
                </View>
                <Switch
                  value={sitterBiz[key]}
                  onValueChange={(v) => patchSitterBiz({ [key]: v })}
                  trackColor={{ false: '#E7E5E4', true: colors.forest }}
                  thumbColor="#fff"
                />
              </View>
              {i < toggles.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </Card>
        <Text className="text-ink font-bold mb-2">Xidmət üzrə qaydalar</Text>
        <Text className="text-muted text-sm mb-4">
          Həcm endirimi, həftə sonu, təcili və məsafə xidmətə görə təyin olunur.
        </Text>
        {sitter.services.map((s) => {
          const meta = SERVICES.find((x) => x.id === s.serviceId);
          return (
            <Tap
              key={s.serviceId}
              onPress={() => router.push('/(sitter)/profil' as Href)}
              className="bg-white border border-line rounded-2xl p-4 mb-3 flex-row items-center">
              <View className="flex-1">
                <Text className="text-ink font-semibold">{meta?.title ?? s.serviceId}</Text>
                <Text className="text-muted text-sm">Hələ xüsusi qayda yoxdur</Text>
              </View>
              <Text className="text-ink font-bold mr-2">{manat(s.price)}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Tap>
          );
        })}
      </View>
    </ScreenPad>
  );
}