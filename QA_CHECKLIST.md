# DataWatch Device Verification Checklist

These tests must be performed on Android hardware/emulator before declaring the APK production-ready. They have **not** been executed here.

- [ ] First launch renders branded splash, three onboarding slides, Skip and Next actions.
- [ ] Usage permission flow takes user to the correct Android Usage Access setting.
- [ ] Returning with permission enabled displays observed mobile and Wi-Fi totals; revoking permission shows honest warnings rather than fabricated figures.
- [ ] Home Today / 7 Days / Month switch their actual queried date window.
- [ ] Usage charts show OS-provided daily history. No charts display sample data when unavailable.
- [ ] Per-app list names launchable applications where available; search, Mobile/Wi-Fi filters and app details work.
- [ ] Android app details shortcut opens the selected app's OS settings.
- [ ] Add/edit/delete data plans; date, size and prior usage validation; refresh & relaunch persist changes.
- [ ] Usage estimate reflects device mobile bytes since plan start (not falsely described as carrier balance).
- [ ] Limit thresholds and billing-cycle day persist and configure WorkManager.
- [ ] On Android 13+, notification prompt works; test a low monthly limit and verify a WorkManager alert when threshold is crossed.
- [ ] SQLite daily snapshots survive process kill/relaunch and export as CSV.
- [ ] Settings and plan JSON backup downloads through Android's WebView.
- [ ] Check usage counters vs Android Settings for the same window; document deviations by device/OEM.
- [ ] Check mobile keyboard/soft input, small phones, tablets and foldable aspect ratios.
- [ ] Confirm no unintended requests to remote analytics APIs or mock statistics.
- [ ] Check build and install from `release/DataWatch-debug.apk`; confirm app icon, splash and notification icon on Android 12–16.
