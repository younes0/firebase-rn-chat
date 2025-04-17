import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

import { RehydratedActions, RehydratedState } from "./store.utils";
import { safePick } from "@/utils/lodash-safe";
import { zustandMmkvStorage } from "@/utils/storage";

// interfaces
// -----------------------------------------------------------------------------------
interface State extends RehydratedState {
  deviceId?: string;
  hasNotifsPermission: boolean | null;
}

interface Actions extends RehydratedActions {
  reset: () => void;
  setDeviceId: (deviceId: string) => void;
  setHasNotifsPermission: (hasNotifsPermission: boolean) => void;
}

interface Store extends State {
  actions: Actions;
}

// implementation
// -----------------------------------------------------------------------------------
const initialState: Pick<State, never> = {};

export const useAppStore = create<Store>()(
  persist(
    devtools(
      subscribeWithSelector((set, get) => ({
        ...initialState,
        deviceId: undefined,
        hasNotifsPermission: null,
        isRehydrated: false,

        actions: {
          reset: () => set(initialState, false, "app/reset"),

          setDeviceId: (deviceId) =>
            set({ deviceId }, false, "app/setDeviceId"),

          setHasNotifsPermission: (hasNotifsPermission) =>
            set({ hasNotifsPermission }, false, "app/setHasNotifsPermission"),

          setIsHydrated: (isRehydrated) =>
            set({ isRehydrated }, false, "auth/setIsHydrated"),
        },
      }))
    ),
    {
      name: "AppStore",
      partialize: (state: Store) => safePick(state, ["deviceId"]),
      storage: zustandMmkvStorage,
      onRehydrateStorage: () => (state) => {
        state?.actions.setIsHydrated(true);
      },
    }
  )
);

// external api
// -----------------------------------------------------------------------------------
export const useAppStoreActions = () => useAppStore((state) => state.actions);
