import { Redirect } from 'expo-router';

import { LoadingScreen } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function Index() {
  const { mode, ready } = useApp();
  if (!ready) return <LoadingScreen />;
  return <Redirect href={mode === 'sitter' ? '/(sitter)' : '/(owner)'} />;
}
