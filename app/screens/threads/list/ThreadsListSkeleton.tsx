import React from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { View } from "react-native";
import times from "lodash/times";
import { Placeholder, PlaceholderLine, PlaceholderMedia } from "rn-placeholder";

export interface Props {
  count?: number;
}

const ThreadsListSkeleton = ({ count = 4 }) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.root}>
      {times(count, (index) => (
        <Placeholder
          key={index}
          style={styles.placeholder}
          Left={() => <PlaceholderMedia style={styles.media} />}
        >
          <PlaceholderLine width={50} />
          <PlaceholderLine width={75} noMargin={true} />
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
  },
  media: {
    borderRadius: 100,
    height: 50,
    marginRight: 15,
    width: 50,
  },
}));

export default ThreadsListSkeleton;
