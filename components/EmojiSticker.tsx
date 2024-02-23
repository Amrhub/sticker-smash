import { View, Image } from 'react-native';
import { Gesture, GestureDetector, GestureUpdateEvent, PanGestureChangeEventPayload, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from './ImageViewer';

interface IProps {
  imageSize: number;
  stickerSource: any;
}

export default function EmojiSticker({ imageSize, stickerSource }: IProps) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart(() => {
    if (scaleImage.value !== imageSize * 2) {
      // Fix the position of the image after scaling up while at the bottom to avoid overflow
      if(translateY.value > IMAGE_HEIGHT - imageSize * 2 ) translateY.value = IMAGE_HEIGHT - imageSize * 2;
      // Fix the position of the image after scaling up while at the right to avoid overflow
      if(translateX.value > IMAGE_WIDTH - imageSize * 2 ) translateX.value = IMAGE_WIDTH - imageSize * 2;

      scaleImage.value = scaleImage.value * 2;
    } else {
      scaleImage.value = imageSize;
    }
  });
  const drag = Gesture.Pan()
  .onChange((event) => {
    if((translateX.value + event.changeX > 0) && ((translateX.value + event.changeX) < IMAGE_WIDTH - scaleImage.value)) 
      translateX.value += event.changeX;
    if((translateY.value + event.changeY > 0) && (translateY.value + event.changeY < IMAGE_HEIGHT - scaleImage.value))  
      translateY.value += event.changeY;
  });
  
  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle,{position: 'absolute'}]}>
        <GestureDetector gesture={doubleTap}>
          <Animated.Image
            source={stickerSource}
            resizeMode="contain"
            style={[{ width: imageSize, height: imageSize }, imageStyle]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}