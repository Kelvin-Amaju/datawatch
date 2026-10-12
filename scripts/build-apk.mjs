import { existsSync,copyFileSync,mkdirSync,readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve,join } from 'node:path';
if(!existsSync('android')){console.error('Run npm run android:init before building.');process.exit(1)}
// Capacitor 7 requires JDK 21; prefer it over an older JAVA_HOME.
function resolveJdk(){
 const candidates=[];
 if(process.env.JAVA_HOME&&process.env.JAVA_HOME.trim())candidates.push(process.env.JAVA_HOME.trim());
 if(process.platform==='win32'){
  for(const base of ['C:/Program Files/Eclipse Adoptium','C:/Program Files/Java','C:/Program Files/Zulu','C:/Program Files/Microsoft']){
   if(!existsSync(base))continue;
   for(const name of readdirSync(base))candidates.push(join(base,name));
  }
 }
 for(const dir of candidates){
  const java=join(dir,'bin',process.platform==='win32'?'java.exe':'java');
  if(!existsSync(java))continue;
  try{
   const out=spawnSync(java,['-version'],{encoding:'utf8'}).stderr||'';
   const m=out.match(/version "?(\d+)/);
   const major=m?parseInt(m[1],10):0;
   if(major>=21){console.log(`Using JDK ${major} from ${dir}`);return dir;}
  }catch(e){}
 }
 return process.env.JAVA_HOME||'';
}
const jdk=resolveJdk();
const env={...process.env};
if(jdk)env.JAVA_HOME=jdk;
const isWindows=process.platform==='win32';
const gradle=isWindows?'gradlew.bat':'./gradlew';
const p=spawnSync(gradle,['assembleDebug'],{cwd:'android',stdio:'inherit',shell:isWindows,env});
if(p.status!==0){console.error('APK compilation failed. Verify Android SDK, JDK 21 and Android Studio setup.');process.exit(p.status||1)}
const file=resolve('android/app/build/outputs/apk/debug/app-debug.apk');
if(!existsSync(file)){console.error('Gradle reported success but debug APK not found.');process.exit(1)}
mkdirSync('release',{recursive:true});copyFileSync(file,'release/DataWatch-debug.apk');
console.log('Built: release/DataWatch-debug.apk (debug testing only; sign a release build before publishing).');
