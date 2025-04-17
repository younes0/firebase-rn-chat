import React, { PropsWithChildren, useState } from "react";
import { Dimensions, KeyboardAvoidingView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: DEVICE_HEIGHT } = Dimensions.get("screen");

const KeyboardAvoidingWrapperIos = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  const [screenHeight, setScreenHeight] = useState<number>(0);

  // render
  // -------------------------------------------------------------------
  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        setScreenHeight(event.nativeEvent.layout.height);
      }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={DEVICE_HEIGHT - screenHeight - insets.bottom}
        style={{ flex: 1 }}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
};

export default KeyboardAvoidingWrapperIos;
