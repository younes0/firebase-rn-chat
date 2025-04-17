import { Thread } from "@/modules/chat/chat.definitions";

export const compareThreadsFn = (first: Thread, second: Thread) =>
  new Date(second.lastMessageCreatedAt).getTime() -
  new Date(first.lastMessageCreatedAt).getTime();
