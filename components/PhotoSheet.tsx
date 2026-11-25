import { Text, View } from 'react-native';

import { Sheet } from '@/components/Sheet';
import { GhostButton, PrimaryButton } from '@/components/ui';
import { pickFromLibrary, pickVideo, takePhoto } from '@/src/lib/media';

export function PhotoSheet({
  open,
  onClose,
  onPicked,
  allowVideo = false,
}: {
  open: boolean;
  onClose: () => void;
  onPicked: (uri: string) => void;
  allowVideo?: boolean;
}) {
  return (
    <Sheet open={open} onClose={onClose}>
      <Text className="text-ink font-bold text-lg mb-1">Şəkil əlavə et</Text>
      <Text className="text-muted text-sm mb-4">Kamera və ya qalereyadan seçin.</Text>
      <View className="gap-2 pb-2">
        <PrimaryButton
          label="Kamera"
          onPress={async () => {
            const uri = await takePhoto();
            if (uri) onPicked(uri);
            onClose();
          }}
        />
        <GhostButton
          label="Qalereya"
          onPress={async () => {
            const uri = await pickFromLibrary();
            if (uri) onPicked(uri);
            onClose();
          }}
        />
        {allowVideo ? (
          <GhostButton
            label="Video (qısa hesabat)"
            onPress={async () => {
              const uri = await pickVideo();
              if (uri) onPicked(uri);
              onClose();
            }}
          />
        ) : null}
      </View>
    </Sheet>
  );
}
