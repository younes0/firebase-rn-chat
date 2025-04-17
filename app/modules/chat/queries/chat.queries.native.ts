import { collection, getFirestore } from "@react-native-firebase/firestore";

import { FirestoreCollection } from "@/modules/chat/chat.definitions";

export const getThreadsSubCollection = (userId: string) =>
  collection(
    getFirestore(),
    FirestoreCollection.Threads,
    userId,
    FirestoreCollection.SubCollection,
  );
