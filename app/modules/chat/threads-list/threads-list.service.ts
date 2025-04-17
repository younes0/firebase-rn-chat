import {
  DocumentChangeType,
  QueryConstraintType,
  QuerySnapshotType,
  QueryType,
  Unsubscribe,
  getDocs,
  onQuerySnapshot,
  where,
} from "@/modules/firebase/adapters/firestore.adapter";

import {
  getThreadsMainQuery,
  getThreadsArchivedQuery,
} from "@/modules/chat/queries/threads-list.queries";
import {
  ChangedDocuments,
  ChatService,
  Thread,
  ThreadType,
} from "@/modules/chat/chat.definitions";
import { parseFirebaseThread } from "@/modules/chat/chat.utils";

export default class ThreadsListService implements ChatService<Thread> {
  static PAGINATION_SIZE = 20;
  private threadType: ThreadType;
  private userId: string;

  constructor({
    threadType,
    userId,
  }: {
    threadType: ThreadType;
    userId: string;
  }) {
    this.threadType = threadType;
    this.userId = userId;
  }

  // threads methods
  // ----------------------------------------------------------------------
  getThreads = async (nextThread?: Thread) => {
    const output: Thread[] = [];

    const baseQuery = this.getBaseQuery(
      nextThread
        ? [where("lastMessageCreatedAt", "<", nextThread.lastMessageCreatedAt)]
        : []
    );

    const snapshot = await getDocs(baseQuery);
    snapshot.forEach((doc: any) => {
      output.push(parseFirebaseThread(doc));
    });

    return output;
  };

  subscribe = (
    callback: (changed: ChangedDocuments<Thread>) => void,
    changeTypes: DocumentChangeType[] = ["added", "modified", "removed"]
  ) => {
    if (this.unsubscribe) {
      return;
    }

    this.unsubscribe = onQuerySnapshot(
      this.getBaseQuery(),
      (snapshot: QuerySnapshotType | null) => {
        const data: ChangedDocuments<Thread> = {
          added: [],
          modified: [],
          removed: [],
        };

        snapshot?.docChanges().forEach((change: any) => {
          const type = change.type as DocumentChangeType;
          if (changeTypes.includes(type)) {
            data[type].push(parseFirebaseThread(change.doc));
          }
        });

        callback(data);
      }
    );
  };

  unsubscribe: undefined | Unsubscribe;

  // private threads methods
  // ----------------------------------------------------------------------
  private getBaseQuery = (
    constraints: QueryConstraintType[] = []
  ): QueryType => {
    return {
      [ThreadType.Main]: getThreadsMainQuery,
      [ThreadType.Archived]: getThreadsArchivedQuery,
    }[this.threadType](
      {
        userId: this.userId,
        limitVal: ThreadsListService.PAGINATION_SIZE,
      },
      // @ts-ignore
      constraints
    ) as QueryType;
  };
}
