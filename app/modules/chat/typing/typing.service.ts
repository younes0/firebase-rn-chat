import {
  UnsubscribeType,
  getDatabase,
  onValue,
  ref,
  set,
} from "@/modules/firebase/adapters/database.adapter";

import { getRelationFid } from "@/modules/chat/chat.utils";
import { ChatService } from "@/modules/chat/chat.definitions";

export default class TypingService implements ChatService<boolean> {
  private userId: string;
  private peerId: string;

  constructor({ userId, peerId }: { userId: string; peerId: string }) {
    this.userId = userId;
    this.peerId = peerId;
  }

  // read methods
  // ----------------------------------------------------------------------
  subscribe = (callback: (value: boolean) => void) => {
    if (this.unsubscribe) {
      return;
    }

    this.unsubscribe = onValue(this.getRef(false), (dataSnapshot) =>
      callback(dataSnapshot.val())
    );
  };

  unsubscribe: undefined | UnsubscribeType;

  // write methods
  // ----------------------------------------------------------------------
  send = (value: boolean) => set(this.getRef(), value);

  // private methods
  // ----------------------------------------------------------------------
  private getRef = (isCurrentUser = true) => {
    const typerFid = isCurrentUser ? this.userId : this.peerId;
    const relationFid = getRelationFid(this.userId, this.peerId);

    return ref(getDatabase(), `typing/${relationFid}/${typerFid}`);
  };
}
