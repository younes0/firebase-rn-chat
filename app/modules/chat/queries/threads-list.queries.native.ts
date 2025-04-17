import {
  FirebaseFirestoreTypes,
  QueryFieldFilterConstraint,
  limit,
  orderBy,
  query,
  where,
} from "@react-native-firebase/firestore";

import { Thread, ThreadsQueryParams } from "@/modules/chat/chat.definitions";
import { getThreadsSubCollection } from "@/modules/chat/queries/chat.queries.native";

type ThreadField = keyof Thread;

const getBaseThreadsQuery = (
  { userId, limitVal = 20 }: ThreadsQueryParams,
  constraints: QueryFieldFilterConstraint[] = []
): FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =>
  query(
    getThreadsSubCollection(userId),
    limit(limitVal),
    orderBy("lastMessageCreatedAt", "desc"),
    where("lastMessageId" as ThreadField, "!=", null),
    ...constraints
  );

export const getThreadsMainQuery = (
  params: ThreadsQueryParams,
  constraints: QueryFieldFilterConstraint[] = []
): FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =>
  getBaseThreadsQuery(params, [
    where("isArchived" as ThreadField, "==", false),
    where("isBlocked" as ThreadField, "==", false),
    ...constraints,
  ]);

export const getThreadsArchivedQuery = (
  params: ThreadsQueryParams,
  constraints: QueryFieldFilterConstraint[] = []
): FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =>
  getBaseThreadsQuery(params, [
    where("isArchived" as ThreadField, "==", true),
    where("isBlocked" as ThreadField, "==", false),
    ...constraints,
  ]);

export const getThreadsUnreadQuery = (
  params: ThreadsQueryParams,
  constraints: QueryFieldFilterConstraint[] = []
): FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =>
  getBaseThreadsQuery(params, [
    where("isArchived" as ThreadField, "==", false),
    where("isBlocked" as ThreadField, "==", false),
    where("isMuted" as ThreadField, "==", false),
    where("isLastMessageMine" as ThreadField, "==", false),
    where("isLastPeerMessageSeen" as ThreadField, "==", false),
    ...constraints,
  ]);

export const getThreadsUnreadMainQuery = (
  params: ThreadsQueryParams
): FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =>
  getThreadsUnreadQuery(params, []);
