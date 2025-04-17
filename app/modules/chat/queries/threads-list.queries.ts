import { Platform } from "react-native";
import * as webQueries from "./threads-list.queries.web";
import * as nativeQueries from "./threads-list.queries.native";

const {
  getThreadsMainQuery,
  getThreadsArchivedQuery,
  getThreadsUnreadQuery,
  getThreadsUnreadMainQuery,
} = Platform.OS === "web" ? webQueries : nativeQueries;

export {
  getThreadsMainQuery,
  getThreadsArchivedQuery,
  getThreadsUnreadQuery,
  getThreadsUnreadMainQuery,
};
