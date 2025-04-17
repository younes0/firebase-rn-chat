import * as admin from "firebase-admin";
import * as firebase from "@firebase/rules-unit-testing";
import fs from "fs";

import serviceAccount from "../../serviceAccount.json";

const FIREBASE_PROJECT_ID = "REPLACE_ME";

export const getAdmin = () =>
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "REPLACE_ME",
  });

export const useEmulator = () => {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  process.env.FIREBASE_DATABASE_EMULATOR_HOST = "localhost:9000";
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
};

export const getTestEnv = () => {
  return firebase.initializeTestEnvironment({
    projectId: FIREBASE_PROJECT_ID,
    hub: {
      host: "localhost",
      port: 4400,
    },
    database: {
      rules: fs.readFileSync("database.rules.json", "utf8"),
    },
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  });
};
