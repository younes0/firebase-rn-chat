import React, { useEffect, useMemo, useRef } from "react";
import { BackHandler, NativeEventSubscription, View } from "react-native";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { usePathname } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import SpeakerHigh from "phosphor-react-native/src/icons/SpeakerHigh";
import SpeakerSlash from "phosphor-react-native/src/icons/SpeakerSlash";
import ArchiveBox from "phosphor-react-native/src/icons/BoxArrowDown";
import ArchiveTray from "phosphor-react-native/src/icons/BoxArrowUp";

import {
  useThreadsStore,
  useThreadsStoreActions,
} from "@/stores/threads.store";
import CustomAppbar from "@/components/CustomAppbar";
import ThreadService from "@/modules/chat/thread/thread.service";
import useGetProfile from "@/modules/user/hooks/useGetProfile";
import useGetUserId from "@/modules/firebase/hooks/useGetUserId";
import useSigninCheck from "@/modules/firebase/hooks/useSigninCheck";
import { ThreadUpdatableField } from "@/modules/chat/chat.definitions";
import { colors } from "@/definitions/styles.definitions";

export interface Props {
  isArchived?: boolean;
}

const ThreadsAppbarSelected = ({ isArchived = false }: Props) => {
  const selected = useThreadsStore((state) => state.selected);
  const { setSelected } = useThreadsStoreActions();

  // service
  // ------------------------------------------------------------------------
  const { data: signInCheckResult } = useSigninCheck();
  const userId = useGetUserId();
  const peerId = selected?.userId ? selected.userId : null;

  const threadService = useMemo(() => {
    if (signInCheckResult?.signedIn && userId && peerId) {
      return new ThreadService({
        userId,
        peerId,
      });
    }
  }, [peerId, signInCheckResult, userId]);

  // fetch data
  // ------------------------------------------------------------------------
  const { data: profile } = useGetProfile({
    profileId: peerId as string,
    skip: !selected || !peerId,
  });

  // unselect on screen blur
  // ------------------------------------------------------------------------
  const navigation = useNavigation();

  useEffect(
    () =>
      navigation.addListener("blur", () => {
        setSelected(null);
      }),
    [navigation, setSelected]
  );

  // back handler
  // ------------------------------------------------------------------------
  const backHandlerSubRef = useRef<NativeEventSubscription | null>(null);

  useEffect(() => {
    if (!backHandlerSubRef.current) {
      backHandlerSubRef.current = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          setSelected(null);
          return true;
        }
      );
    }
  }, [setSelected]);

  useEffect(() => {
    return () => {
      if (backHandlerSubRef.current) {
        backHandlerSubRef.current?.remove();
        backHandlerSubRef.current = null;
      }
    };
  }, [selected]);

  // handlers
  // ------------------------------------------------------------------------
  const handleBackAction = () => {
    setSelected(null);
  };

  const toggleIsArchived = () => {
    if (selected && threadService) {
      setSelected(null);

      threadService.updateField({
        field: ThreadUpdatableField.IsArchived,
        value: !selected.isArchived,
      });
    }
  };

  const toggleIsMuted = () => {
    if (selected && threadService) {
      setSelected(null);

      threadService.updateField({
        field: ThreadUpdatableField.IsMuted,
        value: !selected.isMuted,
      });
    }
  };

  // render
  // -----------------------------------------------------------------------
  const { styles } = useStyles(stylesheet);

  const pathname = usePathname();

  const isMutedVisible = !isArchived && pathname === "/";

  return selected ? (
    <CustomAppbar
      backActionHandler={handleBackAction}
      title={profile ? profile.firstName + " " + profile.lastName : ""}
    >
      <View style={styles.actions}>
        {isMutedVisible ? (
          <Appbar.Action
            animated={false}
            size={26}
            color={colors.icon}
            icon={({ color, size }) =>
              selected.isMuted ? (
                <SpeakerHigh size={size} color={color} />
              ) : (
                <SpeakerSlash size={size} color={color} />
              )
            }
            onPress={toggleIsMuted}
          />
        ) : null}

        <Appbar.Action
          animated={false}
          size={26}
          color={colors.icon}
          icon={({ color, size }) =>
            selected.isArchived ? (
              <ArchiveTray size={size} color={color} />
            ) : (
              <ArchiveBox size={size} color={color} />
            )
          }
          onPress={toggleIsArchived}
        />
      </View>
    </CustomAppbar>
  ) : null;
};

const stylesheet = createStyleSheet(() => ({
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
  },
}));

export default ThreadsAppbarSelected;
