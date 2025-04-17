import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "@firebase/firestore";

export type WithID<T> = T & { id: string };

export function firestoreConverter<T extends DocumentData>(
  includeID: true,
): FirestoreDataConverter<WithID<T>>;
export function firestoreConverter<T extends DocumentData>(
  includeID?: false,
): FirestoreDataConverter<T>;
export function firestoreConverter<T extends DocumentData>(
  includeID?: boolean,
): FirestoreDataConverter<T | WithID<T>> {
  return {
    toFirestore(modelObject: WithFieldValue<T | WithID<T>>): DocumentData {
      if (!includeID) return modelObject;
      const { id, ...data } = modelObject;
      return data;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options?: SnapshotOptions,
    ): T | WithID<T> {
      const documentData = snapshot.data(options) as T;
      if (!includeID) return documentData;

      return {
        ...(snapshot.data(options) as T),
        id: snapshot.id,
      };
    },
  };
}
