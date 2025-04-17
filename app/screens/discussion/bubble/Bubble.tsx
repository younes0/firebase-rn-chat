import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { format } from "date-fns";

import Checks from "phosphor-react-native/src/icons/Checks";
import Check from "phosphor-react-native/src/icons/Check";

import MessageText from "./MessageText";
import { Message } from "@/modules/chat/messages/messages.definitions";
import { bubbleShadow, colors } from "@/screens/discussion/discussion.styles";
import { useDiscussionStore } from "@/stores/discussion.store";
import useGetUserId from "@/modules/firebase/hooks/useGetUserId";

export interface Props {
  message: Message;
}

const CHECKMARK_SIZE = 20;

const Bubble = ({ message }: Props) => {
  const userId = useGetUserId();
  const isAuthorCurrent = message.authorId === userId?.toString();

  // store
  // ------------------------------------------------------------------------------------
  const seenMessageIds = useDiscussionStore((state) => state.seenMessageIds);

  const isSeen = useMemo(
    () => seenMessageIds.includes(message._id),
    [message._id, seenMessageIds]
  );

  // render
  // ------------------------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);
  const position = isAuthorCurrent ? "right" : "left";

  return (
    <View
      style={[
        styles.rootBase,
        bubbleShadow,
        position === "left" ? styles.rootLeft : styles.rootRight,
      ]}
    >
      {message.text ? <MessageText text={message.text} /> : null}

      <View style={styles.footer}>
        <Text style={styles.time}>{format(message.createdAt, "HH:mm")}</Text>

        {/* TODOLater: rework read receipts */}
        {false && isAuthorCurrent ? (
          isSeen ? (
            <Checks color={colors.blue} size={CHECKMARK_SIZE} />
          ) : (
            <Check color="#8696a0" size={CHECKMARK_SIZE} />
          )
        ) : null}
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(() => ({
  rootBase: {
    borderRadius: 15,
    flexDirection: "row",
    paddingVertical: 6,
  },
  rootRight: {
    alignSelf: "flex-end",
    backgroundColor: "#e6ffdf",
    marginLeft: "27%",
    paddingLeft: 15,
    paddingRight: 10,
  },
  rootLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    marginRight: "27%",
    paddingLeft: 10,
    paddingRight: 15,
  },
  footer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: -5,
    paddingLeft: 5,
  },
  time: {
    color: "#667781",
    fontSize: 12,
    padding: 2,
  },
}));

export default Bubble;
