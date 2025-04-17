import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin/app";
import * as https from "https";

import serviceAccount from "@/config/serviceAccount.json";

const config = {
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,

  // default httpAgent doesn't work with expo api routes
  httpAgent: new https.Agent({
    keepAlive: true,
    rejectUnauthorized: true, // Ensure proper SSL validation
  }),
};

export const app = admin.apps[0] || admin.initializeApp(config);

admin.firestore().settings({
  preferRest: true,
});

export const firestore = admin.firestore();
