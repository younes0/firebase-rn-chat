import { Platform } from "react-native";
import { getMessaging } from "@react-native-firebase/messaging";
import NetInfo from "@react-native-community/netinfo";

import {
  deletePushTokenByDeviceId,
  upsertPushToken,
} from "@/modules/user/queries/push-tokens.queries";
import { PushTokenType } from "@/api/chat/chat.definitions";
import { checkNotifsPermission } from "./notifs.setup";
import { useAppStore } from "@/stores/app.store";

const getDeviceId = () => useAppStore.getState().deviceId;

export const getPushToken = async () => {
  if (!(await checkNotifsPermission())) {
    return false;
  }

  const { isConnected } = await NetInfo.fetch();

  // device is offline
  if (!isConnected) {
    return false;
  }

  const data = await getMessaging().getToken();

  // push token is not available
  if (!data) {
    return false;
  }

  return data;
};

export const sendPushTokens = async () => {
  if (Platform.OS === "web") {
    return;
  }

  const data = await getPushToken();
  const deviceId = getDeviceId();

  if (!data || !deviceId) {
    return;
  }

  return upsertPushToken({
    deviceId,
    data,
    type: Platform.OS === "ios" ? PushTokenType.Ios : PushTokenType.Android,
  });
};

export const deletePushToken = async () => {
  if (Platform.OS === "web") {
    return;
  }

  const deviceId = getDeviceId();

  return deviceId ? deletePushTokenByDeviceId(deviceId) : undefined;
};
