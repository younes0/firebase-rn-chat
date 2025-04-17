import { Platform } from "react-native";
import { getMessaging } from "@react-native-firebase/messaging";

if (Platform.OS === "android") {
  // avoids warning message
  getMessaging().setBackgroundMessageHandler(() => new Promise(() => null));
}
