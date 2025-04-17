import { MessageAssetType } from "@/api/chat/chat.definitions";

export interface MessageAssetModel {
  type: MessageAssetType;
  path: string;
}
