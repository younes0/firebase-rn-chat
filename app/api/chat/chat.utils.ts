import { MessageAssetType } from "@/api/chat/chat.definitions";

export const getMessageAssetS3Path = (
  userId: string,
  threadFid: string,
  type: MessageAssetType
) => `chat/${threadFid}/${userId}/${type.toLowerCase()}/`;

export const generateFirebaseFid = (length = 20) => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let result = "";
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};
