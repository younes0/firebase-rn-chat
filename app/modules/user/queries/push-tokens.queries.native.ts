import {
  doc,
  getFirestore,
  setDoc,
  deleteDoc,
} from "@react-native-firebase/firestore";

import { FirestoreCollection } from "@/definitions/enums";
import { PushToken, PushTokenType } from "@/api/chat/chat.definitions";

export const getPushTokenDoc = (deviceId: string) =>
  doc(getFirestore(), FirestoreCollection.PushTokens, deviceId);

export const upsertPushToken = async (pushToken: {
  data: string;
  deviceId: string;
  type: PushTokenType;
}) => {
  const now = new Date();

  return setDoc(getPushTokenDoc(pushToken.deviceId), <PushToken>{
    ...pushToken,
    createdAt: now,
    updatedAt: now,
  });
};

export const deletePushTokenByDeviceId = (deviceId: string) =>
  deleteDoc(getPushTokenDoc(deviceId));
