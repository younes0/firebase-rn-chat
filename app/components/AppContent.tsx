import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import useFirebaseLogin from "@/modules/firebase/hooks/useFirebaseLogin";
import useGetProfile from "@/modules/user/hooks/useGetProfile";
import useGetUserId from "@/modules/firebase/hooks/useGetUserId";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useInitUser } from "@/hooks/api/useInitUser";

const AppContent = () => {
  const colorScheme = useColorScheme();

  useFirebaseLogin();

  // fetch profile
  // ---------------------------------------------------------------------------
  const userId = useGetUserId();
  const { data: peerProfile, loading: isLoadingProfile } = useGetProfile({
    profileId: userId as string,
    skip: !userId,
  });

  // init user if profile not found
  // ---------------------------------------------------------------------------
  const { mutate: initUser, isPending: isInitiatingUser } = useInitUser();

  useEffect(() => {
    if (!isLoadingProfile && peerProfile === null && userId) {
      initUser(userId);
    }
  }, [peerProfile, userId]);

  // render
  // ---------------------------------------------------------------------------
  return isLoadingProfile ? (
    "Loading Profile..."
  ) : isInitiatingUser ? (
    "Creating User Profile & Data Example for demo purposes..."
  ) : (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="archived" options={{ headerShown: false }} />
        <Stack.Screen
          name="discussion/[peerId]"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

export default AppContent;
