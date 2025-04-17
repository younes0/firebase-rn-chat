import {
  FirebaseFirestoreTypes,
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "@react-native-firebase/firestore";

import { FirestoreCollection } from "@/definitions/enums";

export type UserProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
};

type ProfileQueryParams = {
  limitVal?: number;
};

export const getUserProfilesCollection = () =>
  collection(getFirestore(), FirestoreCollection.UserProfiles);

export const getUserProfileDoc = (profileId: string) =>
  doc(getFirestore(), FirestoreCollection.UserProfiles, profileId);

export const getUserProfilesQuery = ({
  limitVal = 20,
}: ProfileQueryParams = {}) =>
  query(
    getUserProfilesCollection(),
    orderBy("firstName", "asc"),
    limit(limitVal)
  );

export const getUserProfilesByIdsQuery = (
  profileIds: string[],
  { limitVal = 100 }: ProfileQueryParams = {}
): FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> => {
  if (profileIds.length === 0) {
    return query(getUserProfilesCollection(), limit(0));
  }

  return query(
    getUserProfilesCollection(),
    where("__name__", "in", profileIds),
    limit(limitVal)
  );
};
