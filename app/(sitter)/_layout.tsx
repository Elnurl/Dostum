import { type Href, Redirect, Tabs } from 'expo-router';

import { TabIcon } from '@/components/TabIcon';
import { useApp } from '@/src/context/AppContext';
import { tap } from '@/src/lib/haptics';
import { brand } from '@/src/lib/ui';
import { colors } from '@/src/theme';

export default function SitterTabs() {
  const { chats, requests, accountKind, sitter, sitterBiz } = useApp();
  const unread = chats.filter((c) => c.sitterId.startsWith('owner-')).reduce((s, c) => s + c.unread, 0);
  const moreBadge = 3 + (sitterBiz.autoReplyEnabled ? 0 : 1);
  const homeBadge = sitterBiz.calendarUpdatedAt ? undefined : 1;

  if (accountKind === 'baxici' && !sitter.onboardingComplete) {
    return <Redirect href={'/baxici-qeydiyyat' as Href} />;
  }

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
          title: 'Ana səhifə',
          tabBarBadge: homeBadge,
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} color={color} />,
        }}
        listeners={{ tabPress: () => void tap() }}
      />
      <Tabs.Screen
        name="sorqular"
        options={{
          title: 'Sorğular',
          tabBarBadge: requests.length || undefined,
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'radio' : 'radio-outline'} color={color} />,
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
        name="musteriler"
        options={{
          title: 'Müştərilər',
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? 'people' : 'people-outline'} color={color} />,
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
      <Tabs.Screen name="teqvim" options={{ href: null }} />
      <Tabs.Screen name="profil" options={{ href: null }} />
    </Tabs>
  );
}