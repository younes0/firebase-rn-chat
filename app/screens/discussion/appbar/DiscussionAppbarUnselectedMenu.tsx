import React, { useContext, useState } from "react";
import { Platform, StatusBar } from "react-native";
import { Appbar, Menu } from "react-native-paper";
import { useRouter } from "expo-router";

import { DiscussionServicesContext } from "@/definitions/contexts";
import { ThreadUpdatableField } from "@/modules/chat/chat.definitions";
import { colors } from "@/definitions/styles.definitions";
import { useDiscussionStore } from "@/stores/discussion.store";

const DOTS_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

const DiscussionAppbarUnselectedMenu = () => {
  const router = useRouter();

  // state & context
  // -------------------------------------------------------------------
  const { services } = useContext(DiscussionServicesContext);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const thread = useDiscussionStore((state) => state.thread);

  // handlers
  // -------------------------------------------------------------------
  const handleMenuPress = (callback: Function) => {
    setIsMenuVisible(false);

    // since enableFreeze(true), setTimeout is used to avoid screen change before menu closes otherwise the the new screen will be freezed
    setTimeout(callback, 100);
  };

  const toggleMute = () => {
    services?.thread.updateField({
      field: ThreadUpdatableField.IsMuted,
      value: !thread?.isMuted,
    });
  };

  const toggleArchive = () => {
    router.navigate("/");

    services?.thread.updateField({
      field: ThreadUpdatableField.IsArchived,
      value: !thread?.isArchived,
    });
  };

  // render
  // -----------------------------------------------------------------------------
  return (
    <Menu
      anchor={
        <Appbar.Action
          color={colors.icon}
          icon={DOTS_ICON}
          onPress={() => setIsMenuVisible(true)}
        />
      }
      onDismiss={() => setIsMenuVisible(false)}
      style={{ paddingTop: StatusBar.currentHeight }}
      theme={{ animation: { scale: 0 } }}
      visible={isMenuVisible}
    >
      {thread ? (
        <>
          <Menu.Item
            onPress={() => handleMenuPress(toggleMute)}
            title={thread.isMuted ? "Unmute" : "Mute"}
          />
          <Menu.Item
            onPress={() => handleMenuPress(toggleArchive)}
            title={thread.isArchived ? "Unarchive" : "Archive"}
          />
        </>
      ) : null}
    </Menu>
  );
};

export default DiscussionAppbarUnselectedMenu;
