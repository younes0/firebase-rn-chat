#  Firebase React Native Firestore Chat

## About

### Features
Complete 1 to 1 Chat feature that includes:
- Complete Interface (React Native, Expo 53)
- Firebase Cloud Functions to send notifications
- Firestore & RTDB Rules
- Thread Archive, Muting & Blocking
- Notifications handling (RN Firebase & Notifee)
  + Notifications shows profile picture of the Sender
- Typing indicators
- Some message formatting


For advanced features, consider using [Stream](https://getstream.io/chat/) which offers: file uploads, reply, thread conversations, search, moderation tools etc.

### Demo Video
(Soon)

## Setup 

### Firebase

#### Configure Project
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

#### Service Account file

Create via the Firebase Admin UI : Project Overview > Project Settings > Service Accounts
Copy the JSON file to `app/config/serviceAccount.json`

### Expo App

```bash
cd ..
cd app
cp ../firebase/serviceAccount.json config/serviceAccount.json
cp .env.example .env # change env with the previous configuration data
pnpm install
pnpm start 
# then open on Web
```

## Architecture notes

### General

- Thread Creation is implemented on the server side: this design choice ensures that proper checks can be performed before allowing one user to chat with another user.
- Demo Data: Fake data is created for the demo to quickly showcase the chat feature.
- Does not use React Native Gifted Chat (complex & questionable architecture)

### User Profiles

- Profiles are loaded from Firebase for demonstration purposes, but can be loaded from other sources.
- Important: Remember to update profile data in Firestore whenever the user updates their profile, to ensure notifications display the most current information (notifications use Firestore data).

### Platform Support

- Compatible with Web, Android, and iOS platforms.
