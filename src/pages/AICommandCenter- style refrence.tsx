import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles, Brain, FlaskConical, Zap,
  Star, Users, UserCog,
  RotateCcw, Target, ChevronRight,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const genres = ["Action","Comedy","Drama","Horror","Sci-Fi","Romance","Thriller","Animation","Documentary","Fantasy"];
const directorExperience = [
  { value: "rookie", label: "Rookie (0–2 films)" },
  { value: "mid", label: "Mid-Level (3–7 films)" },
  { value: "veteran", label: "Veteran (8–15 films)" },
  { value: "legend", label: "Legend (16+ films)" },
];

async function simulateAIPrediction(form) {
  await new Promise(r => setTimeout(r, 2800 + Math.random() * 600));
  const risk = Math.floor(Math.random() * 80) + 10;
  return {
    budgetOverrun: {
      riskPercent: risk,
      status: risk < 35 ? "low" : risk < 65 ? "medium" : "high",
      factors: [
        { name: "Locations", impact: Math.floor(Math.random() * 15) + 5 },
        { name: "Crew Size", impact: Math.floor(Math.random() * 15) + 5 },
        { name: "Shooting Days", impact: Math.floor(Math.random() * 15) + 5 },
        { name: "Cast", impact: Math.floor(Math.random() * 15) + 5 },
      ],
      insight: "Historical data suggests similar productions exceeded budget by 18% on average.",
    },
    successPrediction: {
      rating: (Math.random() * 4 + 6).toFixed(1),
      probability: Math.floor(Math.random() * 40) + 55,
      tags: ["Award Potential","Wide Release","Marketing Ready"].slice(0, Math.floor(Math.random()*3)+1),
      trendData: Array.from({length: 12}, () => Math.floor(Math.random()*80)+20),
    },
    actorRecommendations: [
      { name: "Emma Stone", matchPercent: 94, reason: "Genre alignment & audience fit" },
      { name: "Ryan Gosling", matchPercent: 88, reason: "Budget tier compatibility" },
      { name: "Zendaya", matchPercent: 82, reason: "Demographic target match" },
    ],
    crewRecommendations: [
      { name: "Alex Turner", role: "DP", matchPercent: 91, reason: "Known for genre aesthetics" },
      { name: "Maya Chen", role: "Editor", matchPercent: 87, reason: "Fast turnaround specialist" },
      { name: "Sam Park", role: "Composer", matchPercent: 79, reason: "Mood & tone alignment" },
    ],
  };
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const SPRING = { type: "spring", stiffness: 400, damping: 30 };
const SPRING_SOFT = { type: "spring", stiffness: 200, damping: 25 };
const PREMIUM_EASE = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.55, ease: PREMIUM_EASE },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: PREMIUM_EASE } },
  exit: { opacity: 0, y: -10, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.3 } },
};

// ─── Cursor Glow ──────────────────────────────────────────────────────────────
function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ x: springX, y: springY }}
    >
      <div style={{
        position: "absolute",
        transform: "translate(-50%,-50%)",
        width: 320, height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, hsla(var(--neon-blue),0.07) 0%, transparent 70%)",
        filter: "blur(1px)",
      }} />
    </motion.div>
  );
}

// ─── Noise Overlay ────────────────────────────────────────────────────────────
function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: "128px 128px",
    }} />
  );
}

// ─── Ripple Effect ────────────────────────────────────────────────────────────
function useRipple() {
  const [ripples, setRipples] = useState([]);
  const trigger = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
  }, []);
  return [ripples, trigger];
}

