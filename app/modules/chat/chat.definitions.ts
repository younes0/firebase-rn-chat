import { Timestamp } from "@react-native-firebase/firestore";

import { DocumentChangeType } from "@/modules/firebase/adapters/firestore.adapter";

import MessagesService from "@/modules/chat/messages/messages.service";
import ThreadService from "@/modules/chat/thread/thread.service";
import TypingService from "@/modules/chat/typing/typing.service";
import { MessageContentType } from "@/api/chat/chat.definitions";

export enum FirestoreCollection {
  Messages = "messages",
  PushTokens = "pushTokens",
  SubCollection = "collection",
  Threads = "threads",
}

export interface Thread {
  isArchived: boolean;
  isBlocked: boolean;
  isMuted: boolean;
  isLastMessageMine: boolean;
  isLastPeerMessageSeen: boolean;
  lastMessageContentType: MessageContentType;
  lastMessageCreatedAt: Date;
  lastMessageId: string;
  lastMessageText: string;
  lastSeenMessageIdByPeer: string;
  userId: string;
}

export type FirebaseThread = Omit<Thread, "lastMessageCreatedAt"> & {
  lastMessageCreatedAt: Timestamp;
};

export enum ThreadType {
  Archived = "Archived",
  Main = "Main",
}

export enum ThreadUpdatableField {
  IsArchived = "isArchived",
  IsBlocked = "isBlocked",
  IsMuted = "isMuted",
}

export type ThreadsQueryParams = {
  userId: string;
  limitVal?: number;
};

export interface ChatServices {
  thread: ThreadService;
  typing: TypingService;
  message: MessagesService;
}

export interface ChatService<T> {
  subscribe: (
    callback: (changed: ChangedDocuments<T> | T) => void,
    changeTypes: DocumentChangeType[]
  ) => void;
  unsubscribe: undefined | (() => void);
}

export interface ChangedDocuments<T> {
  added: T[];
  modified: T[];
  removed: T[];
}
