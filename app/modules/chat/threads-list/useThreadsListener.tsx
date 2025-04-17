import { useEffect, useRef, useState } from "react";

import {
  onQuerySnapshot,
  QueryType,
} from "@/modules/firebase/adapters/firestore.adapter";
import useSigninCheck from "@/modules/firebase/hooks/useSigninCheck";

import { Thread, ThreadsQueryParams } from "@/modules/chat/chat.definitions";
import { parseFirebaseThread } from "@/modules/chat/chat.utils";

export interface Props {
  queryFn: ({ userId }: ThreadsQueryParams) => QueryType;
  limit?: number;
}

const useThreadsListener = ({ queryFn, limit }: Props) => {
  const [state, setState] = useState<{
    data: Thread[];
    error: Error | null;
    isFirstFetching: boolean;
  }>({
    data: [],
    error: null,
    isFirstFetching: false,
  });

  const unsubscribeRef = useRef<() => void>(undefined);

  const { data: signInCheckResult } = useSigninCheck();

  useEffect(() => {
    (async () => {
      const user = signInCheckResult?.user;

      if (!user) {
        return;
      }

      setState((prevState) => ({
        ...prevState,
        isFirstFetching: true,
      }));

      unsubscribeRef.current = onQuerySnapshot(
        queryFn({
          userId: user.uid,
          limitVal: limit,
        }),
        (snapshot) => {
          const data = snapshot?.docs.map((doc) => parseFirebaseThread(doc));

          if (data) {
            setState({
              data,
              error: null,
              isFirstFetching: false,
            });
          }
        },
        (error) => {
          console.error(error);

          setState({
            data: [],
            error: error,
            isFirstFetching: false,
          });
        }
      );
    })();

    return () => {
      unsubscribeRef.current?.();
    };
  }, [limit, signInCheckResult, queryFn]);

  return state;
};

export default useThreadsListener;
