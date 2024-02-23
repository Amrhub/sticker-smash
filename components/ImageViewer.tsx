import { StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface IProps {
  placeholderImageSource: ImageSourcePropType;
  selectedImageUri: string | null;
}

export const IMAGE_WIDTH = 320;
export const IMAGE_HEIGHT = 440;

export default function ImageViewer({ placeholderImageSource, selectedImageUri }: IProps) {
  const imageSource = selectedImageUri ? { uri: selectedImageUri } : placeholderImageSource;
  
  return (
    <Image source={imageSource} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 18,
  },
});
