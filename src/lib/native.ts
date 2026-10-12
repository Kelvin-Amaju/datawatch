import { Capacitor, registerPlugin } from '@capacitor/core';
import type { DayRecord, MonitoringState, PermissionState, UsageResult } from './types';
interface NativeAPI {
  getPermissionStatus(): Promise<PermissionState>;
  openUsageAccessSettings(): Promise<void>;
  requestNotifications(): Promise<PermissionState>;
  getUsageStats(options:{start:number;end:number}):Promise<UsageResult>;
  getDailyTrend(options:{start:number;end:number}):Promise<{days:DayRecord[]}>;
  getSavedHistory(options:{days:number}):Promise<{days:DayRecord[]}>;
  setMonitoringConfig(options:{enabled:boolean;limitBytes:number;cycleDay:number;thresholds:number[];notificationsEnabled:boolean}):Promise<{ok:boolean}>;
  getMonitoringStatus():Promise<MonitoringState>;
  openAppSettings(options:{packageName:string}):Promise<void>;
}
export const Native = registerPlugin<NativeAPI>('DataWatchNative');
export const android = Capacitor.getPlatform()==='android';
export const gb=(value:number)=>value*1024*1024*1024;
export function prettyBytes(bytes:number|null|undefined):string {
  if(bytes==null || !Number.isFinite(bytes)) return '—';
  if(bytes===0) return '0 MB';
  if(bytes<1048576) return `${Math.max(0.01,bytes/1024).toFixed(bytes<1024?2:0)} KB`;
  if(bytes<1073741824) return `${(bytes/1048576).toFixed(bytes<10485760?1:0)} MB`;
  return `${(bytes/1073741824).toFixed(2)} GB`;
}
export function rangeFor(period:'today'|'week'|'month'|'yesterday'):{start:number;end:number}{
  const now=new Date(); const end=now.getTime(); const start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  if(period==='yesterday'){start.setDate(start.getDate()-1);return {start:start.getTime(),end:new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime()};}
  if(period==='week') start.setDate(start.getDate()-6);
  if(period==='month') start.setDate(1);
  return {start:start.getTime(),end};
}
export function cycleStart(day:number):number {const n=new Date();let s=new Date(n.getFullYear(),n.getMonth(),Math.min(day,28));if(+s>+n)s=new Date(n.getFullYear(),n.getMonth()-1,Math.min(day,28));return +s;}
export function friendlyDate(date:string):string {if(!date)return '—'; const d=new Date(`${date}T12:00:00`); return Number.isNaN(+d)?'—':d.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});}
export const naira=(amount:number)=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(amount||0);
