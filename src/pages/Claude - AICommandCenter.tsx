import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles, Brain, FlaskConical, Zap,
  Star, Users, UserCog,
  RotateCcw, Target, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2, Activity,
  Eye, Layers, BarChart2, Shield
} from "lucide-react";
import { movieAPI } from "@/services/movieAPI";
import { useToast } from "@/hooks/use-toast";
import { useProductions } from "@/contexts/ProductionsContext";

// ─── Constants ────────────────────────────────────────────────────────────────
const SPRING      = { type: "spring", stiffness: 380, damping: 32 } as const;
const SPRING_SOFT = { type: "spring", stiffness: 200, damping: 26 } as const;
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

// ─── Global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

  :root {
    --blue:   213 94% 58%;
    --indigo: 243 75% 63%;
    --violet: 270 72% 62%;
    --cyan:   190 88% 52%;
    --emerald:158 68% 48%;
    --amber:  42 92% 54%;
    --rose:   348 78% 58%;
    --bg:     224 22% 4%;
    --surf:   224 18% 7%;
    --surf2:  224 16% 10%;
    --surf3:  224 14% 14%;
    --bdr:    224 14% 17%;
    --bdr2:   224 12% 22%;
    --txt:    224 14% 90%;
    --txt2:   224 10% 65%;
    --muted:  224 10% 40%;
  }

  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 12px hsla(213,94%,58%,.25); }
    50%      { box-shadow: 0 0 28px hsla(213,94%,58%,.55); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes scan {
    0%   { transform: translateY(-100%); opacity: 0; }
    10%  { opacity: .6; }
    90%  { opacity: .6; }
    100% { transform: translateY(100%); opacity: 0; }
  }
  @keyframes typewriter {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes blink {
    0%,100% { opacity:1; } 50% { opacity:0; }
  }
  @keyframes row-in {
    from { opacity:0; transform:translateX(-10px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes breathe {
    0%,100% { opacity:.5; transform:scale(1); }
    50%     { opacity:.9; transform:scale(1.05); }
  }
  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes counter-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }

  .glass-panel {
    background: hsl(var(--surf));
    border: 1px solid hsl(var(--bdr));
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(12px);
  }
  .glass-panel::before {
    content:'';
    position:absolute; inset:0;
    background: linear-gradient(135deg, rgba(255,255,255,.028) 0%, transparent 50%);
    pointer-events:none;
    border-radius:inherit;
  }

  .field-label {
    font-family:'Space Mono',monospace;
    font-size:9px; font-weight:700;
    letter-spacing:.14em; text-transform:uppercase;
    color:hsl(var(--muted));
    display:block; margin-bottom:7px;
  }

  input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;width:100%;cursor:pointer;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:white;border:2px solid hsl(var(--blue));box-shadow:0 0 10px hsla(213,94%,58%,.6);margin-top:-5px;transition:transform .15s;}
  input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2);}
  input[type=range]::-webkit-slider-runnable-track{height:4px;border-radius:4px;background:hsl(var(--bdr2));}

  .no-sb::-webkit-scrollbar{display:none;}
  .no-sb{-ms-overflow-style:none;scrollbar-width:none;}

  .scanline {
    position: absolute;
    left: 0; right: 0;
    height: 60px;
    background: linear-gradient(to bottom, transparent, rgba(99,179,255,.04), transparent);
    pointer-events: none;
    animation: scan 5s linear infinite;
  }

  .ai-thinking {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: hsl(var(--cyan));
    animation: blink 1s ease-in-out infinite;
  }

  .token-badge {
    font-family: 'Space Mono', monospace;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 9999px;
    border: 1px solid;
  }
`;

// ─── AI Analysis Engine (calls Anthropic API) ─────────────────────────────────
async function runAIAnalysis(formData: any, backendResult: any) {
  const prompt = `You are a senior Hollywood film analyst and production expert. Analyze this movie production and provide a comprehensive, realistic, data-driven analysis. Be specific, analytical, and vary your responses based on the exact inputs.

PRODUCTION DATA:
- Title: "${formData.title}"
- Genre: ${formData.genre}
- Budget: $${(formData.budget / 1_000_000).toFixed(1)}M
- Cast Size: ${formData.castSize} actors
- Crew Size: ${formData.crewSize} crew members
- Shooting Days: ${formData.shootingDays} days
- Locations: ${formData.locations} locations
- Director Experience: ${formData.directorExperience}
- Actor Popularity Score: ${formData.actorPopularity}/100
- Backend Prediction: ${backendResult.prediction} (${backendResult.success_probability}% probability)

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "budgetAnalysis": {
    "overrunRiskPercent": <integer 5-95, calculated from actual budget/crew/days complexity>,
    "overrunRiskLevel": "<low|medium|high>",
    "factors": [
      { "name": "Budget Scale", "impact": <0-20>, "description": "<specific insight>" },
      { "name": "Crew Complexity", "impact": <0-20>, "description": "<specific insight>" },
      { "name": "Production Length", "impact": <0-20>, "description": "<specific insight>" },
      { "name": "Location Logistics", "impact": <0-20>, "description": "<specific insight>" },
      { "name": "Director Track Record", "impact": <0-20>, "description": "<specific insight>" }
    ],
    "keyInsight": "<2-sentence expert insight specific to this production>",
    "contingencyRecommendation": "<specific dollar amount or percentage>"
  },
  "successAnalysis": {
    "adjustedProbability": <integer 1-99>,
    "confidenceLevel": "<Low|Moderate|High|Very High>",
    "confidenceScore": <integer 60-98>,
    "riskLevel": "<low|medium|high>",
    "marketPositioning": "<Sharp 1-sentence positioning statement>",
    "competitiveAdvantage": "<What makes this film stand out>",
    "primaryRisk": "<The biggest single risk factor>",
    "sentimentScore": <integer 1-10 with one decimal>,
    "audienceResonanceScore": <integer 50-99>,
    "criticalReceptionLikelihood": "<Poor|Mixed|Positive|Strong>",
    "boxOfficeRange": { "low": "<$XM>", "mid": "<$XM>", "high": "<$XM>" },
    "tags": ["<3-5 specific tags like genre+descriptor>"],
    "trendData": [<12 integers 20-100 representing market trend projection>],
    "improvementTips": ["<3 specific, actionable tips>"]
  },
  "releaseStrategy": {
    "optimalWindow": "<Specific quarter and year>",
    "secondaryWindow": "<Alternative if primary is crowded>",
    "platformStrategy": "<Theatrical/Streaming/Hybrid recommendation>",
    "competitionLevel": "<Low|Medium|High>",
    "marketingBudgetSuggestion": "<Specific percentage of production budget>",
    "targetDemographic": "<Primary audience descriptor>",
    "positioning": "<How to position this film in the market>",
    "internationalPotential": "<Low|Medium|High|Very High>",
    "openingWeekendEstimate": "<$XM range>",
    "awardsViability": "<None|Possible|Likely|Strong>"
  },
  "castRecommendations": [
    {
      "name": "<Real actor name appropriate for this genre/budget>",
      "matchScore": <integer 70-98>,
      "tier": "<A-List|B-List|Rising Star|Character Actor>",
      "reason": "<Specific reason: recent work, genre fit, audience draw>",
      "riskFactor": "<Availability|Budget|Age|None>",
      "recentWork": "<One recent notable project>"
    }
  ],
  "crewRecommendations": [
    {
      "name": "<Real director/cinematographer name>",
      "role": "<Specific role: Director|DP|Production Designer|Composer>",
      "matchScore": <integer 72-97>,
      "tier": "<Elite|Established|Rising>",
      "reason": "<Specific reason based on their known style and genre work>",
      "knownFor": "<1-2 notable works>"
    }
  ],
  "productionIntelligence": {
    "shootingDayEfficiency": <integer 60-99>,
    "castChemistryScore": <integer 50-99>,
    "scriptRiskScore": <integer 10-90>,
    "distributionScore": <integer 40-99>,
    "marketTimingScore": <integer 30-99>,
    "overallHealthScore": <integer 40-99>,
    "keyMilestones": ["<3 critical production milestones with timeframes>"],
    "watchoutFlags": ["<2-3 specific warnings for this production>"]
  }
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1800,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const text = data.content?.find((b: any) => b.type === "text")?.text || "";
  
  // Strip any markdown fences if present
  const clean = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(clean);
}

