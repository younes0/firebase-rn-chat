import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

/**
 * Android building fails with .webp images so we use png
 */
const DiscussionBackground = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <ImageBackground
      resizeMode="repeat"
      source={require("@/assets/images/chat-background.png")}
      style={styles.backgroundImage}
    />
  );
};

const stylesheet = createStyleSheet(() => ({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    opacity: 0.1,
    width: "100%",
  },
}));

export default DiscussionBackground;
