import firebase from "firebase/compat/app";
import { FirestoreCollection } from "test/test.definitions";

// dummy data
// ------------------------------------------------------------------------
export const getThreadObject = (uid: string) => ({
  isLastMessageMine: true,
  isLastPeerMessageSeen: false,
  lastMessageCreatedAt: new Date(),
  lastMessageId: uid,
  lastMessageText: "dummy",
  lastSeenMessageIdByPeer: "1",
});

export const getMessageObject = (uid: string) => ({
  authorId: uid,
  createdAt: new Date(),
  text: "dummy",
});

// firebase regular (not admin)
// ------------------------------------------------------------------------
export const getThread = async (
  firestore: firebase.firestore.Firestore,
  user: string,
  peer: string
) => getThreadWithDB(firestore, user, peer);

export const getMessages = async (
  firestore: firebase.firestore.Firestore,
  docId: string
) => firestore.collection(FirestoreCollection.Messages).doc(docId);

export const getThreadWithDB = (
  firestore: firebase.firestore.Firestore,
  user: string,
  peer: string
) =>
  firestore
    .collection(FirestoreCollection.Threads)
    .doc(user)
    .collection(FirestoreCollection.SubCollection)
    .doc(peer);

// firebase-admin
// ------------------------------------------------------------------------
export const adminCreateThread = async (
  firestore: FirebaseFirestore.Firestore,
  userA: string,
  userB: string
) => {
  const getMessagesDocCollection = firestore
    .collection(FirestoreCollection.Messages)
    .doc(userA + "_" + userB)
    .collection(FirestoreCollection.SubCollection);

  await adminGetThreadWithDB(firestore, userA, userB).set(
    getThreadObject(userA)
  );
  await adminGetThreadWithDB(firestore, userB, userA).set(
    getThreadObject(userA)
  );

  await getMessagesDocCollection.add(getMessageObject(userA));
  await getMessagesDocCollection.add(getMessageObject(userB));
};

export const adminGetThreadWithDB = (
  firestore: FirebaseFirestore.Firestore,
  user: string,
  peer: string
) =>
  firestore
    .collection(FirestoreCollection.Threads)
    .doc(user)
    .collection(FirestoreCollection.SubCollection)
    .doc(peer);
