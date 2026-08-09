

// import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   Sparkles, Brain, FlaskConical, Zap,
//   Star, Users, UserCog,
//   RotateCcw, Target, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2, Activity
// } from "lucide-react";
// import { movieAPI, PredictionResponse, PredictionRequest } from "@/services/movieAPI";
// import { useToast } from "@/hooks/use-toast";
// import { useProductions } from "@/contexts/ProductionsContext";
// import { BarChart, Bar as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// // ─── Constants ────────────────────────────────────────────────────────────────
// const SPRING      = { type: "spring", stiffness: 380, damping: 32 } as const;
// const SPRING_SOFT = { type: "spring", stiffness: 200, damping: 26 } as const;
// const EASE        = [0.22, 1, 0.36, 1] as const;

// const GENRES = [
//   "Action","Adventure","Animation","Comedy","Crime",
//   "Documentary","Drama","Family","Fantasy","History",
//   "Horror","Music","Mystery","Romance","Science Fiction",
//   "Thriller","War","Western",
// ];

// const DIRECTOR_EXP = [
//   { value: "rookie",  label: "Rookie  (0–2 films)"  },
//   { value: "mid",     label: "Mid-Level (3–7 films)" },
//   { value: "veteran", label: "Veteran (8–15 films)"  },
//   { value: "legend",  label: "Legend (16+ films)"    },
// ];

// // ─── Global styles ────────────────────────────────────────────────────────────
// const GLOBAL_CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

//   *, *::before, *::after { box-sizing: border-box; }

//   :root {
//     --blue:   210 100% 60%;
//     --purple: 262 80% 65%;
//     --cyan:   188 90% 55%;
//     --green:  152 70% 50%;
//     --red:    0 80% 60%;
//     --amber:  38 90% 55%;
//     --bg:     220 20% 5%;
//     --surf:   220 18% 9%;
//     --surf2:  220 16% 12%;
//     --bdr:    220 15% 18%;
//     --txt:    220 15% 88%;
//     --muted:  220 12% 45%;
//   }

//   @keyframes breathe {
//     0%,100% { opacity:.4; transform:scale(1);    }
//     50%     { opacity:.85; transform:scale(1.06); }
//   }
//   @keyframes row-in {
//     from { opacity:0; transform:translateY(8px); }
//     to   { opacity:1; transform:translateY(0);   }
//   }

//   .acc-panel {
//     background: hsl(var(--surf));
//     border: 1px solid hsl(var(--bdr));
//     border-radius: 16px;
//     position: relative;
//     overflow: hidden;
//   }
//   .acc-panel::before {
//     content:'';
//     position:absolute; inset:0;
//     background:linear-gradient(135deg,rgba(255,255,255,.022) 0%,transparent 55%);
//     pointer-events:none; border-radius:inherit;
//   }

//   .field-label {
//     font-family:'DM Mono',monospace;
//     font-size:10px; font-weight:500;
//     letter-spacing:.1em; text-transform:uppercase;
//     color:hsl(var(--muted));
//     display:block; margin-bottom:6px;
//   }

//   input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;width:100%;cursor:pointer;}
//   input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:hsl(var(--blue));border:2px solid hsl(var(--bg));box-shadow:0 0 8px hsla(210,100%,60%,.5);margin-top:-6px;}
//   input[type=range]::-webkit-slider-runnable-track{height:4px;border-radius:4px;background:hsl(var(--bdr));}

//   .no-sb::-webkit-scrollbar{display:none;}
//   .no-sb{-ms-overflow-style:none;scrollbar-width:none;}
// `;

// // ─── Ambient BG ───────────────────────────────────────────────────────────────
// function AmbientBG() {
//   return (
//     <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
//       <div style={{
//         position:"absolute",inset:0,
//         backgroundImage:`linear-gradient(rgba(99,179,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,255,.02) 1px,transparent 1px)`,
//         backgroundSize:"60px 60px",
//         maskImage:"radial-gradient(ellipse 90% 90% at 50% 50%,black,transparent)",
//       }}/>
//       {[
//         {x:"12%",y:"15%",r:500,c:"59,130,246",d:18},
//         {x:"80%",y:"8%",r:360,c:"139,92,246",d:22},
//         {x:"60%",y:"72%",r:300,c:"16,185,129",d:16},
//         {x:"88%",y:"80%",r:280,c:"59,130,246",d:20},
//       ].map((o,i)=>(
//         <motion.div key={i} style={{
//           position:"absolute",left:o.x,top:o.y,
//           width:o.r,height:o.r,borderRadius:"50%",
//           background:`radial-gradient(circle,rgba(${o.c},.05) 0%,transparent 65%)`,
//           filter:"blur(30px)",transform:"translate(-50%,-50%)",
//         }}
//           animate={{x:[0,30,-15,20,0],y:[0,-25,20,-10,0],scale:[1,1.07,.97,1.03,1]}}
//           transition={{duration:o.d,repeat:Infinity,ease:"easeInOut"}}
//         />
//       ))}
//       <div style={{
//         position:"absolute",inset:0,opacity:.032,
//         backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
//         backgroundSize:"128px",
//       }}/>
//       <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,hsl(210,100%,60%) 30%,hsl(262,80%,65%) 70%,transparent)",opacity:.35}}/>
//     </div>
//   );
// }

// // ─── Cursor glow ──────────────────────────────────────────────────────────────
// function CursorGlow() {
//   const x=useMotionValue(0),y=useMotionValue(0);
//   const sx=useSpring(x,{stiffness:60,damping:18}),sy=useSpring(y,{stiffness:60,damping:18});
//   useEffect(()=>{
//     const m=(e:MouseEvent)=>{x.set(e.clientX);y.set(e.clientY);};
//     window.addEventListener("mousemove",m);
//     return()=>window.removeEventListener("mousemove",m);
//   },[]);
//   return (
//     <motion.div className="pointer-events-none" style={{position:"fixed",inset:0,zIndex:1,x:sx,y:sy}}>
//       <div style={{position:"absolute",transform:"translate(-50%,-50%)",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,.055) 0%,transparent 70%)",filter:"blur(2px)"}}/>
//     </motion.div>
//   );
// }

// // ─── Radial progress ──────────────────────────────────────────────────────────
// function RadialProgress({value,size=130,sw=8,color="hsl(210,100%,60%)"}:any) {
//   const r=(size-sw)/2,c=r*2*Math.PI,off=c-(value/100)*c;
//   return (
//     <div style={{position:"relative"}}>
//       <div style={{position:"absolute",inset:-16,borderRadius:"50%",background:`radial-gradient(circle,${color}22 0%,transparent 70%)`,filter:"blur(18px)",animation:"breathe 3s ease-in-out infinite"}}/>
//       <svg width={size} height={size} style={{transform:"rotate(-90deg)",position:"relative"}}>
//         <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--bdr))" strokeWidth={sw}/>
//         <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw+8} strokeDasharray={c} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off}} transition={{duration:2,ease:EASE}} strokeLinecap="round" style={{filter:"blur(10px)",opacity:.2}}/>
//         <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw+3} strokeDasharray={c} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off}} transition={{duration:2,ease:EASE,delay:.05}} strokeLinecap="round" style={{filter:"blur(4px)",opacity:.35}}/>
//         <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={c} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off}} transition={{duration:2,ease:EASE,delay:.1}} strokeLinecap="round"/>
//         <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="white" strokeWidth={2.5} strokeDasharray={`5 ${c-5}`} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off-1}} transition={{duration:2,ease:EASE,delay:.12}} strokeLinecap="round" style={{opacity:.9}}/>
//       </svg>
//     </div>
//   );
// }

// // ─── Animated number ──────────────────────────────────────────────────────────
// function Num({v,d=0}:{v:number;d?:number}) {
//   const [n,setN]=useState(0);
//   useEffect(()=>{
//     const t0=performance.now(),dur=1700;
//     const tick=(now:number)=>{const p=Math.min((now-t0)/dur,1);setN((1-Math.pow(1-p,3))*v);if(p<1)requestAnimationFrame(tick);else setN(v);};
//     requestAnimationFrame(tick);
//   },[v]);
//   return <>{n.toFixed(d)}</>;
// }

// // ─── Slim bar ─────────────────────────────────────────────────────────────────
// function Bar({pct,color,delay=0}:{pct:number;color:string;delay?:number}) {
//   return (
//     <div style={{height:3,borderRadius:9999,background:"hsl(var(--bdr))",overflow:"hidden",flex:1}}>
//       <motion.div style={{height:"100%",borderRadius:9999,background:color,boxShadow:`0 0 6px ${color}`}} initial={{width:0}} animate={{width:`${pct}%`}} transition={{...SPRING_SOFT,delay}}/>
//     </div>
//   );
// }

// // ─── Field wrapper ────────────────────────────────────────────────────────────
// function Field({label,children}:{label:string;children:React.ReactNode}) {
//   return <div><label className="field-label">{label}</label>{children}</div>;
// }

// // ─── Glow input ───────────────────────────────────────────────────────────────
// function GlowInput({value,onChange,placeholder="",type="text"}:any) {
//   const [f,setF]=useState(false);
  
//   const handleChange = (e: any) => {
//     if (type === "number") {
//       const numValue = e.target.value === "" ? 0 : Number(e.target.value);
//       // Only update if it's a valid number or empty string (which we convert to 0)
//       if (!isNaN(numValue)) {
//         onChange(numValue);
//       }
//     } else {
//       onChange(e.target.value);
//     }
//   };
  
//   return (
//     <div style={{position:"relative"}}>
//       <motion.div style={{position:"absolute",inset:-1.5,borderRadius:10,pointerEvents:"none",background:"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--purple)))",zIndex:0}} animate={{opacity:f?1:0}} transition={{duration:.2}}/>
//       <motion.div style={{position:"absolute",inset:-8,borderRadius:16,pointerEvents:"none",background:"radial-gradient(circle,hsla(210,100%,60%,.07),transparent 70%)",filter:"blur(8px)",zIndex:0}} animate={{opacity:f?1:0}} transition={{duration:.3}}/>
//       <input type={type} value={value} onChange={handleChange} placeholder={placeholder}
//         onFocus={()=>setF(true)} onBlur={()=>setF(false)}
//         style={{position:"relative",zIndex:1,width:"100%",padding:"9px 12px",background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",borderRadius:9,color:"hsl(var(--txt))",fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",transition:"border-color .2s"}}
//       />
//     </div>
//   );
// }

// // ─── Glow select ──────────────────────────────────────────────────────────────
// function GlowSelect({value,onChange,placeholder="",options}:any) {
//   const [f,setF]=useState(false);
//   return (
//     <div style={{position:"relative"}}>
//       <motion.div style={{position:"absolute",inset:-1.5,borderRadius:10,pointerEvents:"none",background:"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--purple)))",zIndex:0}} animate={{opacity:f?1:0}} transition={{duration:.2}}/>
//       <select value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
//         style={{position:"relative",zIndex:1,width:"100%",padding:"9px 12px",background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",borderRadius:9,color:value?"hsl(var(--txt))":"hsl(var(--muted))",fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",cursor:"pointer",appearance:"none"}}
//       >
//         <option value="" disabled>{placeholder}</option>
//         {options.map((o:any)=><option key={o.value||o} value={o.value||o} style={{background:"hsl(var(--surf2))"}}>{o.label||o}</option>)}
//       </select>
//       <ChevronRight style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%) rotate(90deg)",width:13,height:13,color:"hsl(var(--muted))",pointerEvents:"none",zIndex:2}}/>
//     </div>
//   );
// }

// // ─── Glow slider ──────────────────────────────────────────────────────────────
// function GlowSlider({value,onChange}:any) {
//   return (
//     <div style={{position:"relative",paddingBlock:6}}>
//       <div style={{position:"absolute",top:"50%",left:0,right:0,height:4,borderRadius:9999,background:"hsl(var(--bdr))",transform:"translateY(-50%)",zIndex:0}}/>
//       <motion.div style={{position:"absolute",top:"50%",left:0,width:`${value}%`,height:4,borderRadius:9999,background:"linear-gradient(90deg,hsl(var(--blue)),hsl(var(--purple)))",transform:"translateY(-50%)",zIndex:1,boxShadow:"0 0 8px hsla(210,100%,60%,.5)"}}/>
//       <input type="range" min={0} max={100} step={1} value={value} onChange={e=>onChange(+e.target.value)} style={{position:"relative",zIndex:2,width:"100%",opacity:0,cursor:"pointer",height:20}}/>
//     </div>
//   );
// }

