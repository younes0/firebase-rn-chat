import { Linking, Platform } from "react-native";

import { requestNotifsPermission } from "@/modules/notifs/notifs.setup";
import { useAppStore, useAppStoreActions } from "@/stores/app.store";

const useNotifsUtils = () => {
  // store
  // ---------------------------------------------------------------------------
  const { setHasNotifsPermission } = useAppStoreActions();
  const hasNotifsPermission = useAppStore((state) => state.hasNotifsPermission);

  // handlers
  // ---------------------------------------------------------------------------
  const handleAllowNotifs = async ({
    onAction,
    isSettingsOpenIfDenied = true,
  }: {
    onAction?: (response?: boolean) => void;
    isSettingsOpenIfDenied?: boolean;
  } = {}) => {
    if (Platform.OS === "web") {
      setHasNotifsPermission(true);

      return onAction?.(true);
    }

    const response = await requestNotifsPermission();

    if (response === true) {
      setHasNotifsPermission(true);
    } else if (response === false && isSettingsOpenIfDenied) {
      Linking.openSettings();
    }

    onAction?.(response);
  };

  return { hasNotifsPermission, handleAllowNotifs };
};

export default useNotifsUtils;
