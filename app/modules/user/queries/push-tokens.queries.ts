import { Platform } from "react-native";
import * as webQueries from "./push-tokens.queries.web";
import * as nativeQueries from "./push-tokens.queries.native";

const { getPushTokenDoc, upsertPushToken, deletePushTokenByDeviceId } =
  Platform.OS === "web" ? webQueries : nativeQueries;

export { getPushTokenDoc, upsertPushToken, deletePushTokenByDeviceId };
