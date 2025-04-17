import { ImageBackground, Platform, StyleSheet } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const PatternBackground = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <ImageBackground
      resizeMode="repeat"
      source={require("@/assets/images/react-logo.png")}
      style={styles.backgroundImage}
    />
  );
};

const stylesheet = createStyleSheet(() => ({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    height: Platform.select({
      default: undefined,
      web: "100%",
    }),
    opacity: 0.1,
    width: Platform.select({
      default: undefined,
      web: "100%",
    }),
  },
}));

export default PatternBackground;
