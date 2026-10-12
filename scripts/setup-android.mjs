import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const cap=process.platform==='win32'?'npx.cmd':'npx';
if(!existsSync('android')){
 const result=spawnSync(cap,['cap','add','android'],{stdio:'inherit',shell:process.platform==='win32'});
 if(result.status!==0){console.error('Capacitor could not generate the Android project. First run npm install and npm run build.');process.exit(result.status||1)}
}
const sync=spawnSync(cap,['cap','sync','android'],{stdio:'inherit',shell:process.platform==='win32'});
if(sync.status!==0)process.exit(sync.status||1);
const cmd=spawnSync(process.execPath,['scripts/install-native.mjs'],{stdio:'inherit'});
process.exit(cmd.status||0);
