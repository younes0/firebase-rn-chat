import { Platform } from "react-native";
import {
  DocumentChange as WebDocumentChange,
  DocumentData,
  DocumentReference as WebDocumentReference,
  DocumentSnapshot as WebDocumentSnapshot,
  Firestore as WebFirestore,
  Query as WebQuery,
  QueryConstraint as WebQueryConstraint,
  QuerySnapshot as WebQuerySnapshot,
  SetOptions as WebSetOptions,
  Unsubscribe as WebUnsubscribe,
  WriteBatch as WebWriteBatch,
  clearIndexedDbPersistence as webDbPersistence,
  doc as webDoc,
  getDoc as webGetDoc,
  getDocs as webGetDocs,
  getFirestore as webGetFirestore,
  onSnapshot as webOnSnapshot,
  query as webQuery,
  terminate as webTerminate,
  updateDoc as webUpdateDoc,
  where as webWhere,
  writeBatch as webWriteBatch,
} from "@firebase/firestore";
import {
  FirebaseFirestoreTypes as NativeTypes,
  Unsubscribe as NativeUnsubscribe,
  clearPersistence as nativeDbPersistence,
  doc as nativeDoc,
  getDoc as nativeGetDoc,
  getDocs as nativeGetDocs,
  getFirestore as nativeGetFirestore,
  onSnapshot as nativeOnSnapshot,
  query as nativeQuery,
  terminate as nativeTerminate,
  updateDoc as nativeUpdateDoc,
  where as nativeWhere,
  writeBatch as nativeWriteBatch,
} from "@react-native-firebase/firestore";

// types
// ---------------------------------------------------------------------------------
export type DocumentChangeType = NativeTypes.DocumentChangeType;

export type Unsubscribe = WebUnsubscribe | NativeUnsubscribe;

export type QueryType =
  | WebQuery<DocumentData>
  | NativeTypes.Query<NativeTypes.DocumentData>;

export type QueryConstraintType =
  | WebQueryConstraint
  | NativeTypes.QueryFieldFilterConstraint;

export type DocumentChange =
  | WebDocumentChange<DocumentData>
  | NativeTypes.DocumentChange<NativeTypes.DocumentData>;

export type QuerySnapshotType =
  | WebQuerySnapshot<DocumentData>
  | NativeTypes.QuerySnapshot<NativeTypes.DocumentData>;

export type DocumentReferenceType =
  | WebDocumentReference<DocumentData>
  | NativeTypes.DocumentReference;

export type DocumentSnapshotType = {
  data: () => DocumentData | undefined;
  exists: () => boolean;
};

export type FirestoreType = WebFirestore | NativeTypes.Module;

export type SetOptionsType = WebSetOptions | NativeTypes.SetOptions;

export type WriteBatchType = {
  update: (
    docRef: DocumentReferenceType,
    data: Partial<DocumentData>,
  ) => WriteBatchType;
  set: (
    docRef: DocumentReferenceType,
    data: DocumentData,
    options?: SetOptionsType,
  ) => WriteBatchType;
  commit: () => Promise<void>;
};

// general methods
// ---------------------------------------------------------------------------------
const IS_WEB = Platform.OS === "web";

export const getFirestore = (): FirestoreType =>
  IS_WEB ? webGetFirestore() : nativeGetFirestore();

export const clearPersistence = () =>
  IS_WEB
    ? webDbPersistence(webGetFirestore())
    : nativeDbPersistence(nativeGetFirestore());

export const terminate = () =>
  IS_WEB
    ? webTerminate(webGetFirestore())
    : nativeTerminate(nativeGetFirestore());

// query methods
// ---------------------------------------------------------------------------------
export const where = (
  fieldPath: string,
  opStr: NativeTypes.WhereFilterOp,
  value: any,
): QueryConstraintType =>
  (IS_WEB
    ? webWhere(fieldPath, opStr, value)
    : nativeWhere(fieldPath, opStr, value)) as QueryConstraintType;

export const query = (
  query: QueryType,
  ...queryConstraints: QueryConstraintType[]
): QueryType =>
  (IS_WEB
    ? webQuery(
        query as WebQuery<DocumentData>,
        ...(queryConstraints as WebQueryConstraint[]),
      )
    : nativeQuery(
        query as NativeTypes.Query<NativeTypes.DocumentData>,
        ...(queryConstraints as NativeTypes.QueryFieldFilterConstraint[]),
      )) as QueryType;

export const getDocs = (query: QueryType): Promise<QuerySnapshotType> =>
  IS_WEB
    ? webGetDocs(query as WebQuery<DocumentData>)
    : nativeGetDocs(query as NativeTypes.Query<NativeTypes.DocumentData>);

