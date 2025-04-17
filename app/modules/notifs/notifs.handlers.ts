import { Platform } from "react-native";
import notifee, { Event, EventType } from "@notifee/react-native";
import { router } from "expo-router";

import {
  RemoteMessage,
  displayChatNotif,
  getChatNotifPeerId,
  getNotifeeNotif,
  isChatNotif,
} from "@/modules/notifs/notifs.utils";
import { getCurrentChatPeerId } from "@/utils/navigation.utils";
import { ChatNotification } from "@/modules/notifs/notifs.definitions";

// remote message (notification received)
// --------------------------------------------------------------------------------------
export const handleBackgroundMessage = (message: RemoteMessage) => {
  const notif = getNotifeeNotif(message);

  return notif && Platform.OS === "ios"
    ? notifee.displayNotification(notif)
    : new Promise(() => null);
};

export const handleMessage = (message: RemoteMessage) => {
  const notif = getNotifeeNotif(message);

  // don't display if non notifee
  // -------------------------------------------------------------
  if (!notif) {
    return new Promise(() => null);
  }

  //  chat notification
  // -------------------------------------------------------------
  if (isChatNotif(notif)) {
    if (
      getChatNotifPeerId(notif as ChatNotification) === getCurrentChatPeerId()
    ) {
      return new Promise(() => null);
    }

    return displayChatNotif(message);
  } else {
    // non chat notification
    // -------------------------------------------------------------
    // we build notification from ground up to make it working with events
    return notifee.displayNotification({
      // @ts-ignore
      ...JSON.parse(message?.data?.notifee),
      body: message.notification?.body,
      title: message.notification?.title,
    });
  }
};

// notifee events (tap)
// --------------------------------------------------------------------------------------
export const handleEvent = async (event: Event) => {
  const { detail, type } = event;

  if (type !== EventType.PRESS) {
    return;
  }

  const notif = detail?.notification;

  if (!notif) {
    return;
  }

  if (isChatNotif(notif)) {
    // navigate to discussion
    const peerId = getChatNotifPeerId(notif as ChatNotification);

    if (peerId) {
      router.navigate({
        pathname: "/discussion/[peerId]",
        params: { peerId },
      });
    }
  }

  if (notif.id) {
    notifee.cancelNotification(notif.id);
  }
};