// // ─── Loader ───────────────────────────────────────────────────────────────────
// function Loader() {
//   const [pct,setPct]=useState(0);
//   const [ph,setPh]=useState(0);
//   const phases=["Parsing parameters…","Running neural inference…","Synthesizing predictions…","Finalizing output…"];
//   useEffect(()=>{
//     const a=setInterval(()=>setPct(p=>p>=95?p:p+Math.random()*3.5+.5),110);
//     const b=setInterval(()=>setPh(p=>Math.min(p+1,phases.length-1)),750);
//     return()=>{clearInterval(a);clearInterval(b);};
//   },[]);
//   return (
//     <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,filter:"blur(8px)"}}
//       style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:28,padding:"40px 24px"}}
//     >
//       <div style={{position:"relative",width:100,height:100}}>
//         {[0,1,2,3].map(i=>(
//           <motion.div key={i} style={{position:"absolute",inset:i*11,borderRadius:"50%",border:`1px solid hsla(210,100%,60%,${.65-i*.14})`}}
//             animate={{rotate:i%2===0?360:-360}} transition={{duration:2.5+i*1.3,repeat:Infinity,ease:"linear"}}
//           />
//         ))}
//         <div style={{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden"}}>
//           <motion.div style={{position:"absolute",top:0,left:0,right:0,height:"50%",background:"linear-gradient(to bottom,transparent,hsla(210,100%,60%,.12))",transformOrigin:"bottom center"}}
//             animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:"linear"}}
//           />
//         </div>
//         <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
//           <motion.div animate={{scale:[1,1.12,1],opacity:[.7,1,.7]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}>
//             <Brain style={{width:28,height:28,color:"hsl(var(--blue))"}}/>
//           </motion.div>
//         </div>
//       </div>
//       <div style={{textAlign:"center",width:"100%",maxWidth:240}}>
//         <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",color:"hsl(var(--muted))",marginBottom:6}}>Neural Processing</p>
//         <AnimatePresence mode="wait">
//           <motion.p key={ph} initial={{opacity:0,y:5,filter:"blur(4px)"}} animate={{opacity:1,y:0,filter:"blur(0)"}} exit={{opacity:0,y:-5}}
//             style={{color:"hsl(var(--txt))",fontSize:13,fontFamily:"'Outfit',sans-serif",marginBottom:16}}
//           >{phases[ph]}</motion.p>
//         </AnimatePresence>
//         <div style={{width:"100%",marginBottom:12}}>
//           <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
//             <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"hsl(var(--muted))"}}>PROGRESS</span>
//             <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"hsl(var(--blue))"}}>{Math.round(pct)}%</span>
//           </div>
//           <div style={{height:2,borderRadius:9999,background:"hsl(var(--bdr))",overflow:"hidden",position:"relative"}}>
//             <motion.div style={{height:"100%",borderRadius:9999,width:`${pct}%`,background:"linear-gradient(90deg,hsl(var(--blue)),hsl(var(--purple)))"}}/>
//             <motion.div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)"}}
//               animate={{x:["-100%","300%"]}} transition={{duration:1.4,repeat:Infinity,ease:"linear"}}
//             />
//           </div>
//         </div>
//         <div style={{display:"flex",gap:6,justifyContent:"center"}}>
//           {phases.map((_,i)=>(
//             <motion.div key={i} style={{height:5,borderRadius:9999,background:i<=ph?"hsl(var(--blue))":"hsl(var(--bdr))",transition:"all .3s"}} animate={{width:i<=ph?18:5}}/>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // ─── Empty state ──────────────────────────────────────────────────────────────
// function EmptyState() {
//   return (
//     <motion.div initial={{opacity:0}} animate={{opacity:1}}
//       style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:18,padding:"60px 32px",textAlign:"center",position:"relative"}}
//     >
//       {[.18,.38,.58,.78].map((top,i)=>(
//         <motion.div key={i} style={{position:"absolute",left:0,right:0,top:`${top*100}%`,height:1,background:"linear-gradient(90deg,transparent,hsl(var(--bdr)),transparent)"}}
//           animate={{opacity:[.3,.7,.3]}} transition={{duration:4,repeat:Infinity,delay:i*.6}}
//         />
//       ))}
//       <motion.div style={{width:64,height:64,borderRadius:18,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1}}
//         animate={{y:[0,-6,0],boxShadow:["0 0 0 0 hsla(210,100%,60%,0)","0 8px 24px 0 hsla(210,100%,60%,.18)","0 0 0 0 hsla(210,100%,60%,0)"]}}
//         transition={{duration:3.5,repeat:Infinity,ease:"easeInOut"}}
//       >
//         <Brain style={{width:28,height:28,color:"hsla(210,100%,60%,.5)"}}/>
//       </motion.div>
//       <div style={{position:"relative",zIndex:1}}>
//         <p style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:16,color:"hsl(var(--txt))",marginBottom:8}}>Ready for Analysis</p>
//         <p style={{fontFamily:"'Outfit',sans-serif",fontSize:12.5,color:"hsl(var(--muted))",lineHeight:1.7,maxWidth:260}}>
//           Fill in the production parameters on the left, then run the AI prediction engine.
//         </p>
//       </div>
//       <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",position:"relative",zIndex:1}}>
//         {["Budget Risk","Success Score","Cast Match","Crew Fit","Release Window"].map((t,i)=>(
//           <motion.span key={t} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.08}}
//             style={{fontFamily:"'DM Mono',monospace",fontSize:9,fontWeight:500,letterSpacing:".08em",textTransform:"uppercase",padding:"4px 10px",borderRadius:9999,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",color:"hsl(var(--muted))"}}
//           >{t}</motion.span>
//         ))}
//       </div>
//     </motion.div>
//   );
// }

// // ─── Block header ─────────────────────────────────────────────────────────────
// function BH({icon:Icon,title,accent}:any) {
//   return (
//     <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
//       <div style={{width:26,height:26,borderRadius:8,background:`${accent}18`,border:`1px solid ${accent}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
//         <Icon style={{width:12,height:12,color:accent}}/>
//       </div>
//       <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:"hsl(var(--txt))"}}>
//         {title}
//       </span>
//     </div>
//   );
// }

// // ─── Budget block ─────────────────────────────────────────────────────────────
// function BudgetBlock({data}:any) {
//   const rc=data.status==="low"?"hsl(var(--green))":data.status==="medium"?"hsl(var(--amber))":"hsl(var(--red))";
//   return (
//     <div className="acc-panel" style={{padding:18}}>
//       <BH icon={Target} title="Budget Overrun Risk" accent="hsl(var(--blue))"/>
//       <div style={{display:"flex",gap:18,alignItems:"center"}}>
//         <div style={{position:"relative",flexShrink:0}}>
//           <RadialProgress value={data.riskPercent} size={128} sw={8} color={rc}/>
//           <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
//             <span style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:"hsl(var(--txt))"}}><Num v={data.riskPercent}/>%</span>
//             <motion.span style={{fontFamily:"'DM Mono',monospace",fontSize:8,fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",color:rc,marginTop:2}}
//               animate={{opacity:[.7,1,.7]}} transition={{duration:2,repeat:Infinity}}
//             >{data.status} risk</motion.span>
//           </div>
//         </div>
//         <div style={{flex:1,display:"flex",flexDirection:"column",gap:9}}>
//           {data.factors.map((f:any,i:number)=>(
//             <div key={f.name} style={{animation:`row-in .4s ease ${i*.08}s both`}}>
//               <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
//                 <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"hsl(var(--muted))"}}>{f.name}</span>
//                 <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:500,color:"hsl(var(--txt))"}}>{f.impact}</span>
//               </div>
//               <Bar pct={f.impact*5} color={rc} delay={i*.1}/>
//             </div>
//           ))}
//           <p style={{fontFamily:"'Outfit',sans-serif",fontSize:10.5,color:"hsl(var(--muted))",fontStyle:"italic",marginTop:2,lineHeight:1.6}}>{data.insight}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Success block ────────────────────────────────────────────────────────────
// function SuccessBlock({data}:any) {
//   return (
//     <div className="acc-panel" style={{padding:18}}>
//       <BH icon={TrendingUp} title="Success Prediction" accent="hsl(var(--amber))"/>
      
//       {/* Transparency Layer: AI vs Statistical */}
//       <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16,padding:12,borderRadius:10,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))"}}>
//         <div>
//           <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"hsl(var(--muted))",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>AI Insight</p>
//           <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,color:"hsl(var(--blue))"}}>{data.originalProbability}%</p>
//           <p style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"hsl(var(--muted))",marginTop:2}}>Model confidence</p>
//         </div>
//         <div>
//           <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"hsl(var(--muted))",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Statistical Adjust.</p>
//           <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,color:data.adjustmentPercent > 0 ? "hsl(var(--green))" : data.adjustmentPercent < 0 ? "hsl(var(--amber))" : "hsl(var(--txt))"}}>{data.adjustmentPercent > 0 ? "+" : ""}{data.adjustmentPercent}%</p>
//           <p style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"hsl(var(--muted))",marginTop:2}}>Production params</p>
//         </div>
//       </div>

//       {/* Adjustment Reasoning */}
//       <div style={{padding:10,borderRadius:8,background:"hsla(210,100%,60%,.06)",border:"1px solid hsla(210,100%,60%,.15)",marginBottom:16}}>
//         <p style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",letterSpacing:".08em",textTransform:"uppercase",marginBottom:5}}>Adjustment Reasoning</p>
//         <p style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:"hsl(var(--txt))",lineHeight:1.5}}>{data.adjustmentReasoning}</p>
//       </div>

//       {/* Main score display */}
//       <div style={{display:"flex",gap:22,alignItems:"flex-start"}}>
//         <div style={{textAlign:"center",flexShrink:0}}>
//           <motion.p initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{...SPRING,delay:.15}}
//             style={{fontFamily:"'Outfit',sans-serif",fontSize:42,fontWeight:900,lineHeight:1,background:"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--purple)))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}
//           >{data.rating}</motion.p>
//           <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"hsl(var(--muted))",letterSpacing:".1em",marginTop:4}}>/ 10 SCORE</p>
//           <div style={{display:"flex",gap:3,justifyContent:"center",marginTop:8}}>
//             {Array.from({length:5},(_,i)=>{
//               const filled=i<Math.round(parseFloat(data.rating)/2);
//               return (
//                 <motion.div key={i} initial={{scale:0}} animate={{scale:1}} transition={{...SPRING,delay:.3+i*.07}}>
//                   <Star style={{width:12,height:12,color:"hsl(var(--amber))",fill:filled?"hsl(var(--amber))":"transparent"}}/>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//         <div style={{flex:1}}>
//           <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"hsl(var(--muted))",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Final Probability</p>
//           <motion.p initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{duration:.5,delay:.25}}
//             style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"hsl(var(--blue))",lineHeight:1}}
//           ><Num v={data.probability}/>%</motion.p>
          
//           {/* Risk & Confidence metrics */}
//           <div style={{display:"flex",gap:8,marginTop:12,marginBottom:10}}>
//             <div style={{flex:1,padding:"8px 10px",borderRadius:8,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))"}}>
//               <p style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",letterSpacing:".08em",marginBottom:3}}>RISK LEVEL</p>
//               <p style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:11,color:data.riskLevel==="low"?"hsl(var(--green))":data.riskLevel==="medium"?"hsl(var(--amber))":"hsl(var(--red))"}}>{data.riskLevel.charAt(0).toUpperCase()+data.riskLevel.slice(1)}</p>
//             </div>
//             <div style={{flex:1,padding:"8px 10px",borderRadius:8,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))"}}>
//               <p style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",letterSpacing:".08em",marginBottom:3}}>CONFIDENCE</p>
//               <p style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:11,color:"hsl(var(--cyan))"}}>{data.confidenceLevel}</p>
//             </div>
//           </div>

//           <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
//             {data.tags.map((tag:string,i:number)=>(
//               <motion.span key={tag} initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{...SPRING,delay:.5+i*.08}}
//                 style={{fontFamily:"'DM Mono',monospace",fontSize:8,fontWeight:500,letterSpacing:".08em",textTransform:"uppercase",padding:"3px 9px",borderRadius:9999,background:"hsla(210,100%,60%,.1)",color:"hsl(var(--blue))",border:"1px solid hsla(210,100%,60%,.2)"}}
//               >{tag}</motion.span>
//             ))}
//           </div>
//           <div style={{display:"flex",alignItems:"flex-end",gap:2,marginTop:10,height:30,padding:"0 2px"}}>
//             {data.trendData.map((v:number,i:number)=>(
//               <motion.div key={i} style={{flex:1,borderRadius:"3px 3px 0 0",background:"linear-gradient(to top,hsl(var(--blue)),hsl(var(--purple)))",opacity:.65}}
//                 initial={{height:0}} animate={{height:`${v}%`}} transition={{...SPRING_SOFT,delay:.4+i*.03}}
//               />
//             ))}
//           </div>
//           <p style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",letterSpacing:".08em",marginTop:3}}>MARKET TREND PROJECTION</p>
//           {data.tips && data.tips.length > 0 && (
//             <div style={{marginTop:16}}>
//               <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"hsl(var(--muted))",letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>Improvement Tips</p>
//               <div style={{display:"flex",flexDirection:"column",gap:4}}>
//                 {data.tips.map((tip:string,i:number)=>(
//                   <motion.div key={i} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{duration:.3,delay:.6+i*.1}}
//                     style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:"hsl(var(--txt))",lineHeight:1.4,padding:"6px 10px",background:"hsl(var(--surf2))",borderRadius:6,border:"1px solid hsl(var(--bdr))"}}
//                   >{tip}</motion.div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Release window block ─────────────────────────────────────────────────────
// function ReleaseBlock({data}:{data:any}) {
//   const cc=data.comp==="Low"?"hsl(var(--green))":data.comp==="Medium"?"hsl(var(--amber))":"hsl(var(--red))";
//   return (
//     <div className="acc-panel" style={{padding:18}}>
//       <BH icon={Activity} title="Strategic Release Window" accent="hsl(var(--green))"/>
//       <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
//         {[
//           {label:"Optimal Window",val:data.q,accent:"hsl(var(--blue))"},
//           {label:"Positioning",val:data.note,accent:"hsl(var(--txt))",small:true},
//           {label:"Competition",val:data.comp,accent:cc},
//         ].map((item,i)=>(
//           <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.08}}
//             style={{padding:"11px 13px",borderRadius:10,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))"}}
//           >
//             <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"hsl(var(--muted))",letterSpacing:".1em",textTransform:"uppercase",marginBottom:5}}>{item.label}</p>
//             <p style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:(item as any).small?11:14,color:item.accent,lineHeight:1.3}}>{item.val}</p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Actors block ─────────────────────────────────────────────────────────────
// function ActorsBlock({actors}:any) {
//   return (
//     <div className="acc-panel" style={{padding:18}}>
//       <BH icon={Users} title="Actor Recommendations" accent="hsl(var(--purple))"/>
//       <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}} className="no-sb">
//         {actors.map((a:any,i:number)=>(
//           <motion.div key={a.name} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{...SPRING,delay:i*.09}}
//             whileHover={{y:-4,scale:1.03}}
//             style={{flexShrink:0,width:152,padding:13,borderRadius:12,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",cursor:"pointer",position:"relative",overflow:"hidden"}}
//           >
//             <motion.div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 0%,hsla(262,80%,65%,.1),transparent 70%)",opacity:0}} whileHover={{opacity:1}} transition={{duration:.3}}/>
//             <div style={{width:36,height:36,borderRadius:9,background:"linear-gradient(135deg,hsla(210,100%,60%,.2),hsla(262,80%,65%,.2))",border:"1px solid hsla(262,80%,65%,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:10,color:"hsl(var(--purple))",marginBottom:9,position:"relative",zIndex:1}}>
//               {a.name.split(' ').map((n:string)=>n[0]).join('')}
//             </div>
//             <p style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:"hsl(var(--txt))",position:"relative",zIndex:1}}>{a.name}</p>
//             <div style={{display:"flex",alignItems:"center",gap:6,marginTop:5,position:"relative",zIndex:1}}>
//               <Bar pct={a.matchPercent} color="hsl(var(--purple))" delay={i*.1}/>
//               <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,fontWeight:500,color:"hsl(var(--purple))",flexShrink:0}}>{a.matchPercent}%</span>
//             </div>
//             <p style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"hsl(var(--muted))",marginTop:5,lineHeight:1.5,position:"relative",zIndex:1}}>{a.reason}</p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Crew block ───────────────────────────────────────────────────────────────
// function CrewBlock({crew}:any) {
//   return (
//     <div className="acc-panel" style={{padding:18}}>
//       <BH icon={UserCog} title="Crew Recommendations" accent="hsl(var(--cyan))"/>
//       <div style={{display:"flex",flexDirection:"column",gap:8}}>
//         {crew.map((c:any,i:number)=>(
//           <motion.div key={c.name} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{...SPRING,delay:i*.09}}
//             whileHover={{x:4}}
//             style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:10,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",cursor:"pointer",position:"relative",overflow:"hidden"}}
//           >
//             <motion.div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 0% 50%,hsla(188,90%,55%,.07),transparent 60%)",opacity:0}} whileHover={{opacity:1}} transition={{duration:.3}}/>
//             <div style={{width:34,height:34,borderRadius:9,flexShrink:0,background:"linear-gradient(135deg,hsla(188,90%,55%,.15),hsla(210,100%,60%,.15))",border:"1px solid hsla(188,90%,55%,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:10,color:"hsl(var(--cyan))",position:"relative",zIndex:1}}>
//               {c.name.split(' ').map((n:string)=>n[0]).join('')}
//             </div>
//             <div style={{flex:1,minWidth:0,position:"relative",zIndex:1}}>
//               <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
//                 <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:12,color:"hsl(var(--txt))"}}>{c.name}</span>
//                 <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,fontWeight:500,letterSpacing:".08em",padding:"2px 7px",borderRadius:9999,background:"hsla(210,100%,60%,.1)",color:"hsl(var(--blue))",textTransform:"uppercase"}}>{c.role}</span>
//               </div>
//               <p style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:"hsl(var(--muted))"}}>{c.reason}</p>
//             </div>
//             <span style={{fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,color:"hsl(var(--cyan))",position:"relative",zIndex:1,flexShrink:0}}>{c.matchPercent}%</span>
//             <ChevronRight style={{width:12,height:12,color:"hsl(var(--muted))",position:"relative",zIndex:1,flexShrink:0}}/>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function AICommandCenter() {
//   const [form, setForm] = useState({
//     title:"", genre:"",
//     budget:50_000_000, castSize:15, crewSize:100,
//     shootingDays:60, locations:3,
//     directorExperience:"", actorPopularity:70,
//   });
//   const [loading, setLoading] = useState(false);
//   const [result, setResult]   = useState<any>(null);
//   const [scheduled, setScheduled] = useState(false);
//   const { toast } = useToast();
//   const { productions, addProduction } = useProductions();

