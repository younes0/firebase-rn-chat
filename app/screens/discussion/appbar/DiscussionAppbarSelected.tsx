import React, { useEffect, useRef } from "react";
import { BackHandler, NativeEventSubscription } from "react-native";
import { Appbar } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";

import {
  useDiscussionStore,
  useDiscussionStoreActions,
} from "@/stores/discussion.store";
import { colors } from "@/definitions/styles.definitions";
import CustomAppbar from "@/components/CustomAppbar";

const DiscussionAppbarSelected = () => {
  // store
  // ------------------------------------------------------------------------------------
  const message = useDiscussionStore((state) => state.selectedMessage);
  const { setSelectedMessage } = useDiscussionStoreActions();

  // unselect on screen blur
  // ------------------------------------------------------------------------
  const navigation = useNavigation();

  useEffect(
    () =>
      navigation.addListener("blur", () => {
        setSelectedMessage(null);
      }),
    [navigation, setSelectedMessage]
  );

  // handlers
  // ------------------------------------------------------------------------------------
  const handleBackActionWithSelected = () => setSelectedMessage(null);

  const handleCopyPress = () => {
    if (message) {
      setSelectedMessage(null);

      console.info("Copied message to clipboard", message.text);

      Clipboard.setStringAsync(message.text);
    }
  };

  // back handler
  // ------------------------------------------------------------------------
  const backHandlerSubRef = useRef<NativeEventSubscription | null>(null);

  useEffect(() => {
    if (!backHandlerSubRef.current) {
      backHandlerSubRef.current = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          setSelectedMessage(null);
          return true;
        }
      );
    }
  }, [setSelectedMessage]);

  useEffect(() => {
    return () => {
      if (backHandlerSubRef.current) {
        backHandlerSubRef.current?.remove();
        backHandlerSubRef.current = null;
      }
    };
  }, []);

  // render
  // -----------------------------------------------------------------------------
  return (
    <CustomAppbar backActionHandler={handleBackActionWithSelected} title=" ">
      <Appbar.Action
        color={colors.icon}
        icon="content-copy"
        onPress={handleCopyPress}
      />
    </CustomAppbar>
  );
};

export default DiscussionAppbarSelected;