// ─── Radial Progress ─────────────────────────────────────────────────────────
function RadialProgress({ value, size = 120, strokeWidth = 8, color = "hsl(var(--neon-blue))" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: "relative" }}>
      {/* Glow ring */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "50%",
        background: `radial-gradient(circle at center, ${color}18 0%, transparent 70%)`,
        filter: "blur(8px)",
        animation: "breathe 3s ease-in-out infinite",
      }} />
      <svg width={size} height={size} className="transform -rotate-90" style={{ position: "relative" }}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="hsla(var(--secondary),0.4)" strokeWidth={strokeWidth} />
        {/* Glow duplicate */}
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth + 4}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: PREMIUM_EASE }}
          strokeLinecap="round"
          style={{ filter: `blur(4px)`, opacity: 0.35 }}
        />
        {/* Main stroke */}
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: PREMIUM_EASE, delay: 0.1 }}
          strokeLinecap="round"
        />
        {/* Traveling light particle */}
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="white" strokeWidth={3}
          strokeDasharray={`6 ${circumference - 6}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset - 2 }}
          transition={{ duration: 1.8, ease: PREMIUM_EASE, delay: 0.15 }}
          strokeLinecap="round"
          style={{ opacity: 0.8 }}
        />
      </svg>
    </div>
  );
}

// ─── Animated Number ──────────────────────────────────────────────────────────
function AnimatedNumber({ value, decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1600;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out with overshoot
      const eased = progress < 1
        ? 1 - Math.pow(1 - progress, 3)
        : 1;
      const current = start + (value - start) * eased;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplay(value);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{typeof value === 'number' ? display.toFixed(decimals) : value}</>;
}

// ─── Animated Bar ─────────────────────────────────────────────────────────────
function AnimatedBar({ value, delay = 0 }) {
  return (
    <motion.div
      className="h-1.5 rounded-full"
      style={{ background: "linear-gradient(90deg, hsl(var(--neon-blue)), hsl(var(--neon-purple)))" }}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, value * 5)}%` }}
      transition={{ ...SPRING_SOFT, delay }}
    />
  );
}

// ─── AI Loader ────────────────────────────────────────────────────────────────
function ShimmerLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const phases = ["Parsing parameters…", "Running neural inference…", "Synthesizing predictions…", "Finalizing output…"];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) return p;
        return p + Math.random() * 4 + 0.5;
      });
    }, 120);
    const phaseInterval = setInterval(() => {
      setPhase(p => Math.min(p + 1, phases.length - 1));
    }, 700);
    return () => { clearInterval(interval); clearInterval(phaseInterval); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      className="flex flex-col items-center justify-center h-full gap-8 py-16"
    >
      {/* Neural ring */}
      <div style={{ position: "relative", width: 100, height: 100 }}>
        {[0,1,2].map(i => (
          <motion.div key={i} style={{
            position: "absolute", inset: i * 12,
            borderRadius: "50%",
            border: `1.5px solid hsla(var(--neon-blue),${0.6 - i*0.15})`,
          }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 3 + i * 1.5, repeat: Infinity, ease: "linear" }}
          />
        ))}
        {/* Scanning line */}
        <motion.div style={{
          position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
        }}>
          <motion.div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "50%", background: "linear-gradient(to bottom, transparent, hsla(var(--neon-blue),0.15))",
            transformOrigin: "bottom center",
          }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <motion.div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain style={{ width: 28, height: 28, color: "hsl(var(--neon-blue))" }} />
        </motion.div>
      </div>

      {/* Phase text */}
      <div className="text-center space-y-2">
        <p className="font-semibold text-foreground" style={{ fontFamily: "inherit" }}>AI Processing</p>
        <AnimatePresence mode="wait">
          <motion.p key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {phases[phase]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div style={{ width: 220 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-semibold" style={{ color: "hsl(var(--neon-blue))" }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 9999, background: "hsl(var(--secondary))", overflow: "hidden", position: "relative" }}>
          <motion.div
            style={{
              height: "100%", borderRadius: 9999,
              background: "linear-gradient(90deg, hsl(var(--neon-blue)), hsl(var(--neon-purple)))",
              width: `${progress}%`,
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Shimmer */}
            <motion.div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scanning lines decoration */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: 16 }}>
        {[0.2, 0.5, 0.8].map((top, i) => (
          <motion.div key={i} style={{
            position: "absolute", left: 0, right: 0, top: `${top * 100}%`, height: 1,
            background: "linear-gradient(90deg, transparent, hsla(var(--neon-blue),0.15), transparent)",
          }}
            animate={{ opacity: [0, 0.6, 0], scaleX: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Tilt Card ────────────────────────────────────────────────────────────────
function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - cy) * 8);
    rotateY.set((cx - 0.5) * 8);
    glowX.set(cx * 100);
    glowY.set(cy * 100);
  };
  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, hsla(var(--neon-blue),0.05) 0%, transparent 60%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 800, position: "relative", ...style }}
      className={className}
    >
      <motion.div style={{
        position: "absolute", inset: 0, borderRadius: "inherit",
        background: glowBg, pointerEvents: "none", zIndex: 1,
      }} />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </motion.div>
  );
}

