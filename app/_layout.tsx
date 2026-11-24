import '../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProvider } from '@/src/context/AppContext';
import { colors } from '@/src/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: Platform.OS === 'web' ? '#E8E4DC' : colors.cream,
      }}>
      <View
        style={
          Platform.OS === 'web'
            ? {
                flex: 1,
                width: '100%',
                maxWidth: 430,
                alignSelf: 'center',
                backgroundColor: colors.cream,
                overflow: 'hidden',
              }
            : { flex: 1 }
        }>
        <BottomSheetModalProvider>
          <AppProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.cream },
                animation: 'slide_from_right',
              }}
            />
          </AppProvider>
        </BottomSheetModalProvider>
      </View>
    </GestureHandlerRootView>
  );
}
