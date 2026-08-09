import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Brain,
  Zap,
  Target,
  FlaskConical,
  Activity,
  Star,
  ShieldCheck,
  ChevronRight,
  Cpu,
  TrendingUp,
  Clock,
  Layers,
  BarChart2,
  Radio,
  Circle,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────
interface AIModel {
  name: string;
  version: string;
  accuracy: string;
  runtime: string;
  trained: string;
  type?: string;
  status?: "active" | "training" | "idle";
  predictions?: number;
}

// ─── Animation Presets ─────────────────────────────
const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease },
  }),
};

// ─── Mock API ──────────────────────────────────────
const getMockModels = (): AIModel[] => [
  {
    name: "Movie Success Predictor",
    version: "2.1",
    accuracy: "94%",
    runtime: "2.3s",
    trained: "2 days ago",
    type: "Classification",
    status: "active",
    predictions: 18_432,
  },
  {
    name: "Audience Sentiment AI",
    version: "1.4",
    accuracy: "91%",
    runtime: "1.8s",
    trained: "1 week ago",
    type: "NLP",
    status: "active",
    predictions: 9_204,
  },
  {
    name: "Box Office Forecaster",
    version: "3.0",
    accuracy: "88%",
    runtime: "3.1s",
    trained: "3 days ago",
    type: "Regression",
    status: "training",
    predictions: 4_780,
  },
  {
    name: "Genre Classifier",
    version: "1.1",
    accuracy: "97%",
    runtime: "0.9s",
    trained: "2 weeks ago",
    type: "Classification",
    status: "idle",
    predictions: 31_009,
  },
];

// ─── Skeleton ──────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.9, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      className={`bg-slate-800/60 rounded-lg ${className}`}
    />
  );
}