// ─── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticButton({ children, onClick, disabled, className = "" }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);
  const scale = useSpring(useMotionValue(1), SPRING);
  const [ripples, triggerRipple] = useRipple();

  const onMouseMove = (e) => {
    if (disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    x.set(cx * 0.25);
    y.set(cy * 0.25);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };
  const onMouseDown = () => { if (!disabled) scale.set(0.95); };
  const onMouseUp = (e) => {
    scale.set(1.04);
    setTimeout(() => scale.set(1), 150);
    if (!disabled) { triggerRipple(e); onClick?.(); }
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown} onMouseUp={onMouseUp}
      style={{ x, y, scale, position: "relative", overflow: "hidden" }}
      disabled={disabled}
      className={className}
    >
      {ripples.map(r => (
        <motion.span key={r.id} style={{
          position: "absolute", left: r.x, top: r.y,
          width: 8, height: 8, borderRadius: "50%",
          background: "rgba(255,255,255,0.4)",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 18, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      {children}
    </motion.button>
  );
}

// ─── Glowing Input ────────────────────────────────────────────────────────────
function GlowInput({ value, onChange, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <motion.div style={{
        position: "absolute", inset: -1, borderRadius: 8, pointerEvents: "none",
        background: "linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-purple)))",
        opacity: focused ? 1 : 0,
        padding: 1,
        zIndex: 0,
      }}
        animate={{ opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: "relative", zIndex: 1,
          width: "100%", padding: "8px 12px",
          background: "hsl(var(--secondary)/0.4)",
          border: `1px solid hsl(var(--border)/0.5)`,
          borderRadius: 8,
          color: "hsl(var(--foreground))",
          fontSize: 14,
          outline: "none",
          transition: "background 0.2s",
        }}
      />
    </div>
  );
}

// ─── Glow Select ──────────────────────────────────────────────────────────────
function GlowSelect({ value, onChange, placeholder, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <motion.div style={{
        position: "absolute", inset: -1, borderRadius: 8, pointerEvents: "none",
        background: "linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-purple)))",
        zIndex: 0,
      }}
        animate={{ opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <select
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          position: "relative", zIndex: 1,
          width: "100%", padding: "8px 12px",
          background: "hsl(var(--secondary)/0.8)",
          border: `1px solid hsl(var(--border)/0.5)`,
          borderRadius: 8,
          color: "hsl(var(--foreground))",
          fontSize: 14, outline: "none", cursor: "pointer",
          appearance: "none",
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => (
          <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
        ))}
      </select>
      <ChevronRight style={{
        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%) rotate(90deg)",
        width: 14, height: 14, color: "hsl(var(--muted-foreground))", pointerEvents: "none", zIndex: 2,
      }} />
    </div>
  );
}

// ─── Glow Slider ─────────────────────────────────────────────────────────────
function GlowSlider({ value, onChange }) {
  return (
    <div style={{ position: "relative", paddingTop: 4, paddingBottom: 4 }}>
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0,
        height: 4, borderRadius: 9999,
        background: "hsl(var(--secondary))",
        transform: "translateY(-50%)", zIndex: 0,
      }} />
      <motion.div style={{
        position: "absolute", top: "50%", left: 0,
        width: `${value}%`, height: 4, borderRadius: 9999,
        background: "linear-gradient(90deg, hsl(var(--neon-blue)), hsl(var(--neon-purple)))",
        transform: "translateY(-50%)", zIndex: 1,
        boxShadow: "0 0 8px hsl(var(--neon-blue)/0.5)",
      }} />
      <input
        type="range" min={0} max={100} step={1} value={value}
        onChange={e => onChange(+e.target.value)}
        style={{
          position: "relative", zIndex: 2, width: "100%",
          opacity: 0, cursor: "pointer", height: 20,
        }}
      />
    </div>
  );
}

// ─── Result Panel Blocks ──────────────────────────────────────────────────────
function BudgetRiskPanel({ result }) {
  const riskColor = r => r === "low"
    ? "hsl(var(--success))" : r === "medium"
    ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <div className="glass-panel p-5">
      <motion.div variants={cardVariants}>
        <div className="flex items-center gap-2 mb-4">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <Target style={{ width: 16, height: 16, color: "hsl(var(--neon-blue))" }} />
          </motion.div>
          <h3 className="font-semibold text-sm">Budget Overrun Risk</h3>
        </div>
        <div className="flex items-center gap-6">
          <div style={{ position: "relative" }}>
            <RadialProgress value={result.budgetOverrun.riskPercent} color={riskColor(result.budgetOverrun.status)} />
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 22, fontWeight: 700 }}>
                <AnimatedNumber value={result.budgetOverrun.riskPercent} />%
              </span>
              <motion.span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: riskColor(result.budgetOverrun.status),
              }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {result.budgetOverrun.status} risk
              </motion.span>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {result.budgetOverrun.factors.map((f, i) => (
              <div key={f.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                <span className="text-muted-foreground">{f.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 64, height: 6, borderRadius: 9999, background: "hsl(var(--secondary))", overflow: "hidden" }}>
                    <AnimatedBar value={f.impact} delay={i * 0.1} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, minWidth: 20, textAlign: "right" }}>{f.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <motion.p
          className="text-sm text-muted-foreground mt-3 italic"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        >
          {result.budgetOverrun.insight}
        </motion.p>
      </motion.div>
    </div>
  );
}

