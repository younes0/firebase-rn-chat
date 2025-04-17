import React, { useCallback, useContext, useEffect, useRef } from "react";
import { AppState, FlatList, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import orderBy from "lodash/orderBy";
import sortBy from "lodash/sortBy";

import {
  useDiscussionStore,
  useDiscussionStoreActions,
} from "@/stores/discussion.store";
import {
  DiscussionContext,
  DiscussionServicesContext,
} from "@/definitions/contexts";
import DiscussionFooter from "../footer/DiscussionFooter";
import DiscussionList from "./DiscussionList";
import KeyboardAvoidingWrapper from "@/components/keyboard-avoiding-wrapper/KeyboardAvoidingWrapper";
import MessagesService from "@/modules/chat/messages/messages.service";
import PatternBackground from "@/components/PatternBackground";
import useAppState from "@/hooks/useAppState";
import { ChangedDocuments } from "@/modules/chat/chat.definitions";
import { Message } from "@/modules/chat/messages/messages.definitions";

const DiscussionView = () => {
  const chatViewRef = useRef<FlatList>(null);
  const handleForegroundRef =
    useRef<() => Promise<void> | undefined>(undefined);

  // state & context
  // -------------------------------------------------------------------
  const { peerId } = useContext(DiscussionContext);
  const { services } = useContext(DiscussionServicesContext);

  // store
  // -------------------------------------------------------------------
  const isFullyLoaded = useDiscussionStore((state) => state.isFullyLoaded);
  const messages = useDiscussionStore((state) => state.messages);
  const reply = useDiscussionStore((state) => state.reply);
  const uploadedAsset = useDiscussionStore((state) => state.uploadedAsset);

  const {
    addMessages,
    addUserMessage,
    reset: resetState,
    setIsFirstFetching,
    setIsFullyLoaded,
    setIsPeerTyping,
    setThread,
    setPeerId,
  } = useDiscussionStoreActions();

  useEffect(() => {
    setPeerId(peerId);
  }, [peerId, setPeerId]);

  // subscribe to messages
  // -------------------------------------------------------------------
  const handleSubscribedMessages = useCallback(
    ({ added }: ChangedDocuments<Message>) => {
      console.log(added);
      if (added.length) {
        addMessages({ messages: added });

        const setReceived = () =>
          services?.message.setReceived(orderBy(added, "createdAt", "desc")[0]);

        if (AppState.currentState === "active") {
          setReceived();
        } else {
          handleForegroundRef.current = setReceived;
        }
      } else {
        setIsFirstFetching(false);
      }
    },
    [addMessages, services, setIsFirstFetching]
  );

  // handlers: focus/blur
  // -------------------------------------------------------------------
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      services?.message.subscribe(handleSubscribedMessages, ["added"]);
      services?.thread.subscribe(setThread);
      services?.typing.subscribe(setIsPeerTyping);

      return () => {
        // // prevents unsubscribe on navigation from discussion to profile
        // if (currentRoute === "profile") {
        //   return;
        // }

        resetState();
        services?.message.unsubscribe?.();
        services?.thread.unsubscribe?.();
        services?.typing.unsubscribe?.();
      };
    }, [
      handleSubscribedMessages,
      navigation,
      resetState,
      services,
      setIsPeerTyping,
      setThread,
    ])
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setThread(await services?.thread.get());
      })();
    }, [setThread, services])
  );

  useAppState({
    onForeground: () => {
      if (handleForegroundRef.current) {
        handleForegroundRef.current();
        handleForegroundRef.current = undefined;
      }
    },
  });

  // handlers: list
  // -------------------------------------------------------------------
  const handleEndReached = async () => {
    if (isFullyLoaded || !services) {
      return;
    }

    const previousMessages = await services.message.getMessages(
      sortBy(messages, ["createdAt", "asc"])[0]
    );

    if (previousMessages.length) {
      addMessages({ messages: previousMessages, isOlder: true });
    }

    if (
      !isFullyLoaded &&
      previousMessages.length < MessagesService.PAGINATION_SIZE
    ) {
      setIsFullyLoaded(true);
    }
  };

  // handlers: sending
  // -------------------------------------------------------------------
  const handleSent = useCallback(() => {
    chatViewRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
  }, []);

  const handleSend = (text: string | undefined) => {
    if (services && text?.trim()) {
      addUserMessage(services.message.sendText(text, reply));
      handleSent();
    }
  };

  useEffect(() => {
    if (uploadedAsset && services) {
      addUserMessage(services.message.sendAsset(uploadedAsset));
      handleSent();
    }
  }, [addUserMessage, services, handleSent, uploadedAsset]);

  // render
  // -------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.wrapper}>
      <KeyboardAvoidingWrapper>
        <PatternBackground />

        <DiscussionList
          messages={messages}
          onEndReached={handleEndReached}
          ref={chatViewRef}
        />

        <DiscussionFooter onSend={handleSend} />
      </KeyboardAvoidingWrapper>
    </View>
  );
};

const stylesheet = createStyleSheet(() => ({
  wrapper: {
    backgroundColor: "rgba(255, 175, 100, 0.08)",
    flex: 1,
  },
}));

export default DiscussionView;
