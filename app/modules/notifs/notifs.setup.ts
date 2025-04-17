import { Platform } from "react-native";
import { isDevice } from "expo-device";
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from "@notifee/react-native";

import {
  ChannelGroupIdentifier,
  ChannelIdentifier,
} from "@/modules/notifs/notifs.definitions";

// permission
// ----------------------------------------------------------------------------
export const checkNotifsPermission = async () => {
  const { authorizationStatus } = await notifee.getNotificationSettings();

  return _getAuthorizationStatusValue(authorizationStatus);
};

export const requestNotifsPermission = async () => {
  const { authorizationStatus } = await notifee.requestPermission();

  return _getAuthorizationStatusValue(authorizationStatus);
};

const _getAuthorizationStatusValue = async (status: AuthorizationStatus) => {
  if (
    [AuthorizationStatus.AUTHORIZED, AuthorizationStatus.PROVISIONAL].includes(
      status
    )
  ) {
    return true;
  } else if (status === AuthorizationStatus.DENIED) {
    return false;
  } else if (status === AuthorizationStatus.NOT_DETERMINED) {
    return undefined;
  }
};

// channels
// ----------------------------------------------------------------------------
export const createAndroidChannels = async () => {
  // ignore if: not android/not device/already created
  if (
    Platform.OS !== "android" ||
    !isDevice ||
    (await notifee.getChannel(ChannelIdentifier.Default))
  ) {
    return false;
  }

  // channel group
  await notifee.createChannelGroup({
    id: ChannelGroupIdentifier.Message,
    name: "Message",
  });

  // channels
  const channelDefaults = {
    vibration: true,
    importance: AndroidImportance.HIGH,
  };

  notifee.createChannel({
    ...channelDefaults,
    description: "New messages",
    id: ChannelIdentifier.MessageNew,
    name: "New messages",
    groupId: ChannelGroupIdentifier.Message,
  });
};

export const createIosCategories = () => {
  if (Platform.OS !== "ios" || !isDevice) {
    return false;
  }

  return notifee.setNotificationCategories([
    {
      id: ChannelIdentifier.Default,
    },
  ]);
};
