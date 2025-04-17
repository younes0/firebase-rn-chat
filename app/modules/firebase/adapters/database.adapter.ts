import { Platform } from "react-native";
import {
  DataSnapshot as WebDataSnapshot,
  Database as WebDatabase,
  DatabaseReference as WebDatabaseReference,
  getDatabase as webGetDatabase,
  onValue as webOnValue,
  ref as webRef,
  set as webSet,
} from "@firebase/database";
import {
  FirebaseDatabaseTypes as NativeTypes,
  getDatabase as nativeGetDatabase,
  onValue as nativeOnValue,
  ref as nativeRef,
  set as nativeSet,
} from "@react-native-firebase/database";

// types
// ---------------------------------------------------------------------------------
export type DatabaseType = WebDatabase | NativeTypes.Module;

export type DatabaseReferenceType =
  | WebDatabaseReference
  | NativeTypes.Reference;

export type DataSnapshotType = WebDataSnapshot | NativeTypes.DataSnapshot;

export type UnsubscribeType = () => void;

// methods
// ---------------------------------------------------------------------------------
export const getDatabase = (): DatabaseType =>
  Platform.OS === "web" ? webGetDatabase() : nativeGetDatabase();

export const ref = (db: DatabaseType, path: string): DatabaseReferenceType =>
  Platform.OS === "web"
    ? webRef(db as WebDatabase, path)
    : nativeRef(db as NativeTypes.Module, path);

export const onValue = (
  reference: DatabaseReferenceType,
  callback: (snapshot: DataSnapshotType) => void,
): UnsubscribeType =>
  Platform.OS === "web"
    ? webOnValue(
        reference as WebDatabaseReference,
        callback as (snapshot: WebDataSnapshot) => void,
      )
    : nativeOnValue(
        reference as NativeTypes.Reference,
        callback as (snapshot: NativeTypes.DataSnapshot) => void,
      );

export const set = (
  reference: DatabaseReferenceType,
  value: any,
): Promise<void> =>
  Platform.OS === "web"
    ? webSet(reference as WebDatabaseReference, value)
    : nativeSet(reference as NativeTypes.Reference, value);
