import React, { forwardRef } from "react";
import { Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ContentStyle, FlashList, FlashListProps } from "@shopify/flash-list";
import { KeyboardController } from "react-native-keyboard-controller";

import {
  useDiscussionStore,
  useDiscussionStoreActions,
} from "@/stores/discussion.store";
import BubbleContainer from "../bubble/BubbleContainer";
import { Message } from "@/modules/chat/messages/messages.definitions";
import { getMessageType } from "@/modules/chat/messages/messages.utils";

type Props = Pick<FlashListProps<Message>, "onEndReached"> & {
  initialText?: string;
  messages: Message[];
};

const DiscussionList = forwardRef<any, Props>(
  ({ messages, onEndReached }: Props, ref) => {
    // store
    // ------------------------------------------------------------------------------------
    const { setIsScrolling } = useDiscussionStoreActions();
    const selectedMessage = useDiscussionStore(
      (state) => state.selectedMessage
    );

    // render
    // ------------------------------------------------------------------------------------
    const { styles } = useStyles(stylesheet);

    return (
      <FlashList<Message>
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={styles.content as ContentStyle}
        data={messages}
        estimatedItemSize={50}
        extraData={selectedMessage?._id}
        getItemType={getMessageType}
        inverted={true}
        keyExtractor={(message) => message._id}
        keyboardShouldPersistTaps="handled"
        onEndReached={onEndReached}
        onScrollBeginDrag={() => {
          setIsScrolling(true);
          KeyboardController.dismiss();
        }}
        onScrollEndDrag={() => setIsScrolling(false)}
        ref={ref}
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={Platform.OS !== "android"}
        renderItem={({ item: message }) => (
          <BubbleContainer
            isSelected={selectedMessage?._id === message._id}
            message={message}
          />
        )}
        // TODOLater: test
        // // prevents the list from scrolling to the bottom when a new message is added
        // maintainVisibleContentPosition={{
        //   minIndexForVisible: 0,
        // }}
      />
    );
  }
);

const stylesheet = createStyleSheet((theme) => ({
  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
}));

DiscussionList.displayName = "DiscussionList";

export default DiscussionList;
