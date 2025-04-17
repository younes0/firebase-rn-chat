import * as admin from "firebase-admin";

import {
  FirestoreCollection,
  Message,
  MessageContentType,
  Thread,
  ThreadUpdatableField,
} from "@/api/chat/chat.definitions";
import { CreateChatThreadArgs } from "./dto/create-chat-thread.args";
import { app, firestore } from "../utils/firebase";
import { generateFirebaseFid } from "./chat.utils";

export class ThreadService {
  private database: admin.database.Database;

  constructor() {
    this.database = admin.database(app);
  }

  // actions on thread
  // ----------------------------------------------------------------
  initUser(userId: string) {
    return this.getThreadsDoc(userId).set({ placeholder: "" });
  }

  async find({
    peerId,
    userId,
  }: {
    peerId: string;
    userId: string;
  }): Promise<Thread> {
    const threadDoc = await this.getThreadsDocCollection(userId)
      .doc(peerId)
      .get();

    return threadDoc.data() as Thread;
  }

  // thread creation methods
  // ----------------------------------------------------------------
  async create({ createThreadInput, peerId, userId }: CreateChatThreadArgs) {
    // ${peerId}/collection/${userId}
    await this.getThreadsDocCollection(peerId)
      .doc(userId)
      .set(<Thread>{
        ...createThreadInput,
        isArchived: false,
        isBlocked: false,
        isMuted: false,
        lastSeenMessageIdByPeer: null,
        isLastMessageMine: false,
        isLastPeerMessageSeen: false,
      });

    // add message to the thread
    await this.getMessagesDocCollection(userId, peerId)
      .doc(generateFirebaseFid())
      .set(<Message>{
        authorId: userId,
        createdAt: new Date(),
        text: createThreadInput.lastMessageText,
      });

    await this.createForPeer({
      createThreadInput,
      peerId,
      userId,
    });

    return true;
  }

  async createForPeer({
    createThreadInput,
    peerId,
    userId,
  }: CreateChatThreadArgs) {
    // ${userId}/collection/${peerId}
    await this.getThreadsDocCollection(userId)
      .doc(peerId)
      .set(<Thread>{
        ...createThreadInput,
        isArchived: false,
        isBlocked: false,
        isMuted: false,
        lastSeenMessageIdByPeer: null,
        isLastMessageMine: true,
        isLastPeerMessageSeen: true,
      });
  }

  // thread other methods
  // ----------------------------------------------------------------
  async update({
    field,
    peerId,
    userId,
    value,
  }: {
    field: ThreadUpdatableField;
    peerId: string;
    userId: string;
    value: boolean;
  }) {
    await this.getThreadsDocCollection(userId)
      .doc(peerId)
      .update({
        [field]: value,
      });

    return true;
  }

  async block({
    peerId,
    userId,
    value = true,
  }: {
    peerId: string;
    userId: string;
    value: boolean;
  }) {
    const found = await this.find({ peerId, userId });

    if (found) {
      await this.update({
        field: ThreadUpdatableField.IsBlocked,
        peerId,
        userId,
        value,
      });
    } else {
      await this.create({
        createThreadInput: {
          lastMessageContentType: MessageContentType.Text,
          lastMessageCreatedAt: new Date(),
          lastMessageId: null,
          lastMessageText: null,
        },
        peerId,
        userId,
      });
    }

    return true;
  }

  async delete(userId: string) {
    const documents = await this.getThreadsDocCollection(
      userId
    ).listDocuments();

    for await (const peerId of documents.map((doc) => doc.id)) {
      // delete realtime data
      await this.database
        .ref(`typing/${this.getThreadFid(userId, peerId)}`)
        .remove();

      // delete "threads > A > collection > X"
      // delete "threads > B > collection > X"
      await this.getThreadsDocCollection(userId)
        .get()
        .then(this.recursiveDelete);
      await this.getThreadsDocCollection(peerId).doc(userId).delete();

      // delete "messages > A_B > collection > X"
      // delete "messages > A_B"
      await this.getMessagesDocCollection(userId, peerId)
        .get()
        .then(this.recursiveDelete);
      await this.getMessagesDoc(userId, peerId).delete();
    }

    // delete "threads > A
    await this.getThreadsDoc(userId).delete();
  }

  // private methods
  // ----------------------------------------------------------------------
  private recursiveDelete = (
    querySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
  ) => {
    const batch = firestore.batch();
    querySnapshot.forEach((doc) => batch.delete(doc.ref));
    return batch.commit();
  };

  // helpers
  // ----------------------------------------------------------------------
  getThreadsDoc = (userId: string) =>
    firestore.collection(FirestoreCollection.Threads).doc(userId);

  getThreadsDocCollection = (userId: string) =>
    this.getThreadsDoc(userId).collection(FirestoreCollection.SubCollection);

  getMessagesDocCollection = (userId: string, peerId: string) =>
    this.getMessagesDoc(userId, peerId).collection(
      FirestoreCollection.SubCollection
    );

  getMessagesDoc = (userId: string, peerId: string) =>
    firestore
      .collection(FirestoreCollection.Messages)
      .doc(this.getThreadFid(userId, peerId));

  getThreadFid = (userId: string, peerId: string) =>
    userId.localeCompare(peerId, "en") < 0
      ? `${userId}_${peerId}`
      : `${peerId}_${userId}`;
}