export const doc = (
  collectionRef: any,
  ...pathSegments: string[]
): DocumentReferenceType =>
  IS_WEB
    ? webDoc(collectionRef, ...pathSegments)
    : nativeDoc(collectionRef, ...pathSegments);

export const getDoc = async (
  docRef: DocumentReferenceType,
): Promise<DocumentSnapshotType> => {
  if (IS_WEB) {
    const webSnapshot = await webGetDoc(
      docRef as WebDocumentReference<DocumentData>,
    );

    return {
      data: () => webSnapshot.data(),
      exists: () => webSnapshot.exists(),
    };
  } else {
    const nativeSnapshot = await nativeGetDoc(
      docRef as NativeTypes.DocumentReference,
    );

    return {
      data: () => nativeSnapshot.data(),
      exists: () => nativeSnapshot.exists,
    };
  }
};

export const updateDoc = (
  docRef: DocumentReferenceType,
  data: Partial<DocumentData>,
): Promise<void> =>
  IS_WEB
    ? webUpdateDoc(docRef as WebDocumentReference<DocumentData>, data)
    : nativeUpdateDoc(docRef as NativeTypes.DocumentReference, data);

// helpers: replacements to avoid typing issues or complex workarounds
// ---------------------------------------------------------------------------------

// onQuerySnapshot replaces onSnapshot
export const onQuerySnapshot = (
  query: QueryType,
  onNext: (snapshot: QuerySnapshotType | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe =>
  IS_WEB
    ? webOnSnapshot(
        query as WebQuery<DocumentData>,
        onNext as (snapshot: WebQuerySnapshot<DocumentData>) => void,
        onError,
      )
    : nativeOnSnapshot(
        query as NativeTypes.Query<NativeTypes.DocumentData>,
        onNext as (
          snapshot: NativeTypes.QuerySnapshot<NativeTypes.DocumentData>,
        ) => void,
        onError,
      );

// onDocumentSnapshot replaces onSnapshot
export const onDocumentSnapshot = (
  docRef: DocumentReferenceType,
  onNext: (snapshot: DocumentSnapshotType) => void,
  onError?: (error: Error) => void,
): Unsubscribe =>
  IS_WEB
    ? webOnSnapshot(
        docRef as WebDocumentReference<DocumentData>,
        (snapshot: WebDocumentSnapshot<DocumentData>) => {
          onNext({
            data: () => snapshot.data(),
            exists: () => snapshot.exists(),
          });
        },
        onError,
      )
    : nativeOnSnapshot(
        docRef as NativeTypes.DocumentReference,
        (snapshot: NativeTypes.DocumentSnapshot) => {
          onNext({
            data: () => snapshot.data(),
            exists: () => snapshot.exists,
          });
        },
        onError,
      );

// getDataFromSnapshot replaces snapshot.data()
export const getDataFromSnapshot = (
  snapshot: QuerySnapshotType | DocumentSnapshotType,
): DocumentData | undefined =>
  "docs" in snapshot ? snapshot.docs[0]?.data() : snapshot.data();

// batch
// ---------------------------------------------------------------------------------
export const writeBatch = (firestore: FirestoreType): WriteBatchType => {
  const nativeBatch = IS_WEB
    ? webWriteBatch(firestore as WebFirestore)
    : nativeWriteBatch(firestore as NativeTypes.Module);

  const update = (
    docRef: DocumentReferenceType,
    data: Partial<DocumentData>,
  ) => {
    if (IS_WEB) {
      (nativeBatch as WebWriteBatch).update(
        docRef as WebDocumentReference<DocumentData>,
        data,
      );
    } else {
      (nativeBatch as NativeTypes.WriteBatch).update(
        docRef as NativeTypes.DocumentReference,
        data,
      );
    }

    return batch;
  };

  const set = (
    docRef: DocumentReferenceType,
    data: DocumentData,
    options?: SetOptionsType,
  ) => {
    if (IS_WEB) {
      (nativeBatch as WebWriteBatch).set(
        docRef as WebDocumentReference<DocumentData>,
        data,
        options as WebSetOptions,
      );
    } else {
      (nativeBatch as NativeTypes.WriteBatch).set(
        docRef as NativeTypes.DocumentReference,
        data,
        options as NativeTypes.SetOptions,
      );
    }

    return batch;
  };

  const batch: WriteBatchType = {
    update,
    set,
    commit: () => nativeBatch.commit(),
  };

  return batch;
};
