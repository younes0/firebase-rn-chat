import {
  DocumentData,
  QueryConstraint,
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "@firebase/firestore";

import { FirestoreCollection } from "@/definitions/enums";
import { firestoreConverter } from "@/modules/firebase/utils/firestore-converter";

export type UserProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
};

export type FirebaseUserProfile = Omit<UserProfile, "id">;

type ProfileQueryParams = {
  limitVal?: number;
};

const converter = firestoreConverter<UserProfile>();

export const getUserProfilesCollection = () =>
  collection(getFirestore(), FirestoreCollection.UserProfiles).withConverter(
    converter
  );

export const getUserProfileDoc = (profileId: string) =>
  doc(
    getFirestore(),
    FirestoreCollection.UserProfiles,
    profileId
  ).withConverter(converter);

// Get a query fo retrieving multiple profiles with optional limit
export const getUserProfilesQuery = ({
  limitVal = 20,
}: ProfileQueryParams = {}) =>
  query(
    getUserProfilesCollection(),
    orderBy("firstName", "asc"),
    limit(limitVal)
  );

// Get profiles by specific IDs
export const getUserProfilesByIdsQuery = (
  profileIds: string[],
  { limitVal = 100 }: ProfileQueryParams = {}
) => {
  if (profileIds.length === 0) {
    return query(getUserProfilesCollection(), limit(0));
  }

  return query(
    getUserProfilesCollection(),
    where("__name__", "in", profileIds),
    limit(limitVal)
  );
};

export const parseFirebaseUserProfile = (
  document: DocumentData
): UserProfile => {
  const data: FirebaseUserProfile = document.data();

  return {
    ...data,
    id: document.id,
  };
};