function SuccessPanel({ result }) {
  return (
    <TiltCard className="glass-panel p-5">
      <motion.div variants={cardVariants}>
        <div className="flex items-center gap-2 mb-4">
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}>
            <Star style={{ width: 16, height: 16, color: "hsl(var(--warning))" }} />
          </motion.div>
          <h3 className="font-semibold text-sm">Success Prediction</h3>
        </div>
        <div className="flex items-center gap-6">
          <div style={{ textAlign: "center" }}>
            <motion.p
              style={{
                fontSize: 40, fontWeight: 700,
                background: "linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-purple)))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...SPRING, delay: 0.2 }}
            >
              {result.successPrediction.rating}
            </motion.p>
            <p className="text-xs text-muted-foreground">/&nbsp;10</p>
            <div style={{ display: "flex", gap: 2, marginTop: 6, justifyContent: "center" }}>
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...SPRING, delay: 0.3 + i * 0.08 }}>
                  <Star style={{
                    width: 14, height: 14,
                    color: i < Math.round(parseFloat(result.successPrediction.rating) / 2)
                      ? "hsl(var(--warning))" : "hsl(var(--secondary))",
                    fill: i < Math.round(parseFloat(result.successPrediction.rating) / 2)
                      ? "hsl(var(--warning))" : "transparent",
                  }} />
                </motion.div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p className="text-sm text-muted-foreground mb-1">Success Probability</p>
            <motion.p
              style={{
                fontSize: 28, fontWeight: 700,
                color: "hsl(var(--neon-blue))",
              }}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AnimatedNumber value={result.successPrediction.probability} />%
            </motion.p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {result.successPrediction.tags.map((tag, i) => (
                <motion.span key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...SPRING, delay: 0.5 + i * 0.1 }}
                  style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 9999,
                    background: "hsla(var(--neon-blue),0.1)",
                    color: "hsl(var(--neon-blue))",
                    border: "1px solid hsla(var(--neon-blue),0.2)",
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
            {/* Trend sparkline */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, marginTop: 10, height: 28 }}>
              {result.successPrediction.trendData.map((v, i) => (
                <motion.div key={i}
                  style={{
                    flex: 1, borderRadius: 2,
                    background: "linear-gradient(to top, hsl(var(--neon-blue)), hsl(var(--neon-purple)))",
                    opacity: 0.7,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${v}%` }}
                  transition={{ ...SPRING_SOFT, delay: 0.4 + i * 0.04 }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

function ActorCard({ actor, delay }) {
  const scale = useSpring(1, SPRING);
  const y = useSpring(0, SPRING);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...SPRING, delay }}
      onMouseEnter={() => { scale.set(1.04); y.set(-3); }}
      onMouseLeave={() => { scale.set(1); y.set(0); }}
      style={{
        scale, y,
        flexShrink: 0, width: 148, padding: 12,
        borderRadius: 10,
        background: "hsl(var(--secondary)/0.3)",
        border: "1px solid hsl(var(--border)/0.3)",
        cursor: "pointer", position: "relative", overflow: "hidden",
      }}
    >
      {/* Inner glow on hover */}
      <motion.div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 0%, hsla(var(--neon-purple),0.1), transparent 70%)",
        opacity: 0,
      }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "linear-gradient(135deg, hsl(var(--neon-blue)/0.2), hsl(var(--neon-purple)/0.2))",
        border: "1px solid hsl(var(--neon-purple)/0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "hsl(var(--neon-purple))", fontWeight: 700, fontSize: 11,
        marginBottom: 8, position: "relative", zIndex: 1,
      }}>
        {actor.name.split(' ').map(n => n[0]).join('')}
      </div>
      <p style={{ fontWeight: 600, fontSize: 12, position: "relative", zIndex: 1 }}>{actor.name}</p>
      <p style={{ color: "hsl(var(--neon-blue))", fontSize: 11, fontWeight: 700, marginTop: 3, position: "relative", zIndex: 1 }}>
        {actor.matchPercent}% match
      </p>
      <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 4, position: "relative", zIndex: 1, lineHeight: 1.4 }}>
        {actor.reason}
      </p>
    </motion.div>
  );
}

function CrewRow({ crew, delay }) {
  const scale = useSpring(1, SPRING);
  const x = useSpring(0, SPRING);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...SPRING, delay }}
      onMouseEnter={() => { scale.set(1.02); x.set(3); }}
      onMouseLeave={() => { scale.set(1); x.set(0); }}
      style={{
        scale, x,
        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
        borderRadius: 8, background: "hsl(var(--secondary)/0.25)",
        border: "1px solid transparent", cursor: "pointer",
        transition: "border-color 0.2s",
        position: "relative", overflow: "hidden",
      }}
    >
      <motion.div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 0% 50%, hsla(var(--neon-cyan),0.06), transparent 60%)",
        opacity: 0,
      }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div style={{
        width: 34, height: 34, borderRadius: 8,
        background: "linear-gradient(135deg, hsl(var(--neon-cyan)/0.15), hsl(var(--neon-blue)/0.15))",
        border: "1px solid hsl(var(--neon-cyan)/0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "hsl(var(--neon-cyan))", fontWeight: 700, fontSize: 10,
        flexShrink: 0, position: "relative", zIndex: 1,
      }}>
        {crew.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <p style={{ fontWeight: 600, fontSize: 12 }}>{crew.name}</p>
          <span style={{
            fontSize: 9, padding: "1px 6px", borderRadius: 9999,
            background: "hsl(var(--neon-blue)/0.1)", color: "hsl(var(--neon-blue))",
            fontWeight: 700,
          }}>{crew.role}</span>
        </div>
        <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{crew.reason}</p>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "hsl(var(--neon-blue))", position: "relative", zIndex: 1 }}>
        {crew.matchPercent}%
      </span>
      <ChevronRight style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground)/0.5)", position: "relative", zIndex: 1 }} />
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AICommandCenter() {
  const [form, setForm] = useState({
    title: "", genre: "",
    budget: 50000000, castSize: 15, crewSize: 100,
    shootingDays: 60, locations: 3,
    directorExperience: "", actorPopularity: 70,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runPrediction = async () => {
    setLoading(true);
    setResult(null);
    const res = await simulateAIPrediction(form);
    setLoading(false);
    setResult(res);
  };

  const reset = () => {
    setResult(null);
    setForm({
      title: "", genre: "", budget: 50000000, castSize: 15,
      crewSize: 100, shootingDays: 60, locations: 3,
      directorExperience: "", actorPopularity: 70,
    });
  };

  const labelStyle = {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "hsl(var(--muted-foreground))",
    display: "block", marginBottom: 6,
  };

  return (
    <>
      <style>{`
        @keyframes breathe {
          0%,100% { opacity:0.4; transform:scale(1); }
          50% { opacity:0.8; transform:scale(1.05); }
        }
        @keyframes border-trace {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .glass-panel {
          background: hsl(var(--card)/0.6);
          backdrop-filter: blur(16px);
          border: 1px solid hsl(var(--border)/0.4);
          border-radius: 14px;
          position: relative;
          overflow: hidden;
        }
        .glass-panel::before {
          content:'';
          position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%);
          pointer-events:none;
          border-radius: inherit;
        }
      `}</style>

      <CursorGlow />
      <NoiseOverlay />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: 1200, display: "flex", flexDirection: "column", gap: 24 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <motion.div
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-purple)))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 24px hsla(var(--neon-blue),0.4), 0 0 48px hsla(var(--neon-blue),0.15)",
            }}
            animate={{ boxShadow: [
              "0 0 24px hsla(var(--neon-blue),0.4), 0 0 48px hsla(var(--neon-blue),0.15)",
              "0 0 32px hsla(var(--neon-blue),0.6), 0 0 64px hsla(var(--neon-blue),0.25)",
              "0 0 24px hsla(var(--neon-blue),0.4), 0 0 48px hsla(var(--neon-blue),0.15)",
            ]}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles style={{ width: 22, height: 22, color: "white" }} />
          </motion.div>
          <div>
            <h1 style={{
              fontSize: 28, fontWeight: 800, lineHeight: 1,
              background: "linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-purple)))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              AI Command Center
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: 13, marginTop: 4 }}>
              Production intelligence &amp; predictive analytics
            </p>
          </div>
        </motion.div>

        {/* Main Panel */}
        <motion.div variants={itemVariants}>
          <div style={{ borderRadius: 18 }}>
            <div style={{
              background: "hsl(var(--card)/0.7)",
              backdropFilter: "blur(20px)",
              border: "1px solid hsl(var(--border)/0.4)",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 0 0 1px hsl(var(--border)/0.1), 0 24px 48px rgba(0,0,0,0.3)",
            }}>
              {/* Panel header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "14px 24px",
                borderBottom: "1px solid hsl(var(--border)/0.3)",
                background: "linear-gradient(180deg, hsl(var(--secondary)/0.3), transparent)",
              }}>
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                  <FlaskConical style={{ width: 16, height: 16, color: "hsl(var(--neon-blue))" }} />
                </motion.div>
                <h2 style={{ fontWeight: 700, fontSize: 15 }}>AI Test Lab</h2>

                {/* Animated dots */}
                <div style={{ marginLeft: "auto", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "hsl(var(--neon-blue))",
                    }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                  <span className="text-muted-foreground" style={{ fontSize: 11, marginLeft: 6 }}>Run Custom Prediction</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {/* LEFT: Input */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}
                >
                  {/* Grid of inputs */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <motion.div variants={itemVariants} style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Movie Title</label>
                      <GlowInput
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        placeholder="Enter movie title"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label style={labelStyle}>Genre</label>
                      <GlowSelect
                        value={form.genre}
                        onChange={v => setForm({ ...form, genre: v })}
                        placeholder="Select genre"
                        options={genres.map(g => ({ value: g, label: g }))}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label style={labelStyle}>Director Experience</label>
                      <GlowSelect
                        value={form.directorExperience}
                        onChange={v => setForm({ ...form, directorExperience: v })}
                        placeholder="Select"
                        options={directorExperience}
                      />
                    </motion.div>

                    {[
                      { label: "Budget ($)", key: "budget" },
                      { label: "Cast Size", key: "castSize" },
                      { label: "Crew Size", key: "crewSize" },
                      { label: "Shooting Days", key: "shootingDays" },
                      { label: "Locations", key: "locations" },
                    ].map(({ label, key }) => (
                      <motion.div key={key} variants={itemVariants}>
                        <label style={labelStyle}>{label}</label>
                        <GlowInput
                          type="number"
                          value={form[key]}
                          onChange={e => setForm({ ...form, [key]: +e.target.value })}
                          placeholder={label}
                        />
                      </motion.div>
                    ))}

                    <motion.div variants={itemVariants} style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>
                        Actor Popularity:{" "}
                        <motion.span
                          key={form.actorPopularity}
                          style={{ color: "hsl(var(--neon-blue))", fontWeight: 800 }}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          transition={SPRING}
                        >
                          {form.actorPopularity}
                        </motion.span>
                      </label>
                      <GlowSlider
                        value={form.actorPopularity}
                        onChange={v => setForm({ ...form, actorPopularity: v })}
                      />
                    </motion.div>
                  </div>

                  {/* Buttons */}
                  <motion.div variants={itemVariants} style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <MagneticButton
                      onClick={runPrediction}
                      disabled={loading}
                      className={`flex-1 h-12`}
                      style={{ flex: 1 }}
                    >
                      <motion.div style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "0 20px", height: 46, borderRadius: 10,
                        background: loading
                          ? "hsl(var(--secondary))"
                          : "linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--neon-purple)))",
                        color: "white", fontWeight: 700, fontSize: 14,
                        cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: loading ? "none" : "0 0 20px hsla(var(--neon-blue),0.4)",
                        border: "none", width: "100%",
                        transition: "background 0.3s, box-shadow 0.3s",
                      }}>
                        <motion.div
                          animate={loading ? { rotate: 360 } : { rotate: 0 }}
                          transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                        >
                          <Zap style={{ width: 18, height: 18 }} />
                        </motion.div>
                        {loading ? "Processing…" : "Run AI Prediction"}
                      </motion.div>
                    </MagneticButton>

                    <MagneticButton onClick={reset}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 10,
                        background: "hsl(var(--secondary)/0.6)",
                        border: "1px solid hsl(var(--border)/0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                      }}>
                        <RotateCcw style={{ width: 15, height: 15 }} />
                      </div>
                    </MagneticButton>
                  </motion.div>
                </motion.div>

                {/* RIGHT: Output */}
                <div style={{
                  padding: 24, minHeight: 520,
                  borderLeft: "1px solid hsl(var(--border)/0.3)",
                  position: "relative",
                }}>
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div key="loading"
                        initial={{ opacity: 0, filter: "blur(8px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(8px)" }}
                        style={{ height: "100%" }}
                      >
                        <ShimmerLoader />
                      </motion.div>
                    ) : result ? (
                      <motion.div key="result"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.3 } }}
                        style={{ display: "flex", flexDirection: "column", gap: 14 }}
                      >
                        <motion.div variants={itemVariants}><BudgetRiskPanel result={result} /></motion.div>
                        <motion.div variants={itemVariants}><SuccessPanel result={result} /></motion.div>

                        {/* Actor Recommendations */}
                        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <Users style={{ width: 14, height: 14, color: "hsl(var(--neon-purple))" }} />
                            <h3 style={{ fontWeight: 600, fontSize: 13 }}>Actor Recommendations</h3>
                          </div>
                          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                            {result.actorRecommendations.map((a, i) => (
                              <ActorCard key={a.name} actor={a} delay={i * 0.1} />
                            ))}
                          </div>
                        </motion.div>

                        {/* Crew Recommendations */}
                        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <UserCog style={{ width: 14, height: 14, color: "hsl(var(--neon-cyan))" }} />
                            <h3 style={{ fontWeight: 600, fontSize: 13 }}>Crew Recommendations</h3>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {result.crewRecommendations.map((c, i) => (
                              <CrewRow key={c.name} crew={c} delay={i * 0.1} />
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          height: "100%", display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center",
                          gap: 16, padding: "60px 0", textAlign: "center",
                        }}
                      >
                        <motion.div style={{
                          width: 64, height: 64, borderRadius: 16,
                          background: "linear-gradient(135deg, hsl(var(--secondary)/0.5), hsl(var(--secondary)/0.2))",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: "1px solid hsl(var(--border)/0.4)",
                        }}
                          animate={{ y: [0, -6, 0], boxShadow: [
                            "0 0 0 0 hsla(var(--neon-blue),0)",
                            "0 8px 20px 0 hsla(var(--neon-blue),0.2)",
                            "0 0 0 0 hsla(var(--neon-blue),0)",
                          ]}}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Brain style={{ width: 28, height: 28, color: "hsl(var(--neon-blue)/0.5)" }} />
                        </motion.div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 15 }}>Ready for Analysis</p>
                          <p className="text-muted-foreground" style={{ fontSize: 12, marginTop: 6, maxWidth: 240, lineHeight: 1.6 }}>
                            Fill in the production parameters and run the AI prediction to get intelligent insights.
                          </p>
                        </div>
                        {/* Decorative grid lines */}
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                          {Array.from({ length: 6 }, (_, i) => (
                            <motion.div key={i} style={{
                              position: "absolute", left: 0, right: 0,
                              top: `${(i + 1) * 14}%`, height: 1,
                              background: "linear-gradient(90deg, transparent, hsl(var(--border)/0.15), transparent)",
                            }}
                              animate={{ opacity: [0.3, 0.7, 0.3] }}
                              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}