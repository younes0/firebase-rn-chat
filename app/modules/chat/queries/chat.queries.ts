import { Platform } from "react-native";

import * as webQueries from "./chat.queries.web";
import * as nativeQueries from "./chat.queries.native";

const { getThreadsSubCollection } =
  Platform.OS === "web" ? webQueries : nativeQueries;

export { getThreadsSubCollection };
