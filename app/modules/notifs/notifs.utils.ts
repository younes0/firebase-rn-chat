import { Platform } from "react-native";
import notifee, { AndroidStyle, Notification } from "@notifee/react-native";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";

import { ChatNotification } from "@/modules/notifs/notifs.definitions";

export type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;

// common
// ----------------------------------------------------------------------------
export const getNotifeeNotif = (message: RemoteMessage) =>
  message.data?.notifee && typeof message.data.notifee === "string"
    ? (JSON.parse(message.data.notifee) as Notification)
    : undefined;

// chat
// ----------------------------------------------------------------------------
export const isChatNotif = (notif?: Notification) =>
  Boolean(notif?.data?.chatPeerId || notif?.ios?.communicationInfo?.sender?.id);

export const getChatNotifPeerId = (notif: ChatNotification) => {
  const id =
    notif?.ios?.communicationInfo?.sender?.id || notif?.data.chatPeerId;

  return id || null;
};

// chat utils
// ----------------------------------------------------------------------------
export const displayChatNotif = (message: RemoteMessage) => {
  const notif = getNotifeeNotif(message) as ChatNotification;

  if (Platform.OS === "ios") {
    // @ts-ignore
    const ios = message?.data?.notifee_options.ios;

    if (ios) {
      return notifee.displayNotification({
        // @ts-ignore
        ...JSON.parse(message?.data?.notifee),
        body: message.notification?.body,
        ios,
      });
    }
  } else {
    const person = {
      name: notif.title as string,
      icon: notif.data.imageUrl,
    };

    return notifee.displayNotification({
      ...notif,
      android: {
        ...notif.android,
        style: {
          type: AndroidStyle.MESSAGING,
          person,
          messages: [
            {
              person,
              text: notif.body as string,
              timestamp: Date.now(),
            },
          ],
        },
      },
    });
  }
};
