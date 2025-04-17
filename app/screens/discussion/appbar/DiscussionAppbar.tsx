import React from "react";

import { useDiscussionStore } from "@/stores/discussion.store";
import DiscussionAppbarSelected from "./DiscussionAppbarSelected";
import DiscussionAppbarUnselected from "./DiscussionAppbarUnselected";

const DiscussionAppbar = () => {
  const selectedMessage = useDiscussionStore((state) => state.selectedMessage);

  // render
  // -----------------------------------------------------------------------------
  return selectedMessage ? (
    <DiscussionAppbarSelected />
  ) : (
    <DiscussionAppbarUnselected />
  );
};

export default DiscussionAppbar;
