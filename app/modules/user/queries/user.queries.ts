import { Platform } from "react-native";
import * as webQueries from "./user.queries.web";
import * as nativeQueries from "./user.queries.native";

export type { UserProfile } from "./user.queries.web";

// Export the appropriate implementation based on platform
const {
  getUserProfilesCollection,
  getUserProfileDoc,
  getUserProfilesQuery,
  getUserProfilesByIdsQuery,
} = Platform.OS === "web" ? webQueries : nativeQueries;

export {
  getUserProfilesCollection,
  getUserProfileDoc,
  getUserProfilesQuery,
  getUserProfilesByIdsQuery,
};

export const parseFirebaseUserProfile = webQueries.parseFirebaseUserProfile;
