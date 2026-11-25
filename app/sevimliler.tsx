import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { Header } from '@/components/Header';
import { EmptyState, ScreenPad } from '@/components/ui';
import { SitterCard } from '@/components/SitterCard';
import { useApp } from '@/src/context/AppContext';

export default function FavoritesScreen() {
  const { favorites, sitters } = useApp();
  const list = sitters.filter((s) => favorites.includes(s.id));
  return (
    <ScreenPad>
      <Header title="Sevimli baxıcılar" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        {list.length === 0 ? (
          <EmptyState title="Hələ sevimli yoxdur" text="Baxıcı profilində ürəyə toxunaraq yadda saxlayın." />
        ) : (
          list.map((s, i) => (
            <SitterCard key={s.id} sitter={s} index={i} onPress={() => router.push(`/baxici/${s.id}`)} />
          ))
        )}
      </ScrollView>
    </ScreenPad>
  );
}
