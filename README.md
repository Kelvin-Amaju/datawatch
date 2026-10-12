# DataWatch v1 — Watch Every Byte

A dark + electric-lime **React + TypeScript + Capacitor Android** application for reading actual Android mobile/Wi-Fi network usage. Includes custom native Java integration, SQLite usage snapshots, configurable usage limits, and periodic notification checks.

> **Build status:** Source implementation supplied. The packaged project has not been installed or run on an Android device here. **No APK has been compiled or verified in this environment**, because the Android SDK and package registry are unavailable. Build a debug APK using the steps below, then verify it on a device.

## Included features

- Fully designed mobile-first dark UI, branded splash screen, three onboarding slides, permission onboarding and animated navigation.
- Android Usage Access permission settings and permission return detection.
- Device-wide **mobile and Wi-Fi** usage totals, upload/download bytes; today / 7 days / month periods.
- App-by-app mobile and Wi-Fi usage for Android user-profile UIDs, with launchable package names where Android exposes them.
- Day-by-day charts, usage breakdown, date-window filtering and search.
- User-created data bundles (MTN, Airtel, Glo, 9mobile, other), price, activation/expiry, estimated remaining allowance and manual prior-usage adjustment.
- Monthly mobile allowance limits, 50% / 75% / 90% / 100% alert toggles; configurable cycle day.
- Native **WorkManager** 15-minute periodic background checks (actual execution can be delayed by Android).
- Native **SQLite** daily snapshots + CSV history export; JSON backup of data plans/settings. On Android exports use the native share/save sheet.
- No required account, no user analytics server, no invented network statistics.
- Mobile responsive UI with desktop-browser preview explaining real-device access restrictions.

## Requirements (Windows)

1. **Node.js 22 LTS** or later, and npm.
2. **Android Studio** (2024.2.1+ / recent stable) with **Android SDK Platform 35**, SDK Build Tools, and platform tools.
3. **JDK 21** for Capacitor 7. Use Android Studio's bundled JDK 21 or set `JAVA_HOME` to a JDK 21 installation.
4. Android phone with **Android 6.0+**, USB debugging enabled (or Android emulator). Android 13+ requires notification permission for alerts.

## Install, run, and generate an APK

Open Windows PowerShell or Terminal **in this project directory**:

```powershell
npm install
npm run dev
```

Visit the local URL reported by Vite. The browser preview works for UI flows, plan forms, and settings; **actual network figures require Android**.

To generate the native Android project:

```powershell
npm run build
npm run android:init
```

`android:init` invokes `npx cap add android` (first run), syncs web assets, and copies the custom native plugin into the generated Android project. The native install script also adds the Android Usage Access / notification permissions, launcher icon, and WorkManager dependency. It can be run again safely.

For native inspection and device debugging:

```powershell
npm run android:open
```

In Android Studio, wait for Gradle sync, select a device, and press Run.

To create a **debug-test APK** using Gradle:

```powershell
npm run android:apk
```

The script builds the React app, syncs the Capacitor project, installs native sources and runs `gradlew assembleDebug`. If successful, the output is:

`release/DataWatch-debug.apk`

You may also find the Gradle output in `android/app/build/outputs/apk/debug/app-debug.apk`.

The installed app uses immersive fullscreen mode, with system bars available by swiping. Native launch screens use the DataWatch emblem on the dark brand background, followed by the existing branded web splash. Android layouts fill the display on phones, tablets and in landscape. These settings are reapplied by `android:sync`.

**Important:** A debug APK is for testing. For publishing, use a signed Android release / AAB from Android Studio with your own signing key.

## Android permission & behavior

1. Launch DataWatch and finish onboarding.
2. On the permission screen, tap **Grant usage access**.
3. Android opens Usage Access settings; select **DataWatch** and enable **Permit usage access**.
4. Return to DataWatch; it reads actual device totals and recorded app usage.
5. In Settings, request notification permission if desired (Android 13+).
6. Add a plan and configure monthly limits and alert thresholds.