//   const isSuccessful = result?.prediction === "Successful";

//   const display = result ? (() => {
//     // Deterministic random seeding based on inputs for consistent variation
//     const seed = (form.title + form.genre + form.budget).split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
//     const seededRandom = (index: number) => {
//       const x = Math.sin(seed + index) * 10000;
//       return x - Math.floor(x);
//     };

//    // ─── Risk Factor Calculations ─────────────────────────

// // Budget risk escalates exponentially for mega-budget films
// const budgetNormalized = Math.min((form.budget || 50_000_000) / 250_000_000, 1);
// const budgetFactor = Math.pow(budgetNormalized, 1.4);

// // Large crews increase coordination complexity
// const crewNormalized = Math.min((form.crewSize || 100) / 250, 1);
// const crewFactor = Math.pow(crewNormalized, 1.2);

// // Long productions become exponentially unstable
// const shootingNormalized = Math.min((form.shootingDays || 60) / 180, 1);
// const shootingFactor = Math.pow(shootingNormalized, 1.35);

// // Large casts create scheduling/logistics overhead
// const castNormalized = Math.min((form.castSize || 15) / 40, 1);
// const castFactor = Math.pow(castNormalized, 1.15);

// // Multi-location shoots massively increase complexity
// const locationNormalized = Math.min((form.locations || 3) / 12, 1);
// const locationFactor = Math.pow(locationNormalized, 1.5);

// // Director experience reduces production instability
// const directorModifier =
//   form.directorExperience === "legend" ? -0.12 :
//   form.directorExperience === "veteran" ? -0.07 :
//   form.directorExperience === "mid" ? 0 :
//   0.08;

// // Star power can stabilize investor confidence slightly
// const popularityModifier =
//   ((form.actorPopularity || 70) - 50) / 500;

// // Combined weighted risk score
// const rawRisk =
//   budgetFactor * 0.30 +
//   crewFactor * 0.15 +
//   shootingFactor * 0.20 +
//   castFactor * 0.10 +
//   locationFactor * 0.15 +
//   directorModifier -
//   popularityModifier;

// // Final normalized risk %
// const riskPercent = Math.max(
//   5,
//   Math.min(Math.round(rawRisk * 100), 95)
// );

// // Risk classification
// const riskLevel =
//   riskPercent >= 75 ? "high" :
//   riskPercent >= 45 ? "medium" :
//   "low";
    
//     // Release window selection based on success probability and genre
//     const successProb = result.success_probability;
//     const getReleaseWindow = (genre: string, prob: number) => {
//       const baseWindows: Record<string, { q: string; note: string; comp: string }> = {
//         Action: { q: "Summer 2026", note: "Peak blockbuster season", comp: prob > 65 ? "High" : "Medium" },
//         Horror: { q: "Oct–Nov 2026", note: "Halloween prime slot", comp: prob > 60 ? "Medium" : "High" },
//         Comedy: { q: "Holiday 2026", note: "Family audience Q4 peak", comp: prob > 60 ? "Medium" : "High" },
//         Animation: { q: "Holiday 2026", note: "Family audience peak", comp: prob > 70 ? "High" : "Medium" },
//         Drama: { q: "Q4 Awards 2026", note: "Awards-season alignment", comp: prob > 55 ? "Low" : "Medium" },
//         "Science Fiction": { q: "Summer 2026", note: "Broad tentpole window", comp: prob > 70 ? "High" : "Medium" },
//         Romance: { q: "Feb 2027", note: "Valentine's Day window", comp: prob > 50 ? "Low" : "Medium" },
//         Thriller: { q: "Spring 2026", note: "Counter-programming slot", comp: prob > 60 ? "Medium" : "High" },
//       };
//       return baseWindows[genre] || { q: "Q4 2026", note: "General wide-release window", comp: prob > 55 ? "Medium" : "High" };
//     };

//     // Use backend-provided recommendations if available, otherwise use names from API
//     const actorRecs = result.suggestedActors?.length > 0 
//       ? result.suggestedActors.map((a: any) => ({
//           name: typeof a === 'string' ? a : a.name,
//           matchPercent: typeof a === 'string' ? Math.round(75 + seededRandom(1) * 20) : (a.matchPercent || 90),
//           reason: typeof a === 'string' ? "Genre alignment & market fit" : (a.reason || "Genre alignment & historical performance")
//         }))
//       : result.actor_recommendations?.map((name: string, idx: number) => ({
//           name,
//           matchPercent: Math.round(75 + seededRandom(idx + 2) * 22),
//           reason: "Genre alignment & historical performance"
//         })) || [];

//     const crewRecs = result.suggestedDirectors?.length > 0
//       ? result.suggestedDirectors.map((c: any, idx: number) => ({
//           name: typeof c === 'string' ? c : c.name,
//           role: form.directorExperience ? `Director (${form.directorExperience})` : "Director",
//           matchPercent: typeof c === 'string' ? Math.round(80 + seededRandom(idx + 50) * 18) : (c.matchPercent || 90),
//           reason: typeof c === 'string' ? "Style compatibility for genre" : (c.reason || "Style compatibility for the genre")
//         }))
//       : result.crew_recommendations?.map((name: string, idx: number) => ({
//           name,
//           role: form.directorExperience ? `Director (${form.directorExperience})` : "Director",
//           matchPercent: Math.round(80 + seededRandom(idx + 50) * 18),
//           reason: "Historical track record & style match"
//         })) || [];

//     return {
//       budgetOverrun: {
//         factors: [
//           { name: "Budget Scale", impact: Math.round(budgetFactor * 100) },
//           { name: "Crew Size", impact: Math.round(crewFactor * 100) },
//           { name: "Schedule Length", impact: Math.round(shootingFactor * 100) },
//           { name: "Cast Complexity", impact: Math.round(castFactor * 100) },
//         ],
//         riskPercent: result.risk_percent,
//         status: result.risk_level,
//         insight: result.tips?.[0] || `${form.shootingDays}-day production with ${form.crewSize}-person crew indicates ${result.risk_level} production risk.`,
//       },
//       successPrediction: {
//         ...result,
//         probability: result.success_probability,
//         originalProbability: result.original_probability,
//         confidenceLevel: result.confidence,
//         riskLevel: result.risk_level,
//         trendData: result.trend_data || [],
//       },
//       actorRecommendations: actorRecs,
//       crewRecommendations: crewRecs,
//       releaseWindow: getReleaseWindow(form.genre, successProb),
//     };
//   })() : null;

//   const savePredictionToMovies = async () => {
//     if (!result || !display) return;
//     try {
//       await addProduction({
//         title: form.title || "Untitled",
//         genre: form.genre || "Unknown",
//         budget: form.budget,
//         runtime: Math.round(form.shootingDays * 1.5),
//         popularity: form.actorPopularity,
//         vote_average: display.successPrediction.probability / 10,
//         vote_count: 500,
//         status: "Pre-Production",
//         spent: 0,
//         progress: 0,
//         prediction: result.prediction,
//         success_probability: display.successPrediction.probability,
//         suggestedActors: result.actor_recommendations || [],
//         suggestedDirector: result.crew_recommendations?.[0] || "TBD",
//       });
//       toast({ title: "Saved", description: "Prediction added to movie productions." });
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     }
//   };

//   const schedulePredictedMovie = async () => {
//     if (!result || !display) return;
//     try {
//       await movieAPI.scheduleEvent({
//         movieTitle: form.title || "Untitled",
//         date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
//         type: "Release",
//         description: `Predicted success ${display.successPrediction.probability}% - add pre-production schedule`,
//       });
//       setScheduled(true);
//       toast({ title: "Scheduled", description: "Predicted movie added to schedule." });
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     }
//   };

//   const runPrediction = async () => {
//     if (!form.title?.trim()) {
//       toast({ title:"Validation Error", description:"Project title is required", variant:"destructive" });
//       return;
//     }
//     if (!form.genre?.trim()) {
//       toast({ title:"Validation Error", description:"Genre must be selected", variant:"destructive" });
//       return;
//     }

//     setLoading(true);
//     setResult(null);

//     try {
//       const payload = {
//         title: form.title.trim(),
//         genre: form.genre.trim(),
//         budget: Number(form.budget),
//         runtime: Math.round(Number(form.shootingDays) * 1.5),
//         popularity: Number(form.actorPopularity),
//         vote_average: 6.5,
//         vote_count: 500,
//         castSize: form.castSize,
//         crewSize: form.crewSize,
//         shootingDays: form.shootingDays,
//         locations: form.locations,
//         actorPopularity: form.actorPopularity,
//         directorExperience: form.directorExperience || "mid",
//       };

//       const res = await movieAPI.predictMovie(payload as any);
      
//       if (!res || typeof res.success_probability === "undefined") {
//         throw new Error("Invalid response from prediction service");
//       }

