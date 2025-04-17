import {
  DocumentData,
  QueryConstraint,
  limit,
  orderBy,
  query,
  where,
} from "@firebase/firestore";

import {
  FirebaseThread,
  Thread,
  ThreadsQueryParams,
} from "@/modules/chat/chat.definitions";
import { getThreadsSubCollection } from "@/modules/chat/queries/chat.queries.web";

// base
// ---------------------------------------------------------------------------------
type ThreadField = keyof Thread;

const getBaseThreadsQuery = (
  { userId, limitVal = 20 }: ThreadsQueryParams,
  constraints: QueryConstraint[] = []
) =>
  query(
    getThreadsSubCollection(userId),
    limit(limitVal),
    orderBy("lastMessageCreatedAt", "desc"),
    where("lastMessageId" as ThreadField, "!=", null),
    ...constraints
  );

// list
// ---------------------------------------------------------------------------------
export const getThreadsMainQuery = (
  params: ThreadsQueryParams,
  constraints: QueryConstraint[] = []
) =>
  getBaseThreadsQuery(params, [
    where("isArchived" as ThreadField, "==", false),
    where("isBlocked" as ThreadField, "==", false),
    ...constraints,
  ]);

export const getThreadsArchivedQuery = (
  params: ThreadsQueryParams,
  constraints: QueryConstraint[] = []
) =>
  getBaseThreadsQuery(params, [
    where("isArchived" as ThreadField, "==", true),
    where("isBlocked" as ThreadField, "==", false),
    ...constraints,
  ]);

// unread
// ---------------------------------------------------------------------------------
export const getThreadsUnreadQuery = (
  params: ThreadsQueryParams,
  constraints: QueryConstraint[] = []
) =>
  getBaseThreadsQuery(params, [
    where("isArchived" as ThreadField, "==", false),
    where("isBlocked" as ThreadField, "==", false),
    where("isMuted" as ThreadField, "==", false),
    where("isLastMessageMine" as ThreadField, "==", false),
    where("isLastPeerMessageSeen" as ThreadField, "==", false),
    ...constraints,
  ]);

export const getThreadsUnreadMainQuery = (params: ThreadsQueryParams) =>
  getThreadsUnreadQuery(params, []);

// other
// ---------------------------------------------------------------------------------
export const parseFirebaseThread = (document: DocumentData): Thread => {
  const data: FirebaseThread = document.data();

  return {
    ...data,
    userId: document.id,
    lastMessageCreatedAt: data.lastMessageCreatedAt.toDate(),
  };
};
