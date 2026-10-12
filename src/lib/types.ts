export interface DeviceApp { uid:number; packageName:string; name:string; mobileBytes:number; wifiBytes:number; totalBytes:number }
export interface UsageResult { start:number; end:number; mobileBytes:number; wifiBytes:number; rxBytes:number; txBytes:number; apps:DeviceApp[]; capturedAt:number; note?:string }
export interface DayRecord { date:string; mobileBytes:number; wifiBytes:number }
export interface PermissionState { usageAccess:boolean; notifications:boolean; platform:string }
export interface MonitoringState { enabled:boolean; lastCheck:number; nextScheduled:boolean }
export interface Bundle { id:string; carrier:string; name:string; sizeGb:number; price:number; start:string; expires:string; initialUsedGb:number; createdAt:number }
export interface AppSettings { onboardingDone:boolean; alertsEnabled:boolean; monthlyLimitGb:number; cycleDay:number; thresholds:number[]; anomalyAlerts:boolean; notificationEnabled:boolean; welcomeDismissed:boolean }
export const DEFAULT_SETTINGS:AppSettings={onboardingDone:false,alertsEnabled:true,monthlyLimitGb:10,cycleDay:1,thresholds:[50,75,90,100],anomalyAlerts:false,notificationEnabled:true,welcomeDismissed:false};
export type Screen='home'|'usage'|'apps'|'plans'|'settings'|'alerts'|'appdetail'|'wifi'|'history'|'notifications';
