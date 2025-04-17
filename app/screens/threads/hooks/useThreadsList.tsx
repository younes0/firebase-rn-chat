import { useCallback, useEffect, useMemo } from "react";

import {
  ChangedDocuments,
  Thread,
  ThreadType,
} from "@/modules/chat/chat.definitions";
import ThreadsListService from "@/modules/chat/threads-list/threads-list.service";
import useGetUserId from "@/modules/firebase/hooks/useGetUserId";
import { fetchProfiles } from "@/modules/chat/chat.utils";
import { useThreadsListStoreActions } from "@/stores/threads-list.store";

export interface Props {
  type: ThreadType;
}

const useThreadsList = ({ type }: Props) => {
  const userId = useGetUserId();

  // service
  // ---------------------------------------------------------------------------
  const threadsService = useMemo(
    () =>
      userId
        ? new ThreadsListService({
            threadType: type,
            userId: userId,
          })
        : null,
    [, type, userId]
  );

  // state
  // ---------------------------------------------------------------------------
  const {
    addThreads,
    reset: resetState,
    setIsLoading,
    updateThreads,
  } = useThreadsListStoreActions(type);

  // listen to threads changes
  // ---------------------------------------------------------------------------
  const handleSubscribedThreads = useCallback(
    async ({ added, modified, removed }: ChangedDocuments<Thread>) => {
      if (!threadsService) {
        return;
      }

      if (removed.length) {
        updateThreads(removed, true);
      } else if (modified.length) {
        updateThreads(modified);
      } else if (added.length) {
        await fetchProfiles(added);
        addThreads(added);
      }

      setIsLoading(false);
    },
    [addThreads, setIsLoading, threadsService, updateThreads]
  );

  useEffect(() => {
    threadsService?.subscribe(handleSubscribedThreads);

    return () => {
      resetState();
      threadsService?.unsubscribe?.();
    };
  }, [threadsService, handleSubscribedThreads, resetState]);

  // return
  // ---------------------------------------------------------------------------
  return {
    threadsService,
  };
};

export default useThreadsList;
