import type { AppSettings, Bundle } from './types';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { DEFAULT_SETTINGS } from './types';
export function readSettings():AppSettings {try {return {...DEFAULT_SETTINGS,...JSON.parse(localStorage.getItem('dw.settings')||'{}')}}catch{return {...DEFAULT_SETTINGS}}}
export function writeSettings(value:AppSettings){localStorage.setItem('dw.settings',JSON.stringify(value))}
export function readBundles():Bundle[]{try {const raw=JSON.parse(localStorage.getItem('dw.bundles')||'[]');return Array.isArray(raw)?raw:[]} catch{return []}}
export function writeBundles(items:Bundle[]){localStorage.setItem('dw.bundles',JSON.stringify(items))}
export function getActiveBundle(bundles:Bundle[]):Bundle|undefined {const now=Date.now();return [...bundles].filter(b=>+new Date(`${b.start}T00:00:00`)<=now && +new Date(`${b.expires}T23:59:59`)>=now).sort((a,b)=>b.createdAt-a.createdAt)[0]}
export async function exportSettings(bundles:Bundle[],settings:AppSettings){const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),settings,bundles},null,2)],{type:'application/json'});await download(blob,'datawatch-backup.json');}
export async function download(blob:Blob,name:string){
  if(Capacitor.isNativePlatform()){
    // Capacitor's Android WebView does not reliably download blob: URLs.
    // Write the file to app cache and open the native Android share/save sheet.
    await Filesystem.writeFile({path:name,data:await blob.text(),directory:Directory.Cache,encoding:Encoding.UTF8,recursive:true});
    const file=await Filesystem.getUri({path:name,directory:Directory.Cache});
    await Share.share({title:`DataWatch • ${name}`,url:file.uri,dialogTitle:'Save or share DataWatch export'});
    return;
  }
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