// ─── Ambient BG ───────────────────────────────────────────────────────────────
function AmbientBG() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:`radial-gradient(ellipse 80% 50% at 20% 20%, hsla(213,94%,58%,.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, hsla(270,72%,62%,.04) 0%, transparent 60%)`,
      }}/>
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:`linear-gradient(rgba(99,179,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,255,.015) 1px,transparent 1px)`,
        backgroundSize:"48px 48px",
      }}/>
      {[
        {x:"8%",y:"12%",r:600,c:"59,130,246",d:20},
        {x:"85%",y:"6%",r:400,c:"139,92,246",d:24},
        {x:"55%",y:"75%",r:350,c:"16,185,129",d:18},
        {x:"92%",y:"82%",r:320,c:"99,102,241",d:22},
        {x:"35%",y:"45%",r:280,c:"59,130,246",d:26},
      ].map((o,i)=>(
        <motion.div key={i} style={{
          position:"absolute",left:o.x,top:o.y,
          width:o.r,height:o.r,borderRadius:"50%",
          background:`radial-gradient(circle,rgba(${o.c},.04) 0%,transparent 70%)`,
          filter:"blur(40px)",transform:"translate(-50%,-50%)",
        }}
          animate={{x:[0,25,-20,15,0],y:[0,-20,15,-8,0]}}
          transition={{duration:o.d,repeat:Infinity,ease:"easeInOut"}}
        />
      ))}
      {/* Noise texture */}
      <div style={{position:"absolute",inset:0,opacity:.025,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,backgroundSize:"200px"}}/>
      {/* Top edge glow */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent 0%,hsl(213,94%,58%) 30%,hsl(270,72%,62%) 70%,transparent 100%)",opacity:.4}}/>
    </div>
  );
}

// ─── Cursor glow ──────────────────────────────────────────────────────────────
function CursorGlow() {
  const x=useMotionValue(0),y=useMotionValue(0);
  const sx=useSpring(x,{stiffness:55,damping:16}),sy=useSpring(y,{stiffness:55,damping:16});
  useEffect(()=>{
    const m=(e:MouseEvent)=>{x.set(e.clientX);y.set(e.clientY);};
    window.addEventListener("mousemove",m);
    return()=>window.removeEventListener("mousemove",m);
  },[]);
  return (
    <motion.div className="pointer-events-none" style={{position:"fixed",inset:0,zIndex:1,x:sx,y:sy}}>
      <div style={{position:"absolute",transform:"translate(-50%,-50%)",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,.045) 0%,transparent 65%)",filter:"blur(2px)"}}/>
    </motion.div>
  );
}

// ─── Radial progress ──────────────────────────────────────────────────────────
function RadialProgress({value,size=130,sw=6,color="hsl(213,94%,58%)"}:any) {
  const r=(size-sw*2)/2, c=r*2*Math.PI, off=c-(value/100)*c;
  return (
    <div style={{position:"relative",flexShrink:0}}>
      <div style={{position:"absolute",inset:-20,borderRadius:"50%",background:`radial-gradient(circle,${color}1a 0%,transparent 70%)`,filter:"blur(20px)",animation:"breathe 3s ease-in-out infinite"}}/>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)",position:"relative",zIndex:1}}>
        {/* Background ring */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--bdr2))" strokeWidth={sw}/>
        {/* Glow layers */}
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw+12} strokeDasharray={c} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off}} transition={{duration:1.8,ease:EASE}} strokeLinecap="round" style={{filter:"blur(14px)",opacity:.15}}/>
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw+5} strokeDasharray={c} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off}} transition={{duration:1.8,ease:EASE,delay:.04}} strokeLinecap="round" style={{filter:"blur(5px)",opacity:.3}}/>
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={c} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off}} transition={{duration:1.8,ease:EASE,delay:.08}} strokeLinecap="round"/>
        {/* Bright tip */}
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="white" strokeWidth={2} strokeDasharray={`4 ${c-4}`} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off-2}} transition={{duration:1.8,ease:EASE,delay:.1}} strokeLinecap="round" style={{opacity:.8}}/>
      </svg>
    </div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Num({v,d=0,prefix="",suffix=""}:{v:number;d?:number;prefix?:string;suffix?:string}) {
  const [n,setN]=useState(0);
  useEffect(()=>{
    const t0=performance.now(),dur=1600;
    const tick=(now:number)=>{
      const p=Math.min((now-t0)/dur,1);
      setN((1-Math.pow(1-p,3))*v);
      if(p<1) requestAnimationFrame(tick); else setN(v);
    };
    requestAnimationFrame(tick);
  },[v]);
  return <>{prefix}{n.toFixed(d)}{suffix}</>;
}

