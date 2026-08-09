import { motion, AnimatePresence } from "framer-motion";
import {
  Film, DollarSign, AlertTriangle, TrendingUp, Plus, Users,
  Calendar, Sparkles, User, Target, LayoutDashboard, Settings,
  Bell, Search, ChevronRight, Menu, X, LogOut, Clapperboard,
  BarChart2, Zap, Star, Eye, Clock, ArrowUpRight, Activity, Hand
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { movieAPI, MovieResponse } from "@/services/movieAPI";
import { useProductions } from "@/contexts/ProductionsContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar
} from "recharts";

/* ─── Animated Counter ─────────────────────────────────────────── */
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString()}</>;
}

/* ─── Sidebar Nav Items ─────────────────────────────────────────── */
const NAV = [
  { label: "Dashboard",   icon: LayoutDashboard, path: "/dashboard" },
  { label: "Movies",      icon: Film,            path: "/movies" },
  { label: "AI Command",  icon: Sparkles,        path: "/ai-command" },
  { label: "Productions", icon: Clapperboard,    path: "/movies" },
  { label: "Analytics",   icon: BarChart2,       path: "/model" },
  { label: "Schedule",    icon: Calendar,        path: "/schedule" },
  { label: "Team",        icon: Users,           path: "/crew" },
];

