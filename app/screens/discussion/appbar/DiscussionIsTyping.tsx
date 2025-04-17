import React from "react";
import { Text } from "react-native";

import { useDiscussionStore } from "@/stores/discussion.store";

const DiscussionIsTyping = () => {
  const isPeerTyping = useDiscussionStore((state) => state.isPeerTyping);

  // render
  // -----------------------------------------------------------------------------
  return isPeerTyping ? <Text>Is writing...</Text> : null;
};

export default DiscussionIsTyping;
