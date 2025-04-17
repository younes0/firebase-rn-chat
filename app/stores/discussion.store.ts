import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  Message,
  MessageAsset,
  Reply,
} from "@/modules/chat/messages/messages.definitions";
import MessagesService from "@/modules/chat/messages/messages.service";
import { Thread } from "@/modules/chat/chat.definitions";

// interfaces
// -----------------------------------------------------------------------------------
interface State {
  isFirstFetching: boolean;
  isFullyLoaded: boolean;
  isInputFocused: boolean;
  isPeerTyping: boolean;
  isScrollable: boolean;
  isScrolling: boolean;
  messages: Message[];
  peerId: string | undefined;
  reply: Reply | undefined;
  seenMessageIds: string[];
  selectedMessage: Message | null;
  thread: Thread | undefined;
  uploadedAsset: MessageAsset | undefined;
}

interface Actions {
  _updateSeenMessageIds: () => void;
  addMessages: (payload: { messages: Message[]; isOlder?: boolean }) => void;
  addUserMessage: (message: Message) => void;
  reset: () => void;
  setIsFirstFetching: (isFirstFetching: boolean) => void;
  setIsFullyLoaded: (isFullyLoaded: boolean) => void;
  setIsInputFocused: (isInputFocused: boolean) => void;
  setIsPeerTyping: (isPeerTyping: boolean) => void;
  setIsScrollable: (isScrollable: boolean) => void;
  setIsScrolling: (isScrolling: boolean) => void;
  setPeerId: (peerId: string | undefined) => void;
  setReply: (reply: Reply | undefined) => void;
  setSelectedMessage: (message: Message | null) => void;
  setThread: (thread: Thread | undefined) => void;
  setUploadedAsset: (asset: MessageAsset | undefined) => void;
}

interface Store extends State {
  actions: Actions;
}

// implementation
// -----------------------------------------------------------------------------------
const initialState: State = {
  isFirstFetching: true,
  isFullyLoaded: false,
  isInputFocused: false,
  isPeerTyping: false,
  isScrollable: true,
  isScrolling: false,
  messages: [],
  peerId: undefined,
  reply: undefined,
  seenMessageIds: [],
  selectedMessage: null,
  thread: undefined,
  uploadedAsset: undefined,
};

export const useDiscussionStore = create<Store>()(
  devtools(
    (set, get) => ({
      ...initialState,

      actions: {
        reset: () => set(initialState, false, `chat/reset`),

        setThread: (thread) => {
          set({ thread }, false, "chat/setThread");
          get().actions._updateSeenMessageIds();
        },

        addMessages: ({ messages, isOlder = false }) => {
          set(
            (state) => {
              // filter out messages that are already in the store: why?
              const messageIds = state.messages.map(({ _id }) => _id);
              const addedMessages = messages.filter(
                (message) => !messageIds.includes(message._id)
              );

              return {
                messages: isOlder
                  ? [...state.messages, ...addedMessages]
                  : [...addedMessages, ...state.messages],
                isFirstFetching: false,
                isFullyLoaded:
                  messages.length < MessagesService.PAGINATION_SIZE,
              };
            },
            false,
            "chat/addMessages"
          );

          get().actions._updateSeenMessageIds();
        },

        addUserMessage: (message) =>
          set(
            (state) => {
              const messages = [message, ...state.messages];

              return {
                messages,
                reply: undefined,
                uploadedAsset: undefined,
              };
            },
            false,
            "chat/addUserMessage"
          ),

        setReply: (reply) => set({ reply }, false, "chat/setReply"),

        setIsInputFocused: (isInputFocused) =>
          set({ isInputFocused }, false, "chat/setIsInputFocused"),

        setIsPeerTyping: (isPeerTyping) =>
          set({ isPeerTyping }, false, "chat/setIsPeerTyping"),

        setIsFullyLoaded: (isFullyLoaded) =>
          set({ isFullyLoaded }, false, "chat/setIsFullyLoaded"),

        setIsScrollable: (isScrollable) =>
          set({ isScrollable }, false, "chat/setIsScrollable"),

        setUploadedAsset: (uploadedAsset) =>
          set({ uploadedAsset }, false, "chat/setUploadedAsset"),

        setPeerId: (peerId) => set({ peerId }, false, "chat/setPeerId"),

        setSelectedMessage: (selectedMessage) =>
          set({ selectedMessage }, false, "chat/setSelectedMessage"),

        setIsFirstFetching: (isFirstFetching) => {
          set({ isFirstFetching }, false, "chat/setIsFirstFetching");
        },

        setIsScrolling: (isScrolling) => {
          set({ isScrolling }, false, "chat/setIsScrolling");
        },

        _updateSeenMessageIds: () => {
          const messages = get().messages;
          const lastSeen = messages?.find(
            ({ _id }) => _id === get().thread?.lastSeenMessageIdByPeer
          );

          if (lastSeen) {
            set({
              seenMessageIds: messages
                .filter(({ createdAt }) => createdAt <= lastSeen.createdAt)
                .map(({ _id }) => _id),
            });
          }
        },
      },
    }),
    { name: "DiscussionStore" }
  )
);

// external api
// -----------------------------------------------------------------------------------
export const useDiscussionStoreActions = () =>
  useDiscussionStore((state) => state.actions);
