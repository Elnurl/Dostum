import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert, ScrollView, Switch, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { Card, GhostButton, ScreenPad } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { tap } from '@/src/lib/haptics';
import { accent } from '@/src/lib/ui';
import { colors } from '@/src/theme';

export default function SettingsScreen() {
  const { notificationsOn, toggleNotifications, signOut } = useApp();

  return (
    <ScreenPad>
      <Header title="Tənzimləmələr" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Card className="p-4 mb-3 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-ink font-semibold">Bildirişlər</Text>
            <Text className="text-muted text-sm">Sifariş, mesaj və gəzinti xəbərdarlıqları</Text>
          </View>
          <Switch
            value={notificationsOn}
            onValueChange={() => {
              void tap();
              toggleNotifications();
            }}
            trackColor={{ false: '#E7E5E4', true: accent }}
            thumbColor="#fff"
          />
        </Card>
        <Card className="p-4 mb-3">
          <Text className="text-ink font-semibold">Dil</Text>
          <Text className="text-muted mt-1">Azərbaycan dili — tətbiqin əsas dili</Text>
        </Card>
        <Card className="p-4 mb-4">
          <Text className="text-ink font-semibold">Hesab</Text>
          <Text className="text-muted mt-1">Elnur Quliyev · +994 50 312 44 18</Text>
          <Text className="text-muted text-xs mt-2">Sınaq rejimində giriş tələb olunmur.</Text>
        </Card>
        <GhostButton
          label="Çıxış et"
          onPress={() => {
            signOut();
            router.replace('/giris');
          }}
        />
        <View className="h-2" />
        <GhostButton
          label="Sınaq məlumatını sıfırla"
          onPress={() => {
            Alert.alert('Sıfırlansın?', 'Bütün lokal dəyişikliklər silinəcək.', [
              { text: 'Bağla', style: 'cancel' },
              {
                text: 'Sıfırla',
                style: 'destructive',
                onPress: async () => {
                  await AsyncStorage.removeItem('dostum-state-v1');
                  router.replace('/');
                },
              },
            ]);
          }}
        />
      </ScrollView>
    </ScreenPad>
  );
}
