import { Tabs } from 'expo-router';

import { TabIcon } from '@/components/TabIcon';
import { useApp } from '@/src/context/AppContext';
import { tap } from '@/src/lib/haptics';
import { colors } from '@/src/theme';

export default function SitterTabs() {
  const { chats, requests } = useApp();
  const unread = chats.filter((c) => c.sitterId.startsWith('owner-')).reduce((s, c) => s + c.unread, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: colors.line,
          height: 64,
          paddingTop: 6,
        },
        tabBarBadgeStyle: { backgroundColor: colors.badge, fontSize: 10 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Panel',
          tabBarBadge: requests.length || undefined,
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'grid' : 'grid-outline'} color={color} />,
        }}
        listeners={{ tabPress: () => void tap() }}
      />
      <Tabs.Screen
        name="teqvim"
        options={{
          title: 'Təqvim',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
          ),
        }}
        listeners={{ tabPress: () => void tap() }}
      />
      <Tabs.Screen
        name="mesajlar"
        options={{
          title: 'Mesajlar',
          tabBarBadge: unread || undefined,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} />
          ),
        }}
        listeners={{ tabPress: () => void tap() }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Baxıcı profili',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
        listeners={{ tabPress: () => void tap() }}
      />
    </Tabs>
  );
}
