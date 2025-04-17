export enum FirestoreCollection {
  Messages = "messages",
  PushTokens = "pushTokens",
  UserProfiles = "userProfiles",
  SubCollection = "collection",
  Threads = "threads",
}

export enum MessageContentType {
  Text = "Text",
  Audio = "Audio",
  Image = "Image",
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
  userFid: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  photoUrl: string;
}

export enum PushTokenType {
  Android = "Android",
  Ios = "Ios",
}

export enum ClientLang {
  Fr = "fr",
  En = "en",
  Es = "es",
}

export interface PushTokenData {
  data: string;
  lang: ClientLang;
  type: PushTokenType;
}

export enum ChannelIdentifier {
  Default = "Default",
  MessageNew = "MessageNew",
}

export interface ChatNotificationPayload {
  message: string;
  peer: {
    id: number;
    displayName: string;
    pictureUrl: string;
  };
}
