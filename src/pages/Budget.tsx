import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { movieAPI } from "@/services/movieAPI";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  AlertCircle,
  BarChart2,
  PieChart,
  Activity,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Clock,
  Filter,
  Minus,
  MoreHorizontal,
} from "lucide-react";

// ─── Animation Presets ─────────────────────────────
const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease } },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, delay, ease } },
});

// ─── Helpers ───────────────────────────────────────
function fmtCurrency(value: number): string {
  const absValue = Math.abs(value);
  let formatted: string;
  let unit: string;

  if (absValue >= 1_000_000_000_000) {
    formatted = (absValue / 1_000_000_000_000).toFixed(2);
    unit = 'T';
  } else if (absValue >= 1_000_000_000) {
    formatted = (absValue / 1_000_000_000).toFixed(2);
    unit = 'B';
  } else if (absValue >= 1_000_000) {
    formatted = (absValue / 1_000_000).toFixed(1);
    unit = 'M';
  } else if (absValue >= 1_000) {
    formatted = (absValue / 1_000).toFixed(1);
    unit = 'K';
  } else {
    formatted = absValue.toFixed(0);
    unit = '';
  }

  return `$${formatted}${unit}`;
}
const getTrend = (current, previous) => {
  if (previous === 0) return { icon: Minus, color: "text-slate-500", label: "No baseline" };

  const diff = current - previous;
  const percent = ((diff / previous) * 100).toFixed(1);

  if (diff > 0)
    return {
      icon: ArrowUpRight,
      color: "text-emerald-400",
      label: `+${percent}% vs last quarter`,
    };

  if (diff < 0)
    return {
      icon: ArrowDownRight,
      color: "text-rose-400",
      label: `${percent}% vs last quarter`,
    };

  return {
    icon: Minus,
    color: "text-slate-500",
    label: "No change",
  };
};
function PulseRing({ color = "bg-emerald-400" }: { color?: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-50`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      className={`bg-slate-800/60 rounded-lg ${className}`}
    />
  );
}

// ─── Sidebar ───────────────────────────────────────
function Sidebar({
  movies,
  loading,
  selected,
  onSelect,
  utilization,
}: {
  movies: any[];
  loading: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
  utilization: number;
}) {
  return (
    <aside className="w-full xl:w-[280px] xl:flex-shrink-0 xl:sticky xl:top-8 xl:self-start space-y-5">

      {/* Health gauge */}
      <motion.div {...fadeRight(0.1)} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 overflow-hidden relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 0% 100%, rgba(16,185,129,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Budget Health</span>
          <PulseRing />
        </div>

        {/* Circular gauge (SVG) */}
        <div className="flex items-center justify-center py-3">
          <div className="relative w-28 h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - Math.min(Math.max(utilization, 0), 1)) }}
                transition={{ duration: 1.6, delay: 0.4, ease }}
              />
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{Math.round(utilization * 100)}%</span>
              <span className="text-[10px] text-slate-500">utilized</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          {[
            { label: "On track", val: "4", dot: "bg-emerald-400" },
            { label: "Over budget", val: "1", dot: "bg-red-400" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800/40 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                <span className="text-[10px] text-slate-500">{s.label}</span>
              </div>
              <span className="text-lg font-black text-white">{s.val}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Movie list (sidebar) */}
      <motion.div {...fadeRight(0.18)} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Layers size={11} /> Productions
          </span>
          <span className="text-[10px] text-slate-600">{movies.length} total</span>
        </div>

        <div className="space-y-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5">
                  <Skeleton className="w-7 h-7 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-2.5 w-24" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
              ))
            : movies.map((movie) => {
                const pct = movie.budget && movie.budget > 0 ? Math.round(((movie.spent || 0) / movie.budget) * 100) : 0;
                const isCompleted = movie.status === "Completed";
                const isSuccessful = movie.prediction === "Successful";

                const isRed = !isCompleted && pct > 80;
                const isBlackish = isCompleted && !isSuccessful;
                const isActive = selected === movie._id;

                const statusColor = isRed ? "text-red-400" : isBlackish ? "text-amber-400" : "text-emerald-400";
                const iconBg = isRed ? "bg-red-500/20" : isBlackish ? "bg-amber-500/20" : "bg-emerald-500/15";
                const barColor = isRed ? "bg-red-500" : isBlackish ? "bg-amber-500/60" : "bg-emerald-500";

                return (
                  <motion.button
                    key={movie._id}
                    onClick={() => onSelect(isActive ? null : movie._id)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors
                      ${isActive
                        ? "bg-emerald-500/10 border border-emerald-500/20"
                        : "hover:bg-slate-800/40 border border-transparent"}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-black
                      ${iconBg} ${statusColor} overflow-hidden border border-slate-700/30`}>
                      {movie.poster_url ? (
                        <img src={movie.poster_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        movie.title?.[0] ?? "?"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{movie.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(pct, 100)}%` }}
                            transition={{ duration: 1, ease }}
                            className={`h-full rounded-full ${barColor}`}
                          />
                        </div>
                        <span className={`text-[10px] font-bold flex-shrink-0 ${statusColor}`}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={12} className={`flex-shrink-0 transition-colors ${isActive ? "text-emerald-400" : "text-slate-700"}`} />
                  </motion.button>
                );
              })}
        </div>
      </motion.div>

      {/* Quick financials */}
      <motion.div {...fadeRight(0.25)} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          <Activity size={11} /> Live Metrics
        </span>
        <div className="space-y-3">
          {[
            { label: "Daily burn rate", val: "$1.2M", delta: "+4.2%", up: true },
            { label: "Avg. efficiency", val: "78%", delta: "+1.1%", up: true },
            { label: "Overruns flagged", val: "3", delta: "−2", up: false },
          ].map((m, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-slate-700" />
                <span className="text-xs text-slate-500">{m.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{m.val}</span>
                <span className={`text-[10px] font-semibold flex items-center ${m.up ? "text-emerald-400" : "text-red-400"}`}>
                  {m.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {m.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent activity */}
      <motion.div {...fadeRight(0.32)} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          <Clock size={11} /> Recent
        </span>
        <div className="space-y-3">
          {[
            { msg: "Invoice #4821 approved", time: "2m ago", type: "success" },
            { msg: "Budget revised: Interstellar", time: "1h ago", type: "warn" },
            { msg: "Allocation request pending", time: "3h ago", type: "info" },
          ].map((ev, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                ev.type === "success" ? "bg-emerald-400" :
                ev.type === "warn" ? "bg-amber-400" : "bg-sky-400"
              }`} />
              <div>
                <p className="text-[11px] text-slate-300 leading-snug">{ev.msg}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{ev.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </aside>
  );
}

// ─── Main Component ────────────────────────────────
export default function Budget() {
  // ── all original backend logic untouched ──
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await movieAPI.getMovies();
        setMovies(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load financial data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalAllocated = useMemo(() => movies.reduce((sum, m) => sum + (m.budget || 0), 0), [movies]);
  const totalSpent = useMemo(() => movies.reduce((sum, m) => sum + (m.spent || 0), 0), [movies]);
  const remaining = useMemo(() => totalAllocated - totalSpent, [totalAllocated, totalSpent]);
  const utilization = useMemo(() => totalAllocated > 0 ? totalSpent / totalAllocated : 0, [totalAllocated, totalSpent]);
  // ─────────────────────────────────────────────────

  const previousTotalAllocated = totalAllocated * 0.95; // dummy previous
  const previousTotalSpent = totalSpent * 1.05; // dummy previous
  const previousRemaining = remaining * 0.9; // dummy previous

  const reserveRatio = totalAllocated > 0 ? remaining / totalAllocated : 0;
  const reserveColor = reserveRatio < 0.15 ? "text-red-400" : reserveRatio < 0.3 ? "text-amber-400" : "text-cyan-400";

  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayMovies =
    selectedMovie ? movies.filter((m) => m._id === selectedMovie) : movies;

  return (
    <div className="min-h-screen bg-[#080B12]">
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 50% at 30% -5%, rgba(16,185,129,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(6,182,212,0.06) 0%, transparent 60%),
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 52px 52px, 52px 52px",
        }}
      />

      <div className="relative z-10 p-5 sm:p-8 xl:p-10 max-w-[1500px] mx-auto">

        {/* ─── Mobile sidebar toggle ─── */}
        <div className="xl:hidden mb-5 flex justify-end">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center gap-2 text-xs text-slate-400 border border-slate-800 rounded-full px-4 py-2 hover:bg-slate-800/50 transition-colors"
          >
            <Filter size={12} />
            {sidebarOpen ? "Hide" : "Show"} Panel
          </button>
        </div>

        {/* ─── Mobile sidebar (collapsible) ─── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease }}
              className="xl:hidden overflow-hidden mb-6"
            >
              <Sidebar
                movies={movies}
                loading={loading}
                selected={selectedMovie}
                onSelect={setSelectedMovie}
                utilization={utilization}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Main layout ─── */}
        <div className="flex flex-col xl:flex-row gap-8">

          {/* ─── Content ─── */}
          <div className="flex-1 min-w-0 space-y-7">

            {error ? (
              <div className="text-center py-8">
                <p className="text-red-400 text-lg">Failed to load financial data</p>
              </div>
            ) : (
            <>
            <motion.div {...fadeUp(0)}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-6 bg-emerald-500/60" />
                <span className="text-emerald-400 text-xs font-medium tracking-widest uppercase">Finance</span>
              </div>
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-4xl font-black text-white tracking-tight leading-none">
                    Real-Time{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                      Budget
                    </span>
                  </h1>
                  <p className="text-slate-400 mt-2 text-sm">
                    Live financial tracking across all active productions.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/60 rounded-full px-4 py-2 text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-slate-300">Live tracking</span>
                </div>
              </div>
            </motion.div>

            {/* Summary cards — original data, new skin */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Total Allocation",
                  value: totalAllocated,
                  previous: previousTotalAllocated,
                  icon: DollarSign,
                  color: "text-white",
                  accent: "from-slate-700/40 to-slate-800/20",
                  border: "border-slate-700/50",
                  iconBg: "bg-slate-700/50 text-slate-300",
                },
                {
                  label: "Burned Revenue",
                  value: totalSpent,
                  previous: previousTotalSpent,
                  icon: TrendingUp,
                  color: "text-emerald-400",
                  accent: "from-emerald-900/30 to-emerald-900/10",
                  border: "border-emerald-800/40",
                  iconBg: "bg-emerald-500/20 text-emerald-400",
                },
                {
                  label: "Reserve Balance",
                  value: remaining,
                  previous: previousRemaining,
                  icon: Wallet,
                  color: reserveColor,
                  accent: "from-cyan-900/30 to-cyan-900/10",
                  border: "border-cyan-800/40",
                  iconBg: "bg-cyan-500/20 text-cyan-400",
                },
              ].map((s, i) => {
                const trend = getTrend(s.value, s.previous);
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease }}
                    className={`relative rounded-2xl border ${s.border} bg-gradient-to-br ${s.accent} p-6 overflow-hidden group`}
                  >
                    {/* Decorative orb */}
                    <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full blur-2xl bg-white/5 group-hover:bg-white/8 transition-all" />

                    <div className="flex items-start justify-between mb-5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                        <s.icon size={14} />
                      </div>
                    </div>

                    <p className={`text-3xl font-black ${s.color} leading-none`}>
                      {loading ? <Skeleton className="h-8 w-24" /> : fmtCurrency(s.value)}
                    </p>

                    <div className="flex items-center gap-1.5 mt-3">
                      <trend.icon size={11} className={trend.color} />
                      <span className={`text-[10px] ${trend.color}`}>{trend.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Burn rate panel — original data + logic, new skin */}
            <motion.div {...fadeUp(0.3)} className="relative rounded-2xl border border-slate-800/60 bg-slate-900/40 overflow-hidden">
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertCircle size={15} className="text-emerald-500" />
                    Active Burn Rate
                    {selectedMovie && (
                      <button
                        onClick={() => setSelectedMovie(null)}
                        className="ml-2 text-[10px] text-slate-500 hover:text-slate-300 border border-slate-700 rounded-full px-2.5 py-0.5 transition-colors"
                      >
                        Clear filter
                      </button>
                    )}
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      On track
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      Over 80%
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Unsuccessful
                    </div>
                  </div>
                </div>

                <div className="space-y-7">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-3.5 w-36" />
                          <Skeleton className="h-3.5 w-24" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                    ))
                  ) : displayMovies.length === 0 ? (
                    <p className="text-slate-500 italic text-sm">No production data available for analysis.</p>
                  ) : (
                    displayMovies.map((movie, idx) => {
                      // ── original calc logic ──
                      const pct = movie.budget && movie.budget > 0 ? Math.round(((movie.spent || 0) / movie.budget) * 100) : 0;
                      // ─────────────────────────
                      const isCompleted = movie.status === "Completed";
                      const isSuccessful = movie.prediction === "Successful";

                      const isRed = !isCompleted && pct > 80;
                      const isBlackish = isCompleted && !isSuccessful;

                      const statusColor = isRed ? "bg-red-500" : isBlackish ? "bg-amber-400" : "bg-emerald-500/50";
                      const tagColor = isRed
                        ? "bg-red-500/15 text-red-400 border-red-500/20"
                        : isBlackish
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
                      const barColor = isRed
                        ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                        : isBlackish
                        ? "bg-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
                        : "bg-gradient-to-r from-emerald-500 to-cyan-400";

                      return (
                        <motion.div
                          key={movie._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.06 }}
                          className="group"
                        >
                          <div className="flex justify-between items-end mb-2.5 px-0.5">
                            <div className="flex items-center gap-3">
                              <div className={`w-1 h-10 rounded-full flex-shrink-0 ${statusColor}`} />
                              <div>
                                <span className="font-bold text-white text-sm">{movie.title}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-tight">{movie.genre}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-right">
                              <div>
                                <p className="text-xs text-slate-500">spent / budget</p>
                                <p className="text-sm font-bold text-white">
                                  {fmtCurrency(movie.spent || 0)}{" "}
                                  <span className="text-slate-500 font-medium">/ {fmtCurrency(movie.budget || 0)}</span>
                                </p>
                              </div>
                              <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg border ${tagColor}`}>
                                {pct}%
                              </span>
                            </div>
                          </div>

                          {/* Progress track */}
                          <div className="h-2 rounded-full bg-slate-800/60 overflow-hidden ml-4">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(pct, 100)}%` }}
                              transition={{ duration: 1.5, ease: "circOut" }}
                              className={`h-full rounded-full ${barColor}`}
                            />
                          </div>

                          {/* Segment ticks */}
                          <div className="flex justify-between mt-1.5 ml-4 px-0.5">
                            {[0, 25, 50, 75, 100].map((t) => (
                              <span key={t} className="text-[9px] text-slate-700">{t}%</span>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Overall progress footer */}
                {!loading && movies.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-800/60">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs text-slate-500 font-medium">Portfolio utilization</span>
                      <span className="text-xs font-black text-white">
                        {totalAllocated > 0
                          ? Math.round((totalSpent / totalAllocated) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-800/60 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: totalAllocated > 0
                            ? `${Math.min((totalSpent / totalAllocated) * 100, 100)}%`
                            : "0%",
                        }}
                        transition={{ duration: 1.8, ease }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-slate-600">
                      <span>Spent: {fmtCurrency(totalSpent)}</span>
                      <span>Remaining: {fmtCurrency(remaining)}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            </>
            )}
          </div>

          <div className="hidden xl:block">
            <Sidebar
              movies={movies}
              loading={loading}
              selected={selectedMovie}
              onSelect={setSelectedMovie}
              utilization={utilization}
            />
          </div>

        </div>
      </div>
    </div>
  );
}