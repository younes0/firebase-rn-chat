import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { Thread } from "@/modules/chat/chat.definitions";

interface State {
  selected: Thread | null;
}

interface Actions {
  setSelected: (selected: Thread | null) => void;
}

interface Store extends State {
  actions: Actions;
}

// implementation
// -----------------------------------------------------------------------------------
export const useThreadsStore = create<Store>()(
  devtools(
    (set) => ({
      selected: null,
      actions: {
        setSelected: (selected) => set({ selected }, false, "app/setSelected"),
      },
    }),
    {
      name: "ThreadStore",
    },
  ),
);
// external api
// -----------------------------------------------------------------------------------
export const useThreadsStoreActions = () =>
  useThreadsStore((state) => state.actions);
