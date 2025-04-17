import {
  FirebaseFirestoreTypes,
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
} from "@react-native-firebase/firestore";

import { FirestoreCollection } from "@/definitions/enums";

type MessageQueryParams = {
  fid: string;
};

// queries
// ---------------------------------------------------------------------------------
export const getMessagesBaseQuery = ({
  fid,
  limitVal = 100,
}: MessageQueryParams & {
  limitVal?: number;
}): FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =>
  query(
    getMessagesDocCollection({ fid }),
    orderBy("createdAt", "desc"),
    limit(limitVal)
  );

export const getMessagesDoc = ({
  fid,
}: MessageQueryParams): FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData> =>
  doc(getFirestore(), FirestoreCollection.Messages, fid);

export const getMessagesDocCollection = ({
  fid,
}: MessageQueryParams): FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData> =>
  collection(getMessagesDoc({ fid }), FirestoreCollection.SubCollection);
