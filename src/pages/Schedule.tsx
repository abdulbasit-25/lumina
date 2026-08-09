import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  Clock,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  Activity,
  Clapperboard,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import { scheduleEvents as mockSchedule } from "@/lib/mockData";
import { movieAPI } from "@/services/movieAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ─────────────────────────────────────────────────────────────────
   SCOPED STYLES  — extends your Tailwind design-token system
───────────────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');

.sched-root {
  font-family: 'Space Grotesk', sans-serif;
}

/* Ambient background */
.sched-bg-blob-1 {
  position: absolute;
  top: -180px; left: 50%;
  transform: translateX(-50%);
  width: 700px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(139,92,246,.14) 0%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  animation: sb-float1 18s ease-in-out infinite;
}
.sched-bg-blob-2 {
  position: absolute;
  bottom: -200px; right: -100px;
  width: 600px; height: 500px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(59,130,246,.1) 0%, transparent 70%);
  filter: blur(90px);
  pointer-events: none;
  animation: sb-float2 22s ease-in-out infinite;
}
@keyframes sb-float1 {
  0%,100% { transform: translateX(-50%) scale(1); }
  50%      { transform: translateX(-45%) scale(1.07) translateY(-20px); }
}
@keyframes sb-float2 {
  0%,100% { transform: scale(1); }
  50%      { transform: scale(1.08) translate(-20px, 15px); }
}

/* Grid overlay */
.sched-grid-overlay {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 100% 100% at 50% 0%, black 30%, transparent 80%);
  pointer-events: none;
}

/* Scanline sweep */
.sched-scanline {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent, rgba(99,102,241,.25) 30%,
    rgba(139,92,246,.25) 70%, transparent);
  animation: sched-scan 12s linear infinite;
  pointer-events: none;
}
@keyframes sched-scan {
  0%   { transform: translateY(-2px); opacity: 0; }
  5%   { opacity: 1; }
  95%  { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

/* ── HEADER PANEL ── */
.sched-header {
  border-radius: 20px;
  border: 1px solid rgba(99,102,241,.18);
  background: rgba(13,20,36,.75);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  padding: 2rem 2.25rem;
  position: relative;
  overflow: hidden;
}
.sched-header::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent, rgba(139,92,246,.5) 30%,
    rgba(59,130,246,.5) 70%, transparent);
}

.sched-title {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -.03em;
  line-height: 1.1;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 55%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sched-sub {
  font-size: .83rem;
  color: rgba(148,163,184,.7);
  margin-top: .35rem;
  font-weight: 300;
  letter-spacing: .01em;
}

/* Refresh button */
.btn-refresh {
  font-family: 'Space Grotesk', sans-serif;
  font-size: .8rem;
  font-weight: 600;
  letter-spacing: .05em;
  padding: .6rem 1.4rem;
  border-radius: 10px;
  border: 1px solid rgba(99,102,241,.35);
  background: linear-gradient(135deg, rgba(59,130,246,.15), rgba(139,92,246,.15));
  color: #a78bfa;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  transition: all .25s;
  white-space: nowrap;
}
.btn-refresh:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(59,130,246,.25), rgba(139,92,246,.25));
  border-color: rgba(139,92,246,.6);
  color: #fff;
  box-shadow: 0 0 22px rgba(139,92,246,.3);
}
.btn-refresh:disabled { opacity: .5; cursor: not-allowed; }

/* Stat chips */
.stat-chip {
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.07);
  background: rgba(6,13,31,.6);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: border-color .25s, background .25s, transform .2s;
  cursor: default;
}
.stat-chip:hover {
  border-color: rgba(99,102,241,.35);
  background: rgba(13,20,36,.8);
  transform: translateY(-2px);
}
.stat-chip-lbl {
  font-size: .62rem;
  text-transform: uppercase;
  letter-spacing: .18em;
  color: rgba(148,163,184,.6);
  margin-bottom: .3rem;
}
.stat-chip-val {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  color: #f1f5f9;
}

/* ── CONTROLS ── */
.controls-bar {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.07);
  background: rgba(13,20,36,.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 1rem 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  align-items: center;
}

.search-wrap {
  flex: 1;
  min-width: 200px;
  position: relative;
}
.search-wrap svg {
  position: absolute;
  left: .75rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(148,163,184,.5);
  pointer-events: none;
}
.search-input {
  font-family: 'Space Grotesk', sans-serif;
  font-size: .83rem;
  width: 100%;
  background: rgba(6,13,31,.7);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 9px;
  color: #f1f5f9;
  padding: .55rem .75rem .55rem 2.25rem;
  outline: none;
  transition: border-color .25s, box-shadow .25s;
}
.search-input::placeholder { color: rgba(148,163,184,.4); }
.search-input:focus {
  border-color: rgba(99,102,241,.5);
  box-shadow: 0 0 0 3px rgba(99,102,241,.1);
}