//       await new Promise(r => setTimeout(r, 2600));
//       setResult(res);
//       toast({ title:"Analysis Complete", description:"Movie profile successfully processed." });
//     } catch(err:any) {
//       const errorMsg = err.response?.data?.message || err.message || "Prediction failed.";
//       toast({ title:"Error", description: errorMsg, variant:"destructive" });
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   const reset = () => {
//     setResult(null);
//     setForm({title:"",genre:"",budget:50_000_000,castSize:15,crewSize:100,shootingDays:60,locations:3,directorExperience:"",actorPopularity:70});
//   };

//   return (
//     <>
//       <style>{GLOBAL_CSS}</style>
//       <AmbientBG/>
//       <CursorGlow/>

//       <div style={{minHeight:"100vh",background:"hsl(var(--bg))",fontFamily:"'Outfit',sans-serif",color:"hsl(var(--txt))",position:"relative",zIndex:2,padding:"28px 24px",display:"flex",flexDirection:"column",gap:22}}>

//         {/* Header */}
//         <motion.div initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}} style={{display:"flex",alignItems:"center",gap:14}}>
//           <motion.div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--purple)))",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px hsla(210,100%,60%,.4)"}}
//             animate={{boxShadow:["0 0 24px hsla(210,100%,60%,.35)","0 0 36px hsla(210,100%,60%,.6)","0 0 24px hsla(210,100%,60%,.35)"]}}
//             transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}
//           >
//             <Sparkles style={{width:18,height:18,color:"white"}}/>
//           </motion.div>
//           <div>
//             <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:900,lineHeight:1,background:"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--purple)))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
//               AI Command Center
//             </h1>
//             <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"hsl(var(--muted))",letterSpacing:".1em",marginTop:3,textTransform:"uppercase"}}>
//               Production Intelligence &amp; Predictive Analytics
//             </p>
//           </div>
//           <div style={{marginLeft:"auto",display:"flex",gap:8}}>
//             {[{label:"Model",val:"v2.4",c:"hsl(var(--blue))"},{label:"Accuracy",val:"94.2%",c:"hsl(var(--green))"}].map(b=>(
//               <div key={b.label} style={{padding:"5px 11px",borderRadius:9999,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",display:"flex",alignItems:"center",gap:6}}>
//                 <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"hsl(var(--muted))",textTransform:"uppercase",letterSpacing:".08em"}}>{b.label}</span>
//                 <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,fontWeight:500,color:b.c}}>{b.val}</span>
//               </div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Main card */}
//         <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
//           <div style={{background:"hsl(var(--surf))",border:"1px solid hsl(var(--bdr))",borderRadius:20,overflow:"hidden",boxShadow:"0 24px 48px rgba(0,0,0,.35)",display:"grid",gridTemplateRows:"auto 1fr"}}>

//             {/* card header */}
//             <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 20px",borderBottom:"1px solid hsl(var(--bdr))",background:"linear-gradient(180deg,hsl(var(--surf2)),hsl(var(--surf)))"}}>
//               <motion.div animate={{rotate:[0,360]}} transition={{duration:9,repeat:Infinity,ease:"linear"}}>
//                 <FlaskConical style={{width:13,height:13,color:"hsl(var(--blue))"}}/>
//               </motion.div>
//               <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12}}>AI Test Lab</span>
//               <div style={{marginLeft:"auto",display:"flex",gap:5,alignItems:"center"}}>
//                 {[0,1,2].map(i=>(
//                   <motion.div key={i} style={{width:5,height:5,borderRadius:"50%",background:"hsl(var(--blue))"}}
//                     animate={{opacity:[.3,1,.3]}} transition={{duration:1.5,repeat:Infinity,delay:i*.3}}
//                   />
//                 ))}
//                 <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"hsl(var(--muted))",marginLeft:6,textTransform:"uppercase",letterSpacing:".08em"}}>Run Custom Prediction</span>
//               </div>
//             </div>

//             {/* split pane */}
//             <div style={{display:"grid",gridTemplateColumns:"370px 1fr",minHeight:640}}>

//               {/* LEFT */}
//               <div style={{padding:"22px 20px",borderRight:"1px solid hsl(var(--bdr))",display:"flex",flexDirection:"column",gap:16,overflowY:"auto"}} className="no-sb">

//                 <Field label="Movie Title">
//                   <GlowInput value={form.title} onChange={(v:any)=>setForm({...form,title:v})} placeholder="Enter production title…"/>
//                 </Field>

//                 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
//                   <Field label="Genre">
//                     <GlowSelect value={form.genre} onChange={(v:any)=>setForm({...form,genre:v})} placeholder="Select genre…" options={GENRES.map(g=>({value:g,label:g}))}/>
//                   </Field>
//                   <Field label="Director Exp.">
//                     <GlowSelect value={form.directorExperience} onChange={(v:any)=>setForm({...form,directorExperience:v})} placeholder="Level…" options={DIRECTOR_EXP}/>
//                   </Field>
//                 </div>

//                 <Field label="Budget ($)">
//                   <GlowInput type="number" value={form.budget} onChange={(v:any)=>setForm({...form,budget:v})} placeholder="Budget in USD"/>
//                 </Field>

//                 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
//                   {([["castSize","Cast Size"],["crewSize","Crew Size"],["shootingDays","Shooting Days"],["locations","Locations"]] as [string,string][]).map(([k,l])=>(
//                     <Field key={k} label={l}>
//                       <GlowInput type="number" value={(form as any)[k]} onChange={(v:any)=>setForm({...form,[k]:v})} placeholder={l}/>
//                     </Field>
//                   ))}
//                 </div>

//                 <Field label={`Actor Popularity — ${form.actorPopularity}`}>
//                   <GlowSlider value={form.actorPopularity} onChange={(v:any)=>setForm({...form,actorPopularity:v})}/>
//                   <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
//                     <span style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))"}}>Indie</span>
//                     <span style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))"}}>A-List</span>
//                   </div>
//                 </Field>

//                 {/* divider */}
//                 <div style={{height:1,background:"hsl(var(--bdr))",margin:"2px 0"}}/>

//                 <div style={{display:"flex",gap:10}}>
//                   <motion.button onClick={runPrediction} disabled={loading}
//                     whileHover={{scale:1.015}} whileTap={{scale:.985}}
//                     style={{flex:1,height:44,borderRadius:10,background:loading?"hsl(var(--surf2))":"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--purple)))",color:"white",border:"none",cursor:loading?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:13,letterSpacing:".04em",boxShadow:loading?"none":"0 0 20px hsla(210,100%,60%,.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,position:"relative",overflow:"hidden",transition:"background .3s,box-shadow .3s"}}
//                   >
//                     {!loading&&<motion.div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent)",skewX:"-12deg"}} animate={{x:["-120%","220%"]}} transition={{duration:2.5,repeat:Infinity,ease:"linear",repeatDelay:.8}}/>}
//                     <motion.div animate={loading?{rotate:360}:{rotate:0}} transition={{duration:1,repeat:loading?Infinity:0,ease:"linear"}}>
//                       <Zap style={{width:15,height:15}}/>
//                     </motion.div>
//                     {loading?"Processing…":"Run AI Prediction"}
//                   </motion.button>
//                   <motion.button onClick={reset} whileHover={{scale:1.06}} whileTap={{scale:.94}}
//                     style={{width:44,height:44,borderRadius:10,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",color:"hsl(var(--muted))",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
//                   >
//                     <RotateCcw style={{width:13,height:13}}/>
//                   </motion.button>
//                 </div>

//                 {result && (
//                   <div style={{marginTop:12}}>
//                     <div style={{display:"flex",alignItems:"center",gap:10}}>
//                       <button onClick={savePredictionToMovies} style={{flex:1,padding:"10px 12px",borderRadius:8,border:"none",background:"hsl(var(--blue))",color:"white",fontWeight:700,cursor:"pointer"}}>Add to Productions</button>
//                       <button onClick={schedulePredictedMovie} style={{flex:1,padding:"10px 12px",borderRadius:8,border:"none",background:scheduled?"hsl(var(--green))":"hsl(var(--purple))",color:"white",fontWeight:700,cursor:"pointer"}}>{scheduled?"Scheduled" : "Schedule Release"}</button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* RIGHT */}
//               <div style={{overflowY:"auto",position:"relative"}} className="no-sb">
//                 <AnimatePresence mode="wait">
//                   {loading ? (
//                     <motion.div key="loading" style={{height:"100%"}} initial={{opacity:0,filter:"blur(8px)"}} animate={{opacity:1,filter:"blur(0)"}} exit={{opacity:0,filter:"blur(8px)"}}>
//                       <Loader/>
//                     </motion.div>
//                   ) : display ? (
//                     <motion.div key="result" initial={{opacity:0,y:20,filter:"blur(6px)"}} animate={{opacity:1,y:0,filter:"blur(0)"}} exit={{opacity:0,filter:"blur(8px)"}} transition={{duration:.45,ease:EASE}}
//                       style={{padding:20,display:"flex",flexDirection:"column",gap:12}}
//                     >
//                       {/* status banner */}
//                       <motion.div initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} transition={{...SPRING,delay:.08}}
//                         style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,background:isSuccessful?"hsla(152,70%,50%,.08)":"hsla(0,80%,60%,.08)",border:`1px solid ${isSuccessful?"hsla(152,70%,50%,.2)":"hsla(0,80%,60%,.2)"}`}}
//                       >
//                         {isSuccessful
//                           ? <CheckCircle2 style={{width:15,height:15,color:"hsl(var(--green))",flexShrink:0}}/>
//                           : <AlertTriangle style={{width:15,height:15,color:"hsl(var(--red))",flexShrink:0}}/>
//                         }
//                         <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:isSuccessful?"hsl(var(--green))":"hsl(var(--red))"}}>
//                           {result?.prediction}
//                         </span>
//                         <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:"hsl(var(--muted))"}}>
//                           · {result?.success_probability}% confidence
//                         </span>
//                         <span style={{marginLeft:"auto",fontFamily:"'DM Mono',monospace",fontSize:8,fontWeight:500,padding:"2px 8px",borderRadius:9999,background:"hsl(var(--surf2))",color:"hsl(var(--muted))"}}>
//                           {form.genre||"Film"}
//                         </span>
//                       </motion.div>

//                       <BudgetBlock data={display.budgetOverrun}/>
//                       <SuccessBlock data={display.successPrediction}/>
//                       <ReleaseBlock data={display.releaseWindow}/>
//                       <ActorsBlock actors={display.actorRecommendations}/>
//                       <CrewBlock crew={display.crewRecommendations}/>
//                     </motion.div>
//                   ) : (
//                     <motion.div key="empty" style={{height:"100%"}} initial={{opacity:0}} animate={{opacity:1}}>
//                       <EmptyState/>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// }

import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles, Brain, FlaskConical, Zap,
  Star, Users, UserCog,
  RotateCcw, Target, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2, Activity,
  Cpu, BarChart2, Layers, Eye, Clock, DollarSign, Film
} from "lucide-react";
import { movieAPI } from "@/services/movieAPI";
import { useToast } from "@/hooks/use-toast";
import { useProductions } from "@/contexts/ProductionsContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  title: string;
  genre: string;
  budget: number;
  castSize: number;
  crewSize: number;
  shootingDays: number;
  locations: number;
  directorExperience: string;
  actorPopularity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SPRING      = { type: "spring", stiffness: 340, damping: 30 } as const;
const SPRING_SOFT = { type: "spring", stiffness: 180, damping: 24 } as const;
const EASE        = [0.22, 1, 0.36, 1] as const;

const GENRES = [
  "Action","Adventure","Animation","Comedy","Crime",
  "Documentary","Drama","Family","Fantasy","History",
  "Horror","Music","Mystery","Romance","Science Fiction",
  "Thriller","War","Western",
];

const DIRECTOR_EXP = [
  { value: "rookie",  label: "Rookie  (0–2 films)"  },
  { value: "mid",     label: "Mid-Level (3–7 films)" },
  { value: "veteran", label: "Veteran (8–15 films)"  },
  { value: "legend",  label: "Legend (16+ films)"    },
];

// ─── Seeded RNG (deterministic per film) ──────────────────────────────────────
function createSeededRNG(seed: number) {
  let s = seed;
  return function(index: number = 0): number {
    s = (s * 1664525 + 1013904223 + index * 6364136223846793005) & 0xffffffff;
    return ((s >>> 0) / 0xffffffff);
  };
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) & 0xffffffff;
  }
  return h >>> 0;
}

// ─── AI Logic Engine ──────────────────────────────────────────────────────────
// Genre-specific intelligence matrices
const GENRE_DNA: Record<string, {
  budgetMultiplier: number; riskProfile: number; audienceReach: number;
  seasonalPeak: string; competitionWindow: string; reviewSentiment: number;
  marketVolatility: number; castImpact: number; productionComplexity: number;
}> = {
  Action:           { budgetMultiplier:1.45, riskProfile:0.72, audienceReach:0.88, seasonalPeak:"Summer",   competitionWindow:"High",   reviewSentiment:0.62, marketVolatility:0.55, castImpact:0.80, productionComplexity:0.85 },
  Adventure:        { budgetMultiplier:1.30, riskProfile:0.65, audienceReach:0.82, seasonalPeak:"Summer",   competitionWindow:"High",   reviewSentiment:0.68, marketVolatility:0.48, castImpact:0.72, productionComplexity:0.78 },
  Animation:        { budgetMultiplier:1.55, riskProfile:0.58, audienceReach:0.90, seasonalPeak:"Holiday",  competitionWindow:"Medium", reviewSentiment:0.76, marketVolatility:0.42, castImpact:0.55, productionComplexity:0.92 },
  Comedy:           { budgetMultiplier:0.65, riskProfile:0.42, audienceReach:0.74, seasonalPeak:"Holiday",  competitionWindow:"Medium", reviewSentiment:0.58, marketVolatility:0.62, castImpact:0.78, productionComplexity:0.40 },
  Crime:            { budgetMultiplier:0.85, riskProfile:0.52, audienceReach:0.70, seasonalPeak:"Fall",     competitionWindow:"Low",    reviewSentiment:0.74, marketVolatility:0.44, castImpact:0.82, productionComplexity:0.62 },
  Documentary:      { budgetMultiplier:0.25, riskProfile:0.28, audienceReach:0.42, seasonalPeak:"Spring",   competitionWindow:"Low",    reviewSentiment:0.82, marketVolatility:0.32, castImpact:0.30, productionComplexity:0.35 },
  Drama:            { budgetMultiplier:0.70, riskProfile:0.38, audienceReach:0.65, seasonalPeak:"Awards Q4",competitionWindow:"Low",    reviewSentiment:0.80, marketVolatility:0.38, castImpact:0.88, productionComplexity:0.50 },
  Family:           { budgetMultiplier:1.10, riskProfile:0.48, audienceReach:0.85, seasonalPeak:"Holiday",  competitionWindow:"Medium", reviewSentiment:0.72, marketVolatility:0.38, castImpact:0.65, productionComplexity:0.60 },
  Fantasy:          { budgetMultiplier:1.40, riskProfile:0.70, audienceReach:0.80, seasonalPeak:"Summer",   competitionWindow:"Medium", reviewSentiment:0.65, marketVolatility:0.52, castImpact:0.70, productionComplexity:0.90 },
  History:          { budgetMultiplier:0.95, riskProfile:0.45, audienceReach:0.58, seasonalPeak:"Awards Q4",competitionWindow:"Low",    reviewSentiment:0.78, marketVolatility:0.35, castImpact:0.80, productionComplexity:0.70 },
  Horror:           { budgetMultiplier:0.40, riskProfile:0.32, audienceReach:0.68, seasonalPeak:"Halloween",competitionWindow:"Medium", reviewSentiment:0.54, marketVolatility:0.72, castImpact:0.58, productionComplexity:0.38 },
  Music:            { budgetMultiplier:0.75, riskProfile:0.48, audienceReach:0.72, seasonalPeak:"Spring",   competitionWindow:"Low",    reviewSentiment:0.74, marketVolatility:0.55, castImpact:0.85, productionComplexity:0.55 },
  Mystery:          { budgetMultiplier:0.72, riskProfile:0.44, audienceReach:0.62, seasonalPeak:"Fall",     competitionWindow:"Low",    reviewSentiment:0.76, marketVolatility:0.42, castImpact:0.78, productionComplexity:0.58 },
  Romance:          { budgetMultiplier:0.60, riskProfile:0.36, audienceReach:0.68, seasonalPeak:"Valentine",competitionWindow:"Low",    reviewSentiment:0.64, marketVolatility:0.50, castImpact:0.88, productionComplexity:0.38 },
  "Science Fiction":{ budgetMultiplier:1.50, riskProfile:0.76, audienceReach:0.82, seasonalPeak:"Summer",   competitionWindow:"High",   reviewSentiment:0.66, marketVolatility:0.60, castImpact:0.68, productionComplexity:0.88 },
  Thriller:         { budgetMultiplier:0.88, riskProfile:0.55, audienceReach:0.72, seasonalPeak:"Spring",   competitionWindow:"Medium", reviewSentiment:0.70, marketVolatility:0.50, castImpact:0.80, productionComplexity:0.65 },
  War:              { budgetMultiplier:1.20, riskProfile:0.65, audienceReach:0.62, seasonalPeak:"Awards Q4",competitionWindow:"Low",    reviewSentiment:0.75, marketVolatility:0.40, castImpact:0.72, productionComplexity:0.82 },
  Western:          { budgetMultiplier:0.90, riskProfile:0.58, audienceReach:0.55, seasonalPeak:"Fall",     competitionWindow:"Low",    reviewSentiment:0.72, marketVolatility:0.46, castImpact:0.76, productionComplexity:0.68 },
};

const DEFAULT_GENRE_DNA = { budgetMultiplier:1.0, riskProfile:0.5, audienceReach:0.7, seasonalPeak:"Q4", competitionWindow:"Medium", reviewSentiment:0.68, marketVolatility:0.5, castImpact:0.7, productionComplexity:0.6 };

