import { ExpoConfig } from "@expo/config-types";

// -------------------------------------------------------------------------------
// variants
// -------------------------------------------------------------------------------
enum AppVariant {
  development = "development",
  production = "production",
}

const variant =
  (process.env.APP_VARIANT as AppVariant) || AppVariant.development;

const apsEnvironment =
  variant === AppVariant.development ? "development" : "production";

// ================================================================================

const config = <ExpoConfig>{
  // -------------------------------------------------------------------------------
  // main
  // -------------------------------------------------------------------------------
  assetBundlePatterns: ["**/*"],
  name: "app",
  slug: "app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  platforms: ["ios", "android", "web"],
  newArchEnabled: false,
  experiments: {
    typedRoutes: true,
    reactServerFunctions: true,
  },

  // -------------------------------------------------------------------------------
  // plugins
  // -------------------------------------------------------------------------------
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "15.1",
          useFrameworks: "static", // required for react-native-firebase
        },
      },
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "expo-font",
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "@evennit/notifee-expo-plugin",
      {
        appleDevTeamId: process.env.APPLE_TEAM_ID,
        apsEnvMode: apsEnvironment,
        enableCommunicationNotifications: true,
        iosDeploymentTarget: "15.1", // same as main app target
      },
    ],
  ],

  // -------------------------------------------------------------------------------
  // platform specific
  // -------------------------------------------------------------------------------
  web: {
    bundler: "metro",
    output: "server",
    favicon: "./assets/images/favicon.png",
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },

  ios: {
    supportsTablet: true,
    usesAppleSignIn: true,
    config: {
      usesNonExemptEncryption: false,
    },
    entitlements: {
      "aps-environment": apsEnvironment,
    },
    googleServicesFile: `./config/GoogleService-Info.${variant}.plist`,
    infoPlist: {
      UIBackgroundModes: ["remote-notification"],
    },
  },
};

export default config;
