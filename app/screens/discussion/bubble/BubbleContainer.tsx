import React, { useMemo } from "react";
import { Pressable, View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { format, isSameDay } from "date-fns";

import {
  useDiscussionStore,
  useDiscussionStoreActions,
} from "@/stores/discussion.store";
import Bubble from "@/screens/discussion/bubble/Bubble";
import { Message } from "@/modules/chat/messages/messages.definitions";
import { bubbleShadow } from "@/screens/discussion/discussion.styles";

export interface Props {
  isSelected?: boolean;
  message: Message;
}

const BubbleContainer = React.memo(({ message, isSelected = false }: Props) => {
  const messages = useDiscussionStore((state) => state.messages);
  const previousMessage = useMemo(
    () => messages[messages.indexOf(message) + 1],
    [message, messages]
  );

  // handlers
  // ------------------------------------------------------------------------------------
  const { setSelectedMessage } = useDiscussionStoreActions();

  const handleLongPress = () => {
    setSelectedMessage(message);
  };

  // render
  // ------------------------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);

  return (
    <>
      {isSameDay(previousMessage?.createdAt, message.createdAt) ? null : (
        <View style={styles.timeRow}>
          <View style={[styles.timeContainer, bubbleShadow]}>
            <Text style={styles.time}>
              {format(message.createdAt, "d MMMM yyyy")}
            </Text>
          </View>
        </View>
      )}

      <Pressable
        delayLongPress={300}
        onLongPress={handleLongPress}
        style={[
          styles.bubbleWrapper,
          isSelected ? styles.bubbleWrapperIsSelected : [],
          previousMessage?.authorId === message.authorId
            ? styles.bubbleWrapperIsSameAuthor
            : [],
        ]}
      >
        <Bubble message={message} />
      </Pressable>
    </>
  );
});

const stylesheet = createStyleSheet(() => ({
  bubbleWrapper: {
    marginTop: 10,
  },
  bubbleWrapperIsSameAuthor: {
    marginTop: 5,
  },
  bubbleWrapperIsSelected: {
    opacity: 0.75,
    backgroundColor: "rgba(227, 221, 255, 1)",
    marginHorizontal: -10,
    paddingHorizontal: 10,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  timeContainer: {
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  time: {
    color: "#6b6b6b",
    fontSize: 13,
    fontWeight: "500",
  },
}));

BubbleContainer.displayName = "BubbleContainer";

export default BubbleContainer;
