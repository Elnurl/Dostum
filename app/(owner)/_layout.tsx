import { Tabs } from 'expo-router';

import { TabIcon } from '@/components/TabIcon';
import { useApp } from '@/src/context/AppContext';
import { tap } from '@/src/lib/haptics';
import { brand } from '@/src/lib/ui';
import { colors } from '@/src/theme';

export default function OwnerTabs() {
  const { chats, bookings } = useApp();
  const unread = chats.filter((c) => !c.sitterId.startsWith('owner-')).reduce((s, c) => s + c.unread, 0);
  const moreBadge = bookings.some((b) => b.status === 'gozlemede' && b.forUserAs === 'owner') ? 1 : undefined;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: brand,
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
          title: 'Xidmətlər',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
        listeners={{ tabPress: () => void tap() }}
      />
      <Tabs.Screen
        name="axtaris"
        options={{
          title: 'Axtarış',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'search' : 'search-outline'} color={color} />
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
        name="komekci"
        options={{
          title: 'Köməkçi',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'sparkles' : 'sparkles-outline'} color={color} />
          ),
        }}
        listeners={{ tabPress: () => void tap() }}
      />
      <Tabs.Screen
        name="daha-cox"
        options={{
          title: 'Daha çox',
          tabBarBadge: moreBadge,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'} color={color} />
          ),
        }}
        listeners={{ tabPress: () => void tap() }}
      />
    </Tabs>
  );
}
