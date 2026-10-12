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
// Capacitor's generated MainActivity is replaced with the registered native plugin.
const main=`package com.datawatch.monitor;\n\nimport android.os.Bundle;\nimport com.getcapacitor.BridgeActivity;\n\npublic class MainActivity extends BridgeActivity {\n  @Override public void onCreate(Bundle savedInstanceState) {\n    registerPlugin(DataWatchNativePlugin.class);\n    super.onCreate(savedInstanceState);\n  }\n}\n`;
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
console.log('Native Android plugin, manifest permissions, SQLite, WorkManager and launcher image installed.');
console.log('Ensure Android Studio and SDK are available, then run npm run android:apk.');
