import { DocumentData } from "firebase/firestore";

import {
  FirebaseMessage,
  Message,
  MessageType,
} from "@/modules/chat/messages/messages.definitions";

export const getMessageType = (message: Message): MessageType =>
  message.audioPath
    ? MessageType.Vocal
    : message.imagePath
    ? MessageType.Image
    : MessageType.Text;

export const generateMessageDocFid = (length = 20): string => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let result = "";
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

export const parseFirebaseMessage = (document: DocumentData): Message => {
  const data: FirebaseMessage = document.data();

  return {
    ...data,
    _id: document.id,
    createdAt: data.createdAt.toDate(),
  };
};
