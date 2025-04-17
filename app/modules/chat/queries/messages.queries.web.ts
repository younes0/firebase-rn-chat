import {
  DocumentData,
  Query,
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
} from "@firebase/firestore";

import { FirestoreCollection } from "@/definitions/enums";
import { Thread } from "@/modules/chat/chat.definitions";
import { firestoreConverter } from "@/modules/firebase/utils/firestore-converter";

type MessageQueryParams = {
  fid: string;
};

const converter = firestoreConverter<Thread>();

// queries
// ---------------------------------------------------------------------------------
export const getMessagesBaseQuery = ({
  fid,
  limitVal = 100,
}: MessageQueryParams & {
  limitVal?: number;
}): Query<DocumentData> =>
  query(
    getMessagesDocCollection({ fid }),
    orderBy("createdAt", "desc"),
    limit(limitVal)
  );

export const getMessagesDoc = ({ fid }: MessageQueryParams) =>
  doc(getFirestore(), FirestoreCollection.Messages, fid);

export const getMessagesDocCollection = ({ fid }: MessageQueryParams) =>
  collection(
    getMessagesDoc({ fid }),
    FirestoreCollection.SubCollection
  ).withConverter(converter);
