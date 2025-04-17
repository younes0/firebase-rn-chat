import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";

        height.value = e.height;
      },
      onEnd: (e) => {
        "worklet";

        height.value = e.height;
      },
    },
    [],
  );

  return { height };
};

const KeyboardAvoidingWrapperAndroid = ({ children }: PropsWithChildren) => {
  const { height } = useGradualAnimation();

  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    [],
  );

  // render
  // -------------------------------------------------------------------
  return (
    <View style={{ flex: 1 }}>
      {children}
      <Animated.View style={fakeView} />
    </View>
  );
};

export default KeyboardAvoidingWrapperAndroid;
