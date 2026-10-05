import { View, Image } from 'react-native';
import { styles } from './styles/photo-preview.styles';

export interface PhotoPreviewProps {
  photoUri: string | null;
  hasPhoto: boolean;
}

export default function PhotoPreview({ photoUri, hasPhoto }: PhotoPreviewProps) {
  if (!hasPhoto || !photoUri) return null;

  return (
    <View style={[styles.result, styles.resultNoPointerEvents]}>
      <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
    </View>
  );
}
