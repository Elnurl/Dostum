import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeServiceRow } from '@/components/HomeServiceRow';
import { PawMark } from '@/components/PawMark';
import { Card, Divider, ScreenPad, SectionLabel, Tap } from '@/components/ui';
import { SERVICES } from '@/src/data/catalog';
import { tap } from '@/src/lib/haptics';
import { accent } from '@/src/lib/ui';
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
    <ScreenPad className="bg-sheet">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 32, paddingHorizontal: 20 }}
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
        <PawMark size={36} showWordmark inline />
        <Text className="text-ink text-[28px] font-bold leading-9 mt-6 mb-6">Dostunuz sevəcək baxıcı tapın</Text>

        <SectionLabel>Baxıcının evində</SectionLabel>
        <Card className="mb-6 overflow-hidden bg-white border-line">
          {sitterHome.map((service, i) => (
            <View key={service.id}>
              {i > 0 ? <Divider /> : null}
              <HomeServiceRow
                emoji={service.emoji}
                title={service.title}
                description={service.description}
                onPress={() => openSearch(service.id)}
              />
            </View>
          ))}
        </Card>

        <SectionLabel>Sizin evinizdə</SectionLabel>
        <Card className="mb-6 overflow-hidden bg-white border-line">
          {ownerHome.map((service, i) => (
            <View key={service.id}>
              {i > 0 ? <Divider /> : null}
              <HomeServiceRow
                emoji={service.emoji}
                title={service.title}
                description={service.description}
                onPress={() => openSearch(service.id)}
              />
            </View>
          ))}
        </Card>

        <Tap
          onPress={() => openSearch()}
          className="bg-white border border-line rounded-2xl px-4 py-4 flex-row items-center">
          <View className="w-11 h-11 rounded-full bg-moss items-center justify-center mr-3">
            <Ionicons name="search" size={22} color={accent} />
          </View>
          <View className="flex-1">
            <Text className="text-forest font-bold text-base">
              Baxıcı tap<Text className="text-amber">.</Text>
            </Text>
            <Text className="text-muted text-sm mt-0.5">Filtrlər və tarix</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Tap>
      </ScrollView>
    </ScreenPad>
  );
}