The read APIs are `NetworkStatsManager.querySummaryForDevice` (device totals) and `querySummary` (per-UID app data). Some devices may limit detail and history, or combine app traffic under shared UIDs. Network counters are batched and are **not guaranteed to be second-by-second**. The charts never fill with demo figures if an API is unavailable.

## Important product limitations

- **Not a carrier data balance:** DataWatch cannot query MTN/Airtel/Glo bundle balance without approved carrier integration. Remaining data is an estimate derived from device-wide mobile traffic after plan activation plus optional prior-usage adjustment. It may include both SIMs on dual-SIM phones.
- **Not Wi-Fi router metering:** Wi-Fi totals represent this device, not every device connected to a router. Per-Wi-Fi network identities are not included in v1.
- **Not exact foreground/background attribution:** Per-app rows show network statistics by UID, without confidently labeling bytes as foreground or background.
- **Not instantaneous alerts:** WorkManager periodic intervals are approximately 15 minutes minimum and are affected by power management and OEM restrictions.
- **No mobile data blocking:** Android apps cannot generally restrict other apps' connectivity without elevated privileges or an opt-in VPN service. DataWatch provides shortcuts to Android app settings instead.
- **No iOS monitoring:** Ordinary iOS apps cannot obtain system-wide per-app statistics from public APIs.
- **Package visibility:** DataWatch deliberately avoids the Google Play-restricted `QUERY_ALL_PACKAGES` permission. Android may display some background services as `System / UID ####`.
- **Offline-first:** Usage snapshots are stored in Android SQLite; user plan and preferences reside in this app's local WebView storage. Removing app data or uninstalling deletes both unless exported.

## Project structure

```text
DataWatch-v1/
  public/assets/              approved DataWatch logo, backgrounds & onboarding illustrations
  src/App.tsx                 React screen logic and state
  src/components/Intro.tsx    onboarding flow
  src/components/Visuals.tsx  meter, charts, app rows
  src/lib/native.ts           Capacitor Android bridge / formatting
  src/lib/storage.ts          plans & settings persistence / export
  src/lib/types.ts            data models
  src/styles.css              custom dark/lime style system
  native/android/...          native statistics, SQLite, notifications & plugin
  scripts/setup-android.mjs   initializes Android project
  scripts/install-native.mjs  installs native sources / manifest changes
  scripts/build-apk.mjs      compiles + copies debug APK
  QA_CHECKLIST.md             device test checklist
```

## Troubleshooting

**`npm install` can't reach registry:** Check internet / proxy / npm registry. This source ZIP excludes `node_modules` (normally installed on your machine).

**`SDK location not found`:** Install Android Studio's Android SDK and set Android SDK path in Studio; or set `ANDROID_HOME` and create `android/local.properties` containing `sdk.dir=C:\\Users\\<your-user>\\AppData\\Local\\Android\\Sdk` (escape backslashes in .properties). Do not commit a machine-specific path.

**`invalid source release: 21`:** Set Gradle JDK to 21 (Android Studio Settings > Build, Execution, Deployment > Build Tools > Gradle).

**`CSV does not download`:** On Android the native share sheet opens so you can save or share the exported CSV/JSON file. The web preview uses normal browser downloads.

**`Usage permission denied`:** Open Android Settings > Apps > Special app access > Usage access > DataWatch. Re-enable and return to the app.

**No per-app results:** Check device manufacturer restrictions, Android profile, and Usage Access; some system/app UIDs may not have identifiable labels.

**Gradle fails to resolve WorkManager:** Let Android Studio sync with an internet connection to download AndroidX dependencies.

**Android project regeneration:** If `android/` was removed, run `npm run build` then `npm run android:init`. Never edit the copied plugin sources without also updating their originals under `native/android` because `android:sync` recopies them.
