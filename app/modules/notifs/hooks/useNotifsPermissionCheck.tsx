import { useEffect } from "react";

import { checkNotifsPermission } from "@/modules/notifs/notifs.setup";
import { useAppStoreActions } from "@/stores/app.store";
import useAppState from "@/hooks/useAppState";

const useNotifsPermissionCheck = () => {
  // check permissions on boot and on foreground switch
  // ---------------------------------------------------------------------------
  const { setHasNotifsPermission } = useAppStoreActions();

  useEffect(() => {
    (async () => {
      setHasNotifsPermission(Boolean(await checkNotifsPermission()));
    })();
  }, [setHasNotifsPermission]);

  useAppState({
    onForeground: async () => {
      setHasNotifsPermission(Boolean(await checkNotifsPermission()));
    },
  });
};

export default useNotifsPermissionCheck;
