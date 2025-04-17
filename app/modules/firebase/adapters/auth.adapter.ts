import { Platform } from "react-native";
import {
  getAuth as getNativeAuth,
  signInWithCustomToken as nativeSignInWithCustomToken,
  signInAnonymously as nativeSignInAnonymously,
  FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import {
  Auth as WebAuth,
  UserCredential as WebUserCredential,
  getAuth as getWebAuth,
  signInWithCustomToken as webSignInWithCustomToken,
  signInAnonymously as webSignInAnonymously,
} from "@firebase/auth";

// types
// ---------------------------------------------------------------------------------
type AuthInstance = WebAuth | FirebaseAuthTypes.Module;

type UserCredential = WebUserCredential | FirebaseAuthTypes.UserCredential;

// methods
// ---------------------------------------------------------------------------------
export const getAuth = (): AuthInstance =>
  Platform.OS === "web" ? getWebAuth() : getNativeAuth();

export const signInWithCustomToken = (token: string): Promise<UserCredential> =>
  Platform.OS === "web"
    ? webSignInWithCustomToken(getWebAuth(), token)
    : nativeSignInWithCustomToken(getNativeAuth(), token);

export const signInAnonymously = (): Promise<UserCredential> =>
  Platform.OS === "web"
    ? webSignInAnonymously(getWebAuth())
    : nativeSignInAnonymously(getNativeAuth());
