# Career Dashboard Mobile App

Career Dashboard is a vibecoded mobile app concept for engineering students who want one place to manage academic performance and career growth. The app combines a GPA command center for university modules with a course tracker for online learning, skills, tools, streaks, and deadlines.

## Product Idea

This app is designed as a student operating system:

- Academic side: track grades, compute CGPA and SGPA, explore the curriculum, and see target GPA predictions.
- Career side: track external courses, progress, completion dates, learned skills, tools, certificates, and learning streaks.
- Mobile first experience: fast access, dark command-center visuals, and focused student workflows.

## Current Modules

### 1. GPA Command Center

- Anonymous Firebase auth
- Curriculum browser
- Grade entry per module
- CGPA and semester GPA calculations
- Target GPA tracking and predictions
- Settings and theme toggle

### 2. Course Tracker

- Add, edit, and delete personal learning courses
- Progress tracking by lesson count
- Deadline and timeline view
- Skills and languages aggregation
- Learning streak tracking
- Certificate tracking

## Tech Stack

- Expo
- React Native
- React 19
- TypeScript
- React Navigation
- Firebase Auth + Firestore
- AsyncStorage
- date-fns
- react-native-svg

## Project Structure

```text
App.tsx
src/
  context/        App state providers
  data/           Curriculum data
  models/         Shared types and models
  navigation/     App navigators
  services/       Firebase and local storage services
  utils/          GPA and prediction logic
  viewmodels/     Calendar layout logic
  views/
    components/   Shared UI
    screens/      App screens
```

## Environment Setup

Create a `.env` file in the project root and fill in the Expo public environment variables:

```env
EXPO_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
EXPO_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
EXPO_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
EXPO_PUBLIC_FIREBASE_DATABASE_ID="YOUR_DATABASE_ID"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=""
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID="YOUR_WEB_CLIENT_ID"
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID="YOUR_ANDROID_CLIENT_ID"
```

Quick start on Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Firebase Checklist

Before running the app, make sure Firebase is ready:

1. Create a Firebase project.
2. Enable Anonymous Authentication.
3. Create a Firestore database.
4. Add the app config values to `.env`.
5. Review `firestore.rules` before production use.

## Local Development

Install dependencies:

```bash
npm install
```

Start the Expo dev server:

```bash
npm run start
```

Run Android locally:

```bash
npm run android
```

Run iOS locally:

```bash
npm run ios
```

Run TypeScript checks:

```bash
npm run lint
```

## Build

### Android EAS build

This repo already includes an Android build script:

```bash
npm run build
```

That runs:

```bash
eas build -p android
```

### If EAS is not set up yet

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Then run:

```bash
npm run build
```

### iOS release build

There is no dedicated npm script yet, but you can build with:

```bash
eas build -p ios
```

## Release Notes

Before shipping a production build, double-check:

- Firebase env values are correct
- Firestore rules are ready for real user data
- App icons and splash assets are final
- `app.json` branding, slug, and version are correct
- TypeScript passes with `npm run lint`

## Why This App Matters

Most student tools only solve one side of the problem. Career Dashboard is meant to connect both:

- university grades
- career skill development
- long-term progress visibility

That is the core vibecoded idea behind this app: one mobile dashboard for both degree performance and employability growth.
