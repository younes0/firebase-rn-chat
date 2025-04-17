import React from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { View } from "react-native";
import times from "lodash/times";
import { Placeholder, PlaceholderLine } from "rn-placeholder";

const DiscussionSkeleton = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.root}>
      {times(3, (index) => (
        <Placeholder key={index} style={styles.placeholder}>
          <PlaceholderLine noMargin={true} color="#ffffff" />
        </Placeholder>
      ))}
    </View>
  );
};

const stylesheet = createStyleSheet(() => ({
  root: {
    paddingHorizontal: 15,
    paddingTop: 10,
    rowGap: 15,
  },
  placeholder: {
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    width: "75%",
  },
  media: {
    borderRadius: 100,
    height: 50,
    marginRight: 15,
    width: 50,
  },
}));

export default DiscussionSkeleton;