.sort-select-wrap {
  min-width: 130px;
}
.sort-select {
  font-family: 'Space Grotesk', sans-serif;
  font-size: .8rem;
  width: 100%;
  background: rgba(6,13,31,.7);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 9px;
  color: #f1f5f9;
  padding: .55rem .75rem;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color .25s;
}
.sort-select:focus { border-color: rgba(99,102,241,.5); }

.btn-sort {
  font-family: 'Space Grotesk', sans-serif;
  padding: .55rem .9rem;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(6,13,31,.7);
  color: rgba(148,163,184,.8);
  cursor: pointer;
  display: flex; align-items: center;
  transition: all .25s;
}
.btn-sort:hover {
  border-color: rgba(99,102,241,.4);
  color: #a78bfa;
  background: rgba(99,102,241,.08);
}

.view-toggle {
  display: flex;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 9px;
  overflow: hidden;
}
.view-btn {
  padding: .55rem .8rem;
  background: transparent;
  border: none;
  color: rgba(148,163,184,.5);
  cursor: pointer;
  transition: all .2s;
  display: flex; align-items: center;
}
.view-btn.active {
  background: rgba(99,102,241,.2);
  color: #a78bfa;
}
.view-btn:hover:not(.active) { color: rgba(148,163,184,.9); }

/* ── EVENT CARD (grid view) ── */
.event-card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.07);
  background: rgba(13,20,36,.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  cursor: default;
  transition: border-color .3s, background .3s, box-shadow .3s;
}
.event-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent, rgba(99,102,241,.3) 30%,
    rgba(139,92,246,.3) 70%, transparent);
  transform: scaleX(0);
  transition: transform .4s;
}
.event-card:hover {
  border-color: rgba(99,102,241,.3);
  background: rgba(13,20,36,.9);
  box-shadow: 0 12px 40px rgba(0,0,0,.35), 0 0 0 1px rgba(99,102,241,.12);
}
.event-card:hover::before { transform: scaleX(1); }

/* Corner accent */
.event-card::after {
  content: '';
  position: absolute;
  bottom: 0; right: 0;
  width: 60px; height: 60px;
  background: radial-gradient(ellipse at 100% 100%, rgba(99,102,241,.12), transparent 70%);
}

.event-card-title {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -.01em;
  color: #f1f5f9;
  transition: color .25s;
  line-height: 1.3;
  margin-bottom: .3rem;
}
.event-card:hover .event-card-title { color: #a78bfa; }

.event-badge {
  font-size: .6rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  padding: .2rem .55rem;
  border-radius: 999px;
}
.badge-active {
  background: rgba(52,211,153,.15);
  border: 1px solid rgba(52,211,153,.3);
  color: #6ee7b7;
}
.badge-inactive {
  background: rgba(71,85,105,.2);
  border: 1px solid rgba(71,85,105,.35);
  color: rgba(148,163,184,.7);
}

.event-meta {
  display: flex; align-items: center; gap: .5rem;
  font-size: .78rem;
  color: rgba(148,163,184,.65);
  margin-top: .65rem;
}
.event-meta svg { flex-shrink: 0; }

.event-divider {
  height: 1px;
  background: linear-gradient(90deg,
    transparent, rgba(255,255,255,.06), transparent);
  margin: 1rem 0 .85rem;
}

/* ── LIST ROW (list view) ── */
.list-row {
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.06);
  background: rgba(13,20,36,.55);
  padding: .85rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: border-color .25s, background .25s;
  cursor: default;
}
.list-row:hover {
  border-color: rgba(99,102,241,.3);
  background: rgba(13,20,36,.85);
}
.list-row-icon {
  width: 36px; height: 36px;
  border-radius: 9px;
  border: 1px solid rgba(99,102,241,.2);
  background: rgba(99,102,241,.08);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: #a78bfa;
}
.list-row-title {
  font-size: .9rem; font-weight: 600;
  color: #f1f5f9;
  letter-spacing: -.01em;
  flex: 1;
  min-width: 0;
}
.list-row-loc {
  font-size: .75rem;
  color: rgba(148,163,184,.55);
  display: flex; align-items: center; gap: .3rem;
  min-width: 0;
}
.list-row-time {
  font-family: 'DM Mono', monospace;
  font-size: .72rem;
  color: rgba(148,163,184,.6);
  white-space: nowrap;
  display: flex; align-items: center; gap: .3rem;
}

