import { collection, getFirestore } from "@firebase/firestore";

import { FirestoreCollection, Thread } from "@/modules/chat/chat.definitions";
import { firestoreConverter } from "@/modules/firebase/utils/firestore-converter";

const converter = firestoreConverter<Thread>();

export const getThreadsSubCollection = (userId: string) =>
  collection(
    getFirestore(),
    FirestoreCollection.Threads,
    userId,
    FirestoreCollection.SubCollection,
  ).withConverter(converter);
