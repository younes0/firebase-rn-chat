import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";

import AppContent from "@/components/AppContent";
import FirebaseProviders from "@/modules/firebase/components/FirebaseProviders";
import tanstackQueryClient from "@/utils/tanstack-query-client";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={tanstackQueryClient}>
      <FirebaseProviders>
        <KeyboardProvider>
          <PaperProvider>
            <AppContent />
          </PaperProvider>
        </KeyboardProvider>
      </FirebaseProviders>
    </QueryClientProvider>
  );
};

export default RootLayout;
