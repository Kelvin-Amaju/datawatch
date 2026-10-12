import { useState } from 'react';
import { ArrowRight, ArrowLeft, ScanEye, ChartNoAxesCombined, BellRing } from 'lucide-react';

const slides=[
 {image:'/assets/onboarding-insights.webp',eyebrow:'KNOW YOUR NETWORK',title:<>See where your <em>data goes.</em></>,desc:'Understand your mobile and Wi-Fi consumption with clear, device-level insights.',icon:ScanEye},
 {image:'/assets/onboarding-apps.webp',eyebrow:'APP INTELLIGENCE',title:<>Catch the <em>data hungry.</em></>,desc:'Identify applications consuming the most data and compare their usage over time.',icon:ChartNoAxesCombined},
 {image:'/assets/onboarding-control.webp',eyebrow:'STAY IN CONTROL',title:<>Your data. <em>Your rules.</em></>,desc:'Set data plans, configure limits, and get alerts before usage catches you off guard.',icon:BellRing}
];
export function Intro({finish}:{finish:()=>void}) {const [index,setIndex]=useState(0);const item=slides[index];return <div className="intro-screen">
 <div className="intro-top"><span className="brand-mini"><img src="/assets/datawatch-icon.webp"/> Data<span>Watch</span></span><button className="ghost-link" onClick={finish}>Skip</button></div>
 <div className="intro-visual"><div className="intro-glow"/><img key={index} src={item.image} className="intro-art" alt="DataWatch visualization"/><div className="intro-decor">DATAWATCH // 0{index+1}</div></div>
 <div className="intro-bottom"><div className="step-label"><item.icon size={15}/> {item.eyebrow}</div><h1>{item.title}</h1><p>{item.desc}</p>
 <div className="intro-actions"><div className="dots">{slides.map((_,i)=><button key={i} type="button" aria-label={`Show onboarding step ${i+1}`} className={i===index?'active':''} onClick={()=>setIndex(i)}/>)}</div>
 <button className="primary circle-next" onClick={()=>index<2?setIndex(index+1):finish()}>{index===2?'Get started':'Next'} <ArrowRight size={19}/></button></div>
 {index>0&&<button className="intro-prev" onClick={()=>setIndex(index-1)}><ArrowLeft size={16}/> Back</button>}
 </div></div>}
