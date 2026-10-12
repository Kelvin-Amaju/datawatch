import type { CSSProperties } from 'react';
import { ArrowUpRight, ArrowDownRight, Smartphone, Wifi } from 'lucide-react';
import { prettyBytes } from '../lib/native';
import type { DayRecord, DeviceApp } from '../lib/types';

export function UsageRing({value,total,caption='USED THIS CYCLE'}:{value:number|null;total:number|null;caption?:string}) {
  const valid=value!==null&&total!==null&&total>0;
  const pct=valid?Math.min(100,Math.max(0,value/total*100)):0;
  return <div className="ring-area"><div className="orbital one"/><div className="orbital two"/>
    <div className="ring" style={{'--pct':`${pct}%`} as CSSProperties}><div className="ring-core">
      <span className="eyebrow">{caption}</span><strong className="ring-number">{value!==null?prettyBytes(value):'—'}</strong>
      <span className="ring-sub">{total!==null?`of ${prettyBytes(total)}`:'Set up a data plan'}</span>
      {valid&&<span className="ring-remaining">{prettyBytes(Math.max(0,total-value))} left</span>}
    </div></div>
    <div className="ring-readout"><span>{valid?`${Math.round(pct)}% used`:'Waiting for data'}</span><span>{valid?`${Math.max(0,Math.round(100-pct))}% left`:'—'}</span></div>
  </div>;
}
export function MiniBars({days,mode='both'}:{days:DayRecord[];mode?:'both'|'mobile'|'wifi'}) {
 const m=Math.max(1,...days.map(x=>mode==='mobile'?x.mobileBytes:mode==='wifi'?x.wifiBytes:x.mobileBytes+x.wifiBytes));
 return <div className="chart-columns" aria-label="Daily data consumption chart">{days.length===0?<div className="chart-empty">Usage history appears here when available.</div>:days.map(d=><div className="chart-col" key={d.date} title={`${d.date}: Mobile ${prettyBytes(d.mobileBytes)} / Wi-Fi ${prettyBytes(d.wifiBytes)}`}>
   <div className="column-bars">{mode!=='wifi'&&<i className="bar-mobile" style={{height:`${Math.max(2,d.mobileBytes/m*100)}%`}}/>}{mode!=='mobile'&&<i className="bar-wifi" style={{height:`${Math.max(2,d.wifiBytes/m*100)}%`}}/>}</div><small>{new Date(`${d.date}T12:00:00`).toLocaleDateString(undefined,{weekday:'short'}).slice(0,3)}</small>
 </div>)}</div>;
}
export function MetricCard({type,value,label,onClick}:{type:'mobile'|'wifi';value:number|null;label?:string;onClick?:()=>void}) {return <button className="metric" onClick={onClick} type="button"><span className="metric-label">{type==='mobile'?<Smartphone size={16}/>:<Wifi size={17}/>} {label|| (type==='mobile'?'Mobile data':'Wi-Fi data')} <ArrowUpRight size={14} className="metric-arrow"/></span><strong>{prettyBytes(value)}</strong><span className="metric-bottom">{value===null?'Awaiting device access':'Measured on this device'} {value!==null&&(type==='mobile'?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>)}</span></button>}
export function AppBadge({name}:{name:string}) {const first=name.charAt(0).toUpperCase(); const colors=['#a9e84f','#31dba5','#e6ab4a','#8e9cec','#e287ae'];const color=colors[name.length%colors.length];return <span className="app-badge" style={{color,background:`${color}18`,borderColor:`${color}28`}}>{first}</span>}
export function AppRow({app,index,max,onClick}:{app:DeviceApp;index:number;max:number;onClick:()=>void}) {return <button className="app-row" type="button" onClick={onClick}><AppBadge name={app.name}/><div className="app-row-mid"><div className="app-row-head"><span>{app.name}</span><strong>{prettyBytes(app.totalBytes)}</strong></div><div className="thin-track"><span style={{width:`${Math.max(1,app.totalBytes/Math.max(1,max)*100)}%`}}/></div></div><span className="app-rank">{String(index+1).padStart(2,'0')}</span></button>}
