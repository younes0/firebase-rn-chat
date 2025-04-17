import { MessageContentType, Thread } from "@/api/chat/chat.definitions";

export interface CreateThreadInput
  extends Pick<
    Thread,
    | "lastMessageId"
    | "lastMessageText"
    | "lastMessageContentType"
    | "lastMessageCreatedAt"
  > {}
