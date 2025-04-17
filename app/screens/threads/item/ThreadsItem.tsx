import React, { useMemo } from "react";
import { View, TouchableHighlight } from "react-native";
import { Text } from "react-native-paper";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useRouter } from "expo-router";

import SpeakerSimpleSlash from "phosphor-react-native/src/icons/SpeakerSimpleSlash";
import Circle from "phosphor-react-native/src/icons/Circle";

import ThreadItemTimeAgo from "@/screens/threads/item/ThreadsItemTimeago";
import useGetProfile from "@/modules/user/hooks/useGetProfile";
import { Thread } from "@/modules/chat/chat.definitions";
import { colors, typo } from "@/definitions/styles.definitions";
import { getThreadPreview } from "@/modules/chat/thread/thread.utils";
import { useThreadsStoreActions } from "@/stores/threads.store";
import ProfileMainPhoto from "@/components/ProfileMainPhoto";

export interface Props {
  isSelected?: boolean;
  thread: Thread;
}

const ThreadsItem = React.memo(({ thread, isSelected = false }: Props) => {
  const router = useRouter();

  const { isLastMessageMine, isLastPeerMessageSeen, userId } = thread;
  const createdAt = useMemo(
    () => new Date(thread.lastMessageCreatedAt),
    [thread]
  );

  // fetch data
  // --------------------------------------------------------------------
  const { data: profile } = useGetProfile({ profileId: userId });

  // handlers
  // --------------------------------------------------------------------
  const { setSelected } = useThreadsStoreActions();

  const handleLongPress = () => {
    setSelected(thread);
  };

  const handlePress = () => {
    if (isSelected) {
      setSelected(null);
    } else {
      router.navigate({
        pathname: "/discussion/[peerId]",
        params: { peerId: userId },
      });
    }
  };

  // render
  // --------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);
  const isUnread = !isLastMessageMine && !isLastPeerMessageSeen;

  return profile ? (
    <TouchableHighlight
      delayLongPress={300}
      onLongPress={handleLongPress}
      onPress={handlePress}
    >
      <View style={[styles.root, isSelected ? styles.rootIsSelected : []]}>
        <ProfileMainPhoto profile={profile} size="xs" />

        <View style={styles.text}>
          <Text style={styles.title}>
            {profile.firstName + " " + profile.lastName}
          </Text>

          <Text numberOfLines={1} style={styles.preview}>
            {getThreadPreview(thread)}
          </Text>
        </View>

        <View style={styles.details}>
          <ThreadItemTimeAgo date={createdAt} isUnread={isUnread} />

          <View style={styles.detailsBottom}>
            {thread.isMuted && (
              <SpeakerSimpleSlash size={18} color="#86898c" weight="fill" />
            )}

            {isUnread && (
              <View style={styles.unreadIcon}>
                <Circle
                  size={18}
                  color={"rgba(116, 103, 190, 1)"}
                  weight="fill"
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableHighlight>
  ) : null;
});

const stylesheet = createStyleSheet(() => ({
  // root
  // ------------------------------------------------------
  root: {
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  rootIsSelected: {
    backgroundColor: "rgba(227, 221, 255, 1)",
  },

  // text
  // ------------------------------------------------------
  text: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 15,
  },
  title: {
    ...typo.textLgSemiBold,
    color: colors.text.default,
    paddingBottom: 2,
  },
  preview: {
    color: colors.text.secondary,
    fontWeight: "400",
  },

  // details
  // ------------------------------------------------------
  details: {
    ...typo.textXs,
    alignItems: "flex-end",
    paddingTop: 8,
  },
  detailsBottom: {
    alignContent: "flex-end",
    flexDirection: "row",
    marginRight: -4,
    paddingTop: 2,
  },
  unreadIcon: {
    marginLeft: 4,
  },
}));

ThreadsItem.displayName = "ThreadsItem";

export default ThreadsItem;
