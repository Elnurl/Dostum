import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GuaranteeHomeSection } from '@/components/GuaranteeHomeSection';
import { PawMark } from '@/components/PawMark';
import { Card, Divider, ScreenPad, SectionLabel, Tap } from '@/components/ui';
import { SERVICES } from '@/src/data/catalog';
import { accent } from '@/src/lib/ui';
import { tap } from '@/src/lib/haptics';
import { colors } from '@/src/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const sitterHome = SERVICES.filter((s) => s.group === 'sitter-home');
  const ownerHome = SERVICES.filter((s) => s.group === 'owner-home');

  function openSearch(service?: string) {
    if (service) {
      router.navigate({ pathname: '/(owner)/axtaris', params: { service } });
    } else {
      router.navigate('/(owner)/axtaris');
    }
  }

  return (
    <ScreenPad className="bg-white">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 28, paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={accent}
            onRefresh={() => {
              void tap();
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 700);
            }}
          />
        }>
        <PawMark size={40} showWordmark />
        <Text className="text-ink text-[26px] font-bold leading-8 mt-5">Dostunuz sevəcək baxıcı tapın</Text>
        <Text className="text-muted text-sm mt-2 mb-6 leading-5">
          Sifarişdən əvvəl mesaj yazın — kart tələb olunmur. Yaşıl + narinci dostum brendi ilə etibarlı qayğı.
        </Text>

        <SectionLabel>Baxıcının evində</SectionLabel>
        <Card className="mb-5 overflow-hidden">
          {sitterHome.map((service, i) => (
            <View key={service.id}>
              {i > 0 ? <Divider /> : null}
              <Tap onPress={() => openSearch(service.id)} className="flex-row items-center px-4 py-3.5">
                <Text className="text-3xl mr-3">{service.emoji}</Text>
                <View className="flex-1 pr-2">
                  <Text className="text-ink font-semibold text-base">{service.title}</Text>
                  <Text className="text-muted text-sm mt-0.5">{service.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Tap>
            </View>
          ))}
        </Card>

        <SectionLabel>Sizin evinizdə</SectionLabel>
        <Card className="mb-5 overflow-hidden">
          {ownerHome.map((service, i) => (
            <View key={service.id}>
              {i > 0 ? <Divider /> : null}
              <Tap onPress={() => openSearch(service.id)} className="flex-row items-center px-4 py-3.5">
                <Text className="text-3xl mr-3">{service.emoji}</Text>
                <View className="flex-1 pr-2">
                  <Text className="text-ink font-semibold text-base">{service.title}</Text>
                  <Text className="text-muted text-sm mt-0.5">{service.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Tap>
            </View>
          ))}
        </Card>

        <Tap
          onPress={() => openSearch()}
          className="bg-white border border-line rounded-2xl px-4 py-4 flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-moss items-center justify-center mr-3">
            <Ionicons name="search" size={20} color={accent} />
          </View>
          <View className="flex-1">
            <Text className="text-forest font-bold text-base">
              Baxıcı tap<Text className="text-amber">.</Text>
            </Text>
            <Text className="text-muted text-sm">Filtrlər və tarix</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Tap>

        <GuaranteeHomeSection />
      </ScrollView>
    </ScreenPad>
  );
}