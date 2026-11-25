import { Redirect } from 'expo-router';

import { LoadingScreen } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function Index() {
  const { mode, ready, signedIn } = useApp();
  if (!ready) return <LoadingScreen />;
  if (!signedIn) return <Redirect href="/giris" />;
  return <Redirect href={mode === 'sitter' ? '/(sitter)' : '/(owner)'} />;
}
