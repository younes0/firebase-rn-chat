declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_DEV_API_PORT: string;
      EXPO_PUBLIC_ENV: string;
      EXPO_PUBLIC_FIREBASE_API_KEY: string;
      EXPO_PUBLIC_FIREBASE_APP_ID: string;
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      EXPO_PUBLIC_FIREBASE_DATABASE_URL: string;
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
    }
  }
}

export {};
