import React, { useContext, useEffect, useState } from "react";
import { View, TextInput } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import PaperPlaneRight from "phosphor-react-native/src/icons/PaperPlaneRight";

import MessagesService from "@/modules/chat/messages/messages.service";
import useAdjustInputHeight from "./useAdjustInputHeight";
import useInputTextChange from "./useInputTextChange";
import { DiscussionContext } from "@/definitions/contexts";
import { colors } from "../discussion.styles";
import { getDraft, setDraft } from "../discussion.utils";
import { useDiscussionStoreActions } from "@/stores/discussion.store";

export interface Props {
  onSend: (text: string | undefined) => void;
}

const DiscussionFooter = ({ onSend }: Props) => {
  // context & state
  // ------------------------------------------------------------------------------------
  const { peerId } = useContext(DiscussionContext);
  const { setIsInputFocused } = useDiscussionStoreActions();
  const [text, setText] = useState<string | undefined>(
    peerId ? getDraft(peerId) : undefined
  );

  const hasText = Boolean(text?.trim().length);

  // handlers
  // ------------------------------------------------------------------------------------
  const { handleTextChanged } = useInputTextChange();
  const { adjustInputHeight } = useAdjustInputHeight({ maxHeight: 100 });

  const handleChangeText = (value: string) => {
    setText(value);
    handleTextChanged(value);
  };

  const handleSend = () => {
    if (hasText) {
      setText("");
      onSend(text);
      handleTextChanged(null);
    }
  };

  useEffect(() => {
    // clean draft if no text on unmount
    return () => {
      if (!hasText && peerId) {
        setDraft(peerId, "");
      }
    };
  }, [hasText, peerId, text]);

  // render
  // ------------------------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <TextInput
        enablesReturnKeyAutomatically={true}
        maxLength={MessagesService.MAX_INPUT_LENGTH}
        multiline={true}
        onBlur={() => setIsInputFocused(false)}
        onChange={adjustInputHeight}
        onChangeText={handleChangeText}
        onFocus={() => setIsInputFocused(true)}
        onLayout={adjustInputHeight}
        placeholder="Message"
        placeholderTextColor="#6f6f6f"
        style={styles.input}
        value={text}
      />

      <View style={styles.actions}>
        <IconButton
          accessibilityLabel="send"
          containerColor={
            hasText ? "rgba(116, 103, 190, 1)" : "rgba(171, 157, 248, 1)"
          }
          disabled={!hasText}
          onPress={handleSend}
          size={30}
          icon={() => (
            <PaperPlaneRight
              color={
                hasText ? "rgba(43, 30, 114, 1)" : "rgba(116, 103, 190, 1)"
              }
              size={28}
              style={styles.sendIcon}
              weight="fill"
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(() => ({
  root: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: "#e8eae3",
    borderRadius: 25,
    borderWidth: 1,
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    marginVertical: 7.5,
    maxHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  actions: {
    alignItems: "center",
    alignSelf: "flex-end",
    flexDirection: "row",
    marginRight: -5,
  },
  photoButton: {
    marginRight: 0,
  },
  sendIcon: {
    marginRight: -2,
  },
}));

export default DiscussionFooter;
