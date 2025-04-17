import React from "react";

import CountBadge from "@/components/CountBadge";
import useThreadsListener from "@/modules/chat/threads-list/useThreadsListener";
import { getThreadsUnreadMainQuery } from "@/modules/chat/queries/threads-list.queries";

type Type = "main" | "requests" | "all";

export interface Props {
  size?: number;
  type: Type;
}

const queries = {
  ["main" as Type]: getThreadsUnreadMainQuery,
};

const ThreadsCountBadge = ({ type, size }: Props) => {
  const { data, error } = useThreadsListener({
    queryFn: queries[type],
    limit: 10,
  });

  const hasLargeCount = data?.length > 10;

  return !error && data?.length ? (
    <CountBadge
      count={hasLargeCount ? "10+" : data.length}
      hasLargeCount={hasLargeCount}
      isPrimary={type !== "requests"}
      size={size}
    />
  ) : null;
};

export default ThreadsCountBadge;
