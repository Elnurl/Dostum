import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Divider, Logo, ScreenPad, SectionLabel, Tap } from '@/components/ui';
import { SERVICES } from '@/src/data/catalog';
import { tap } from '@/src/lib/haptics';
import { colors } from '@/src/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const sitterHome = SERVICES.filter((s) => s.group === 'sitter-home');
  const ownerHome = SERVICES.filter((s) => s.group === 'owner-home');

  function openSearch(service?: string) {
    router.push({ pathname: '/(owner)/axtaris', params: service ? { service } : {} });
  }

  return (
    <ScreenPad>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 28, paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={colors.forest}
            onRefresh={() => {
              void tap();
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 700);
            }}
          />
        }>
        <View className="items-start mb-4">
          <Logo height={28} />
        </View>
        <Text className="text-forest text-[28px] font-bold leading-8 mb-6">Dostunuza hansı qayğı lazımdır?</Text>

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

        <Tap onPress={() => openSearch()} className="bg-white rounded-2xl px-4 py-4 flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-moss items-center justify-center mr-3">
            <Ionicons name="search" size={20} color={colors.forest} />
          </View>
          <View className="flex-1">
            <Text className="text-ink font-semibold text-base">Baxıcı tap</Text>
            <Text className="text-muted text-sm">Ərazi və tarixə görə axtarış</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Tap>
      </ScrollView>
    </ScreenPad>
  );
}
