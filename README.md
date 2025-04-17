# Chat Project

## About

Complete Chat feature that includes:
- Complete Interface (React Native, Expo 53)
- Firebase Cloud Functions to send notifications
- Firestore & RTDB Rules
- Notifications handling (RN Firebase & Notifee)
  + Notifications shows profile picture of the Sender
- Thread can be Archived, Muted (no notififcations received) or Blocked

## Architecture notes
- TODO: 

## Demo Video

TODO:

## Init Firebase

### Configure Project
```bash
pnpm install -g firebase-tools
cd firebase
pnpm install
cd functions
pnpm install
cd ..
firebase projects:create
```
Then on Firebase Admin UI:
- go to Authentification &  add Anonymous sign in
- create Firestore database
- go to Usage & Billing, and chose "Blaze plan" to enable Cloud Functions

```bash
# continue
firebase use PROJECT_ID
firebase deploy
firebase deploy --only firestore:rules

firebase apps:create WEB your-app-name
firebase apps:sdkconfig WEB your-app-id # ouputs configuration data that we will later in env file
```

### Service Account file

Create via the Firebase Admin UI : Project Overview > Project Settings > Service Accounts
Copy the JSON file to "app/config/serviceAccount.json"

## Init Expo App

```bash
cd ..
cd app
cp ../firebase/serviceAccount.json config/serviceAccount.json
cp .env.example .env # change env with the previous configuration data
pnpm install
pnpm start 
# then open on Web
```
