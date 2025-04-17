import omit from "lodash/omit";

import {
  DocumentChangeType,
  QueryType,
  Unsubscribe,
  doc,
  getDocs,
  onQuerySnapshot,
  query,
  where,
} from "@/modules/firebase/adapters/firestore.adapter";

import {
  Message,
  MessageAsset,
  Reply,
} from "@/modules/chat/messages/messages.definitions";
import {
  getMessagesBaseQuery,
  getMessagesDocCollection,
} from "@/modules/chat/queries/messages.queries";
import {
  generateMessageDocFid,
  parseFirebaseMessage,
} from "@/modules/chat/messages/messages.utils";
import ThreadService from "@/modules/chat/thread/thread.service";
import { ChangedDocuments, ChatService } from "@/modules/chat/chat.definitions";
import { getRelationFid } from "@/modules/chat/chat.utils";

// base
// ---------------------------------------------------------------------------------
export default class MessagesService implements ChatService<Message> {
  static MAX_INPUT_LENGTH = 10000;
  static PAGINATION_SIZE = 25;

  private userId: string;
  private peerId: string;
  private collectionFid: string;
  private threadService: ThreadService;

  constructor({
    userId,
    peerId,
    threadService,
  }: {
    userId: string;
    peerId: string;
    threadService: ThreadService;
  }) {
    this.userId = userId;
    this.peerId = peerId;
    this.collectionFid = getRelationFid(this.userId, this.peerId);
    this.threadService = threadService;
  }

  // read methods
  // ----------------------------------------------------------------------
  getMessages = async (nextMessage?: Message) => {
    const output: Message[] = [];
    let baseQuery = this.getBaseQuery();

    if (nextMessage) {
      baseQuery = query(
        baseQuery,
        where("createdAt", "<", nextMessage.createdAt)
      );
    }

    const snapshot = await getDocs(baseQuery);
    snapshot.forEach((doc) => {
      output.push(parseFirebaseMessage(doc));
    });

    return output;
  };

  subscribe = (
    callback: (changed: ChangedDocuments<Message>) => void,
    changeTypes: DocumentChangeType[]
  ) => {
    this.unsubscribe = onQuerySnapshot(this.getBaseQuery(), (snapshot) => {
      const data: ChangedDocuments<Message> = {
        added: [],
        modified: [],
        removed: [],
      };

      snapshot?.docChanges().forEach(({ doc, type }) => {
        if (changeTypes.includes(type)) {
          data[type].push(parseFirebaseMessage(doc));
        }
      });

      callback(data);
    });
  };

  unsubscribe: undefined | Unsubscribe;

  // write methods
  // ----------------------------------------------------------------------
  sendText = (text: string, reply?: Reply) => {
    const message = {
      _id: generateMessageDocFid(),
      authorId: this.userId as string,
      createdAt: new Date(),
      text: text.trimStart().trimEnd(),
    };

    this.createMessage(message, reply);

    return message;
  };

  sendAsset = ({ type, path }: MessageAsset) => {
    const message = {
      [type.toLowerCase()]: path,
      _id: "",
      authorId: this.userId,
      createdAt: new Date(),
      text: "",
    };

    this.createMessage(message);

    return message;
  };

  setReceived = async (message: Message) => {
    if (!message || (message && message.authorId === this.userId)) {
      return;
    }

    const batch = await this.threadService.updateWithMessageEventWithBatch({
      message,
      type: "seen",
    });

    batch.commit();
  };

  // ----------------------------------------------------------------------
  private getBaseQuery = (): QueryType =>
    getMessagesBaseQuery({
      fid: this.collectionFid,
      limitVal: MessagesService.PAGINATION_SIZE,
    });

  private createMessage = async (message: Message, reply?: Reply) => {
    if (reply) {
      message.reply = reply;
    }

    const batch = await this.threadService.updateWithMessageEventWithBatch({
      message,
      type: "new",
    });

    batch.set(
      doc(getMessagesDocCollection({ fid: this.collectionFid }), message._id),
      omit(message, ["_id"])
    );

    batch.commit();

    return message;
  };
}
