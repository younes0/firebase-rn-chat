# Firebase

## Description

Firebase project which contains:
- Firebase (Firestore & RTDB) security rules
- Cloud Functions definitions

## Install

```bash
# setup tools
pnpm add firebase-tools@latest kill-port --global

# setup project
cd firebase
firebase login
firebase use PROJECT_ID
pnpm i

# setup functions
cd functions
pnpm i
pnpm build
```

## Deploy

```bash
firebase use my-project

# database, firestore rules
pnpm deploy:rules

# cloud functions
cd functions
pnpm deploy:functions
```

## Run on emulator (for tests)
if you are on WSL, avoid the hassle: setup the repo on Windows

### install
```bash
# install emulator if needed
apt install default-jre # linux
firebase init emulators
# windows: https://www.oracle.com/java/technologies/downloads/#jdk21-windows
firebase login --no-localhost
```

### use
before: setup functions

```bash
pnpm emulator:start #  run emulator WITH data import/export
pnpm emulator:start:data #  run emulator WITHOUT data import/export
pnpm test:watch # security rules tests
```

## Other

### Debugging

```bash
firebase deploy --debug --only functions
firebase functions:log
```
