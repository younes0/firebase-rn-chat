import React from "react";

import ThreadsList from "@/screens/threads/list/ThreadsList";
import ThreadsAppbar from "@/screens/threads/appbar/ThreadsAppbar";
import { ThreadType } from "@/modules/chat/chat.definitions";

const ThreadsArchivedScreen = () => (
  <>
    <ThreadsAppbar isArchived={true} />
    <ThreadsList type={ThreadType.Archived} />
  </>
);

export default ThreadsArchivedScreen;