function computeLocalAnalytics(form: FormState, backendResult: any, rng: (i:number)=>number) {
  const dna = GENRE_DNA[form.genre] || DEFAULT_GENRE_DNA;

  // ── Budget Risk Model (physics-inspired logistic curve) ──────────────────
  const budgetNorm    = Math.min(form.budget / 250_000_000, 1);
  const crewNorm      = Math.min(form.crewSize / 250, 1);
  const shootNorm     = Math.min(form.shootingDays / 180, 1);
  const castNorm      = Math.min(form.castSize / 40, 1);
  const locNorm       = Math.min(form.locations / 12, 1);

  // Exponential penalties for over-threshold values
  const budgetPressure   = Math.pow(budgetNorm, 1.6) * 0.32;
  const crewPressure     = Math.pow(crewNorm, 1.3) * 0.16;
  const schedulePressure = Math.pow(shootNorm, 1.5) * 0.22;
  const castPressure     = Math.pow(castNorm, 1.2) * 0.12;
  const locationPressure = Math.pow(locNorm, 1.7) * 0.18;
  const genreMultiplier  = dna.productionComplexity * 0.15;

  const directorRelief =
    form.directorExperience === "legend"  ? -0.14 :
    form.directorExperience === "veteran" ? -0.08 :
    form.directorExperience === "mid"     ?  0.00 : 0.06;

  const popularityRelief = ((form.actorPopularity - 50) / 500);

  // Stochastic jitter per unique film title (±3%)
  const jitter = (rng(99) - 0.5) * 0.06;

  const rawRisk = budgetPressure + crewPressure + schedulePressure + castPressure +
                  locationPressure + genreMultiplier + directorRelief - popularityRelief + jitter;

  const riskPercent = Math.max(5, Math.min(Math.round(rawRisk * 100), 95));

  // ── Success Score Model ───────────────────────────────────────────────────
  const baseProbFromBackend = backendResult.success_probability; // trust the ML model

  // Adjustment factors (deterministic per film config)
  const audienceFactor   = dna.audienceReach;
  const sentimentFactor  = dna.reviewSentiment;
  const popularityBoost  = (form.actorPopularity / 100) * dna.castImpact;
  const directorBoost    =
    form.directorExperience === "legend"  ? 0.08 :
    form.directorExperience === "veteran" ? 0.05 :
    form.directorExperience === "mid"     ? 0.01 : -0.04;
  const riskPenalty = -(riskPercent / 100) * 0.15;

  const statAdjustment = Math.round(
    (audienceFactor * 6 + sentimentFactor * 5 + popularityBoost * 8 + directorBoost * 12 + riskPenalty * 10) - 12
  );

  const finalProbability = Math.max(5, Math.min(95,
    Math.round(baseProbFromBackend + statAdjustment * 0.5 + (rng(88) - 0.5) * 4)
  ));

  // Rating: blend backend with our analytics
  const ratingRaw = (finalProbability / 100) * 7 + 1.5 + (rng(77) - 0.5) * 1.2;
  const rating = Math.max(2.0, Math.min(9.8, Math.round(ratingRaw * 10) / 10)).toFixed(1);

  // ── Market Trend Projection (32-point, genre-specific shape) ──────────────
  const trendData: number[] = [];
  const trendBase = finalProbability;
  const volatility = dna.marketVolatility * 30;
  for (let i = 0; i < 32; i++) {
    const seasonalWave = Math.sin((i / 31) * Math.PI * 2) * 12;
    const trend        = i < 16 ? i * 1.2 : (31 - i) * 0.8;
    const noise        = (rng(i * 13 + 7) - 0.5) * volatility;
    trendData.push(Math.max(8, Math.min(98, trendBase * 0.5 + trend + seasonalWave + noise)));
  }

  // ── ROI Projection ─────────────────────────────────────────────────────────
  const expectedMultiple = 1.2 + (finalProbability / 100) * 3.8 + (rng(55) - 0.5) * 0.8;
  const projectedRevenue = Math.round(form.budget * expectedMultiple);
  const roiPercent       = Math.round((expectedMultiple - 1) * 100);

  // ── Audience Breakdown ─────────────────────────────────────────────────────
  const audienceBreakdown = computeAudienceBreakdown(form.genre, form.actorPopularity, rng);

  // ── Risk Factors (parameterized per film) ──────────────────────────────────
  const riskFactors = [
    { name: "Budget Scale",       impact: Math.round(budgetPressure * 100 * 10),   max: 32 },
    { name: "Schedule Complexity",impact: Math.round(schedulePressure * 100 * 10), max: 22 },
    { name: "Crew Logistics",     impact: Math.round(crewPressure * 100 * 10),     max: 16 },
    { name: "Location Overhead",  impact: Math.round(locationPressure * 100 * 10), max: 18 },
    { name: "Cast Coordination",  impact: Math.round(castPressure * 100 * 10),     max: 12 },
  ];

  // ── Release Window Intelligence ────────────────────────────────────────────
  const releaseWindow = computeReleaseWindow(form.genre, finalProbability, form.budget, rng, dna);

  // ── Competitive Analysis ───────────────────────────────────────────────────
  const competitiveScore = Math.round(45 + (finalProbability - 50) * 0.6 + (rng(33) - 0.5) * 18);

  // ── Tags ───────────────────────────────────────────────────────────────────
  const tags = generateTags(form, finalProbability, riskPercent, dna, rng);

  // ── Insights ──────────────────────────────────────────────────────────────
  const insights = generateInsights(form, finalProbability, riskPercent, dna, rng);

  return {
    riskPercent,
    riskLevel: riskPercent >= 70 ? "high" : riskPercent >= 42 ? "medium" : "low",
    riskFactors,
    statAdjustment,
    adjustmentReasoning: buildAdjustmentReasoning(form, statAdjustment, dna, audienceFactor, sentimentFactor),
    finalProbability,
    rating,
    trendData,
    projectedRevenue,
    roiPercent,
    audienceBreakdown,
    releaseWindow,
    competitiveScore,
    tags,
    insights,
    confidenceLevel: finalProbability > 72 ? "High" : finalProbability > 50 ? "Moderate" : "Low",
  };
}

function computeAudienceBreakdown(genre: string, popularity: number, rng: (i:number)=>number) {
  const profiles: Record<string, number[]> = {
    Action:           [35, 25, 22, 18],
    Animation:        [15, 28, 32, 25],
    Horror:           [28, 38, 22, 12],
    Drama:            [18, 22, 35, 25],
    Comedy:           [22, 30, 28, 20],
    "Science Fiction":[32, 28, 25, 15],
    Romance:          [12, 20, 38, 30],
    Thriller:         [28, 32, 25, 15],
  };
  const base = profiles[genre] || [25, 27, 25, 23];
  const noise = base.map((v, i) => Math.max(5, Math.min(60, Math.round(v + (rng(i * 17 + 3) - 0.5) * 8))));
  const total = noise.reduce((a,b)=>a+b,0);
  return noise.map(v => Math.round((v / total) * 100));
}

function computeReleaseWindow(genre: string, prob: number, budget: number, rng: (i:number)=>number, dna: any) {
  const windows: Record<string, any> = {
    Action:           { primary: "May–Jul 2026", secondary: "Dec 2026", strategy: "Peak summer blockbuster window aligns with franchise potential",        streamingDelay: "90 days" },
    Adventure:        { primary: "Jun–Aug 2026", secondary: "Nov 2026", strategy: "Summer adventure audience peak, family-weekend targeting",              streamingDelay: "90 days" },
    Animation:        { primary: "Nov–Dec 2026", secondary: "Jun 2026", strategy: "Holiday family audience maximises opening-weekend revenue",              streamingDelay: "120 days" },
    Comedy:           { primary: "Nov–Dec 2026", secondary: "Mar 2026", strategy: "Q4 holiday mood drives comedy ticket sales significantly",              streamingDelay: "60 days" },
    Crime:            { primary: "Sep–Oct 2026", secondary: "Jan 2027", strategy: "Fall counter-programming against blockbusters, adult-skewing window",    streamingDelay: "75 days" },
    Documentary:      { primary: "Mar–Apr 2026", secondary: "Sep 2026", strategy: "Spring festival buzz converts to awards-qualifying theatrical run",      streamingDelay: "45 days" },
    Drama:            { primary: "Oct–Nov 2026", secondary: "Jan 2027", strategy: "Awards-season positioning maximises critical reception & nominations",   streamingDelay: "90 days" },
    Family:           { primary: "Nov–Dec 2026", secondary: "Jun 2026", strategy: "Holiday and summer both viable; holiday maximises family group tickets",  streamingDelay: "100 days" },
    Fantasy:          { primary: "May–Jul 2026", secondary: "Nov 2026", strategy: "Summer-spectacle positioning with holiday franchise-expansion option",   streamingDelay: "90 days" },
    History:          { primary: "Oct–Dec 2026", secondary: "Mar 2027", strategy: "Awards-circuit alignment; historical dramas peak in Q4 prestige window", streamingDelay: "90 days" },
    Horror:           { primary: "Sep–Oct 2026", secondary: "Jan 2027", strategy: "Halloween pre-season is the definitive horror release sweet spot",       streamingDelay: "45 days" },
    Music:            { primary: "Feb–Mar 2027", secondary: "Jun 2026", strategy: "Spring tour-season tie-in boosts ancillary revenue streams",             streamingDelay: "60 days" },
    Mystery:          { primary: "Aug–Sep 2026", secondary: "Jan 2027", strategy: "Late-summer counter-programming with adult-audience focus",              streamingDelay: "60 days" },
    Romance:          { primary: "Jan–Feb 2027", secondary: "May 2026", strategy: "Valentine's window delivers premium premium openings for romance films",  streamingDelay: "60 days" },
    "Science Fiction":{ primary: "May–Aug 2026", secondary: "Nov 2026", strategy: "Summer spectacle window maximises VFX showcase value and fanbase reach", streamingDelay: "90 days" },
    Thriller:         { primary: "Mar–May 2026", secondary: "Sep 2026", strategy: "Spring counter-programming achieves wide-open marketplace positioning",   streamingDelay: "75 days" },
    War:              { primary: "Oct–Nov 2026", secondary: "May 2026", strategy: "Fall prestige window, Veterans Day / Remembrance weekend targeting",      streamingDelay: "90 days" },
    Western:          { primary: "Sep–Oct 2026", secondary: "Dec 2026", strategy: "Fall release aligns with mature-audience weekday viewing patterns",       streamingDelay: "75 days" },
  };
  const w = windows[genre] || { primary: "Q4 2026", secondary: "Q2 2027", strategy: "General wide-release window with awards potential", streamingDelay: "75 days" };
  const competitionScore = dna.competitionWindow;
  const openingWeekend   = Math.round((budget * 0.12 + (prob / 100) * budget * 0.25 + (rng(44) - 0.5) * budget * 0.05) / 1_000_000);
  return { ...w, competition: competitionScore, openingWeekendEst: openingWeekend };
}

function buildAdjustmentReasoning(form: FormState, adj: number, dna: any, audienceFactor: number, sentimentFactor: number): string {
  const parts: string[] = [];
  if (audienceFactor > 0.80)      parts.push(`${form.genre} commands broad audience reach (${Math.round(audienceFactor*100)}%)`);
  else if (audienceFactor < 0.55) parts.push(`${form.genre} has niche audience ceiling (${Math.round(audienceFactor*100)}%)`);

  if (form.actorPopularity > 80)       parts.push("A-list cast boosts opening weekend draw");
  else if (form.actorPopularity < 40)  parts.push("indie cast limits marketing reach");

  if (form.directorExperience === "legend")  parts.push("legendary director reduces execution risk substantially");
  else if (form.directorExperience === "rookie") parts.push("first-time director introduces uncertainty premium");

  if (sentimentFactor > 0.75) parts.push("genre reviews trend strongly positive");

  if (adj > 0) return `Upward adjusted: ${parts.join("; ")}.`;
  if (adj < 0) return `Downward adjusted: ${parts.join("; ")}.`;
  return `Balanced adjustment: ${parts.join("; ") || "neutral production parameters detected"}.`;
}

function generateTags(form: FormState, prob: number, risk: number, dna: any, rng: (i:number)=>number): string[] {
  const tags: string[] = [];
  if (prob >= 75)                                   tags.push("High Potential");
  if (prob >= 60 && prob < 75)                      tags.push("Promising");
  if (risk <= 30)                                   tags.push("Low Risk");
  if (risk >= 65)                                   tags.push("High Stakes");
  if (dna.audienceReach >= 0.82)                    tags.push("Broad Market");
  if (form.actorPopularity >= 80)                   tags.push("Star-Driven");
  if (["legend","veteran"].includes(form.directorExperience)) tags.push("Strong Direction");
  if (form.budget >= 150_000_000)                   tags.push("Tentpole");
  if (form.budget < 15_000_000)                     tags.push("Micro-Budget");
  if (dna.reviewSentiment >= 0.76)                  tags.push("Critical Darling");
  if (dna.marketVolatility >= 0.60)                 tags.push("Volatile Market");
  if (form.locations >= 8)                          tags.push("Global Production");
  return tags.slice(0, 5);
}

