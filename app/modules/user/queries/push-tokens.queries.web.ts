import { doc, getFirestore, setDoc, deleteDoc } from "@firebase/firestore";

import { FirestoreCollection } from "@/definitions/enums";
import { PushToken, PushTokenType } from "@/api/chat/chat.definitions";
import { firestoreConverter } from "@/modules/firebase/utils/firestore-converter";

const converter = firestoreConverter<PushToken>();

export const getPushTokenDoc = (deviceId: string) =>
  doc(getFirestore(), FirestoreCollection.PushTokens, deviceId).withConverter(
    converter
  );

export const upsertPushToken = async (pushToken: {
  deviceId: string;
  data: string;
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