/* Skeleton shimmer */
@keyframes sk-shimmer {
  0%   { background-position: -700px 0; }
  100% { background-position:  700px 0; }
}
.skeleton {
  border-radius: 16px;
  background: linear-gradient(90deg,
    rgba(13,20,36,.8) 25%,
    rgba(30,40,70,.5) 50%,
    rgba(13,20,36,.8) 75%);
  background-size: 700px 100%;
  animation: sk-shimmer 1.6s infinite;
}

/* Empty state */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: rgba(148,163,184,.4);
  text-align: center;
}
.empty-icon {
  width: 56px; height: 56px;
  border-radius: 14px;
  border: 1px solid rgba(99,102,241,.18);
  background: rgba(99,102,241,.07);
  display: flex; align-items: center; justify-content: center;
  color: rgba(99,102,241,.5);
}

/* Responsive */
@media (max-width: 640px) {
  .sched-header { padding: 1.5rem 1.25rem; }
  .list-row-loc, .list-row-time { display: none; }
}
`;

/* ─── MOCK DATA FALLBACK ─── */
const MOCK: any[] = [
  { id: 1, title: "Exterior Dawn Shoot",       location: "Griffith Park, LA",      start: "06:00",  end: "12:00", status: "active"   },
  { id: 2, title: "Soundstage — Scene 14",     location: "Stage 7, Paramount",     start: "09:00",  end: "18:00", status: "active"   },
  { id: 3, title: "Costume Fitting",            location: "Wardrobe Suite A",       start: "10:00",  end: "11:30", status: "upcoming" },
  { id: 4, title: "ADR Session",               location: "Ocean Way Studio B",     start: "13:00",  end: "17:00", status: "upcoming" },
  { id: 5, title: "Aerial Drone Unit",          location: "Santa Monica Beach",     start: "07:30",  end: "10:00", status: "active"   },
  { id: 6, title: "Director's Review",          location: "Edit Bay 3, Burbank",    start: "15:00",  end: "17:30", status: "upcoming" },
  { id: 7, title: "Night Exterior — Act III",  location: "Downtown LA, 6th St",    start: "20:00",  end: "04:00", status: "upcoming" },
  { id: 8, title: "VFX Plate Photography",     location: "Sony Backlot",           start: "08:00",  end: "16:00", status: "active"   },
  { id: 9, title: "Producer Dailies",          location: "Screening Room 1",       start: "11:00",  end: "12:00", status: "upcoming" },
];

/* ── SORT OPTIONS ── */
const SORT_OPTIONS = [
  { value: "start",    label: "Start Time" },
  { value: "title",    label: "Title" },
  { value: "location", label: "Location" },
  { value: "status",   label: "Status" },
];

/* ─────────────────────────────────────────────────────────────────
   SCHEDULE PAGE COMPONENT
───────────────────────────────────────────────────────────────── */
export default function Schedule() {
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([]);
  const [loading, setLoading]               = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [sortBy, setSortBy]                 = useState("start");
  const [sortOrder, setSortOrder]           = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode]             = useState<"grid" | "list">("grid");

  const load = async () => {
    setLoading(true);
    try {
      const events = await movieAPI.getScheduleEvents();
      setScheduleEvents(events.length ? events : MOCK);
    } catch {
      setScheduleEvents(MOCK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return [...scheduleEvents]
      .filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.status.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        let av: any = a[sortBy], bv: any = b[sortBy];
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortOrder === "asc" ? -1 : 1;
        if (av > bv) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [scheduleEvents, searchQuery, sortBy, sortOrder]);

  const totalCount    = scheduleEvents.length;
  const activeCount   = scheduleEvents.filter(e => e.status === "active").length;
  const upcomingCount = scheduleEvents.filter(e => e.status !== "active").length;

  return (
    <>
      <style>{STYLES}</style>

      <div className="sched-root relative min-h-screen px-4 py-8 text-white overflow-hidden">

        {/* Background atmosphere */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="sched-bg-blob-1" />
          <div className="sched-bg-blob-2" />
          <div className="sched-grid-overlay" />
          <div className="sched-scanline" />
        </div>

        <div className="mx-auto max-w-6xl space-y-5">

          {/* ── HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6, ease: [.4,0,.2,1] }}
            className="sched-header"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: ".45rem",
                  fontSize: ".65rem", fontWeight: 600, letterSpacing: ".18em",
                  textTransform: "uppercase", color: "#a78bfa", marginBottom: ".6rem"
                }}>
                  <Clapperboard size={11} />
                  Lumina Studio
                </div>
                <h1 className="sched-title">Production Schedule</h1>
                <p className="sched-sub">Manage timelines, locations, and production flow in real time.</p>
              </div>

              <button
                className="btn-refresh"
                onClick={load}
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {/* Stat chips */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: ".85rem",
              marginTop: "1.5rem"
            }}>
              {[
                { label: "Total Events", value: totalCount,    icon: Calendar, color: "#60a5fa" },
                { label: "Active",        value: activeCount,   icon: Activity, color: "#34d399" },
                { label: "Upcoming",      value: upcomingCount, icon: Clock,    color: "#a78bfa" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .15 + i * .07 }}
                  className="stat-chip"
                >
                  <div>
                    <div className="stat-chip-lbl">{s.label}</div>
                    <div className="stat-chip-val" style={{ color: s.color }}>{s.value}</div>
                  </div>
                  <s.icon size={18} style={{ color: s.color, opacity: .6 }} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── CONTROLS ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .2 }}
            className="controls-bar"
          >
            {/* Search */}
            <div className="search-wrap">
              <Search size={15} />
              <input
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, locations, status…"
              />
            </div>

            {/* Sort by */}
            <div className="sort-select-wrap">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Sort order */}
            <button
              className="btn-sort"
              onClick={() => setSortOrder(p => p === "asc" ? "desc" : "asc")}
              title="Toggle sort order"
            >
              {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
            </button>

            {/* View toggle */}
            <div className="view-toggle" style={{ marginLeft: "auto" }}>
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <List size={15} />
              </button>
            </div>
          </motion.div>

          {/* ── GRID VIEW ── */}
          {viewMode === "grid" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 168 }} />
                ))
              ) : filtered.length ? (
                <AnimatePresence mode="popLayout">
                  {filtered.map((event, i) => (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: .96 }}
                      transition={{ delay: i * .04, duration: .35 }}
                      whileHover={{ y: -5 }}
                      className="event-card"
                    >
                      {/* Top row */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: ".5rem" }}>
                        <div className="event-card-title">{event.title}</div>
                        <span className={`event-badge ${event.status === "active" ? "badge-active" : "badge-inactive"}`}>
                          {event.status}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="event-meta" style={{ marginTop: ".75rem" }}>
                        <MapPin size={13} style={{ color: "#a78bfa" }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {event.location}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="event-meta">
                        <Clock size={13} style={{ color: "#60a5fa" }} />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: ".75rem" }}>
                          {event.start} → {event.end}
                        </span>
                      </div>

                      <div className="event-divider" />

                      {/* Footer */}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between"
                      }}>
                        <span style={{
                          fontSize: ".65rem", color: "rgba(148,163,184,.4)",
                          letterSpacing: ".08em", textTransform: "uppercase"
                        }}>
                          {event.status === "active" ? "● In Progress" : "○ Scheduled"}
                        </span>
                        <ChevronRight size={13} style={{ color: "rgba(148,163,184,.3)" }} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><Calendar size={22} /></div>
                  <div style={{ fontSize: ".9rem", fontWeight: 500 }}>No schedule entries found</div>
                  <div style={{ fontSize: ".78rem" }}>Try adjusting your search or filters</div>
                </div>
              )}
            </div>
          )}

          {/* ── LIST VIEW ── */}
          {viewMode === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 56 }} />
                ))
              ) : filtered.length ? (
                <AnimatePresence mode="popLayout">
                  {filtered.map((event, i) => (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ delay: i * .03 }}
                      className="list-row"
                    >
                      <div className="list-row-icon">
                        <Clapperboard size={15} />
                      </div>

                      <div className="list-row-title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {event.title}
                      </div>

                      <div className="list-row-loc" style={{ flex: "0 0 180px", overflow: "hidden" }}>
                        <MapPin size={11} style={{ color: "#a78bfa", flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {event.location}
                        </span>
                      </div>

                      <div className="list-row-time">
                        <Clock size={11} style={{ color: "#60a5fa" }} />
                        {event.start} → {event.end}
                      </div>

                      <span className={`event-badge ${event.status === "active" ? "badge-active" : "badge-inactive"}`}>
                        {event.status}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><Calendar size={22} /></div>
                  <div style={{ fontSize: ".9rem", fontWeight: 500 }}>No schedule entries found</div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}