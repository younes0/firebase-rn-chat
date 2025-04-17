import { Platform } from "react-native";
import * as webQueries from "./messages.queries.web";
import * as nativeQueries from "./messages.queries.native";

const { getMessagesBaseQuery, getMessagesDoc, getMessagesDocCollection } =
  Platform.OS === "web" ? webQueries : nativeQueries;

export { getMessagesBaseQuery, getMessagesDoc, getMessagesDocCollection };