// ─── Status Badge ──────────────────────────────────
const statusConfig = {
  active: {
    label: "Active",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  training: {
    label: "Training",
    dot: "bg-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  idle: {
    label: "Idle",
    dot: "bg-slate-500",
    text: "text-slate-400",
    bg: "bg-slate-700/40 border-slate-700",
  },
};

function StatusBadge({ status = "idle" }: { status?: string }) {
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.idle;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === "active" ? "animate-pulse" : ""}`} />
      {cfg.label}
    </span>
  );
}

// ─── Animated Bar ──────────────────────────────────
function AnimatedBar({ value, delay = 0, color = "bg-white" }: { value: number; delay?: number; color?: string }) {
  return (
    <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.4, delay, ease }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

// ─── Neural Node ───────────────────────────────────
function NeuralNode({ i, active }: { i: number; active: boolean }) {
  return (
    <motion.div
      animate={active ? { scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] } : {}}
      transition={{ repeat: Infinity, duration: 1.8 + i * 0.3, delay: i * 0.2 }}
      className="w-2 h-2 rounded-full bg-cyan-400"
    />
  );
}

// ─── Pulse Ring ────────────────────────────────────
function PulseRing() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
    </span>
  );
}

// ─── Model Card ────────────────────────────────────
function ModelCard({ model, index, selected, onSelect }: {
  model: AIModel;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const accuracyNum = parseFloat(model.accuracy);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={`relative group cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden
        ${selected
          ? "border-indigo-500/50 bg-indigo-900/20 shadow-[0_0_0_1px_rgba(99,102,241,0.3),0_4px_24px_rgba(99,102,241,0.12)]"
          : "border-slate-800/60 bg-slate-900/40 hover:border-slate-700/80 hover:bg-slate-900/60"
        }`}
    >
      {/* Subtle left accent */}
      <motion.div
        animate={{ opacity: selected ? 1 : 0 }}
        className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full bg-gradient-to-b from-indigo-400 to-purple-500"
      />

      <div className="px-6 py-5 flex items-center gap-5">
        {/* Icon box */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
          ${selected ? "bg-indigo-500/20 border border-indigo-500/30" : "bg-slate-800/60 border border-slate-700/50"}`}>
          <Brain className={`w-4.5 h-4.5 ${selected ? "text-indigo-400" : "text-slate-400"}`} size={18} />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <p className="text-white font-semibold text-sm truncate">{model.name}</p>
            <StatusBadge status={model.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>v{model.version}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>{model.type}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>{model.trained}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <p className="text-emerald-400 font-bold text-sm">{model.accuracy}</p>
            <p className="text-slate-500 text-xs">accuracy</p>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold text-sm">{model.runtime}</p>
            <p className="text-slate-500 text-xs">runtime</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-slate-200 font-semibold text-sm">{(model.predictions ?? 0).toLocaleString()}</p>
            <p className="text-slate-500 text-xs">predictions</p>
          </div>

          {/* Mini accuracy bar */}
          <div className="w-16 hidden md:block">
            <div className="flex justify-between text-[10px] text-slate-600 mb-1">
              <span>Acc</span>
              <span>{model.accuracy}</span>
            </div>
            <div className="h-[3px] bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${accuracyNum}%` }}
                transition={{ duration: 1.2, delay: 0.2 + index * 0.1, ease }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              />
            </div>
          </div>

          <ChevronRight
            size={14}
            className={`transition-all ${selected ? "text-indigo-400 translate-x-0.5" : "text-slate-700 group-hover:text-slate-500"}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tilt Card Wrapper ─────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 30 });

  function onMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouse}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────
export default function Model() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(0);
  const [tick, setTick] = useState(0);

  // Simulate live updates
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const load = async () => {
      await new Promise((r) => setTimeout(r, 900));
      setModels(getMockModels());
      setLoading(false);
    };
    load();
  }, []);

  const nodeLatencies = useRef(
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 60) + 20)
  );

  // Slightly randomize latencies on tick
  useEffect(() => {
    nodeLatencies.current = nodeLatencies.current.map((v) =>
      Math.max(12, Math.min(95, v + (Math.random() - 0.5) * 8))
    );
  }, [tick]);

  return (
    <div className="min-h-screen bg-[#080B12] text-white">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%),
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        }}
      />

      <div className="relative z-10 p-4 sm:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 max-w-[1800px] w-full mx-auto">

        {/* ───── LEFT ───── */}
        <div className="space-y-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          >
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-6 bg-indigo-500/60" />
                <span className="text-indigo-400 text-xs font-medium tracking-widest uppercase">
                  Intelligence Layer
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white leading-none">
                AI Model
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {" "}Center
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-md">
                Monitor, evaluate, and manage production AI models in real time.
              </p>
            </div>

            {/* System status */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/60 rounded-full px-4 py-2 text-xs">
                <PulseRing />
                <span className="text-slate-300">All systems online</span>
              </div>
            </div>
          </motion.div>

          {/* Top stat strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { label: "Total Models", val: "7", icon: Brain, accent: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
              { label: "Queue", val: "3", icon: Zap, accent: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              { label: "Avg. Accuracy", val: "94%", icon: Target, accent: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { label: "Avg. Runtime", val: "2.3s", icon: Clock, accent: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className={`relative rounded-2xl border ${s.bg} p-4 overflow-hidden`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg}`}>
                      <Icon size={15} className={s.accent} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Models section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers size={16} className="text-indigo-400" />
                Deployed Models
              </h2>
              <span className="text-xs text-slate-500">{models.length} models</span>
            </div>

            <div className="space-y-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
                      <div className="flex items-center gap-5">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  ))
                : models.map((model, i) => (
                    <ModelCard
                      key={i}
                      model={model}
                      index={i}
                      selected={selected === i}
                      onSelect={() => setSelected(selected === i ? null : i)}
                    />
                  ))}
            </div>
          </div>

          {/* Detail panel (expanded when a model is selected) */}
          <AnimatePresence>
            {selected !== null && models[selected] && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 10 }}
                transition={{ duration: 0.4, ease }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart2 size={15} className="text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">
                      {models[selected].name} — Performance
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Accuracy", val: parseFloat(models[selected].accuracy), color: "from-emerald-500 to-teal-400" },
                      { label: "Confidence", val: 86, color: "from-indigo-500 to-purple-400" },
                      { label: "Throughput", val: 72, color: "from-sky-500 to-cyan-400" },
                    ].map((m, i) => (
                      <div key={i} className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-2">{m.label}</p>
                        <p className="text-xl font-black text-white mb-3">{m.val}%</p>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${m.val}%` }}
                            transition={{ duration: 1, delay: i * 0.15, ease }}
                            className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ───── RIGHT SIDEBAR ───── */}
        <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">

          {/* Venture Stability card (tilt) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease }}
          >
            <TiltCard>
              <div className="relative rounded-3xl overflow-hidden">
                {/* Mesh background */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.35) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.25) 0%, transparent 50%),
                      linear-gradient(135deg, #0f1629 0%, #14102b 100%)`,
                  }}
                />

                {/* Decorative circles */}
                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-white/5" />
                <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full border border-white/5" />

                <div className="relative p-7">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs text-white/40 font-medium tracking-widest uppercase mb-1">Protocol</p>
                      <h3 className="text-xl font-black text-white">Venture Stability</h3>
                      <p className="text-xs text-white/30 mt-0.5">Market Protocol v2.4</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                      <Star size={15} className="text-white/60" />
                    </div>
                  </div>

                  <div className="space-y-5">
                    {[
                      { label: "Efficiency", value: 92, color: "from-indigo-400 to-blue-500" },
                      { label: "Stability",  value: 87, color: "from-purple-400 to-pink-500" },
                      { label: "Growth",     value: 78, color: "from-teal-400 to-emerald-500" },
                    ].map((m, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-white/60">{m.label}</span>
                          <span className="text-white font-semibold">{m.value}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${m.value}%` }}
                            transition={{ duration: 1.4, delay: 0.3 + i * 0.15, ease }}
                            className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Score */}
                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white/40">Composite score</span>
                    <span className="text-2xl font-black text-white">86<span className="text-sm text-white/40">/100</span></span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Neural Monitor */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease }}
            className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Radio size={13} className="text-cyan-400" />
                <h4 className="text-xs font-semibold text-white uppercase tracking-widest">
                  Neural Monitor
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <ShieldCheck size={12} />
                Integrity OK
              </div>
            </div>

            <div className="space-y-3.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const lat = Math.round(nodeLatencies.current[i] ?? 30);
                const isHot = lat > 70;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <NeuralNode i={i} active={i < 3} />
                        Node {i + 1}
                      </div>
                      <span className={isHot ? "text-amber-400" : "text-slate-400"}>
                        {lat} ms
                      </span>
                    </div>
                    <div className="h-[2px] bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ x: ["-100%", "220%"] }}
                        transition={{ repeat: Infinity, duration: 1.8 + i * 0.5, ease: "linear" }}
                        className={`h-full w-1/3 rounded-full ${isHot ? "bg-amber-400" : "bg-cyan-400"}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Throughput mini-sparkline (fake) */}
            <div className="mt-5 pt-4 border-t border-slate-800/60">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Throughput</span>
                <span className="text-slate-300">1.2k req/s</span>
              </div>
              <div className="flex items-end gap-[3px] h-10">
                {[40, 55, 38, 65, 72, 58, 80, 68, 90, 74, 82, 95, 78, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: i * 0.04, ease }}
                    className="flex-1 rounded-sm bg-indigo-500/40"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Live feed */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease }}
            className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity size={13} className="text-indigo-400" />
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest">Live Feed</h4>
            </div>
            <div className="space-y-3">
              {[
                { msg: "Prediction batch #4821 completed", time: "just now", type: "success" },
                { msg: "Model v2.1 redeployed", time: "2m ago", type: "info" },
                { msg: "Training epoch 48/60 — 91.4%", time: "5m ago", type: "warn" },
                { msg: "New dataset ingested", time: "12m ago", type: "info" },
              ].map((ev, i) => (
                <motion.div
                  key={`${tick}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 text-xs"
                >
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    ev.type === "success" ? "bg-emerald-400" :
                    ev.type === "warn" ? "bg-amber-400" : "bg-indigo-400"
                  }`} />
                  <div className="flex-1">
                    <p className="text-slate-300 leading-snug">{ev.msg}</p>
                    <p className="text-slate-600 mt-0.5">{ev.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </aside>
      </div>
    </div>
  );
}