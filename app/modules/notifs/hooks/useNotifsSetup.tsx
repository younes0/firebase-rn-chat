import { useEffect } from "react";
import { Platform } from "react-native";
import { getMessaging } from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

import {
  handleBackgroundMessage,
  handleEvent,
  handleMessage,
} from "@/modules/notifs/notifs.handlers";
import useGetUserId from "@/modules/firebase/hooks/useGetUserId";
import { createAndroidChannels, createIosCategories } from "../notifs.setup";
import { sendPushTokens } from "../push-token.utils";

const useNotifsSetup = () => {
  // message & event handlers
  // ---------------------------------------------------------------------------
  useEffect(() => {
    getMessaging().onMessage(handleMessage);
    const unsubscribe = notifee.onForegroundEvent(handleEvent);

    // android can't handle background messages with notifee
    if (Platform.OS === "ios") {
      getMessaging().setBackgroundMessageHandler(handleBackgroundMessage);
      notifee.onBackgroundEvent(handleEvent);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // android channels
  // ---------------------------------------------------------------------------

  useEffect(() => {
    createAndroidChannels();
    createIosCategories();
  }, []);

  // send push token to server
  // TODO: directly write to FIREBASE
  // ---------------------------------------------------------------------------
  const userId = useGetUserId();

  useEffect(() => {
    if (userId) {
      sendPushTokens();
    }
  }, [userId]);
};

export default useNotifsSetup;
