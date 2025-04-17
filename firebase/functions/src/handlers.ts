import { initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore } from "firebase-admin/firestore";
import {
  Change,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";

import {
  getNotificationText,
  getPushTokens,
  getUserProfile,
} from "./other.utils";
import i18next from "./i18next.utils";
import { Thread, ChatNotificationPayload } from "./definitions";
import { sendNotification } from "./notifs.utils";

// initialize firebase
// -------------------------------------------------------------------
initializeApp();
const messaging = getMessaging();
const firestore = getFirestore();

//handlers
// -------------------------------------------------------------------
export const sendNewMessageNotification = async (
  event: FirestoreEvent<
    Change<QueryDocumentSnapshot> | undefined,
    {
      recipientId: string;
      senderId: string;
    }
  >,
) => {
  // retrieve changes
  // ------------------------------------------------
  const { data } = event;
  if (!data || !data.after.exists) {
    return;
  }

  const thread = data.after.data() as Thread;
  const previousThread = data.before.data() as Thread | undefined;

  // ignore
  // ------------------------------------------------
  if (
    thread.lastMessageId === previousThread?.lastMessageId || // "seen" updated
    thread.isLastMessageMine || // own new message
    // or unknown/blocked/muted peer
    thread.isBlocked ||
    thread.isMuted
  ) {
    return;
  }

  // retrieve tokens & profile
  // ------------------------------------------------
  const { recipientId, senderId } = event.params;

  const tokens = await getPushTokens({
    firestore,
    userFid: recipientId,
  });

  if (!tokens?.length) {
    return;
  }

  const peerProfile = await getUserProfile({
    firestore,
    userFid: senderId,
  });

  if (!peerProfile) {
    return;
  }

  // send notif
  // ------------------------------------------------
  await i18next.changeLanguage(tokens[0].lang as string);

  const payload: ChatNotificationPayload = {
    message: getNotificationText(thread),
    peer: {
      id: parseInt(senderId),
      displayName: peerProfile.firstName + " " + peerProfile.lastName,
      pictureUrl: peerProfile.photoUrl,
    },
  };

  return sendNotification({
    messaging,
    tokens,
    payload,
  });
};
