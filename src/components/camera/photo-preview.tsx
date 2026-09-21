import { Image, View } from "react-native";

import { styles } from "./styles/photo-preview";

export interface PhotoPreviewProps {
  photoUri: string | null;
  hasPhoto: boolean;
}

/**
 * RN has no Canvas API (no getContext/drawImage/clearRect), but none is
 * needed here - expo-camera's takePictureAsync() already returns a
 * ready-to-display file URI, so this is just an <Image>.
 */
export default function PhotoPreview({
  photoUri,
  hasPhoto,
}: PhotoPreviewProps) {
  if (!hasPhoto || !photoUri) return null;

  return (
    <View style={styles.result} pointerEvents="none">
      <Image
        source={{ uri: photoUri }}
        style={styles.photo}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel="Captured photo"
        accessible
      />
    </View>
  );
}
