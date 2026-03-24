# EduBridge / UniTeen

This repo contains two apps:

- `client/` + `server/`: the web app built with React, Vite, and Express
- `mobile/`: the React Native mobile app built with Expo SDK 54

## Requirements

Install these first:

- Node.js 20+
- npm 10+

For mobile development, also install one of these:

- Expo Go on your phone
- Android Studio for an Android emulator
- Xcode on macOS for an iOS simulator

## Project Structure

```text
.
├─ client/        Web frontend
├─ server/        Express backend
├─ shared/        Shared schemas/types used by the web app
├─ mobile/        Expo React Native app
└─ README.md
```

## 1. Set Up The Web App

From the repo root:

```bash
npm install
```

Start the full web app:

```bash
npm run dev
```

That runs:

- `npm run dev:client` for the Vite frontend
- `npm run dev:server` for the Express backend

Useful root commands:

```bash
npm run dev
npm run dev:client
npm run dev:server
npm run build
npm run start
npm run check
```

## 2. Set Up The Expo Mobile App

Move into the mobile app:

```bash
cd mobile
```

Install mobile dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Useful mobile commands:

```bash
npm start
npm run android
npm run ios
npm run web
```

The mobile app is currently configured for:

- Expo SDK 54
- React Native 0.81.5
- React 19.1

## Typical Local Workflow

If you want to work on both apps:

1. In one terminal, start the web app from the repo root:

```bash
npm run dev
```

2. In another terminal, start the mobile app:

```bash
cd mobile
npm start
```

## Type Checking

Web app:

```bash
npm run check
```

Mobile app:

```bash
cd mobile
npx tsc --noEmit
```

## Notes

- The web app and mobile app have separate `package.json` files, so run `npm install` in both places.
- The mobile app is in `mobile/` and does not use the root web build pipeline.
- If Expo reports dependency issues, run:

```bash
cd mobile
npx expo-doctor
```

## Quick Start

Web:

```bash
npm install
npm run dev
```

Mobile:

```bash
cd mobile
npm install
npm start
```