/* ─── Sidebar ───────────────────────────────────────────────────── */
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const sidebarVariants = {
    open:   { x: 0,    opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: -280, opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={open ? "open" : "closed"}
        className="fixed top-0 left-0 h-full w-[260px] z-40 flex flex-col"
        style={{
          background: "linear-gradient(180deg, #0d0f1a 0%, #0a0c16 100%)",
          borderRight: "1px solid rgba(99,102,241,0.15)",
          boxShadow: "4px 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              <Clapperboard className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl blur-md opacity-50"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }} />
            </div>
            <div>
              <p className="font-bold text-sm tracking-wider text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                CINEPULSE
              </p>
              <p className="text-[10px] text-indigo-400 tracking-[0.2em] uppercase">Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/8 group hover:border-indigo-500/40 transition-all">
            <Search className="w-3.5 h-3.5 text-white/30 group-hover:text-indigo-400 transition-colors" />
            <input placeholder="Search..." className="bg-transparent text-xs text-white/60 placeholder-white/25 outline-none flex-1" />
            <span className="text-[10px] text-white/20 border border-white/10 rounded px-1">⌘K</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.15em] px-3 mb-2">Main Menu</p>
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { navigate(item.path); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative overflow-hidden"
                style={{
                  background: active ? "rgba(99,102,241,0.15)" : "transparent",
                  color: active ? "#a5b4fc" : "rgba(255,255,255,0.45)",
                  border: active ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                }}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full"
                    style={{ background: "linear-gradient(180deg, #6366f1, #a855f7)" }}
                  />
                )}
                <item.icon className={`w-4 h-4 transition-all ${active ? "text-indigo-400" : "group-hover:text-white/80"}`} />
                <span className={`font-medium ${active ? "" : "group-hover:text-white/80"}`}>{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400 opacity-60" />}
              </motion.button>
            );
          })}

          <div className="pt-4 pb-2">
            <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.15em] px-3 mb-2">System</p>
            {[{ label: "Settings", icon: Settings, path: "/settings" }, { label: "Notifications", icon: Bell, path: "/notifications" }].map(item => (
              <motion.button
                key={item.path}
                whileHover={{ x: 4 }}
                onClick={() => { navigate(item.path); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* User profile */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/8 transition-all cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">{user?.name ?? "User"}</p>
              <p className="text-[10px] text-indigo-400">Pro Plan</p>
            </div>
            <LogOut className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
          </div>
        </div>
      </motion.aside>
    </>
  );
}

/* ─── Stat Card ─────────────────────────────────────────────────── */
function StatCard({ label, value, suffix, icon: Icon, color, glow, delay, trend }:
  { label: string; value: number; suffix?: string; icon: any; color: string; glow: string; delay: number; trend?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      className="relative rounded-2xl p-5 overflow-hidden group cursor-default"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Glow blob */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
        style={{ background: glow }} />
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`}
          style={{ background: `${glow}22`, border: `1px solid ${glow}33` }}>
          <Icon className="w-5 h-5" style={{ color: glow }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80" }}>
            <ArrowUpRight className="w-3 h-3" />{trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
        <AnimatedCounter target={value} />
        {suffix && <span className="text-base text-white/40 ml-0.5">{suffix}</span>}
      </p>
      <p className="text-xs text-white/40 uppercase tracking-widest font-medium">{label}</p>
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${glow}, transparent)` }} />
    </motion.div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { productions } = useProductions();
  const [movies, setMovies] = useState<MovieResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    // Auto-open sidebar on large screens
    const mql = window.matchMedia("(min-width: 1024px)");
    setSidebarOpen(mql.matches);
    const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    movieAPI.getMovies()
      .then(setMovies)
      .catch(() => setError("Failed to load movie data"))
      .finally(() => setLoading(false));
  }, []);

  const totalMovies = 67;
  const avgSuccessProbability = 44;
  const highRiskMovies = 51;
  const successfulMovies = 42;



//   Fix the dashboard to use real API-driven data instead of hardcoded values, without changing any UI, layout, animations, styling, or chart design.

// Requirements:

// 1. Replace all hardcoded stats (totalMovies, avgSuccessProbability, highRiskMovies, successfulMovies) with dynamically calculated values from existing data sources.

// 2. Use a single consistent data source:

//    * Prefer `productions` from `useProductions()` if available.
//    * Do NOT mix `movies` and `productions` for stats and charts.

// 3. Compute stats as follows:

//    * Total Movies = total number of items
//    * Average Success Rate = average of `success_probability`
//    * High Risk = items where `success_probability < 40`
//    * Successful = items where `success_probability >= 60` (or based on prediction field if already used)

// 4. Ensure all calculations are safe:

//    * Handle empty arrays
//    * Avoid division by zero
//    * Default missing values to 0

// 5. Do NOT modify:

//    * Any JSX structure
//    * Any chart components (BarChart, AreaChart, etc.)
//    * Any styling, animations, gradients, or layout
//    * Any UI text or labels

// 6. Fix only data binding issues if present (e.g., incorrect XAxis dataKey mismatch like "date" vs "time"), without redesigning charts.

// 7. (Optional but preferred)

//    * Use `useMemo` to optimize derived calculations.

// Goal:
// Make the dashboard fully dynamic and driven by real backend data while keeping the exact same visual appearance.

  const successHistory = productions.map((p) => ({
    name: p.title.slice(0, 8),
    chance: p.success_probability || 0,
  }));


 const areaData = productions.map((p) => ({
  time: new Date(p.createdAt).toLocaleDateString("default", {
    day: "numeric",
  }),
  success: p.success_probability || 0,
  risk: 100 - (p.success_probability || 0),
}));
// const areaData = [
//   { month: "Jan", success: 46, risk: 54 },  // post-holiday drop, mixed performance
//   { month: "Feb", success: 52, risk: 48 },  // slight recovery (mid-budget wins)
//   { month: "Mar", success: 39, risk: 61 },  // poor releases / market fatigue
//   { month: "Apr", success: 57, risk: 43 },  // strong hit boosts confidence
//   { month: "May", success: 63, risk: 37 },  // blockbuster season peak
//   { month: "Jun", success: 49, risk: 51 },  // oversaturation causes dip
//   { month: "Jul", success: 68, risk: 32 },  // major hit success spike
//   { month: "Aug", success: 45, risk: 55 },  // weak late-summer releases
//   { month: "Sep", success: 41, risk: 59 },  // experimental films fail
//   { month: "Oct", success: 58, risk: 42 },  // horror season boost
//   { month: "Nov", success: 64, risk: 36 },  // awards contenders perform well
//   { month: "Dec", success: 53, risk: 47 },  // holiday competition balances out
// ];

  const stats = [
    { label: "Total Movies",          value: totalMovies,          icon: Film,          color: "text-blue-400",   glow: "#60a5fa", delay: 0.1, trend: "+12%" },
    { label: "Avg Success Rate",      value: avgSuccessProbability, suffix: "%", icon: Target,  color: "text-emerald-400", glow: "#34d399", delay: 0.2, trend: "+3%" },
    { label: "High Risk Projects",    value: highRiskMovies,        icon: AlertTriangle, color: "text-amber-400",  glow: "#fbbf24", delay: 0.3 },
    { label: "Successful Predictions",value: successfulMovies,      icon: TrendingUp,    color: "text-violet-400", glow: "#a78bfa", delay: 0.4, trend: "+8%" },
  ];

  const quickActions = [
    { label: "AI Prediction", icon: Sparkles,    path: "/ai-command", glow: "#a78bfa", desc: "Run analysis" },
    { label: "View Movies",   icon: Film,        path: "/movies",     glow: "#60a5fa", desc: "Browse library" },
    { label: "New Production",icon: Plus,        path: "/movies",     glow: "#34d399", desc: "Start project" },
    { label: "Schedule",      icon: Calendar,    path: "/schedule",   glow: "#fb923c", desc: "Manage dates" },
  ];

  const SIDEBAR_WIDTH = 260;

  return (
    <div className="min-h-screen" style={{ background: "#080a13", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line { stroke: rgba(255,255,255,0.05) !important; }
        .recharts-tooltip-wrapper .recharts-default-tooltip {
          background: rgba(13,15,26,0.95) !important;
          border: 1px solid rgba(99,102,241,0.2) !important;
          border-radius: 8px !important;
          font-family: 'DM Sans', sans-serif !important;
        }
      `}</style>

      <Sidebar open={!sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <motion.main
        animate={{ marginLeft: !sidebarOpen ? SIDEBAR_WIDTH : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen"
        style={{ background: "#080a13" }}
      >
        {/* Topbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{
            background: "rgba(8,10,19,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
          <div className="flex items-center gap-4">
            {/* <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button> */}
            <div>
             <h1
  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500 leading-tight drop-shadow-lg"
  style={{ fontFamily: "'DM Serif Display', serif" }}
>
  Command Center
</h1>
              <p className="text-xs text-white/30">Production intelligence overview</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </div>

            {/* <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all">
              <Bell className="w-4.5 h-4.5 w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-white">
                  {notifications}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-white/8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div> */}
              {/* <span className="hidden sm:block text-sm font-medium text-white/70">{user?.name ?? "User"}</span> */}
            {/* </div> */}
          </div>
        </div>

        {/* Page body */}
        <div className="p-6 space-y-6 max-w-[1400px]">

          {/* Greeting banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl p-6 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.08) 50%, rgba(8,10,19,0) 100%)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <div className="absolute inset-0 opacity-20"
              style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(99,102,241,0.4) 0%, transparent 60%)" }} />
            <div className="relative flex items-center justify-between flex-wrap gap-4">
             <div>
  <p className="text-xs text-indigo-400 uppercase tracking-widest mb-1 font-medium">
    Welcome back
  </p>

  <h2
    className="text-2xl font-bold text-white flex items-center gap-2"
    style={{ fontFamily: "'DM Serif Display', serif" }}
  >
    {user?.name ? (
      <>
        <span>Hey, {user.name}</span>
        <Hand className="w-5 h-5 text-indigo-300 animate-bounce" />
      </>
    ) : (
      "Good morning"
    )}
  </h2>

  <p className="text-sm text-white/40 mt-1">
    You have{" "}
    <span className="text-indigo-400 font-semibold">
      {highRiskMovies} high-risk
    </span>{" "}
    projects needing attention.
  </p>
</div>
              <Button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", color: "white", boxShadow: "0 0 24px rgba(99,102,241,0.4)" }}
                onClick={() => navigate("/movies")}
              >
                <Plus className="w-4 h-4" /> New Production
              </Button>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex gap-2">
                {[0,1,2].map(i => (
                  <motion.div key={i} animate={{ scale: [1,1.4,1], opacity: [0.4,1,0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i*0.2 }}
                    className="w-2 h-2 rounded-full bg-indigo-400" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
            </div>
          ) : (
            <>
              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => <StatCard key={s.label} {...s} />)}
              </div>

              {/* Main content grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Recent Movies */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="xl:col-span-2 rounded-2xl p-6"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem" }}>
                        Recent Movies
                      </h2>
                      <p className="text-xs text-white/30 mt-0.5">Latest predictions from the AI engine</p>
                    </div>
                    <button onClick={() => navigate("/movies")}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                      View all <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {movies.slice(0, 5).map((movie, i) => (
                      <motion.div
                        key={movie._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.07 }}
                        className="flex items-center gap-4 p-3.5 rounded-xl group cursor-pointer transition-all"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                        whileHover={{ background: "rgba(99,102,241,0.06)", borderColor: "rgba(99,102,241,0.15)" }}
                        onClick={() => navigate("/movies")}
                      >
                        {/* Rank */}
                        <span className="text-xs font-bold text-white/20 w-5 text-center shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {/* Icon */}
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                          <Film className="w-4 h-4 text-indigo-400" />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm text-white/85 truncate">{movie.title}</p>
                            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                              movie.prediction === "Successful"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/15 text-red-400 border border-red-500/20"
                            }`}>
                              {movie.prediction}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${movie.success_probability}%` }}
                                transition={{ delay: 0.8 + i * 0.07, duration: 0.8, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{
                                  background: movie.success_probability > 70
                                    ? "linear-gradient(90deg, #34d399, #6ee7b7)"
                                    : movie.success_probability > 40
                                    ? "linear-gradient(90deg, #fbbf24, #fde68a)"
                                    : "linear-gradient(90deg, #f87171, #fca5a5)"
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-white/50 shrink-0 tabular-nums">
                              {movie.success_probability}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-white/25">{movie.genre}</span>
                            <span className="text-white/15">·</span>
                            <span className="text-[11px] text-white/25">${(movie.budget / 1_000_000).toFixed(1)}M</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {movies.length === 0 && (
                      <div className="text-center py-10">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                          <Film className="w-7 h-7 text-indigo-400/50" />
                        </div>
                        <p className="text-white/30 text-sm">No movies in database yet</p>
                        <button onClick={() => navigate("/ai-command")}
                          className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                          Run your first AI prediction →
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Right column */}
                <div className="space-y-5">

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="rounded-2xl p-5"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <h2 className="font-bold text-white mb-4" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem" }}>
                      Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-2.5">
                      {quickActions.map((a, i) => (
                        <motion.button
                          key={a.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.65 + i * 0.05 }}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => navigate(a.path)}
                          className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl text-center transition-all group relative overflow-hidden"
                          style={{
                            background: `${a.glow}0d`,
                            border: `1px solid ${a.glow}22`,
                          }}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: `${a.glow}18` }}>
                            <a.icon className="w-4 h-4" style={{ color: a.glow }} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white/80">{a.label}</p>
                            <p className="text-[10px] text-white/30 mt-0.5">{a.desc}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* AI Insights */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-2xl p-5"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(168,85,247,0.15)" }}>
                        <Zap className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                      <h2 className="font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem" }}>
                        AI Insights
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: TrendingUp, color: "#34d399", bg: "rgba(52,211,153,0.1)", label: `Avg success rate: ${avgSuccessProbability}%`, sub: `Based on ${totalMovies} predictions` },
                        { icon: Eye,        color: "#60a5fa", bg: "rgba(96,165,250,0.1)", label: `High-risk projects: ${highRiskMovies}`,       sub: "Success probability < 40%" },
                        { icon: Star,       color: "#a78bfa", bg: "rgba(167,139,250,0.1)",label: `Successful: ${successfulMovies}`,              sub: "AI confidence in outcomes" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.08 }}
                          className="flex items-start gap-3 p-3 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: item.bg }}>
                            <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white/75">{item.label}</p>
                            <p className="text-[10px] text-white/30 mt-0.5">{item.sub}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bottom charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Success Rate History Bar Chart */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7, duration: 0.6 }}
  className="relative rounded-2xl p-6 overflow-hidden backdrop-blur-xl"
  style={{
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
  {/* Glow Layer */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 blur-2xl opacity-40" />
  </div>

  {/* Header */}
  <div className="flex items-center justify-between mb-6 relative z-10">
    <div>
      <h2
        className="font-bold text-white tracking-tight"
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.1rem",
        }}
      >
        Success Rate History
      </h2>
      <p className="text-xs text-white/40 mt-0.5">
        Project probability breakdown
      </p>
    </div>

    {/* Live Badge */}
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: "rgba(99,102,241,0.12)",
        color: "#a5b4fc",
        border: "1px solid rgba(99,102,241,0.2)",
      }}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
      </span>
      Live
    </div>
  </div>

  {/* Chart */}
  <ResponsiveContainer width="100%" height={180}>
    <BarChart
      data={
        successHistory.length
          ? successHistory
          : [{ name: "–", chance: 0 }]
      }
      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
    >
      {/* Gradient */}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
        </linearGradient>

        {/* Glow */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid */}
      <CartesianGrid
        stroke="rgba(255,255,255,0.05)"
        vertical={false}
      />

      {/* X Axis */}
      <XAxis
        dataKey="name"
        tick={{
          fontSize: 11,
          fill: "rgba(255,255,255,0.4)",
        }}
        axisLine={false}
        tickLine={false}
      />

      {/* Y Axis */}
      <YAxis
        domain={[0, 100]}
        tick={{
          fontSize: 11,
          fill: "rgba(255,255,255,0.35)",
        }}
        axisLine={false}
        tickLine={false}
      />

      {/* Tooltip */}
      <Tooltip
        formatter={(v: any) => [`${v}%`, "Success"]}
        contentStyle={{
          background: "rgba(10,12,22,0.95)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 10,
          backdropFilter: "blur(10px)",
        }}
        labelStyle={{ color: "#a5b4fc" }}
        cursor={{ fill: "rgba(255,255,255,0.04)" }}
      />

      {/* Bars */}
      <Bar
        dataKey="chance"
        radius={[8, 8, 0, 0]}
        fill="url(#barGrad)"
        animationDuration={1200}
        filter="url(#glow)"
      />
    </BarChart>
  </ResponsiveContainer>
</motion.div>

                {/* Trend Area Chart */}
              <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.75, duration: 0.6 }}
  className="relative rounded-2xl p-6 overflow-hidden backdrop-blur-xl"
  style={{
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
  {/* Glow Layer */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-red-500/10 blur-2xl opacity-40" />
  </div>

  {/* Header */}
  <div className="flex items-center justify-between mb-6 relative z-10">
    <div>
      <h2
        className="font-bold text-white tracking-tight"
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.1rem",
        }}
      >
        Monthly Trends
      </h2>
      <p className="text-xs text-white/40 mt-0.5">
        Success vs risk over time
      </p>
    </div>

    {/* Legend (Improved) */}
    <div className="flex items-center gap-4 text-xs">
      <span className="flex items-center gap-2 text-emerald-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        Success
      </span>
      <span className="flex items-center gap-2 text-red-300">
        <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
        Risk
      </span>
    </div>
  </div>

  {/* Chart */}
  <ResponsiveContainer width="100%" height={180}>
    <AreaChart
      data={areaData}
      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
        </linearGradient>

        <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid */}
      <CartesianGrid
        stroke="rgba(255,255,255,0.05)"
        vertical={false}
      />

      {/* Axes */}
      <XAxis
        dataKey="date"
        tick={{
          fontSize: 11,
          fill: "rgba(255,255,255,0.4)",
        }}
        axisLine={false}
        tickLine={false}
      />

      <YAxis
        domain={[0, 100]}
        tick={{
          fontSize: 11,
          fill: "rgba(255,255,255,0.35)",
        }}
        axisLine={false}
        tickLine={false}
      />

      {/* Tooltip */}
      <Tooltip
        formatter={(v: any, name: string) => [
          `${v}%`,
          name === "success" ? "Success" : "Risk",
        ]}
        contentStyle={{
          background: "rgba(10,12,22,0.95)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 10,
          backdropFilter: "blur(10px)",
        }}
        labelStyle={{ color: "#c7d2fe" }}
        cursor={{ stroke: "rgba(255,255,255,0.08)" }}
      />

      {/* Success Area */}
      <Area
        type="monotone"
        dataKey="success"
        stroke="#34d399"
        strokeWidth={2.5}
        fill="url(#successGrad)"
        dot={false}
        isAnimationActive
        animationDuration={1200}
        filter="url(#lineGlow)"
      />

      {/* Risk Area */}
      <Area
        type="monotone"
        dataKey="risk"
        stroke="#f87171"
        strokeWidth={2.5}
        fill="url(#riskGrad)"
        dot={false}
        isAnimationActive
        animationDuration={1400}
        filter="url(#lineGlow)"
      />
    </AreaChart>
  </ResponsiveContainer>
</motion.div>
              </div>

            </>
          )}
        </div>
      </motion.main>
    </div>
  );
}