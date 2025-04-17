import { Messaging, MulticastMessage } from "firebase-admin/messaging";

import {
  ChannelIdentifier,
  ChatNotificationPayload,
  PushTokenData,
  PushTokenType,
} from "./definitions";

export const sendNotification = async ({
  messaging,
  tokens,
  payload,
}: {
  messaging: Messaging;
  tokens: PushTokenData[];
  payload: ChatNotificationPayload;
}) => {
  const androidTokens = tokens.filter(
    (token) => token.type === PushTokenType.Android,
  );
  const iosTokens = tokens.filter((token) => token.type === PushTokenType.Ios);

  const results = [];

  if (androidTokens.length) {
    results.push(
      await messaging
        .sendEachForMulticast(_createAndroidMessage(androidTokens, payload))
        .catch((error) => {
          console.dir(error, { depth: null });
        }),
    );
  }

  if (iosTokens.length) {
    results.push(
      await messaging
        .sendEachForMulticast(_createIosMessage(iosTokens, payload))
        .catch((error) => {
          console.dir(error, { depth: null });
        }),
    );
  }

  return results;
};

const _createAndroidMessage = (
  tokens: PushTokenData[],
  payload: ChatNotificationPayload,
): MulticastMessage => {
  const { message, peer } = payload;

  return {
    tokens: tokens.map((token) => token.data),

    android: { priority: "high" },

    notification: {
      body: message,
      title: peer.displayName,
    },

    data: {
      notifee: JSON.stringify({
        android: {
          channelId: ChannelIdentifier.MessageNew,
          pressAction: { id: "default" },
        },
        body: message,
        title: peer.displayName,
        data: {
          chatPeerId: peer.id.toString(),
          imageUrl: peer.pictureUrl,
        },
      }),
    },
  };
};

const _createIosMessage = (
  tokens: PushTokenData[],
  payload: ChatNotificationPayload,
): MulticastMessage => {
  const { message, peer } = payload;

  return {
    tokens: tokens.map((token) => token.data),

    notification: {
      title: peer.displayName,
      body: message,
    },

    data: {
      notifee: JSON.stringify({
        data: {
          chatPeerId: peer.id.toString(),
        },
      }),
    },

    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          mutableContent: true,
          category: "communications",
        },
        notifee_options: {
          ios: {
            categoryId: "communications",
            communicationInfo: {
              conversationId: peer.id.toString(),
              sender: {
                id: peer.id.toString(),
                avatar: peer.pictureUrl,
                displayName: peer.displayName,
              },
            },
          },
        },
      },
    },
  };
};
