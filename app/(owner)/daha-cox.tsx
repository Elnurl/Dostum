import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PhotoSheet } from '@/components/PhotoSheet';
import { Avatar, ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { tap } from '@/src/lib/haptics';
import { accent } from '@/src/lib/ui';
import { colors } from '@/src/theme';

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { user, pets, setAvatar } = useApp();
  const [photoOpen, setPhotoOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const name = user.firstName;

  return (
    <ScreenPad>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 36, paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={accent}
            onRefresh={() => {
              void tap();
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 500);
            }}
          />
        }>
        <View className="items-center mb-5">
          <View>
            <Avatar uri={user.avatar} name={`${user.firstName} ${user.lastName}`} size={112} />
            <Tap
              onPress={() => setPhotoOpen(true)}
              className="absolute right-0 bottom-1 w-9 h-9 rounded-full bg-forest items-center justify-center border-2 border-white">
              <Ionicons name="camera" size={16} color="#fff" />
            </Tap>
          </View>
          <Text className="text-ink font-bold text-2xl mt-3">{name}</Text>
        </View>

        <View className="flex-row gap-2 mb-4">
          <Quick icon="person-outline" label="Profilim" onPress={() => router.push('/profilim')} />
          <View className="flex-1">
            <Quick icon="paw-outline" label="Mənim dostlarım" onPress={() => router.push('/heyvanlar')} />
            {pets.length > 0 ? (
              <View className="absolute right-2 top-2 bg-badge min-w-[18px] h-[18px] rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">{pets.length}</Text>
              </View>
            ) : null}
          </View>
          <Quick icon="wallet-outline" label="Cüzdan" onPress={() => router.push('/cuzdan')} />
        </View>

        <Tap onPress={() => router.push('/sevimliler')} className="bg-white border border-line rounded-2xl px-4 py-4 mb-3 flex-row items-center">
          <View className="flex-1">
            <Text className="text-ink font-semibold text-base">Sevimli baxıcılar</Text>
            <Text className="text-muted text-sm mt-0.5">Yadda saxlanılan baxıcılar</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Tap>
        <Tap onPress={() => router.push('/rezervasiyalar')} className="bg-white border border-line rounded-2xl px-4 py-4 mb-4 flex-row items-center">
          <View className="flex-1">
            <Text className="text-ink font-semibold text-base">Rezervasiyalarım</Text>
            <Text className="text-muted text-sm mt-0.5">Gözləmədə, aktiv və tamamlanmış xidmətlər</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Tap>

        <Row icon="sparkles-outline" label="AI köməkçi" onPress={() => router.push('/(owner)/komekci')} />
        <Row icon="shield-checkmark-outline" label="Platforma zəmanəti" onPress={() => router.push('/zemanet')} />
        <Row icon="paw-outline" label="Baxıcı ol" onPress={() => router.push('/baxici-ol')} />
        <Row icon="settings-outline" label="Tənzimləmələr" onPress={() => router.push('/tenzimlemeler')} last />
      </ScrollView>
      <PhotoSheet
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        onPicked={(uri) => setAvatar(uri)}
      />
    </ScreenPad>
  );
}

function Quick({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Tap onPress={onPress} className="flex-1 bg-white border border-line rounded-2xl py-4 items-center">
      <Ionicons name={icon} size={26} color={colors.ink} />
      <Text className="text-ink text-xs font-medium mt-2 text-center">{label}</Text>
    </Tap>
  );
}

function Row({
  icon,
  label,
  onPress,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Tap onPress={onPress} className={`flex-row items-center py-4 ${last ? '' : 'border-b border-line'}`}>
      <Ionicons name={icon} size={22} color={colors.ink} />
      <Text className="text-ink text-base ml-3 flex-1">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Tap>
  );
}