// ─── Segmented bar ────────────────────────────────────────────────────────────
function SegBar({pct,color,delay=0,height=4}:{pct:number;color:string;delay?:number;height?:number}) {
  return (
    <div style={{height,borderRadius:9999,background:"hsl(var(--bdr2))",overflow:"hidden",flex:1}}>
      <motion.div style={{height:"100%",borderRadius:9999,background:color,boxShadow:`0 0 8px ${color}88`}}
        initial={{width:0}} animate={{width:`${Math.min(pct,100)}%`}} transition={{...SPRING_SOFT,delay}}/>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({label,children}:{label:string;children:React.ReactNode}) {
  return <div><label className="field-label">{label}</label>{children}</div>;
}

// ─── Glow input ───────────────────────────────────────────────────────────────
function GlowInput({value,onChange,placeholder="",type="text"}:any) {
  const [f,setF]=useState(false);
  const handleChange=(e:any)=>{
    if(type==="number"){
      const n=e.target.value===""?0:Number(e.target.value);
      if(!isNaN(n)) onChange(n);
    } else onChange(e.target.value);
  };
  return (
    <div style={{position:"relative"}}>
      <motion.div style={{position:"absolute",inset:-1,borderRadius:10,pointerEvents:"none",background:"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--indigo)))",zIndex:0,opacity:0}} animate={{opacity:f?1:0}} transition={{duration:.2}}/>
      <input type={type} value={value} onChange={handleChange} placeholder={placeholder}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{position:"relative",zIndex:1,width:"100%",padding:"9px 12px",background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",borderRadius:9,color:"hsl(var(--txt))",fontSize:12,fontFamily:"'Manrope',sans-serif",fontWeight:500,outline:"none",transition:"border-color .2s",letterSpacing:".01em"}}
      />
    </div>
  );
}

// ─── Glow select ──────────────────────────────────────────────────────────────
function GlowSelect({value,onChange,placeholder="",options}:any) {
  const [f,setF]=useState(false);
  return (
    <div style={{position:"relative"}}>
      <motion.div style={{position:"absolute",inset:-1,borderRadius:10,pointerEvents:"none",background:"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--indigo)))",zIndex:0,opacity:0}} animate={{opacity:f?1:0}} transition={{duration:.2}}/>
      <select value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{position:"relative",zIndex:1,width:"100%",padding:"9px 12px",background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",borderRadius:9,color:value?"hsl(var(--txt))":"hsl(var(--muted))",fontSize:12,fontFamily:"'Manrope',sans-serif",fontWeight:500,outline:"none",cursor:"pointer",appearance:"none"}}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o:any)=><option key={o.value||o} value={o.value||o} style={{background:"hsl(var(--surf2))"}}>{o.label||o}</option>)}
      </select>
      <ChevronRight style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%) rotate(90deg)",width:12,height:12,color:"hsl(var(--muted))",pointerEvents:"none",zIndex:2}}/>
    </div>
  );
}

// ─── Glow slider ──────────────────────────────────────────────────────────────
function GlowSlider({value,onChange}:any) {
  return (
    <div style={{position:"relative",paddingBlock:6}}>
      <div style={{position:"absolute",top:"50%",left:0,right:0,height:4,borderRadius:9999,background:"hsl(var(--bdr2))",transform:"translateY(-50%)",zIndex:0}}/>
      <motion.div style={{position:"absolute",top:"50%",left:0,width:`${value}%`,height:4,borderRadius:9999,background:"linear-gradient(90deg,hsl(var(--blue)),hsl(var(--indigo)))",transform:"translateY(-50%)",zIndex:1,boxShadow:"0 0 10px hsla(213,94%,58%,.5)"}}/>
      <input type="range" min={0} max={100} step={1} value={value} onChange={e=>onChange(+e.target.value)} style={{position:"relative",zIndex:2,width:"100%",opacity:0,cursor:"pointer",height:20}}/>
    </div>
  );
}

// ─── AI Processing Loader ─────────────────────────────────────────────────────
function AILoader() {
  const [phase,setPhase]=useState(0);
  const [pct,setPct]=useState(0);
  const [streamText,setStreamText]=useState("");
  const phases=[
    "Connecting to neural inference engine…",
    "Analyzing genre market dynamics…",
    "Computing production risk factors…",
    "Generating cast & crew intelligence…",
    "Synthesizing release strategy…",
    "Finalizing AI report…",
  ];
  const thoughts=[
    "Parsing budget-to-risk correlation…",
    "Checking historical genre performance…",
    "Evaluating director experience multiplier…",
    "Cross-referencing actor popularity signals…",
    "Computing market timing windows…",
    "Applying box office regression model…",
  ];
  
  useEffect(()=>{
    const a=setInterval(()=>setPct(p=>p>=97?p:p+Math.random()*2.8+.3),130);
    const b=setInterval(()=>setPhase(p=>Math.min(p+1,phases.length-1)),900);
    let idx=0;
    const c=setInterval(()=>{
      setStreamText(thoughts[idx%thoughts.length]);
      idx++;
    },1100);
    return()=>{clearInterval(a);clearInterval(b);clearInterval(c);};
  },[]);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:32,padding:"50px 32px",position:"relative"}}
    >
      <div className="scanline"/>
      {/* Central neural orb */}
      <div style={{position:"relative",width:110,height:110}}>
        {[0,1,2,3].map(i=>(
          <motion.div key={i} style={{
            position:"absolute",inset:i*13,borderRadius:"50%",
            border:`1px solid hsla(213,94%,58%,${.7-i*.15})`,
          }} animate={{rotate:i%2===0?360:-360}} transition={{duration:3+i*1.5,repeat:Infinity,ease:"linear"}}/>
        ))}
        {/* Center */}
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <motion.div animate={{scale:[1,1.15,1],opacity:[.8,1,.8]}} transition={{duration:2,repeat:Infinity}}>
            <Brain style={{width:30,height:30,color:"hsl(var(--blue))"}}/>
          </motion.div>
        </div>
        {/* Orbiting dot */}
        <motion.div style={{position:"absolute",top:"50%",left:"50%",width:6,height:6,borderRadius:"50%",background:"hsl(var(--cyan))",boxShadow:"0 0 12px hsl(var(--cyan))",marginTop:-3,marginLeft:-3,transformOrigin:"0 0"}}
          animate={{rotate:360}} transition={{duration:1.8,repeat:Infinity,ease:"linear"}}
          style2={{position:"absolute",top:"50%",left:"50%"}}
        />
      </div>

      <div style={{width:"100%",maxWidth:300,textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}}>
          <div className="ai-thinking"/>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"hsl(var(--blue))"}}>AI Analysis Running</span>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.p key={phase} initial={{opacity:0,y:6,filter:"blur(4px)"}} animate={{opacity:1,y:0,filter:"blur(0)"}} exit={{opacity:0,y:-6}}
            style={{fontFamily:"'Manrope',sans-serif",fontSize:13,fontWeight:500,color:"hsl(var(--txt))",marginBottom:12,lineHeight:1.5}}
          >{phases[phase]}</motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p key={streamText} initial={{opacity:0}} animate={{opacity:.6}} exit={{opacity:0}}
            style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:"hsl(var(--muted))",marginBottom:16}}
          >{streamText}</motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:"hsl(var(--muted))"}}>PROGRESS</span>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:"hsl(var(--blue))"}}>{Math.round(pct)}%</span>
          </div>
          <div style={{height:3,borderRadius:9999,background:"hsl(var(--bdr2))",overflow:"hidden",position:"relative"}}>
            <motion.div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,hsl(var(--blue)),hsl(var(--violet)))",borderRadius:9999}}/>
            <motion.div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent)"}}
              animate={{x:["-100%","300%"]}} transition={{duration:1.2,repeat:Infinity,ease:"linear"}}
            />
          </div>
        </div>

        {/* Phase dots */}
        <div style={{display:"flex",gap:5,justifyContent:"center"}}>
          {phases.map((_,i)=>(
            <motion.div key={i} style={{height:4,borderRadius:9999,background:i<=phase?"hsl(var(--blue))":"hsl(var(--bdr2))"}}
              animate={{width:i<=phase?16:4}} transition={{duration:.3}}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}
      style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:20,padding:"60px 36px",textAlign:"center",position:"relative"}}
    >
      <div className="scanline"/>
      <motion.div style={{width:72,height:72,borderRadius:22,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}
        animate={{y:[0,-7,0],boxShadow:["0 0 0 0 hsla(213,94%,58%,0)","0 12px 30px 0 hsla(213,94%,58%,.15)","0 0 0 0 hsla(213,94%,58%,0)"]}}
        transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}
      >
        <Brain style={{width:32,height:32,color:"hsla(213,94%,58%,.45)"}}/>
      </motion.div>
      <div>
        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:"hsl(var(--txt))",marginBottom:8}}>AI Ready</p>
        <p style={{fontFamily:"'Manrope',sans-serif",fontSize:12.5,color:"hsl(var(--muted))",lineHeight:1.7,maxWidth:260}}>
          Configure your production parameters and run the full AI analysis engine.
        </p>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center",marginTop:4}}>
        {["Budget Risk","Success Model","Cast Intelligence","Crew Match","Release Strategy","Market Timing","Box Office Range"].map((t,i)=>(
          <motion.span key={t} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.08+i*.06}}
            className="token-badge" style={{color:"hsl(var(--muted))",borderColor:"hsl(var(--bdr2))",background:"hsl(var(--surf2))",fontFamily:"'Space Mono',monospace"}}
          >{t}</motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Block header ─────────────────────────────────────────────────────────────
function BH({icon:Icon,title,accent,badge}:any) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
      <div style={{width:28,height:28,borderRadius:9,background:`${accent}14`,border:`1px solid ${accent}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Icon style={{width:12,height:12,color:accent}}/>
      </div>
      <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"hsl(var(--txt))",flex:1}}>
        {title}
      </span>
      {badge && <span className="token-badge" style={{color:accent,borderColor:`${accent}30`,background:`${accent}0f`,fontFamily:"'Space Mono',monospace"}}>{badge}</span>}
    </div>
  );
}

// ─── AI Badge ─────────────────────────────────────────────────────────────────
function AIBadge() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:9999,background:"hsla(213,94%,58%,.08)",border:"1px solid hsla(213,94%,58%,.2)"}}>
      <div className="ai-thinking" style={{width:5,height:5}}/>
      <span style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,fontWeight:700,color:"hsl(var(--blue))",letterSpacing:".1em",textTransform:"uppercase"}}>AI</span>
    </div>
  );
}

// ─── Budget Block ─────────────────────────────────────────────────────────────
function BudgetBlock({data}:any) {
  const rc = data.riskLevel==="low" ? "hsl(var(--emerald))" : data.riskLevel==="medium" ? "hsl(var(--amber))" : "hsl(var(--rose))";
  return (
    <div className="glass-panel" style={{padding:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <BH icon={Target} title="Budget Overrun Risk" accent="hsl(var(--blue))"/>
        <AIBadge/>
      </div>
      <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
        <div style={{position:"relative",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <div style={{position:"relative"}}>
            <RadialProgress value={data.riskPercent} size={118} sw={6} color={rc}/>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"hsl(var(--txt))"}}><Num v={data.riskPercent}/>%</span>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:7,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:rc,marginTop:1}}>{data.riskLevel}</span>
            </div>
          </div>
          <div style={{padding:"5px 10px",borderRadius:8,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",maxWidth:110,textAlign:"center"}}>
            <p style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:"hsl(var(--muted))",marginBottom:2}}>CONTINGENCY</p>
            <p style={{fontFamily:"'Manrope',sans-serif",fontSize:10,fontWeight:700,color:"hsl(var(--txt))"}}>+{data.contingency}</p>
          </div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
          {data.factors.map((f:any,i:number)=>(
            <motion.div key={f.name} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:i*.08}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <span style={{fontFamily:"'Manrope',sans-serif",fontSize:11,fontWeight:500,color:"hsl(var(--txt2))"}}>
                  {f.name}
                </span>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,fontWeight:700,color:"hsl(var(--txt))"}}>
                  {f.impact}/20
                </span>
              </div>
              <SegBar pct={f.impact * 5} color={rc} delay={i * .1}/>
              <p style={{fontFamily:"'Manrope',sans-serif",fontSize:9,color:"hsl(var(--muted))",marginTop:3,lineHeight:1.5}}>{f.description}</p>
            </motion.div>
          ))}
          <div style={{marginTop:4,padding:"10px 12px",borderRadius:10,background:"hsla(213,94%,58%,.05)",border:"1px solid hsla(213,94%,58%,.14)"}}>
            <p style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--blue))",letterSpacing:".08em",marginBottom:4}}>AI INSIGHT</p>
            <p style={{fontFamily:"'Manrope',sans-serif",fontSize:11,color:"hsl(var(--txt))",lineHeight:1.6}}>{data.insight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Success Block ────────────────────────────────────────────────────────────
function SuccessBlock({data,form}:any) {
  const probColor = data.probability >= 65 ? "hsl(var(--emerald))" : data.probability >= 45 ? "hsl(var(--amber))" : "hsl(var(--rose))";
  return (
    <div className="glass-panel" style={{padding:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <BH icon={TrendingUp} title="Success Prediction Engine" accent="hsl(var(--amber))"/>
        <AIBadge/>
      </div>

      {/* Top metrics row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {[
          {label:"AI Probability",val:`${data.probability}%`,color:probColor,sub:"Adjusted model"},
          {label:"Confidence",val:data.confidence,color:"hsl(var(--cyan))",sub:`${data.confidenceScore}% certainty`},
          {label:"Risk Level",val:data.riskLevel.charAt(0).toUpperCase()+data.riskLevel.slice(1),color:data.riskLevel==="low"?"hsl(var(--emerald))":data.riskLevel==="medium"?"hsl(var(--amber))":"hsl(var(--rose))",sub:"Production risk"},
        ].map((m,i)=>(
          <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.07}}
            style={{padding:"12px 13px",borderRadius:11,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))"}}>
            <p style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",letterSpacing:".1em",marginBottom:5}}>{m.label.toUpperCase()}</p>
            <p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:m.color,lineHeight:1}}>{m.val}</p>
            <p style={{fontFamily:"'Manrope',sans-serif",fontSize:9,color:"hsl(var(--muted))",marginTop:4}}>{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Main score + trend */}
      <div style={{display:"flex",gap:20,alignItems:"flex-start",marginBottom:16}}>
        <div style={{textAlign:"center",flexShrink:0}}>
          <motion.p initial={{scale:.4,opacity:0}} animate={{scale:1,opacity:1}} transition={{...SPRING,delay:.2}}
            style={{fontFamily:"'Syne',sans-serif",fontSize:52,fontWeight:900,lineHeight:1,background:"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--violet)))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}
          >{data.sentimentScore}</motion.p>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",letterSpacing:".1em",marginTop:3}}>/ 10 SCORE</p>
          <div style={{display:"flex",gap:3,justifyContent:"center",marginTop:8}}>
            {Array.from({length:5},(_,i)=>{
              const filled=i<Math.round(data.sentimentScore/2);
              return <motion.div key={i} initial={{scale:0}} animate={{scale:1}} transition={{...SPRING,delay:.35+i*.07}}><Star style={{width:12,height:12,color:"hsl(var(--amber))",fill:filled?"hsl(var(--amber))":"transparent"}}/></motion.div>;
            })}
          </div>
        </div>
        <div style={{flex:1}}>
          {/* Trend bars */}
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",letterSpacing:".08em",marginBottom:6}}>MARKET TREND (12-MONTH PROJECTION)</p>
          <div style={{display:"flex",alignItems:"flex-end",gap:2,height:38,marginBottom:4}}>
            {data.trendData.map((v:number,i:number)=>(
              <motion.div key={i} style={{flex:1,borderRadius:"3px 3px 0 0",background:`linear-gradient(to top,hsl(var(--blue)),hsl(var(--violet)))`,opacity:.7}}
                initial={{height:0}} animate={{height:`${v}%`}} transition={{...SPRING_SOFT,delay:.35+i*.04}}
              />
            ))}
          </div>
          {/* Box office range */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginTop:10}}>
            {[
              {label:"Conservative",val:data.boxOfficeRange.low,color:"hsl(var(--muted))"},
              {label:"Expected",val:data.boxOfficeRange.mid,color:"hsl(var(--blue))"},
              {label:"Optimistic",val:data.boxOfficeRange.high,color:"hsl(var(--emerald))"},
            ].map((b,i)=>(
              <div key={i} style={{padding:"7px 8px",borderRadius:8,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",textAlign:"center"}}>
                <p style={{fontFamily:"'Space Mono',monospace",fontSize:6.5,color:"hsl(var(--muted))",letterSpacing:".08em",marginBottom:3}}>{b.label.toUpperCase()}</p>
                <p style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,color:b.color}}>{b.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI positioning + tags */}
      <div style={{padding:"10px 13px",borderRadius:10,background:"hsla(38,92%,54%,.06)",border:"1px solid hsla(38,92%,54%,.18)",marginBottom:12}}>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--amber))",letterSpacing:".08em",marginBottom:4}}>AI MARKET POSITIONING</p>
        <p style={{fontFamily:"'Manrope',sans-serif",fontSize:11.5,fontWeight:500,color:"hsl(var(--txt))",lineHeight:1.5}}>{data.marketPositioning}</p>
      </div>

      {/* Key insights row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <div style={{padding:"9px 11px",borderRadius:9,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))"}}>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:"hsl(var(--muted))",letterSpacing:".08em",marginBottom:3}}>COMPETITIVE EDGE</p>
          <p style={{fontFamily:"'Manrope',sans-serif",fontSize:10,color:"hsl(var(--txt))",lineHeight:1.4}}>{data.competitiveAdvantage}</p>
        </div>
        <div style={{padding:"9px 11px",borderRadius:9,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))"}}>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:"hsl(var(--muted))",letterSpacing:".08em",marginBottom:3}}>PRIMARY RISK</p>
          <p style={{fontFamily:"'Manrope',sans-serif",fontSize:10,color:"hsl(var(--rose))",lineHeight:1.4}}>{data.primaryRisk}</p>
        </div>
      </div>

      {/* Tags */}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
        {data.tags.map((tag:string,i:number)=>(
          <motion.span key={tag} initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{...SPRING,delay:.5+i*.07}}
            className="token-badge" style={{color:"hsl(var(--blue))",borderColor:"hsla(213,94%,58%,.25)",background:"hsla(213,94%,58%,.08)",fontFamily:"'Space Mono',monospace"}}
          >{tag}</motion.span>
        ))}
        <span className="token-badge" style={{color:"hsl(var(--cyan))",borderColor:"hsla(190,88%,52%,.25)",background:"hsla(190,88%,52%,.08)",fontFamily:"'Space Mono',monospace"}}>
          {data.criticalReception}
        </span>
      </div>

      {/* Improvement tips */}
      {data.tips?.length > 0 && (
        <div>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",letterSpacing:".1em",textTransform:"uppercase",marginBottom:7}}>AI Recommendations</p>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {data.tips.map((tip:string,i:number)=>(
              <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:.6+i*.1}}
                style={{display:"flex",gap:8,padding:"8px 11px",background:"hsl(var(--surf2))",borderRadius:8,border:"1px solid hsl(var(--bdr))",alignItems:"flex-start"}}
              >
                <div style={{width:16,height:16,borderRadius:5,background:"hsla(213,94%,58%,.12)",border:"1px solid hsla(213,94%,58%,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:7,fontWeight:700,color:"hsl(var(--blue))"}}>{i+1}</span>
                </div>
                <p style={{fontFamily:"'Manrope',sans-serif",fontSize:11,color:"hsl(var(--txt))",lineHeight:1.5}}>{tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Release Block ────────────────────────────────────────────────────────────
function ReleaseBlock({data}:any) {
  const cc=data.competition==="Low"?"hsl(var(--emerald))":data.competition==="Medium"?"hsl(var(--amber))":"hsl(var(--rose))";
  return (
    <div className="glass-panel" style={{padding:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <BH icon={Activity} title="Strategic Release Intelligence" accent="hsl(var(--emerald))"/>
        <AIBadge/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {[
          {label:"Optimal Window",val:data.window,color:"hsl(var(--blue))"},
          {label:"Platform Strategy",val:data.platform,color:"hsl(var(--txt))"},
          {label:"Competition",val:data.competition,color:cc},
          {label:"International",val:data.international,color:"hsl(var(--cyan))"},
        ].map((item,i)=>(
          <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.1+i*.07}}
            style={{padding:"12px 13px",borderRadius:10,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))"}}>
            <p style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",letterSpacing:".1em",textTransform:"uppercase",marginBottom:5}}>{item.label}</p>
            <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:item.color,lineHeight:1.3}}>{item.val}</p>
          </motion.div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{padding:"10px 12px",borderRadius:9,background:"hsla(158,68%,48%,.06)",border:"1px solid hsla(158,68%,48%,.18)"}}>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:"hsl(var(--emerald))",letterSpacing:".08em",marginBottom:4}}>OPENING WEEKEND</p>
          <p style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:"hsl(var(--txt))"}}>Est. {data.openingWeekend}</p>
        </div>
        <div style={{padding:"10px 12px",borderRadius:9,background:"hsla(42,92%,54%,.06)",border:"1px solid hsla(42,92%,54%,.18)"}}>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:"hsl(var(--amber))",letterSpacing:".08em",marginBottom:4}}>AWARDS VIABILITY</p>
          <p style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:"hsl(var(--txt))"}}>  {data.awards}</p>
        </div>
      </div>
      <div style={{marginTop:10,padding:"10px 12px",borderRadius:9,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))"}}>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:"hsl(var(--muted))",letterSpacing:".08em",marginBottom:4}}>MARKETING APPROACH</p>
        <p style={{fontFamily:"'Manrope',sans-serif",fontSize:11,color:"hsl(var(--txt))",lineHeight:1.5}}>{data.positioning}</p>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:"hsl(var(--blue))",marginTop:5}}>Marketing budget: {data.marketingBudget}</p>
      </div>
    </div>
  );
}

// ─── Production Intelligence Block ───────────────────────────────────────────
function ProductionIntelBlock({data}:any) {
  const metrics = [
    {label:"Shooting Efficiency",val:data.shootingDayEfficiency,color:"hsl(var(--blue))"},
    {label:"Cast Chemistry",val:data.castChemistryScore,color:"hsl(var(--violet))"},
    {label:"Script Risk",val:data.scriptRiskScore,color:"hsl(var(--rose))"},
    {label:"Distribution Score",val:data.distributionScore,color:"hsl(var(--emerald))"},
    {label:"Market Timing",val:data.marketTimingScore,color:"hsl(var(--amber))"},
  ];
  return (
    <div className="glass-panel" style={{padding:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <BH icon={Layers} title="Production Intelligence" accent="hsl(var(--indigo))"/>
        <AIBadge/>
      </div>
      <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:16}}>
        {/* Overall health */}
        <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <RadialProgress value={data.overallHealth} size={90} sw={5} color="hsl(var(--indigo))"/>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",textTransform:"uppercase",letterSpacing:".08em",textAlign:"center"}}>Overall<br/>Health</p>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:9}}>
          {metrics.map((m,i)=>(
            <div key={m.label}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontFamily:"'Manrope',sans-serif",fontSize:10.5,fontWeight:500,color:"hsl(var(--txt2))"}}>{m.label}</span>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,fontWeight:700,color:m.color}}>{m.val}</span>
              </div>
              <SegBar pct={m.val} color={m.color} delay={i*.08} height={3}/>
            </div>
          ))}
        </div>
      </div>
      {/* Milestones */}
      <div style={{marginBottom:12}}>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Key Milestones</p>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {data.milestones.map((m:string,i:number)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"hsl(var(--indigo))",marginTop:5,flexShrink:0,boxShadow:"0 0 8px hsl(var(--indigo))"}}/>
              <p style={{fontFamily:"'Manrope',sans-serif",fontSize:10.5,color:"hsl(var(--txt))",lineHeight:1.5}}>{m}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Watchout flags */}
      <div style={{padding:"10px 12px",borderRadius:9,background:"hsla(348,78%,58%,.06)",border:"1px solid hsla(348,78%,58%,.18)"}}>
        <p style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:"hsl(var(--rose))",letterSpacing:".08em",marginBottom:6}}>⚠ WATCHOUT FLAGS</p>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {data.flags.map((f:string,i:number)=>(
            <p key={i} style={{fontFamily:"'Manrope',sans-serif",fontSize:10.5,color:"hsl(var(--txt))",lineHeight:1.4}}>• {f}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Actors Block ─────────────────────────────────────────────────────────────
function ActorsBlock({actors}:any) {
  const tierColor:any={
    "A-List":"hsl(var(--amber))","B-List":"hsl(var(--blue))",
    "Rising Star":"hsl(var(--emerald))","Character Actor":"hsl(var(--violet))"
  };
  return (
    <div className="glass-panel" style={{padding:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <BH icon={Users} title="AI Cast Recommendations" accent="hsl(var(--violet))"/>
        <AIBadge/>
      </div>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:6}} className="no-sb">
        {actors.map((a:any,i:number)=>(
          <motion.div key={a.name} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{...SPRING,delay:i*.08}}
            whileHover={{y:-4,scale:1.02}}
            style={{flexShrink:0,width:162,padding:14,borderRadius:13,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",cursor:"pointer",position:"relative",overflow:"hidden"}}
          >
            <motion.div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 0%,hsla(270,72%,62%,.1),transparent 70%)",opacity:0}} whileHover={{opacity:1}}/>
            {/* Avatar */}
            <div style={{width:38,height:38,borderRadius:11,background:"linear-gradient(135deg,hsla(213,94%,58%,.2),hsla(270,72%,62%,.2))",border:"1px solid hsla(270,72%,62%,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:11,color:"hsl(var(--violet))",marginBottom:9}}>
              {a.name.split(' ').map((n:string)=>n[0]).join('')}
            </div>
            <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"hsl(var(--txt))",marginBottom:3}}>{a.name}</p>
            <span className="token-badge" style={{color:tierColor[a.tier]||"hsl(var(--blue))",borderColor:`${tierColor[a.tier]||"hsl(var(--blue))"}30`,background:`${tierColor[a.tier]||"hsl(var(--blue))"}10`,fontFamily:"'Space Mono',monospace",fontSize:7}}>{a.tier}</span>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}>
              <SegBar pct={a.matchScore} color="hsl(var(--violet))" delay={i*.1}/>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,fontWeight:700,color:"hsl(var(--violet))",flexShrink:0}}>{a.matchScore}%</span>
            </div>
            <p style={{fontFamily:"'Manrope',sans-serif",fontSize:9.5,color:"hsl(var(--muted))",marginTop:6,lineHeight:1.5}}>{a.reason}</p>
            {a.recentWork && <p style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:"hsl(var(--blue))",marginTop:4}}>↳ {a.recentWork}</p>}
            {a.riskFactor !== "None" && <p style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--amber))",marginTop:4}}>⚠ {a.riskFactor}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Crew Block ───────────────────────────────────────────────────────────────
function CrewBlock({crew}:any) {
  const tierColor:any={"Elite":"hsl(var(--amber))","Established":"hsl(var(--blue))","Rising":"hsl(var(--emerald))"};
  return (
    <div className="glass-panel" style={{padding:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <BH icon={UserCog} title="AI Crew Recommendations" accent="hsl(var(--cyan))"/>
        <AIBadge/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {crew.map((c:any,i:number)=>(
          <motion.div key={c.name} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{...SPRING,delay:i*.09}}
            whileHover={{x:5}}
            style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:11,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",cursor:"pointer",position:"relative",overflow:"hidden"}}
          >
            <motion.div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 0% 50%,hsla(190,88%,52%,.07),transparent 55%)",opacity:0}} whileHover={{opacity:1}}/>
            <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:"linear-gradient(135deg,hsla(190,88%,52%,.15),hsla(213,94%,58%,.15))",border:"1px solid hsla(190,88%,52%,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:10,color:"hsl(var(--cyan))"}}>
              {c.name.split(' ').map((n:string)=>n[0]).join('')}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"hsl(var(--txt))"}}>{c.name}</span>
                <span className="token-badge" style={{color:"hsl(var(--cyan))",borderColor:"hsla(190,88%,52%,.3)",background:"hsla(190,88%,52%,.08)",fontFamily:"'Space Mono',monospace",fontSize:7}}>{c.role}</span>
                <span className="token-badge" style={{color:tierColor[c.tier]||"hsl(var(--blue))",borderColor:`${tierColor[c.tier]||"hsl(var(--blue))"}30`,background:`${tierColor[c.tier]||"hsl(var(--blue))"}10`,fontFamily:"'Space Mono',monospace",fontSize:7}}>{c.tier}</span>
              </div>
              <p style={{fontFamily:"'Manrope',sans-serif",fontSize:10,color:"hsl(var(--muted))",marginBottom:3}}>{c.reason}</p>
              {c.knownFor && <p style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:"hsl(var(--blue))"}}>Known for: {c.knownFor}</p>}
            </div>
            <div style={{flexShrink:0,textAlign:"right"}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:"hsl(var(--cyan))"}}>{c.matchScore}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AICommandCenter() {
  const [form, setForm] = useState({
    title:"", genre:"",
    budget:50_000_000, castSize:15, crewSize:100,
    shootingDays:60, locations:3,
    directorExperience:"", actorPopularity:70,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<any>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [scheduled, setScheduled] = useState(false);
  const { toast } = useToast();
  const { addProduction } = useProductions();

  const isSuccessful = result?.prediction === "Successful";

  // Build display object from AI result + backend result
  const display = result && aiResult ? {
    budgetOverrun: {
      riskPercent: aiResult.budgetAnalysis.overrunRiskPercent,
      riskLevel: aiResult.budgetAnalysis.overrunRiskLevel,
      factors: aiResult.budgetAnalysis.factors,
      insight: aiResult.budgetAnalysis.keyInsight,
      contingency: aiResult.budgetAnalysis.contingencyRecommendation,
    },
    successPrediction: {
      probability: aiResult.successAnalysis.adjustedProbability,
      confidence: aiResult.successAnalysis.confidenceLevel,
      confidenceScore: aiResult.successAnalysis.confidenceScore,
      riskLevel: aiResult.successAnalysis.riskLevel,
      sentimentScore: aiResult.successAnalysis.sentimentScore,
      marketPositioning: aiResult.successAnalysis.marketPositioning,
      competitiveAdvantage: aiResult.successAnalysis.competitiveAdvantage,
      primaryRisk: aiResult.successAnalysis.primaryRisk,
      criticalReception: aiResult.successAnalysis.criticalReceptionLikelihood,
      boxOfficeRange: aiResult.successAnalysis.boxOfficeRange,
      tags: aiResult.successAnalysis.tags,
      trendData: aiResult.successAnalysis.trendData,
      tips: aiResult.successAnalysis.improvementTips,
    },
    releaseWindow: {
      window: aiResult.releaseStrategy.optimalWindow,
      platform: aiResult.releaseStrategy.platformStrategy,
      competition: aiResult.releaseStrategy.competitionLevel,
      international: aiResult.releaseStrategy.internationalPotential,
      positioning: aiResult.releaseStrategy.positioning,
      marketingBudget: aiResult.releaseStrategy.marketingBudgetSuggestion,
      openingWeekend: aiResult.releaseStrategy.openingWeekendEstimate,
      awards: aiResult.releaseStrategy.awardsViability,
    },
    productionIntel: {
      shootingDayEfficiency: aiResult.productionIntelligence.shootingDayEfficiency,
      castChemistryScore: aiResult.productionIntelligence.castChemistryScore,
      scriptRiskScore: aiResult.productionIntelligence.scriptRiskScore,
      distributionScore: aiResult.productionIntelligence.distributionScore,
      marketTimingScore: aiResult.productionIntelligence.marketTimingScore,
      overallHealth: aiResult.productionIntelligence.overallHealthScore,
      milestones: aiResult.productionIntelligence.keyMilestones,
      flags: aiResult.productionIntelligence.watchoutFlags,
    },
    actors: aiResult.castRecommendations,
    crew: aiResult.crewRecommendations,
  } : null;

  const savePrediction = async () => {
    if (!result || !display) return;
    try {
      await addProduction({
        title: form.title || "Untitled",
        genre: form.genre || "Unknown",
        budget: form.budget,
        runtime: Math.round(form.shootingDays * 1.5),
        popularity: form.actorPopularity,
        vote_average: (display.successPrediction.sentimentScore as number),
        vote_count: 500,
        status: "Pre-Production",
        spent: 0,
        progress: 0,
        prediction: result.prediction,
        success_probability: display.successPrediction.probability,
        suggestedActors: display.actors.map((a:any)=>a.name),
        suggestedDirector: display.crew[0]?.name || "TBD",
      });
      toast({ title: "Saved", description: "Prediction added to productions." });
    } catch(e:any) {
      toast({ title:"Error", description:e.message, variant:"destructive" });
    }
  };

  const scheduleRelease = async () => {
    if (!result || !display) return;
    try {
      await movieAPI.scheduleEvent({
        movieTitle: form.title || "Untitled",
        date: new Date(Date.now() + 1000*60*60*24*30).toISOString(),
        type: "Release",
        description: `AI Predicted: ${display.successPrediction.probability}% success — ${display.releaseWindow.window}`,
      });
      setScheduled(true);
      toast({ title:"Scheduled", description:"Release added to schedule." });
    } catch(e:any) {
      toast({ title:"Error", description:e.message, variant:"destructive" });
    }
  };

  const runPrediction = async () => {
    if (!form.title?.trim()) {
      toast({ title:"Validation", description:"Project title is required", variant:"destructive" });
      return;
    }
    if (!form.genre?.trim()) {
      toast({ title:"Validation", description:"Please select a genre", variant:"destructive" });
      return;
    }

    setLoading(true);
    setResult(null);
    setAiResult(null);

    try {
      // Run backend API + AI analysis in parallel
      const payload = {
        title: form.title.trim(),
        genre: form.genre.trim(),
        budget: Number(form.budget),
        runtime: Math.round(Number(form.shootingDays) * 1.5),
        popularity: Number(form.actorPopularity),
        vote_average: 6.5,
        vote_count: 500,
        castSize: form.castSize,
        crewSize: form.crewSize,
        shootingDays: form.shootingDays,
        locations: form.locations,
        actorPopularity: form.actorPopularity,
        directorExperience: form.directorExperience || "mid",
      };

      const [backendRes] = await Promise.all([
        movieAPI.predictMovie(payload as any),
        new Promise(r => setTimeout(r, 800)),
      ]);

      if (!backendRes || typeof backendRes.success_probability === "undefined") {
        throw new Error("Invalid backend response");
      }

      // Now run AI analysis
      const aiAnalysis = await runAIAnalysis(form, backendRes);

      await new Promise(r => setTimeout(r, 400));
      setResult(backendRes);
      setAiResult(aiAnalysis);
      toast({ title:"Analysis Complete", description:"Full AI report generated." });
    } catch(err:any) {
      const msg = err.response?.data?.message || err.message || "Analysis failed.";
      toast({ title:"Error", description:msg, variant:"destructive" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setAiResult(null);
    setScheduled(false);
    setForm({title:"",genre:"",budget:50_000_000,castSize:15,crewSize:100,shootingDays:60,locations:3,directorExperience:"",actorPopularity:70});
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <AmbientBG/>
      <CursorGlow/>

      <div style={{minHeight:"100vh",background:"hsl(var(--bg))",fontFamily:"'Manrope',sans-serif",color:"hsl(var(--txt))",position:"relative",zIndex:2,padding:"26px 22px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Header */}
        <motion.div initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}} style={{display:"flex",alignItems:"center",gap:14}}>
          <motion.div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--violet)))",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 28px hsla(213,94%,58%,.4)"}}
            animate={{boxShadow:["0 0 20px hsla(213,94%,58%,.3)","0 0 40px hsla(213,94%,58%,.6)","0 0 20px hsla(213,94%,58%,.3)"]}}
            transition={{duration:3.5,repeat:Infinity,ease:"easeInOut"}}
          >
            <Sparkles style={{width:19,height:19,color:"white"}}/>
          </motion.div>
          <div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:900,lineHeight:1,background:"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--violet)))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              AI Command Center
            </h1>
            <p style={{fontFamily:"'Space Mono',monospace",fontSize:8.5,color:"hsl(var(--muted))",letterSpacing:".12em",marginTop:3,textTransform:"uppercase"}}>
              Production Intelligence · Powered by Claude AI
            </p>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            {[
              {label:"Engine",val:"Claude AI",c:"hsl(var(--blue))"},
              {label:"Model",val:"Sonnet 4",c:"hsl(var(--violet))"},
            ].map(b=>(
              <div key={b.label} style={{padding:"5px 12px",borderRadius:9999,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",textTransform:"uppercase",letterSpacing:".08em"}}>{b.label}</span>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,fontWeight:700,color:b.c}}>{b.val}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main panel */}
        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
          <div style={{background:"hsl(var(--surf))",border:"1px solid hsl(var(--bdr))",borderRadius:22,overflow:"hidden",boxShadow:"0 32px 64px rgba(0,0,0,.4)",display:"grid",gridTemplateRows:"auto 1fr"}}>

            {/* Panel header */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 20px",borderBottom:"1px solid hsl(var(--bdr))",background:"linear-gradient(180deg,hsl(var(--surf2)),hsl(var(--surf)))"}}>
              <motion.div animate={{rotate:[0,360]}} transition={{duration:10,repeat:Infinity,ease:"linear"}}>
                <FlaskConical style={{width:12,height:12,color:"hsl(var(--blue))"}}/>
              </motion.div>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12}}>AI Analysis Lab</span>
              <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
                {[0,1,2].map(i=>(
                  <motion.div key={i} style={{width:5,height:5,borderRadius:"50%",background:"hsl(var(--blue))"}}
                    animate={{opacity:[.3,1,.3]}} transition={{duration:1.6,repeat:Infinity,delay:i*.35}}
                  />
                ))}
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))",marginLeft:8,textTransform:"uppercase",letterSpacing:".08em"}}>Real AI · Not Simulated</span>
              </div>
            </div>

            {/* Split pane */}
            <div style={{display:"grid",gridTemplateColumns:"360px 1fr",minHeight:660}}>

              {/* LEFT panel */}
              <div style={{padding:"22px 20px",borderRight:"1px solid hsl(var(--bdr))",display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}} className="no-sb">

                <Field label="Movie Title">
                  <GlowInput value={form.title} onChange={(v:any)=>setForm({...form,title:v})} placeholder="Enter production title…"/>
                </Field>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
                  <Field label="Genre">
                    <GlowSelect value={form.genre} onChange={(v:any)=>setForm({...form,genre:v})} placeholder="Select genre…" options={GENRES.map(g=>({value:g,label:g}))}/>
                  </Field>
                  <Field label="Director Exp.">
                    <GlowSelect value={form.directorExperience} onChange={(v:any)=>setForm({...form,directorExperience:v})} placeholder="Level…" options={DIRECTOR_EXP}/>
                  </Field>
                </div>

                <Field label="Production Budget ($)">
                  <GlowInput type="number" value={form.budget} onChange={(v:any)=>setForm({...form,budget:v})} placeholder="Budget in USD"/>
                </Field>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
                  {([["castSize","Cast Size"],["crewSize","Crew Size"],["shootingDays","Shoot Days"],["locations","Locations"]] as [string,string][]).map(([k,l])=>(
                    <Field key={k} label={l}>
                      <GlowInput type="number" value={(form as any)[k]} onChange={(v:any)=>setForm({...form,[k]:v})} placeholder={l}/>
                    </Field>
                  ))}
                </div>

                <Field label={`Actor Popularity — ${form.actorPopularity}/100`}>
                  <GlowSlider value={form.actorPopularity} onChange={(v:any)=>setForm({...form,actorPopularity:v})}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                    <span style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))"}}>Indie</span>
                    <span style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"hsl(var(--muted))"}}>A-List</span>
                  </div>
                </Field>

                <div style={{height:1,background:"hsl(var(--bdr))",margin:"2px 0"}}/>

                {/* AI info blurb */}
                <div style={{padding:"10px 12px",borderRadius:10,background:"hsla(213,94%,58%,.05)",border:"1px solid hsla(213,94%,58%,.15)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                    <div className="ai-thinking"/>
                    <span style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,fontWeight:700,color:"hsl(var(--blue))",letterSpacing:".1em",textTransform:"uppercase"}}>Claude AI Analysis</span>
                  </div>
                  <p style={{fontFamily:"'Manrope',sans-serif",fontSize:10,color:"hsl(var(--muted))",lineHeight:1.6}}>All metrics, recommendations, and intelligence are generated by Claude AI — not hardcoded or simulated.</p>
                </div>

                <div style={{display:"flex",gap:10}}>
                  <motion.button onClick={runPrediction} disabled={loading}
                    whileHover={{scale:1.015}} whileTap={{scale:.985}}
                    style={{flex:1,height:46,borderRadius:11,background:loading?"hsl(var(--surf2))":"linear-gradient(135deg,hsl(var(--blue)),hsl(var(--violet)))",color:"white",border:"none",cursor:loading?"not-allowed":"pointer",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,letterSpacing:".04em",boxShadow:loading?"none":"0 0 24px hsla(213,94%,58%,.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,position:"relative",overflow:"hidden",transition:"all .3s"}}
                  >
                    {!loading && <motion.div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)",skewX:"-12deg"}} animate={{x:["-120%","220%"]}} transition={{duration:2.8,repeat:Infinity,ease:"linear",repeatDelay:.5}}/>}
                    <motion.div animate={loading?{rotate:360}:{rotate:0}} transition={{duration:.9,repeat:loading?Infinity:0,ease:"linear"}}>
                      <Zap style={{width:15,height:15}}/>
                    </motion.div>
                    {loading?"AI Analyzing…":"Run AI Analysis"}
                  </motion.button>
                  <motion.button onClick={reset} whileHover={{scale:1.06}} whileTap={{scale:.94}}
                    style={{width:46,height:46,borderRadius:11,background:"hsl(var(--surf2))",border:"1px solid hsl(var(--bdr))",color:"hsl(var(--muted))",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                  >
                    <RotateCcw style={{width:14,height:14}}/>
                  </motion.button>
                </div>

                {result && display && (
                  <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{display:"flex",gap:8}}>
                    <button onClick={savePrediction} style={{flex:1,padding:"10px 12px",borderRadius:9,border:"none",background:"hsl(var(--blue))",color:"white",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer"}}>Save to Productions</button>
                    <button onClick={scheduleRelease} style={{flex:1,padding:"10px 12px",borderRadius:9,border:"none",background:scheduled?"hsl(var(--emerald))":"hsl(var(--violet))",color:"white",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer"}}>{scheduled?"Scheduled ✓":"Schedule Release"}</button>
                  </motion.div>
                )}
              </div>

              {/* RIGHT panel */}
              <div style={{overflowY:"auto",position:"relative"}} className="no-sb">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading" style={{height:"100%"}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                      <AILoader/>
                    </motion.div>
                  ) : display ? (
                    <motion.div key="result" initial={{opacity:0,y:20,filter:"blur(6px)"}} animate={{opacity:1,y:0,filter:"blur(0)"}} exit={{opacity:0}} transition={{duration:.45,ease:EASE}}
                      style={{padding:20,display:"flex",flexDirection:"column",gap:14}}
                    >
                      {/* Status banner */}
                      <motion.div initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} transition={{...SPRING,delay:.06}}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"11px 15px",borderRadius:13,background:isSuccessful?"hsla(158,68%,48%,.08)":"hsla(348,78%,58%,.08)",border:`1px solid ${isSuccessful?"hsla(158,68%,48%,.22)":"hsla(348,78%,58%,.22)"}`}}
                      >
                        {isSuccessful
                          ? <CheckCircle2 style={{width:15,height:15,color:"hsl(var(--emerald))",flexShrink:0}}/>
                          : <AlertTriangle style={{width:15,height:15,color:"hsl(var(--rose))",flexShrink:0}}/>
                        }
                        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:isSuccessful?"hsl(var(--emerald))":"hsl(var(--rose))"}}>
                          {result?.prediction}
                        </span>
                        <span style={{fontFamily:"'Manrope',sans-serif",fontSize:11,color:"hsl(var(--muted))"}}>
                          · {display.successPrediction.probability}% AI probability · {display.successPrediction.confidence} confidence
                        </span>
                        <span style={{marginLeft:"auto",fontFamily:"'Space Mono',monospace",fontSize:7.5,fontWeight:700,padding:"2px 9px",borderRadius:9999,background:"hsl(var(--surf2))",color:"hsl(var(--muted))"}}>
                          {form.genre||"Film"}
                        </span>
                      </motion.div>

                      <BudgetBlock data={display.budgetOverrun}/>
                      <SuccessBlock data={display.successPrediction} form={form}/>
                      <ReleaseBlock data={display.releaseWindow}/>
                      <ProductionIntelBlock data={display.productionIntel}/>
                      <ActorsBlock actors={display.actors}/>
                      <CrewBlock crew={display.crew}/>
                    </motion.div>
                  ) : (
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