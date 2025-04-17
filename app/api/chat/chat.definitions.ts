import { firestore } from "firebase-admin";
import { DeepPartial } from "utility-types";

export enum PushTokenType {
  Android = "Android",
  Ios = "Ios",
}

export enum MessageAssetType {
  Audio = "Audio",
  Image = "Image",
}

export enum FirestoreCollection {
  Messages = "messages",
  PushTokens = "pushTokens",
  SubCollection = "collection",
  Threads = "threads",
  UserProfiles = "userProfiles",
}

export enum MessageContentType {
  Text = "Text",
  Audio = "Audio",
  Image = "Image",
}

export interface Message {
  _id: string;
  audioPath?: string;
  authorId: string;
  createdAt: Date | number;
  imagePath?: string;
  pending?: boolean;
  received?: boolean;
  sent?: boolean;
  text: string;
}

export type PushToken = {
  deviceId: string;
  data: string;
  type: PushTokenType;
  createdAt: Date;
  updatedAt: Date;
};

export interface Thread {
  isArchived: boolean;
  isBlocked: boolean;
  isMuted: boolean;
  isLastMessageMine: boolean;
  isLastPeerMessageSeen: boolean;
  lastMessageContentType: MessageContentType;
  lastMessageCreatedAt: Date | firestore.Timestamp;
  lastMessageId: string | null;
  lastMessageText: string | null;
  lastSeenMessageIdByPeer: string | null;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  photoUrl: string;
}

export type ThreadInput = DeepPartial<Thread>;

export interface PushTokensDocValue {
  data: string;
  type: PushTokenType;
}

export enum ThreadUpdatableField {
  IsArchived = "isArchived",
  IsBlocked = "isBlocked",
  IsMuted = "isMuted",
}

export interface CreateThreadInput
  extends Pick<
    Thread,
    | "lastMessageId"
    | "lastMessageText"
    | "lastMessageContentType"
    | "lastMessageCreatedAt"
  > {}
