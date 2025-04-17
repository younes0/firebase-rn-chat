import { createContext } from "react";

import { ChatServices } from "@/modules/chat/chat.definitions";

export const DiscussionContext = createContext<{
  peerId?: string;
}>({});

export const DiscussionServicesContext = createContext<{
  services?: ChatServices;
}>({});
