import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

import ThreadsListService from "@/modules/chat/threads-list/threads-list.service";
import { Thread, ThreadType } from "@/modules/chat/chat.definitions";
import { compareThreadsFn } from "@/modules/chat/threads-list/threads-list.utils";

interface State {
  isFullyLoaded: boolean;
  isLoading: boolean;
  threads: Thread[];
}

interface Actions {
  addThreads: (threads: Thread[]) => void;
  reset: () => void;
  setIsFullyLoaded: (isFullyLoaded: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateThreads: (threads: Thread[], isRemoved?: boolean) => void;
}

interface Store extends State {
  actions: Actions;
}

// implementation: store factory
// -----------------------------------------------------------------------------------
const initialState: State = {
  isFullyLoaded: false,
  isLoading: true,
  threads: [],
};

const getStore = (type: ThreadType) =>
  <StateCreator<Store, [["zustand/devtools", never]], []>>devtools(
    (set, get) => ({
      ...initialState,
      actions: {
        reset: () => set(initialState, false, `${type}/reset`),

        addThreads: (threads) => {
          if (threads.length) {
            const existingFids = get().threads.map((thread) => thread.userId);
            const addedThreads = threads.filter(
              (thread) => !existingFids.includes(thread.userId)
            );

            set(
              (state) => ({
                threads: [...addedThreads, ...state.threads].sort(
                  compareThreadsFn
                ),
                isFullyLoaded:
                  addedThreads.length < ThreadsListService.PAGINATION_SIZE,
                isLoading: false,
              }),
              false,
              `${type}/addThreads`
            );
          } else {
            set({ isLoading: false });
          }
        },

        updateThreads: (threads, isRemoved) => {
          const updatedFids = threads.map((thread) => thread.userId);

          set(
            (state) => ({
              threads: [
                ...(isRemoved ? [] : threads),
                ...state.threads.filter(
                  (thread) => !updatedFids.includes(thread.userId)
                ),
              ].sort(compareThreadsFn),
            }),
            false,
            `${type}/updateThreads`
          );
        },

        setIsFullyLoaded: (isFullyLoaded) =>
          set({ isFullyLoaded }, false, `${type}/setIsFullyLoaded`),

        setIsLoading: (isLoading) =>
          set({ isLoading }, false, `${type}/setIsLoading`),
      },
    }),
    { name: `Threads${type}Store` }
  );

//  external api: create stores and export hooks
// -----------------------------------------------------------------------------------
// @ts-ignore
const mainStore = create<Store>()(getStore(ThreadType.Main));
// @ts-ignore
const archivedStore = create<Store>()(getStore(ThreadType.Archived));

export const useThreadsListStore = (type: ThreadType) => {
  return {
    [ThreadType.Archived]: archivedStore,
    [ThreadType.Main]: mainStore,
  }[type];
};

export const useThreadsListStoreActions = (type: ThreadType) =>
  useThreadsListStore(type)((state) => state.actions);
