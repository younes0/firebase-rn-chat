import emojiRegexCreator from "emoji-regex";

import storage from "@/utils/storage";

// emoji
// ---------------------------------------------------------------------------------
const emojiRegex = emojiRegexCreator();

export const isPureEmojiString = (text: string) =>
  text.match(/./gu)?.length === 1
    ? text.replace(emojiRegex, "").trim() === ""
    : false;

// draft
// ---------------------------------------------------------------------------------
export const getDraft = (peerId: string) =>
  storage.getString(_getDraftKey(peerId));

export const setDraft = (peerId: string, value: string) =>
  storage.set(_getDraftKey(peerId), value);

const _getDraftKey = (peerId: string) => `discussion-${peerId}-draft`;
