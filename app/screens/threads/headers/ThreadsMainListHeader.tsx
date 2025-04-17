import React from "react";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Text, TouchableRipple } from "react-native-paper";
import { useRouter } from "expo-router";

import BoxArrowDown from "phosphor-react-native/src/icons/BoxArrowDown";

import useThreadsListener from "@/modules/chat/threads-list/useThreadsListener";
import { getThreadsArchivedQuery } from "@/modules/chat/queries/threads-list.queries";
import { colors, typo } from "@/definitions/styles.definitions";

const ThreadsMainListHeader = () => {
  const router = useRouter();

  // fetch data
  // -------------------------------------------------------------------
  const { data } = useThreadsListener({ queryFn: getThreadsArchivedQuery });
  const hasArchivedThreads = Boolean(data?.length);

  // render
  // -------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);

  return hasArchivedThreads ? (
    <TouchableRipple
      onPress={() => router.navigate("/archived")}
      borderless={true}
    >
      <View style={styles.root}>
        <View style={styles.iconWrapper}>
          <BoxArrowDown size={24} color={colors.icon} />
        </View>

        <View style={styles.title}>
          <Text style={styles.titleText}>Archived</Text>
        </View>
      </View>
    </TouchableRipple>
  ) : null;
};

const stylesheet = createStyleSheet(() => ({
  root: {
    flexDirection: "row",
    paddingBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    width: 48,
  },
  title: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 5,
  },
  titleText: {
    ...typo.textLg,
  },
  count: {
    justifyContent: "center",
  },
  countText: {
    ...typo.titleSm,
  },
}));

export default ThreadsMainListHeader;
