import { Firestore } from "firebase-admin/firestore";

import {
  FirestoreCollection,
  MessageContentType,
  PushTokenData,
  Thread,
  UserProfile,
} from "./definitions";
import i18next from "./i18next.utils";

// database involved methods
// -----------------------------------------------------------------------
export const getPushTokens = async ({
  firestore,
  userFid,
}: {
  firestore: Firestore;
  userFid: string;
}) => {
  const snapshot = await firestore
    .collection(FirestoreCollection.PushTokens)
    .doc(userFid)
    .collection(FirestoreCollection.SubCollection)
    .get();

  return snapshot.docs.map((doc) => doc.data()) as PushTokenData[];
};

export const getUserProfile = async ({
  firestore,
  userFid,
}: {
  firestore: Firestore;
  userFid: string;
}) => {
  const doc = await firestore
    .collection(FirestoreCollection.UserProfiles)
    .doc(userFid)
    .get();

  return doc.data() as UserProfile;
};

export const getNotificationText = (thread: Thread) => {
  const { lastMessageText, lastMessageContentType } = thread;

  const type = lastMessageContentType.toLowerCase();

  return lastMessageContentType === MessageContentType.Text
    ? lastMessageText
    : i18next.t(`threadText.${type}`).toString();
};
