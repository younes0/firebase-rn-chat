import React, { useMemo } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import {
  DiscussionContext,
  DiscussionServicesContext,
} from "@/definitions/contexts";
import DiscussionAppbar from "@/screens/discussion/appbar/DiscussionAppbar";
import DiscussionView from "@/screens/discussion/base/DiscussionView";
import MessagesService from "@/modules/chat/messages/messages.service";
import ThreadService from "@/modules/chat/thread/thread.service";
import TypingService from "@/modules/chat/typing/typing.service";
import useGetUserId from "@/modules/firebase/hooks/useGetUserId";
import useSigninCheck from "@/modules/firebase/hooks/useSigninCheck";
import ThreadsAppbarSelected from "@/screens/threads/appbar/ThreadsAppbarSelected";

const DiscussionScreen = () => {
  const { peerId } = useLocalSearchParams<{
    peerId: string;
  }>();

  const userId = useGetUserId();

  // services
  // -----------------------------------------------------------------------------
  const { data: signInCheckResult } = useSigninCheck();

  const services = useMemo(() => {
    if (signInCheckResult?.signedIn && userId && peerId) {
      const params = { userId, peerId };

      const threadService = new ThreadService(params);

      return {
        thread: threadService,
        typing: new TypingService(params),
        message: new MessagesService({ ...params, threadService }),
      };
    }
  }, [peerId, signInCheckResult, userId]);

  // render
  // -----------------------------------------------------------------------------
  return (
    <>
      <ThreadsAppbarSelected isArchived={true} />

      {services ? (
        <DiscussionContext.Provider value={{ peerId }}>
          <DiscussionServicesContext.Provider value={{ services }}>
            <View style={{ flex: 1 }}>
              <DiscussionAppbar />
              <DiscussionView />
            </View>
          </DiscussionServicesContext.Provider>
        </DiscussionContext.Provider>
      ) : null}
    </>
  );
};

export default DiscussionScreen;
