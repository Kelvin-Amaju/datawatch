import { existsSync,copyFileSync,mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
if(!existsSync('android')){console.error('Run npm run android:init before building.');process.exit(1)}
const isWindows=process.platform==='win32';
const gradle=isWindows?'gradlew.bat':'./gradlew';
const p=spawnSync(gradle,['assembleDebug'],{cwd:'android',stdio:'inherit',shell:isWindows});
if(p.status!==0){console.error('APK compilation failed. Verify Android SDK, JDK 17+ and Android Studio setup.');process.exit(p.status||1)}
const file=resolve('android/app/build/outputs/apk/debug/app-debug.apk');
if(!existsSync(file)){console.error('Gradle reported success but debug APK not found.');process.exit(1)}
mkdirSync('release',{recursive:true});copyFileSync(file,'release/DataWatch-debug.apk');
console.log('Built: release/DataWatch-debug.apk (debug testing only; sign a release build before publishing).');
