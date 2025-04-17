import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface Message {
  _id: string;
  audioPath?: string;
  authorId: string;
  createdAt: Date | number;
  imagePath?: string;
  pending?: boolean;
  reaction?: Reaction;
  received?: boolean;
  reply?: Reply;
  sent?: boolean;
  text: string;
}

export type FirebaseMessage = Omit<Message, "_id" | "createdAt"> & {
  id: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export interface Reply {
  authorId: string;
  messageId: string;
  text: string;
}

export enum ReactionType {
  Like = "like",
}

export interface Reaction {
  type: ReactionType;
  userIds: string[];
}

export enum MessageType {
  Image = "Image",
  Text = "Text",
  Vocal = "Vocal",
}

export enum MessageAssetType {
  Audio = "Audio",
  Image = "Image",
}

export interface MessageAsset {
  path: string;
  type: MessageAssetType;
}
