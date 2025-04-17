import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { ThreadType } from "@/modules/chat/chat.definitions";
import ThreadsListSkeleton from "./ThreadsListSkeleton";

export interface Props {
  isLoading: boolean;
  hasThreads: boolean;
  type: ThreadType;
}

const getContents = () => ({
  [ThreadType.Main]: "Main",
  [ThreadType.Archived]: "Archived",
});

const ThreadsListEmpty = ({ isLoading, hasThreads, type }: Props) => {
  const { styles } = useStyles(stylesheet);

  const description = useMemo(() => getContents()[type], [type]);

  return isLoading ? (
    <ThreadsListSkeleton />
  ) : hasThreads ? null : (
    <View style={styles.root}>
      <Text>{description}</Text>
    </View>
  );
};

const stylesheet = createStyleSheet(() => ({
  root: {
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: "center",
  },
}));

export default ThreadsListEmpty;