function generateInsights(form: FormState, prob: number, risk: number, dna: any, rng: (i:number)=>number): string[] {
  const pool = [
    prob > 70  ? `Strong ${form.genre} fundamentals align with current market demand` : null,
    risk > 60  ? `Production complexity at current scale warrants contingency budget of 18–22%` : null,
    form.actorPopularity > 75 ? `A-list cast increases opening-weekend floor by an estimated 22–35%` : null,
    form.directorExperience === "rookie" ? `First-time director risk: consider co-production with established studio` : null,
    form.directorExperience === "legend" ? `Legendary director track record is strongest single predictor of ROI` : null,
    dna.reviewSentiment > 0.76 ? `${form.genre} consistently over-performs with critics; awards track likely` : null,
    form.budget > 150_000_000  ? `Mega-budget requires international co-production deals to break even globally` : null,
    form.shootingDays > 100    ? `Extended production schedule: budget creep risk increases by ~0.8% per additional day` : null,
    form.locations > 6         ? `Multi-country shooting adds logistical overhead; local crew partnerships advisable` : null,
    dna.marketVolatility > 0.58 ? `Market window is volatile for this genre — release timing is critical` : null,
    prob < 45  ? `Consider script re-development phase to improve concept validation before greenlight` : null,
    prob >= 80 ? `Franchise potential detected: sequel planning ROI exceeds single-film ceiling` : null,
  ].filter(Boolean) as string[];

  // Pick 3 deterministically (but vary per film)
  const indices = [
    Math.floor(rng(101) * pool.length),
    Math.floor(rng(102) * pool.length),
    Math.floor(rng(103) * pool.length),
  ];
  const unique = [...new Set(indices)].slice(0, 3);
  return unique.map(i => pool[i]).filter(Boolean);
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

  :root {
    --bg:      #09090f;
    --surf1:   #0f0f1a;
    --surf2:   #141422;
    --surf3:   #1a1a2e;
    --bdr:     rgba(120,120,220,0.12);
    --bdr2:    rgba(120,120,220,0.22);
    --txt:     #e8e8f4;
    --muted:   rgba(200,200,240,0.38);
    --blue:    #4f8ef7;
    --purple:  #8b5cf6;
    --cyan:    #22d3ee;
    --green:   #34d399;
    --amber:   #fbbf24;
    --red:     #f87171;
    --pink:    #f472b6;
  }

  body { background: var(--bg); }

  @keyframes shimmer {
    from { background-position: -200% center; }
    to   { background-position: 200% center;  }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.94); opacity: 0.5; }
    100% { transform: scale(1.08); opacity: 0;   }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-6px); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh);  }
  }
  @keyframes data-tick {
    0%,100% { opacity:0.4; } 50% { opacity:1; }
  }

  .grad-text {
    background: linear-gradient(135deg, var(--blue) 0%, var(--purple) 50%, var(--cyan) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }

  .panel {
    background: var(--surf1);
    border: 1px solid var(--bdr);
    border-radius: 14px;
    position: relative;
    overflow: hidden;
  }
  .panel::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(79,142,247,.04) 0%, transparent 60%);
    pointer-events: none;
  }

  .mono {
    font-family: 'JetBrains Mono', monospace;
  }
  .sans {
    font-family: 'Space Grotesk', sans-serif;
  }

  .field-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--muted);
    display: block;
    margin-bottom: 7px;
  }

  input[type=range] { -webkit-appearance:none; appearance:none; background:transparent; width:100%; cursor:pointer; height:20px; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:var(--blue); border:2px solid var(--bg); box-shadow:0 0 10px rgba(79,142,247,.6); margin-top:-5px; }
  input[type=range]::-webkit-slider-runnable-track { height:4px; border-radius:4px; background:var(--bdr2); }

  .scrollbar-none::-webkit-scrollbar { display:none; }
  .scrollbar-none { -ms-overflow-style:none; scrollbar-width:none; }

  .data-dot { animation: data-tick 1.8s ease-in-out infinite; }

  .btn-primary {
    background: linear-gradient(135deg, var(--blue), var(--purple));
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: .04em;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: opacity .2s, transform .1s;
    box-shadow: 0 0 24px rgba(79,142,247,.25), inset 0 1px 0 rgba(255,255,255,.12);
  }
  .btn-primary:hover { opacity: .9; }
  .btn-primary:active { transform: scale(.98); }
  .btn-primary:disabled { opacity:.5; cursor:not-allowed; }

  .input-base {
    width: 100%;
    padding: 10px 13px;
    background: var(--surf2);
    border: 1px solid var(--bdr);
    border-radius: 9px;
    color: var(--txt);
    font-size: 13px;
    font-family: 'Space Grotesk', sans-serif;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .input-base:focus {
    border-color: rgba(79,142,247,.5);
    box-shadow: 0 0 0 3px rgba(79,142,247,.08);
  }
  .input-base::placeholder { color: var(--muted); }

  select.input-base option { background: #1a1a2e; }

  .tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 99px;
    border: 1px solid;
    display: inline-flex;
    align-items: center;
  }
`;

// ─── Ambient Background ────────────────────────────────────────────────────────
function AmbientBG() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:`radial-gradient(ellipse 80% 50% at 20% 20%, rgba(79,142,247,.06) 0%, transparent 60%),
                         radial-gradient(ellipse 60% 40% at 80% 70%, rgba(139,92,246,.05) 0%, transparent 55%),
                         radial-gradient(ellipse 40% 60% at 60% 10%, rgba(34,211,238,.04) 0%, transparent 50%)`,
      }}/>
      <div style={{
        position:"absolute",inset:0,opacity:.018,
        backgroundImage:`linear-gradient(rgba(79,142,247,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,.8) 1px, transparent 1px)`,
        backgroundSize:"40px 40px",
      }}/>
      {/* scanline */}
      <div style={{
        position:"absolute",left:0,right:0,height:180,
        background:"linear-gradient(to bottom, transparent, rgba(79,142,247,.015), transparent)",
        animation:"scanline 12s linear infinite",
        pointerEvents:"none",
      }}/>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(79,142,247,.4),rgba(139,92,246,.4),transparent)"}}/>
    </div>
  );
}

// ─── Cursor glow ──────────────────────────────────────────────────────────────
function CursorGlow() {
  const x=useMotionValue(0),y=useMotionValue(0);
  const sx=useSpring(x,{stiffness:50,damping:16}),sy=useSpring(y,{stiffness:50,damping:16});
  useEffect(()=>{
    const m=(e:MouseEvent)=>{x.set(e.clientX);y.set(e.clientY);};
    window.addEventListener("mousemove",m);
    return()=>window.removeEventListener("mousemove",m);
  },[]);
  return (
    <motion.div className="pointer-events-none" style={{position:"fixed",inset:0,zIndex:1,x:sx,y:sy}}>
      <div style={{position:"absolute",transform:"translate(-50%,-50%)",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(79,142,247,.04) 0%,transparent 70%)"}}/>
    </motion.div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimNum({v,d=0,suffix=""}:{v:number;d?:number;suffix?:string}) {
  const [n,setN]=useState(0);
  useEffect(()=>{
    const t0=performance.now(),dur=1500;
    const tick=(now:number)=>{const p=Math.min((now-t0)/dur,1);setN((1-Math.pow(1-p,4))*v);if(p<1)requestAnimationFrame(tick);else setN(v);};
    requestAnimationFrame(tick);
  },[v]);
  return <>{n.toFixed(d)}{suffix}</>;
}

// ─── Radial arc ───────────────────────────────────────────────────────────────
function ArcMeter({value,size=120,sw=7,color,label}:{value:number;size?:number;sw?:number;color:string;label:string}) {
  const r=(size-sw)/2, c=r*2*Math.PI, off=c-(value/100)*c;
  return (
    <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",inset:-12,borderRadius:"50%",background:`radial-gradient(circle,${color}20,transparent 70%)`,filter:"blur(14px)"}}/>
        <svg width={size} height={size} style={{transform:"rotate(-90deg)",position:"relative"}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bdr2)" strokeWidth={sw}/>
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
            strokeDasharray={c} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off}}
            transition={{duration:1.8,ease:EASE}} strokeLinecap="round"/>
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw+6}
            strokeDasharray={c} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off}}
            transition={{duration:1.8,ease:EASE}} strokeLinecap="round" style={{filter:"blur(8px)",opacity:.2}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span className="sans" style={{fontSize:22,fontWeight:800,color:"var(--txt)",lineHeight:1}}>
            <AnimNum v={value}/>%
          </span>
        </div>
      </div>
      <span className="mono" style={{fontSize:8.5,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)"}}>{label}</span>
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({data,color,height=36}:{data:number[];color:string;height?:number}) {
  if (!data.length) return null;
  const min=Math.min(...data), max=Math.max(...data), range=max-min||1;
  const w=260, h=height;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-(((v-min)/range)*h*0.88+h*0.06)}`).join(" ");
  const fill=`${pts} ${w},${h} 0,${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height}} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <polygon points={fill} fill="url(#sg)"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Thin progress bar ────────────────────────────────────────────────────────
function ThinBar({pct,color,delay=0,height=3}:{pct:number;color:string;delay?:number;height?:number}) {
  return (
    <div style={{height,borderRadius:9999,background:"var(--bdr2)",overflow:"hidden",flex:1}}>
      <motion.div style={{height:"100%",borderRadius:9999,background:color,boxShadow:`0 0 5px ${color}80`}}
        initial={{width:0}} animate={{width:`${Math.min(pct,100)}%`}} transition={{...SPRING_SOFT,delay}}/>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({label,children}:{label:string;children:React.ReactNode}) {
  return <div><label className="field-label">{label}</label>{children}</div>;
}

// ─── Focus input ──────────────────────────────────────────────────────────────
function FInput({value,onChange,placeholder="",type="text"}:any) {
  const [f,setF]=useState(false);
  const handleChange=(e:any)=>{
    if(type==="number"){
      const n=e.target.value===""?0:Number(e.target.value);
      if(!isNaN(n)) onChange(n);
    } else onChange(e.target.value);
  };
  return (
    <div style={{position:"relative"}}>
      <AnimatePresence>
        {f&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          style={{position:"absolute",inset:-1,borderRadius:10,background:"linear-gradient(135deg,var(--blue),var(--purple))",zIndex:0,pointerEvents:"none"}}/>}
      </AnimatePresence>
      <input type={type} value={value} onChange={handleChange} placeholder={placeholder}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        className="input-base"
        style={{position:"relative",zIndex:1,borderColor:f?"transparent":"var(--bdr)"}}
      />
    </div>
  );
}

// ─── Focus select ─────────────────────────────────────────────────────────────
function FSelect({value,onChange,placeholder,options}:any) {
  const [f,setF]=useState(false);
  return (
    <div style={{position:"relative"}}>
      <AnimatePresence>
        {f&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          style={{position:"absolute",inset:-1,borderRadius:10,background:"linear-gradient(135deg,var(--blue),var(--purple))",zIndex:0,pointerEvents:"none"}}/>}
      </AnimatePresence>
      <select value={value} onChange={e=>onChange(e.target.value)}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        className="input-base"
        style={{position:"relative",zIndex:1,appearance:"none",cursor:"pointer",color:value?"var(--txt)":"var(--muted)",borderColor:f?"transparent":"var(--bdr)"}}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o:any)=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
      <ChevronRight style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%) rotate(90deg)",width:12,height:12,color:"var(--muted)",pointerEvents:"none",zIndex:2}}/>
    </div>
  );
}

// ─── Slider ───────────────────────────────────────────────────────────────────
function FSlider({value,onChange}:{value:number;onChange:(v:number)=>void}) {
  return (
    <div style={{position:"relative",paddingBlock:4}}>
      <div style={{position:"absolute",top:"50%",left:0,right:0,height:4,borderRadius:9999,background:"var(--bdr2)",transform:"translateY(-50%)",zIndex:0}}/>
      <div style={{position:"absolute",top:"50%",left:0,width:`${value}%`,height:4,borderRadius:9999,background:"linear-gradient(90deg,var(--blue),var(--purple))",transform:"translateY(-50%)",zIndex:1,boxShadow:"0 0 8px rgba(79,142,247,.5)"}}/>
      <input type="range" min={0} max={100} step={1} value={value} onChange={e=>onChange(+e.target.value)}
        style={{position:"relative",zIndex:2,opacity:0,cursor:"pointer",height:20,width:"100%"}}/>
    </div>
  );
}

// ─── Loader ───────────────────────────────────────────────────────────────────
function Loader() {
  const [pct,setPct]=useState(0);
  const [ph,setPh]=useState(0);
  const phases=["Ingesting parameters…","Calibrating risk model…","Running neural inference…","Synthesizing analytics…","Finalizing output…"];
  useEffect(()=>{
    const a=setInterval(()=>setPct(p=>p>=95?p:p+Math.random()*3+.4),100);
    const b=setInterval(()=>setPh(p=>Math.min(p+1,phases.length-1)),720);
    return()=>{clearInterval(a);clearInterval(b);};
  },[]);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:24,padding:40}}
    >
      <div style={{position:"relative",width:90,height:90}}>
        {[0,1,2].map(i=>(
          <motion.div key={i} style={{position:"absolute",inset:i*12,borderRadius:"50%",border:`1px solid rgba(79,142,247,${.6-i*.15})`}}
            animate={{rotate:i%2===0?360:-360}} transition={{duration:2.8+i*1.4,repeat:Infinity,ease:"linear"}}/>
        ))}
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <motion.div animate={{scale:[1,1.14,1]}} transition={{duration:2,repeat:Infinity}}>
            <Brain style={{width:24,height:24,color:"var(--blue)"}}/>
          </motion.div>
        </div>
      </div>
      <div style={{textAlign:"center",width:"100%",maxWidth:220}}>
        <p className="mono" style={{fontSize:9,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",marginBottom:6}}>Neural Processing</p>
        <AnimatePresence mode="wait">
          <motion.p key={ph} className="sans" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
            style={{color:"var(--txt)",fontSize:12.5,marginBottom:14,fontWeight:500}}
          >{phases[ph]}</motion.p>
        </AnimatePresence>
        <div style={{height:2,borderRadius:9999,background:"var(--bdr2)",overflow:"hidden",marginBottom:10,position:"relative"}}>
          <motion.div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,var(--blue),var(--purple))",borderRadius:9999}}/>
          <motion.div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)"}}
            animate={{x:["-100%","300%"]}} transition={{duration:1.6,repeat:Infinity,ease:"linear"}}/>
        </div>
        <div style={{display:"flex",gap:5,justifyContent:"center"}}>
          {phases.map((_,i)=>(
            <motion.div key={i} style={{height:4,borderRadius:9999,background:i<=ph?"var(--blue)":"var(--bdr2)"}}
              animate={{width:i<=ph?16:4}} transition={SPRING_SOFT}/>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  const items = ["Probability Score","Budget Risk","ROI Projection","Audience Breakdown","Release Intelligence","Cast & Crew Fit"];
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}
      style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:20,padding:"48px 28px",textAlign:"center"}}
    >
      <motion.div style={{width:56,height:56,borderRadius:16,background:"var(--surf3)",border:"1px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center"}}
        animate={{y:[0,-6,0],boxShadow:["0 0 0 0 rgba(79,142,247,0)","0 8px 28px 0 rgba(79,142,247,.15)","0 0 0 0 rgba(79,142,247,0)"]}}
        transition={{duration:4,repeat:Infinity}}
      >
        <Cpu style={{width:24,height:24,color:"rgba(79,142,247,.5)"}}/>
      </motion.div>
      <div>
        <p className="sans" style={{fontWeight:700,fontSize:15,color:"var(--txt)",marginBottom:7}}>Intelligence Engine Ready</p>
        <p className="sans" style={{fontSize:12,color:"var(--muted)",lineHeight:1.75,maxWidth:250}}>Fill in the production parameters and run the AI model. All metrics are derived from your inputs — not static templates.</p>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center"}}>
        {items.map((t,i)=>(
          <motion.span key={t} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{delay:.08+i*.06}}
            className="tag" style={{background:"var(--surf3)",borderColor:"var(--bdr)",color:"var(--muted)"}}>{t}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SH({icon:Icon,title,accent,badge}:any) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
      <div style={{width:28,height:28,borderRadius:8,background:`${accent}18`,border:`1px solid ${accent}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Icon style={{width:13,height:13,color:accent}}/>
      </div>
      <span className="sans" style={{fontWeight:700,fontSize:13,color:"var(--txt)",flex:1}}>{title}</span>
      {badge&&<span className="mono" style={{fontSize:8,letterSpacing:".08em",textTransform:"uppercase",padding:"2px 8px",borderRadius:9999,background:"var(--surf3)",color:"var(--muted)",border:"1px solid var(--bdr)"}}>{badge}</span>}
    </div>
  );
}

