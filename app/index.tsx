import { type Href, Redirect } from 'expo-router';

import { LoadingScreen } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { homeHref } from '@/src/lib/appRoute';

export default function Index() {
  const { ready, signedIn, accountKind, sitter, sitterDraft } = useApp();
  if (!ready) return <LoadingScreen />;
  const href = homeHref({
    signedIn,
    accountKind,
    sitterContractSigned: sitterDraft.contractSigned,
    sitterOnboardingComplete: Boolean(sitter.onboardingComplete),
  });
  return <Redirect href={href as Href} />;
}
