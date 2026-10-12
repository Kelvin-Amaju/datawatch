import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const android=path.join(root,'android');
if(!fs.existsSync(android)){console.error('Android project not found. Run npm run android:init first.');process.exit(1)}
const packageDir=path.join(android,'app/src/main/java/com/datawatch/monitor');
fs.mkdirSync(packageDir,{recursive:true});
const source=path.join(root,'native/android/com/datawatch/monitor');
for(const name of ['UsageEngine.java','UsageHistory.java','UsageCheckWorker.java','DataWatchNativePlugin.java']){
 fs.copyFileSync(path.join(source,name),path.join(packageDir,name));
}
// Capacitor's generated MainActivity is replaced with the registered native plugin and immersive fullscreen mode.
const main=`package com.datawatch.monitor;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override public void onCreate(Bundle savedInstanceState) {
    registerPlugin(DataWatchNativePlugin.class);
    super.onCreate(savedInstanceState);
    enterFullscreen();
  }
  @Override public void onResume(){super.onResume();enterFullscreen();}
  @Override public void onWindowFocusChanged(boolean hasFocus){super.onWindowFocusChanged(hasFocus);if(hasFocus)enterFullscreen();}
  private void enterFullscreen(){
    if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.R){
      WindowInsetsController controller=getWindow().getInsetsController();
      if(controller!=null){
        controller.hide(WindowInsets.Type.statusBars()|WindowInsets.Type.navigationBars());
        controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
      }
    }else{
      getWindow().getDecorView().setSystemUiVisibility(
        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        | View.SYSTEM_UI_FLAG_FULLSCREEN
        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
    }
  }
}
`;
fs.writeFileSync(path.join(packageDir,'MainActivity.java'),main);
const manifestPath=path.join(android,'app/src/main/AndroidManifest.xml');
let m=fs.readFileSync(manifestPath,'utf8');
const permissions=['<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" />','<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />','<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />'];
for(const perm of permissions)if(!m.includes(perm))m=m.replace(/<application\b/,`    ${perm}\n    <application`);
if(!m.includes('android.intent.category.LAUNCHER" /></intent></queries>')){
 const queries=`    <queries><intent><action android:name="android.intent.action.MAIN" /><category android:name="android.intent.category.LAUNCHER" /></intent></queries>\n`;
 m=m.replace(/<application\b/,`${queries}    <application`);
}
m=m.replace(/android:icon="@mipmap\/ic_launcher"/g,'android:icon="@drawable/datawatch_launcher"');
m=m.replace(/android:roundIcon="@mipmap\/ic_launcher_round"/g,'android:roundIcon="@drawable/datawatch_launcher"');
fs.writeFileSync(manifestPath,m);
const gradlePath=path.join(android,'app/build.gradle');
let g=fs.readFileSync(gradlePath,'utf8');
if(!g.includes('androidx.work:work-runtime:'))g+=`\n// DataWatch background statistics snapshots and threshold alerts.\ndependencies {\n    implementation 'androidx.work:work-runtime:2.10.2'\n}\n`;
fs.writeFileSync(gradlePath,g);
// Launcher icons: copy into res drawable-nodpi, then set icon reference where possible.
const res=path.join(android,'app/src/main/res');
const drawable=path.join(res,'drawable-nodpi');fs.mkdirSync(drawable,{recursive:true});
fs.copyFileSync(path.join(root,'public/assets/launcher.png'),path.join(drawable,'datawatch_launcher.png'));
// Branded native splash screens: layered dark background + app emblem on Android 6-11, native SplashScreen on 12+.
fs.writeFileSync(path.join(res,'values/colors.xml'),`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#070c09</color>
    <color name="colorPrimaryDark">#070c09</color>
    <color name="colorAccent">#c6ff22</color>
    <color name="splash_background">#070c09</color>
</resources>
`);
fs.writeFileSync(path.join(res,'values/styles.xml'),`<?xml version="1.0" encoding="utf-8"?>
<resources>

    <!-- Base application theme. -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
    </style>

    <style name="AppTheme.NoActionBar" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:background">@color/splash_background</item>
    </style>

    <style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
        <item name="windowSplashScreenBackground">@color/splash_background</item>
        <item name="windowSplashScreenAnimatedIcon">@drawable/datawatch_launcher</item>
        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:background">@drawable/splash</item>
    </style>
</resources>
`);
fs.writeFileSync(path.join(res,'drawable/splash.xml'),`<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background" />
    <item
        android:width="160dp"
        android:height="160dp"
        android:gravity="center">
        <bitmap
            android:src="@drawable/datawatch_launcher"
            android:gravity="center" />
    </item>
</layer-list>
`);
// Remove the default Capacitor splash images so the branded layer-list is used on every density.
const splashDirs=['drawable','drawable-port-mdpi','drawable-port-hdpi','drawable-port-xhdpi','drawable-port-xxhdpi','drawable-port-xxxhdpi','drawable-land-mdpi','drawable-land-hdpi','drawable-land-xhdpi','drawable-land-xxhdpi','drawable-land-xxxhdpi'];
for(const dir of splashDirs){const p=path.join(res,dir,'splash.png');if(fs.existsSync(p))fs.unlinkSync(p);}
console.log('Native Android plugin, manifest permissions, SQLite, WorkManager, launcher image, branded splash screens and fullscreen mode installed.');
console.log('Ensure Android Studio and SDK are available, then run npm run android:apk.');
