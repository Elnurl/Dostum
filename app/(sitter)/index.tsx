import { useState } from 'react';
import { RefreshControl, ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SitterHomeCalendar } from '@/components/sitter/SitterHomeCalendar';
import { Card, ScreenPad } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { tap } from '@/src/lib/haptics';
import { accent } from '@/src/lib/ui';
import { colors } from '@/src/theme';

export default function SitterHome() {
  const insets = useSafeAreaInsets();
  const { accepting, setAccepting } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <ScreenPad className="bg-sheet">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 32, paddingHorizontal: 16 }}
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
        <Card className="p-4 mb-4 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-ink font-semibold">Yeni sorğulara açığam</Text>
            <Text className="text-muted text-sm mt-0.5">
              {accepting ? 'Profiliniz axtarışda görünür' : 'Oflaynsınız — sorğu gəlmir'}
            </Text>
          </View>
          <Switch
            value={accepting}
            onValueChange={(v) => {
              void tap();
              setAccepting(v);
            }}
            trackColor={{ false: '#E7E5E4', true: colors.forest }}
            thumbColor="#fff"
          />
        </Card>
        <SitterHomeCalendar />
      </ScrollView>
    </ScreenPad>
  );
}