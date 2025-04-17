import {
  Unsubscribe,
  doc,
  getDataFromSnapshot,
  getDoc,
  getFirestore,
  onDocumentSnapshot,
  updateDoc,
  writeBatch,
} from "@/modules/firebase/adapters/firestore.adapter";

import {
  ChatService,
  Thread,
  ThreadUpdatableField,
} from "@/modules/chat/chat.definitions";
import { parseFirebaseThread } from "@/modules/chat/chat.utils";
import { getThreadsSubCollection } from "@/modules/chat/queries/chat.queries";
import { Message } from "@/modules/chat/messages/messages.definitions";
import { MessageContentType } from "@/api/chat/chat.definitions";

export default class ThreadService implements ChatService<Thread> {
  private userId: string;
  private peerId: string;

  constructor({ userId, peerId }: { userId: string; peerId: string }) {
    this.userId = userId;
    this.peerId = peerId;
  }

  // read methods
  // ----------------------------------------------------------------------
  get = async () => {
    const docRef = this.getThreadsDocCollectionDocRef();
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return data ? parseFirebaseThread(snapshot) : undefined;
    }

    return undefined;
  };

  subscribe = (callback: (data: Thread) => void) => {
    if (this.unsubscribe) {
      return;
    }

    this.unsubscribe = onDocumentSnapshot(
      this.getThreadsDocCollectionDocRef(),
      (snapshot) => {
        const data = getDataFromSnapshot(snapshot);

        if (data) {
          callback(parseFirebaseThread(snapshot));
        }
      }
    );
  };

  unsubscribe: undefined | Unsubscribe;

  // write methods
  // ----------------------------------------------------------------------
  updateField = ({
    field,
    value,
  }: {
    field: ThreadUpdatableField;
    value: boolean;
  }) =>
    updateDoc(this.getThreadsDocCollectionDocRef(), {
      [field]: value,
    });

  // will update both threads
  updateWithMessageEventWithBatch = async ({
    message,
    type,
  }: {
    message: Message;
    type: "new" | "seen";
  }) => {
    const batch = writeBatch(getFirestore());

    for await (const userId of [this.peerId, this.userId]) {
      const isCurrentUser = userId === this.userId;
      const threadDocRef = this.getThreadsDocCollectionDocRef(isCurrentUser);

      // existing thread
      // -------------------------------------------------------------------------
      if (type === "new") {
        const input = {
          lastMessageContentType: message?.audioPath
            ? MessageContentType.Audio
            : message?.imagePath
            ? MessageContentType.Image
            : MessageContentType.Text,
          lastMessageCreatedAt: message.createdAt,
          lastMessageId: message._id.toString(),
          lastMessageText: message.text,
        };

        const doc = await getDoc(threadDocRef);

        if (doc.exists()) {
          batch.update(threadDocRef, {
            ...input,
            isLastMessageMine: message.authorId === userId,
            isLastPeerMessageSeen: isCurrentUser,
          });

          // non existing thread
          // -------------------------------------------------------------------------
        } else {
          if (isCurrentUser) {
            // TODO: call API
            // await apolloClient.mutate({
            //   mutation: CreateChatThreadDocument,
            //   variables: {
            //     peerId: this.peerId,
            //     createThreadInput: input,
            //   },
            // });

            break; // exit loop since server created thread for peer as well
          }
        }
      } else if (type === "seen") {
        if (isCurrentUser) {
          batch.update(threadDocRef, {
            isLastPeerMessageSeen: true,
          });
        }
      }
    }

    return batch;
  };

  // private methods
  // ----------------------------------------------------------------------
  private getThreadsDocCollectionDocRef = (isCurrent = true) => {
    const userId = this.userId;
    const peerId = this.peerId;

    return doc(
      getThreadsSubCollection(isCurrent ? userId : peerId),
      isCurrent ? peerId : userId
    );
  };
}
