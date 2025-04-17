import { MessageContentType } from "@/api/chat/chat.definitions";
import { Thread } from "@/modules/chat/chat.definitions";

export const getThreadText = ({
  isLastMessageMine: isMine,
  lastMessageContentType: type,
  lastMessageText: text,
}: Thread) => {
  if (type !== MessageContentType.Text) {
    if (isMine) {
      if (type === MessageContentType.Image) {
        return "You sent an image";
      } else if (type === MessageContentType.Audio) {
        return "You sent an audio";
      }
    } else {
      if (type === MessageContentType.Image) {
        return "Image";
      } else if (type === MessageContentType.Audio) {
        return "Audio";
      }
    }
  }

  return text;
};

export const getThreadPreview = (thread: Thread) => {
  const {
    lastMessageContentType: type,
    isLastMessageMine: isMine,
    lastMessageText: text,
  } = thread;

  return type === MessageContentType.Text
    ? (isMine ? "You" + ": " : "") + text
    : getThreadText(thread);
};