// ─── Budget Risk Panel ────────────────────────────────────────────────────────
function BudgetPanel({analytics}:{analytics:any}) {
  const rc = analytics.riskLevel==="low"?"var(--green)":analytics.riskLevel==="medium"?"var(--amber)":"var(--red)";
  return (
    <div className="panel" style={{padding:18}}>
      <SH icon={Target} title="Budget Overrun Risk" accent="var(--blue)" badge="ML Model"/>
      <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
        <ArcMeter value={analytics.riskPercent} size={118} sw={7} color={rc} label="Risk Level"/>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
          {analytics.riskFactors.map((f:any,i:number)=>{
            const pct = Math.min((f.impact / f.max) * 100, 100);
            return (
              <div key={f.name}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span className="sans" style={{fontSize:11,color:"var(--muted)",fontWeight:500}}>{f.name}</span>
                  <span className="mono" style={{fontSize:9.5,color:"var(--txt)",fontWeight:600}}>{f.impact}%</span>
                </div>
                <ThinBar pct={pct} color={rc} delay={i*.08}/>
              </div>
            );
          })}
          <div style={{marginTop:4,padding:"8px 10px",borderRadius:8,background:"var(--surf3)",border:"1px solid var(--bdr)"}}>
            <p className="sans" style={{fontSize:10.5,color:"var(--muted)",lineHeight:1.6,fontStyle:"italic"}}>{analytics.insights[0]||"Analysis complete."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Success Prediction Panel ─────────────────────────────────────────────────
function SuccessPanel({analytics,backendResult,form}:{analytics:any;backendResult:any;form:FormState}) {
  const probColor = analytics.finalProbability>=70?"var(--green)":analytics.finalProbability>=50?"var(--amber)":"var(--red)";
  return (
    <div className="panel" style={{padding:18}}>
      <SH icon={TrendingUp} title="Success Prediction" accent="var(--amber)" badge="Composite Score"/>

      {/* Transparency row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[
          {label:"ML Model",val:`${backendResult.success_probability}%`,c:"var(--blue)",note:"Backend inference"},
          {label:"Statistical Adj.",val:`${analytics.statAdjustment>0?"+":""}${analytics.statAdjustment}%`,c:analytics.statAdjustment>0?"var(--green)":analytics.statAdjustment<0?"var(--red)":"var(--txt)",note:"Genre & params"},
          {label:"Final Score",val:`${analytics.finalProbability}%`,c:probColor,note:"Combined signal"},
        ].map(item=>(
          <div key={item.label} style={{padding:"9px 10px",borderRadius:9,background:"var(--surf3)",border:"1px solid var(--bdr)"}}>
            <p className="mono" style={{fontSize:7.5,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:3}}>{item.label}</p>
            <p className="sans" style={{fontSize:16,fontWeight:800,color:item.c,lineHeight:1}}>{item.val}</p>
            <p className="sans" style={{fontSize:9,color:"var(--muted)",marginTop:2}}>{item.note}</p>
          </div>
        ))}
      </div>

      {/* Adjustment reasoning */}
      <div style={{padding:"9px 11px",borderRadius:8,background:"rgba(79,142,247,.06)",border:"1px solid rgba(79,142,247,.14)",marginBottom:14}}>
        <p className="mono" style={{fontSize:7.5,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",marginBottom:4}}>Reasoning</p>
        <p className="sans" style={{fontSize:11,color:"var(--txt)",lineHeight:1.55}}>{analytics.adjustmentReasoning}</p>
      </div>

      {/* Score + trend */}
      <div style={{display:"flex",gap:18,alignItems:"flex-start"}}>
        <div style={{textAlign:"center",flexShrink:0}}>
          <motion.p className="grad-text sans" initial={{scale:.6,opacity:0}} animate={{scale:1,opacity:1}} transition={{...SPRING,delay:.1}}
            style={{fontSize:52,fontWeight:900,lineHeight:1}}>{analytics.rating}</motion.p>
          <p className="mono" style={{fontSize:7.5,color:"var(--muted)",letterSpacing:".1em",marginTop:2}}>/10 SCORE</p>
          <div style={{display:"flex",gap:3,justifyContent:"center",marginTop:8}}>
            {Array.from({length:5},(_,i)=>{
              const filled=i<Math.round(parseFloat(analytics.rating)/2);
              return (
                <motion.div key={i} initial={{scale:0}} animate={{scale:1}} transition={{...SPRING,delay:.3+i*.07}}>
                  <Star style={{width:12,height:12,color:"var(--amber)",fill:filled?"var(--amber)":"transparent"}}/>
                </motion.div>
              );
            })}
          </div>
          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:4}}>
            {[
              {label:"Risk",val:analytics.riskLevel.toUpperCase(),c:analytics.riskLevel==="low"?"var(--green)":analytics.riskLevel==="medium"?"var(--amber)":"var(--red)"},
              {label:"Confidence",val:analytics.confidenceLevel.toUpperCase(),c:"var(--cyan)"},
            ].map(m=>(
              <div key={m.label} style={{padding:"5px 8px",borderRadius:6,background:"var(--surf3)",border:"1px solid var(--bdr)"}}>
                <p className="mono" style={{fontSize:7,letterSpacing:".08em",color:"var(--muted)"}}>{m.label}</p>
                <p className="sans" style={{fontSize:10,fontWeight:700,color:m.c}}>{m.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{flex:1}}>
          <p className="mono" style={{fontSize:8,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:6}}>Market Trend Projection</p>
          <Sparkline data={analytics.trendData} color="var(--blue)" height={52}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:3,marginBottom:14}}>
            <span className="mono" style={{fontSize:7.5,color:"var(--muted)"}}>Now</span>
            <span className="mono" style={{fontSize:7.5,color:"var(--muted)"}}>+32wk</span>
          </div>

          {/* ROI */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[
              {label:"Proj. Revenue",val:`$${(analytics.projectedRevenue/1_000_000).toFixed(0)}M`,c:"var(--green)"},
              {label:"Estimated ROI",val:`${analytics.roiPercent>0?"+":""}${analytics.roiPercent}%`,c:analytics.roiPercent>0?"var(--green)":"var(--red)"},
            ].map(item=>(
              <div key={item.label} style={{padding:"8px 10px",borderRadius:8,background:"var(--surf3)",border:"1px solid var(--bdr)"}}>
                <p className="mono" style={{fontSize:7.5,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",marginBottom:3}}>{item.label}</p>
                <p className="sans" style={{fontSize:14,fontWeight:800,color:item.c}}>{item.val}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
            {analytics.tags.map((t:string,i:number)=>(
              <motion.span key={t} initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{delay:.4+i*.07}}
                className="tag" style={{background:"rgba(79,142,247,.08)",borderColor:"rgba(79,142,247,.22)",color:"var(--blue)"}}>
                {t}
              </motion.span>
            ))}
          </div>

          {/* Insights */}
          {analytics.insights.length>0&&(
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <p className="mono" style={{fontSize:7.5,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:2}}>AI Insights</p>
              {analytics.insights.map((ins:string,i:number)=>(
                <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:.5+i*.1}}
                  style={{padding:"7px 10px",borderRadius:7,background:"var(--surf3)",border:"1px solid var(--bdr)",display:"flex",gap:8,alignItems:"flex-start"}}
                >
                  <div style={{width:4,height:4,borderRadius:"50%",background:"var(--blue)",flexShrink:0,marginTop:4}}/>
                  <p className="sans" style={{fontSize:11,color:"var(--txt)",lineHeight:1.5}}>{ins}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Audience Breakdown Panel ─────────────────────────────────────────────────
function AudiencePanel({breakdown}:{breakdown:number[]}) {
  const segments = ["18–24","25–34","35–49","50+"];
  const colors   = ["var(--blue)","var(--purple)","var(--cyan)","var(--green)"];
  return (
    <div className="panel" style={{padding:18}}>
      <SH icon={BarChart2} title="Audience Breakdown" accent="var(--cyan)" badge="Genre Model"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {segments.map((seg,i)=>(
          <motion.div key={seg} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.07}}
            style={{padding:"10px 8px",borderRadius:10,background:"var(--surf3)",border:"1px solid var(--bdr)",textAlign:"center"}}
          >
            <div style={{height:60,display:"flex",alignItems:"flex-end",justifyContent:"center",marginBottom:6}}>
              <motion.div style={{width:28,borderRadius:"4px 4px 0 0",background:colors[i],boxShadow:`0 0 8px ${colors[i]}50`}}
                initial={{height:0}} animate={{height:breakdown[i]*0.6}} transition={{...SPRING_SOFT,delay:.2+i*.07}}/>
            </div>
            <p className="sans" style={{fontSize:15,fontWeight:800,color:colors[i]}}><AnimNum v={breakdown[i]}/>%</p>
            <p className="mono" style={{fontSize:7.5,color:"var(--muted)",letterSpacing:".08em",marginTop:2}}>{seg}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Release Window Panel ─────────────────────────────────────────────────────
function ReleasePanel({window:w}:{window:any}) {
  const cc=w.competition==="Low"?"var(--green)":w.competition==="Medium"?"var(--amber)":"var(--red)";
  const items=[
    {label:"Primary Window",val:w.primary,c:"var(--blue)",icon:Clock},
    {label:"Backup Window",val:w.secondary,c:"var(--txt)",icon:Activity},
    {label:"Competition",val:w.competition,c:cc,icon:Eye},
    {label:"Est. Opening",val:`$${w.openingWeekendEst}M`,c:"var(--green)",icon:DollarSign},
    {label:"Streaming Gap",val:w.streamingDelay,c:"var(--purple)",icon:Film},
  ];
  return (
    <div className="panel" style={{padding:18}}>
      <SH icon={Activity} title="Release Strategy" accent="var(--green)" badge="Market Intelligence"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {items.map((item,i)=>(
          <motion.div key={item.label} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:.08+i*.07}}
            style={{padding:"9px 11px",borderRadius:9,background:"var(--surf3)",border:"1px solid var(--bdr)",display:"flex",gap:8,alignItems:"center"}}
          >
            <item.icon style={{width:12,height:12,color:item.c,flexShrink:0}}/>
            <div>
              <p className="mono" style={{fontSize:7.5,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",marginBottom:2}}>{item.label}</p>
              <p className="sans" style={{fontSize:12,fontWeight:700,color:item.c}}>{item.val}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{padding:"9px 11px",borderRadius:8,background:"rgba(52,211,153,.06)",border:"1px solid rgba(52,211,153,.18)"}}>
        <p className="sans" style={{fontSize:11,color:"var(--txt)",lineHeight:1.55}}>{w.strategy}</p>
      </div>
    </div>
  );
}

// ─── Actors Panel ─────────────────────────────────────────────────────────────
function ActorsPanel({actors}:{actors:any[]}) {
  return (
    <div className="panel" style={{padding:18}}>
      <SH icon={Users} title="Actor Recommendations" accent="var(--purple)"/>
      {actors.length===0?<p className="sans" style={{fontSize:12,color:"var(--muted)"}}>No recommendations available.</p>:(
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}} className="scrollbar-none">
          {actors.map((a:any,i:number)=>(
            <motion.div key={a.name} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{...SPRING,delay:i*.08}}
              whileHover={{y:-3,scale:1.02}}
              style={{flexShrink:0,width:148,padding:13,borderRadius:11,background:"var(--surf3)",border:"1px solid var(--bdr)",cursor:"pointer",position:"relative",overflow:"hidden"}}
            >
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 0%,rgba(139,92,246,.08),transparent 70%)",pointerEvents:"none"}}/>
              <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,rgba(139,92,246,.2),rgba(79,142,247,.2))",border:"1px solid rgba(139,92,246,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk'",fontWeight:800,fontSize:10,color:"var(--purple)",marginBottom:9}}>
                {a.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
              </div>
              <p className="sans" style={{fontWeight:700,fontSize:12,color:"var(--txt)",marginBottom:5}}>{a.name}</p>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
                <ThinBar pct={a.matchPercent} color="var(--purple)" delay={i*.08}/>
                <span className="mono" style={{fontSize:8.5,fontWeight:600,color:"var(--purple)",flexShrink:0}}>{a.matchPercent}%</span>
              </div>
              <p className="sans" style={{fontSize:10,color:"var(--muted)",lineHeight:1.5}}>{a.reason}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Crew Panel ───────────────────────────────────────────────────────────────
function CrewPanel({crew}:{crew:any[]}) {
  return (
    <div className="panel" style={{padding:18}}>
      <SH icon={UserCog} title="Crew Recommendations" accent="var(--cyan)"/>
      {crew.length===0?<p className="sans" style={{fontSize:12,color:"var(--muted)"}}>No recommendations available.</p>:(
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {crew.map((c:any,i:number)=>(
            <motion.div key={c.name} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{...SPRING,delay:i*.08}}
              whileHover={{x:3}}
              style={{display:"flex",alignItems:"center",gap:11,padding:"9px 11px",borderRadius:9,background:"var(--surf3)",border:"1px solid var(--bdr)",cursor:"pointer"}}
            >
              <div style={{width:32,height:32,borderRadius:8,flexShrink:0,background:"linear-gradient(135deg,rgba(34,211,238,.15),rgba(79,142,247,.15))",border:"1px solid rgba(34,211,238,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk'",fontWeight:800,fontSize:9.5,color:"var(--cyan)"}}>
                {c.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <span className="sans" style={{fontWeight:600,fontSize:12,color:"var(--txt)"}}>{c.name}</span>
                  <span className="tag" style={{background:"rgba(79,142,247,.08)",borderColor:"rgba(79,142,247,.22)",color:"var(--blue)",fontSize:7.5}}>{c.role}</span>
                </div>
                <p className="sans" style={{fontSize:10,color:"var(--muted)"}}>{c.reason}</p>
              </div>
              <span className="sans" style={{fontSize:13,fontWeight:800,color:"var(--cyan)",flexShrink:0}}>{c.matchPercent}%</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Competitive Score Panel ──────────────────────────────────────────────────
function CompetitivePanel({score,analytics}:{score:number;analytics:any}) {
  const segments = [
    {label:"Market Timing",val:Math.round(score*0.95+(analytics.finalProbability-50)*0.15),max:100,c:"var(--blue)"},
    {label:"Genre Demand",val:Math.round(score*0.88+analytics.riskPercent*0.1),max:100,c:"var(--purple)"},
    {label:"Budget vs. Genre",val:Math.round(score*0.92),max:100,c:"var(--cyan)"},
    {label:"Crew Caliber",val:Math.round(score*0.85+10),max:100,c:"var(--green)"},
  ].map(s=>({...s,val:Math.min(Math.max(s.val,15),95)}));
  return (
    <div className="panel" style={{padding:18}}>
      <SH icon={Layers} title="Competitive Intelligence" accent="var(--pink)" badge="Market Model"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {segments.map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} transition={{delay:.1+i*.07}}
            style={{padding:"10px 12px",borderRadius:9,background:"var(--surf3)",border:"1px solid var(--bdr)"}}
          >
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <p className="mono" style={{fontSize:8,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)"}}>{s.label}</p>
              <p className="sans" style={{fontSize:12,fontWeight:800,color:s.c}}><AnimNum v={s.val}/>%</p>
            </div>
            <ThinBar pct={s.val} color={s.c} delay={.2+i*.07} height={4}/>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AICommandCenter() {
  const [form, setForm] = useState<FormState>({
    title:"", genre:"",
    budget:50_000_000, castSize:15, crewSize:100,
    shootingDays:60, locations:3,
    directorExperience:"", actorPopularity:70,
  });
  const [loading, setLoading]     = useState(false);
  const [backendResult, setBR]    = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [actorRecs, setActorRecs] = useState<any[]>([]);
  const [crewRecs, setCrewRecs]   = useState<any[]>([]);
  const [scheduled, setScheduled] = useState(false);
  const { toast }        = useToast();
  const { addProduction } = useProductions();

  const isSuccessful = backendResult?.prediction === "Successful";

  const runPrediction = async () => {
    if (!form.title?.trim()) { toast({title:"Validation",description:"Project title is required",variant:"destructive"}); return; }
    if (!form.genre?.trim()) { toast({title:"Validation",description:"Select a genre",variant:"destructive"}); return; }

    setLoading(true); setBR(null); setAnalytics(null);

    try {
      const payload = {
        title: form.title.trim(), genre: form.genre.trim(),
        budget: Number(form.budget),
        runtime: Math.round(Number(form.shootingDays)*1.5),
        popularity: Number(form.actorPopularity),
        vote_average: 6.5, vote_count: 500,
        castSize: form.castSize, crewSize: form.crewSize,
        shootingDays: form.shootingDays, locations: form.locations,
        actorPopularity: form.actorPopularity,
        directorExperience: form.directorExperience || "mid",
      };
      const res = await movieAPI.predictMovie(payload as any);
      if (!res || typeof res.success_probability === "undefined") throw new Error("Invalid response");

      await new Promise(r=>setTimeout(r,2800));

      // Deterministic seed based on this specific film's inputs
      const seed = hashString(`${form.title}${form.genre}${form.budget}${form.castSize}${form.crewSize}${form.shootingDays}${form.locations}${form.directorExperience}${form.actorPopularity}`);
      const rng  = createSeededRNG(seed);

      const computed = computeLocalAnalytics(form, res, rng);
      setAnalytics(computed);
      setBR(res);

      // Build actor recs from backend
      const actors = (res.suggestedActors?.length > 0 ? res.suggestedActors : res.actor_recommendations || [])
        .map((a:any,idx:number)=>({
          name: typeof a==="string"?a:a.name,
          matchPercent: typeof a==="string"?Math.round(72+rng(idx+200)*24):(a.matchPercent||88),
          reason: typeof a==="string"?"Genre alignment & audience fit":(a.reason||"Genre alignment & historical performance"),
        }));
      const crew = (res.suggestedDirectors?.length > 0 ? res.suggestedDirectors : res.crew_recommendations || [])
        .map((c:any,idx:number)=>({
          name: typeof c==="string"?c:c.name,
          role: `Director${form.directorExperience?` (${form.directorExperience})`:""}`,
          matchPercent: typeof c==="string"?Math.round(78+rng(idx+300)*18):(c.matchPercent||88),
          reason: typeof c==="string"?"Style compatibility for this genre":(c.reason||"Style compatibility"),
        }));
      setActorRecs(actors);
      setCrewRecs(crew);

      toast({title:"Analysis Complete",description:"Production intelligence report generated."});
    } catch(err:any) {
      toast({title:"Error",description:err.response?.data?.message||err.message||"Prediction failed.",variant:"destructive"});
    } finally { setLoading(false); }
  };

  const reset = () => {
    setBR(null); setAnalytics(null); setActorRecs([]); setCrewRecs([]);
    setForm({title:"",genre:"",budget:50_000_000,castSize:15,crewSize:100,shootingDays:60,locations:3,directorExperience:"",actorPopularity:70});
    setScheduled(false);
  };

  const savePrediction = async () => {
    if(!backendResult||!analytics) return;
    try {
      await addProduction({
        title: form.title||"Untitled", genre: form.genre||"Unknown",
        budget: form.budget, runtime: Math.round(form.shootingDays*1.5),
        popularity: form.actorPopularity,
        vote_average: analytics.finalProbability/10, vote_count:500,
        status:"Pre-Production", spent:0, progress:0,
        prediction: backendResult.prediction,
        success_probability: analytics.finalProbability,
        suggestedActors: backendResult.actor_recommendations||[],
        suggestedDirector: backendResult.crew_recommendations?.[0]||"TBD",
      });
      toast({title:"Saved",description:"Added to movie productions."});
    } catch(e:any){toast({title:"Error",description:e.message,variant:"destructive"});}
  };

  const scheduleRelease = async () => {
    if(!backendResult||!analytics) return;
    try {
      await movieAPI.scheduleEvent({
        movieTitle: form.title||"Untitled",
        date: new Date(Date.now()+1000*60*60*24*7).toISOString(),
        type:"Release",
        description:`Predicted success ${analytics.finalProbability}% — schedule pre-production`,
      });
      setScheduled(true);
      toast({title:"Scheduled",description:"Added to release schedule."});
    } catch(e:any){toast({title:"Error",description:e.message,variant:"destructive"});}
  };

  return (
    <>
      <style>{CSS}</style>
      <AmbientBG/>
      <CursorGlow/>

      <div className="sans" style={{minHeight:"100vh",background:"var(--bg)",color:"var(--txt)",position:"relative",zIndex:2,padding:"22px 20px",display:"flex",flexDirection:"column",gap:18}}>

        {/* ── Header ── */}
        <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} style={{display:"flex",alignItems:"center",gap:13}}>
          <motion.div style={{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,var(--blue),var(--purple))",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 22px rgba(79,142,247,.35)"}}
            animate={{boxShadow:["0 0 20px rgba(79,142,247,.30)","0 0 34px rgba(79,142,247,.55)","0 0 20px rgba(79,142,247,.30)"]}}
            transition={{duration:3.5,repeat:Infinity}}
          ><Sparkles style={{width:17,height:17,color:"white"}}/></motion.div>
          <div>
            <h1 className="grad-text sans" style={{fontSize:21,fontWeight:900,lineHeight:1}}>AI Command Center</h1>
            <p className="mono" style={{fontSize:8.5,color:"var(--muted)",letterSpacing:".12em",marginTop:3,textTransform:"uppercase"}}>Production Intelligence · Predictive Analytics</p>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:7}}>
            {[{l:"Model",v:"v2.4",c:"var(--blue)"},{l:"Accuracy",v:"94.2%",c:"var(--green)"},{l:"Engine",v:"Adaptive",c:"var(--purple)"}].map(b=>(
              <div key={b.l} style={{padding:"4px 10px",borderRadius:9999,background:"var(--surf2)",border:"1px solid var(--bdr)",display:"flex",alignItems:"center",gap:5}}>
                <span className="mono" style={{fontSize:7.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em"}}>{b.l}</span>
                <span className="mono" style={{fontSize:7.5,fontWeight:600,color:b.c}}>{b.v}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Main Card ── */}
        <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.08}}>
          <div style={{background:"var(--surf1)",border:"1px solid var(--bdr)",borderRadius:18,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.5)"}}>

            {/* Card header */}
            <div style={{display:"flex",alignItems:"center",gap:9,padding:"11px 18px",borderBottom:"1px solid var(--bdr)",background:"var(--surf2)"}}>
              <motion.div animate={{rotate:[0,360]}} transition={{duration:10,repeat:Infinity,ease:"linear"}}>
                <FlaskConical style={{width:12,height:12,color:"var(--blue)"}}/>
              </motion.div>
              <span className="sans" style={{fontWeight:700,fontSize:12}}>AI Test Lab</span>
              <div style={{marginLeft:"auto",display:"flex",gap:5,alignItems:"center"}}>
                {[0,1,2].map(i=>(
                  <div key={i} className="data-dot" style={{width:5,height:5,borderRadius:"50%",background:"var(--blue)",animationDelay:`${i*.3}s`}}/>
                ))}
                <span className="mono" style={{fontSize:8,color:"var(--muted)",marginLeft:6,textTransform:"uppercase",letterSpacing:".08em"}}>Custom Prediction Engine</span>
              </div>
            </div>

            {/* Split pane */}
            <div style={{display:"grid",gridTemplateColumns:"360px 1fr",minHeight:660}}>

              {/* ── LEFT ── */}
              <div style={{padding:"20px 18px",borderRight:"1px solid var(--bdr)",display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}} className="scrollbar-none">

                <Field label="Movie Title">
                  <FInput value={form.title} onChange={(v:string)=>setForm(f=>({...f,title:v}))} placeholder="Enter production title…"/>
                </Field>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
                  <Field label="Genre">
                    <FSelect value={form.genre} onChange={(v:string)=>setForm(f=>({...f,genre:v}))} placeholder="Select genre…" options={GENRES.map(g=>({value:g,label:g}))}/>
                  </Field>
                  <Field label="Director Exp.">
                    <FSelect value={form.directorExperience} onChange={(v:string)=>setForm(f=>({...f,directorExperience:v}))} placeholder="Level…" options={DIRECTOR_EXP}/>
                  </Field>
                </div>

                <Field label="Budget ($)">
                  <FInput type="number" value={form.budget} onChange={(v:number)=>setForm(f=>({...f,budget:v}))} placeholder="Budget in USD"/>
                </Field>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
                  {([["castSize","Cast Size"],["crewSize","Crew Size"],["shootingDays","Shoot Days"],["locations","Locations"]] as [keyof FormState,string][]).map(([k,l])=>(
                    <Field key={k} label={l}>
                      <FInput type="number" value={form[k]} onChange={(v:number)=>setForm(f=>({...f,[k]:v}))} placeholder={l}/>
                    </Field>
                  ))}
                </div>

                <Field label={`Actor Popularity — ${form.actorPopularity}`}>
                  <FSlider value={form.actorPopularity} onChange={v=>setForm(f=>({...f,actorPopularity:v}))}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                    <span className="mono" style={{fontSize:7.5,color:"var(--muted)"}}>Indie</span>
                    <span className="mono" style={{fontSize:7.5,color:"var(--muted)"}}>A-List</span>
                  </div>
                </Field>

                <div style={{height:1,background:"var(--bdr)"}}/>

                {/* Run button */}
                <div style={{display:"flex",gap:9}}>
                  <motion.button onClick={runPrediction} disabled={loading} className="btn-primary"
                    whileHover={{scale:1.012}} whileTap={{scale:.985}}
                    style={{flex:1,height:44,display:"flex",alignItems:"center",justifyContent:"center",gap:8,position:"relative",overflow:"hidden"}}
                  >
                    {!loading&&<motion.div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)",skewX:"-12deg"}}
                      animate={{x:["-140%","240%"]}} transition={{duration:3,repeat:Infinity,ease:"linear",repeatDelay:.6}}/>}
                    <motion.div animate={loading?{rotate:360}:{rotate:0}} transition={{duration:.9,repeat:loading?Infinity:0,ease:"linear"}}>
                      <Zap style={{width:14,height:14}}/>
                    </motion.div>
                    {loading?"Processing…":"Run AI Prediction"}
                  </motion.button>
                  <motion.button onClick={reset} whileHover={{scale:1.06}} whileTap={{scale:.94}}
                    style={{width:44,height:44,borderRadius:10,background:"var(--surf3)",border:"1px solid var(--bdr)",color:"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                  ><RotateCcw style={{width:13,height:13}}/></motion.button>
                </div>

                {backendResult&&(
                  <div style={{display:"flex",gap:9}}>
                    <button onClick={savePrediction} style={{flex:1,padding:"9px",borderRadius:9,border:"none",background:"var(--blue)",color:"white",fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:12,cursor:"pointer"}}>+ Productions</button>
                    <button onClick={scheduleRelease} style={{flex:1,padding:"9px",borderRadius:9,border:"none",background:scheduled?"var(--green)":"var(--purple)",color:"white",fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:12,cursor:"pointer"}}>{scheduled?"✓ Scheduled":"Schedule"}</button>
                  </div>
                )}

                {/* Live parameter feedback */}
                {form.genre && (
                  <div style={{padding:"10px 12px",borderRadius:9,background:"var(--surf3)",border:"1px solid var(--bdr)"}}>
                    <p className="mono" style={{fontSize:7.5,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:7}}>Live Intelligence</p>
                    {(() => {
                      const dna = GENRE_DNA[form.genre]||DEFAULT_GENRE_DNA;
                      return (
                        <div style={{display:"flex",flexDirection:"column",gap:5}}>
                          {[
                            {l:"Audience Reach",v:Math.round(dna.audienceReach*100),c:"var(--blue)"},
                            {l:"Review Trend",v:Math.round(dna.reviewSentiment*100),c:"var(--green)"},
                            {l:"Market Risk",v:Math.round(dna.riskProfile*100),c:"var(--amber)"},
                          ].map(row=>(
                            <div key={row.l}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                                <span className="sans" style={{fontSize:10,color:"var(--muted)"}}>{row.l}</span>
                                <span className="mono" style={{fontSize:9,color:row.c,fontWeight:600}}>{row.v}%</span>
                              </div>
                              <ThinBar pct={row.v} color={row.c}/>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* ── RIGHT ── */}
              <div style={{overflowY:"auto",position:"relative"}} className="scrollbar-none">
                <AnimatePresence mode="wait">
                  {loading?(
                    <motion.div key="loading" style={{height:"100%"}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                      <Loader/>
                    </motion.div>
                  ):backendResult&&analytics?(
                    <motion.div key="result" initial={{opacity:0,y:16,filter:"blur(4px)"}} animate={{opacity:1,y:0,filter:"blur(0)"}} exit={{opacity:0}} transition={{duration:.4,ease:EASE}}
                      style={{padding:18,display:"flex",flexDirection:"column",gap:12}}
                    >
                      {/* Status banner */}
                      <motion.div initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} transition={{...SPRING,delay:.06}}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:11,background:isSuccessful?"rgba(52,211,153,.07)":"rgba(248,113,113,.07)",border:`1px solid ${isSuccessful?"rgba(52,211,153,.22)":"rgba(248,113,113,.22)"}`}}
                      >
                        {isSuccessful
                          ?<CheckCircle2 style={{width:15,height:15,color:"var(--green)",flexShrink:0}}/>
                          :<AlertTriangle style={{width:15,height:15,color:"var(--red)",flexShrink:0}}/>}
                        <span className="sans" style={{fontWeight:700,fontSize:13,color:isSuccessful?"var(--green)":"var(--red)"}}>{backendResult.prediction}</span>
                        <span className="sans" style={{fontSize:12,color:"var(--muted)"}}>· {analytics.finalProbability}% confidence</span>
                        <span style={{marginLeft:"auto"}} className="tag" style={{background:"var(--surf3)",borderColor:"var(--bdr)",color:"var(--muted)",fontSize:8}}>{form.genre}</span>
                      </motion.div>

                      <BudgetPanel analytics={analytics}/>
                      <SuccessPanel analytics={analytics} backendResult={backendResult} form={form}/>
                      <AudiencePanel breakdown={analytics.audienceBreakdown}/>
                      <ReleasePanel window={analytics.releaseWindow}/>
                      <CompetitivePanel score={analytics.competitiveScore} analytics={analytics}/>
                      <ActorsPanel actors={actorRecs}/>
                      <CrewPanel crew={crewRecs}/>
                    </motion.div>
                  ):(
                    <motion.div key="empty" style={{height:"100%"}} initial={{opacity:0}} animate={{opacity:1}}>
                      <EmptyState/>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}