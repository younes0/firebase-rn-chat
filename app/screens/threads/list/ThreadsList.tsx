import React, { useCallback } from "react";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { useShallow } from "zustand/shallow";

import {
  useThreadsListStore,
  useThreadsListStoreActions,
} from "@/stores/threads-list.store";
import ThreadsItem from "@/screens/threads/item/ThreadsItem";
import ThreadsListEmpty from "@/screens/threads/list/ThreadsListEmpty";
import useThreadsList from "@/screens/threads/hooks/useThreadsList";
import { Thread, ThreadType } from "@/modules/chat/chat.definitions";
import { fetchProfiles } from "@/modules/chat/chat.utils";
import { useThreadsStore } from "@/stores/threads.store";

export interface Props
  extends Pick<FlashListProps<Thread>, "ListHeaderComponent"> {
  type: ThreadType;
  isEmptyViewInList?: boolean;
}

type ExtraData = {
  selectedFid: string | null;
};

const ThreadsList = ({
  ListHeaderComponent,
  isEmptyViewInList = false,
  type,
}: Props) => {
  // state
  // ---------------------------------------------------------------------------
  const { isFullyLoaded, threads, isLoading } = useThreadsListStore(type)(
    useShallow((state) => ({
      isFullyLoaded: state.isFullyLoaded,
      isLoading: state.isLoading,
      threads: state.threads,
    }))
  );

  const { addThreads, setIsLoading } = useThreadsListStoreActions(type);

  // service & listen to threads changes
  // ---------------------------------------------------------------------------
  const { threadsService } = useThreadsList({
    type,
  });

  // infinite scroll
  // ---------------------------------------------------------------------------
  const loadPreviousThreads = useCallback(async () => {
    if (!threadsService) {
      return;
    }

    setIsLoading(true);

    const previousThreads = await threadsService.getThreads(
      threads[threads.length - 1]
    );

    if (previousThreads.length) {
      await fetchProfiles(previousThreads);
      addThreads(previousThreads);
    }

    setIsLoading(false);
  }, [addThreads, setIsLoading, threads, threadsService]);

  // list handlers
  // ---------------------------------------------------------------------------
  const handleEndReached = () => {
    if (!isFullyLoaded && !isLoading) {
      loadPreviousThreads();
    }
  };

  // render
  // ---------------------------------------------------------------------------
  const selected = useThreadsStore((state) => state.selected);

  const ListEmpty = () => (
    <ThreadsListEmpty
      hasThreads={threads.length > 0}
      isLoading={isLoading}
      type={type}
    />
  );

  return (
    <>
      {isEmptyViewInList || <ListEmpty />}

      {(Boolean(threads?.length) || isEmptyViewInList) && (
        <FlashList
          ListEmptyComponent={isEmptyViewInList ? <ListEmpty /> : undefined}
          ListHeaderComponent={ListHeaderComponent}
          data={threads}
          estimatedItemSize={65}
          extraData={{ selectedFid: selected?.userId } as ExtraData}
          keyExtractor={(item: Thread) => item.userId}
          onEndReached={handleEndReached}
          renderItem={({ item, extraData }) => {
            const { selectedFid } = extraData as ExtraData;

            return (
              <ThreadsItem
                isSelected={selectedFid === item.userId}
                thread={item}
              />
            );
          }}
        />
      )}
    </>
  );
};

export default ThreadsList;
