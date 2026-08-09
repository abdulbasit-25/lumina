import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Briefcase, UserPlus, ShieldAlert, ShieldCheck,
  Search, SortAsc, SortDesc, Users
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { movieAPI } from "@/services/movieAPI";
import { useToast } from "@/hooks/use-toast";
import AddTalentModal from "@/components/AddTalentModal";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────
   SCOPED STYLES
───────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

.crew-root {
  font-family: 'Space Grotesk', sans-serif;
  position: relative;
  min-height: 100vh;
}

/* ══════════════════════════════════
   WEB / NETWORK GRID BACKGROUND
══════════════════════════════════ */
.crew-canvas-wrap {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* Static dot-grid */
.crew-dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle, rgba(99,102,241,.18) 1px, transparent 1px
  );
  background-size: 40px 40px;
  mask-image: radial-gradient(
    ellipse 100% 100% at 50% 0%,
    black 0%, transparent 85%
  );
}

/* Line grid (blueprint / web feel) */
.crew-line-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.05) 1px, transparent 1px);
  background-size: 80px 80px;
}

/* Finer sub-grid lines */
.crew-subgrid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.025) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Diagonal accent lines */
.crew-diag {
  position: absolute;
  inset: -200px;
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 120px,
    rgba(99,102,241,.025) 120px,
    rgba(99,102,241,.025) 121px
  );
}

/* Ambient blobs */
.crew-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
}
.crew-blob-1 {
  width: 700px; height: 600px;
  top: -160px; left: -120px;
  background: radial-gradient(ellipse, rgba(139,92,246,.12) 0%, transparent 70%);
  animation: blob-drift1 20s ease-in-out infinite;
}
.crew-blob-2 {
  width: 650px; height: 550px;
  top: 10%; right: -150px;
  background: radial-gradient(ellipse, rgba(59,130,246,.09) 0%, transparent 70%);
  animation: blob-drift2 25s ease-in-out infinite;
}
.crew-blob-3 {
  width: 500px; height: 400px;
  bottom: 5%; left: 20%;
  background: radial-gradient(ellipse, rgba(99,102,241,.07) 0%, transparent 70%);
  animation: blob-drift3 18s ease-in-out infinite;
}
@keyframes blob-drift1 {
  0%,100% { transform: translate(0,0) scale(1); }
  40%      { transform: translate(50px,-30px) scale(1.06); }
  70%      { transform: translate(-20px,25px) scale(.97); }
}
@keyframes blob-drift2 {
  0%,100% { transform: translate(0,0) scale(1); }
  35%      { transform: translate(-40px,20px) scale(1.05); }
  65%      { transform: translate(30px,-15px) scale(.96); }
}
@keyframes blob-drift3 {
  0%,100% { transform: translate(0,0) scale(1); }
  50%      { transform: translate(20px,-40px) scale(1.04); }
}

/* Scanline sweep */
.crew-scanline {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(99,102,241,.3) 30%,
    rgba(139,92,246,.3) 70%,
    transparent 100%);
  animation: crew-scan 14s linear infinite;
}
@keyframes crew-scan {
  0%   { transform: translateY(-2px); opacity: 0; }
  4%   { opacity: 1; }
  96%  { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

/* Horizontal accent lines */
.crew-hline {
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%, rgba(99,102,241,.12) 20%,
    rgba(139,92,246,.12) 50%, rgba(99,102,241,.12) 80%,
    transparent 100%);
  animation: hline-pulse 4s ease-in-out infinite;
}
.crew-hline-1 { top: 25%; animation-delay: 0s; }
.crew-hline-2 { top: 55%; animation-delay: 1.3s; }
.crew-hline-3 { top: 80%; animation-delay: 2.6s; }
@keyframes hline-pulse {
  0%,100% { opacity: .4; }
  50%      { opacity: 1; }
}

/* Corner crosshairs */
.crew-crosshair {
  position: absolute;
  width: 24px; height: 24px;
  opacity: .25;
}
.crew-crosshair::before,
.crew-crosshair::after {
  content: '';
  position: absolute;
  background: rgba(99,102,241,.7);
}
.crew-crosshair::before {
  width: 1px; height: 100%;
  left: 50%; top: 0;
}
.crew-crosshair::after {
  height: 1px; width: 100%;
  top: 50%; left: 0;
}
.ch-tl { top: 2rem; left: 2rem; }
.ch-tr { top: 2rem; right: 2rem; }
.ch-bl { bottom: 2rem; left: 2rem; }
.ch-br { bottom: 2rem; right: 2rem; }

/* Floating node dots */
@keyframes node-float {
  0%,100% { transform: translateY(0) scale(1); opacity: var(--op-max); }
  50%      { transform: translateY(var(--drift)) scale(1.2); opacity: var(--op-min); }
}
.crew-node {
  position: absolute;
  border-radius: 50%;
  animation: node-float var(--dur) ease-in-out infinite;
  animation-delay: var(--delay);
}

/* SVG network canvas */
.crew-network-svg {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
}

/* ══════════════════════════════════
   CONTENT LAYER
══════════════════════════════════ */
.crew-content {
  position: relative;
  z-index: 1;
  padding: 2rem 1.5rem 4rem;
  max-width: 1280px;
  margin: 0 auto;
}

/* ── HEADER ── */
.crew-header-panel {
  border-radius: 20px;
  border: 1px solid rgba(99,102,241,.2);
  background: rgba(6,13,31,.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  padding: 2rem 2.25rem;
  position: relative;
  overflow: hidden;
  margin-bottom: 1.25rem;
}
.crew-header-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%, rgba(99,102,241,.6) 30%,
    rgba(139,92,246,.6) 70%, transparent 100%);
}
.crew-header-panel::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%, rgba(99,102,241,.15) 50%, transparent 100%);
}

.crew-title {
  font-size: clamp(1.9rem, 5vw, 3rem);
  font-weight: 700;
  letter-spacing: -.03em;
  line-height: 1;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 55%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.crew-desc {
  font-size: .83rem;
  color: rgba(148,163,184,.65);
  margin-top: .4rem;
  font-weight: 300;
}

.crew-eyebrow {
  display: inline-flex;
  align-items: center; gap: .4rem;
  font-size: .62rem; font-weight: 600;
  letter-spacing: .2em; text-transform: uppercase;
  color: #a78bfa;
  margin-bottom: .65rem;
}

/* Add crew button */
.btn-add-crew {
  font-family: 'Space Grotesk', sans-serif;
  font-size: .82rem; font-weight: 600;
  letter-spacing: .04em;
  padding: .7rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center; gap: .5rem;
  transition: transform .2s, box-shadow .3s;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}
.btn-add-crew::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent);
  transform: translateX(-100%);
  transition: transform .5s;
}
.btn-add-crew:hover::before { transform: translateX(100%); }
.btn-add-crew:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(99,102,241,.45), 0 0 0 1px rgba(139,92,246,.3);
}

/* ── CONTROLS ── */
.crew-controls {
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.06);
  background: rgba(6,13,31,.6);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  padding: .9rem 1.1rem;
  display: flex;
  flex-wrap: wrap;
  gap: .7rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.crew-search-wrap {
  flex: 1; min-width: 200px;
  position: relative;
}
.crew-search-wrap svg {
  position: absolute; left: .75rem; top: 50%;
  transform: translateY(-50%);
  color: rgba(148,163,184,.45);
  pointer-events: none;
}
.crew-search {
  font-family: 'Space Grotesk', sans-serif;
  font-size: .82rem;
  width: 100%;
  background: rgba(3,7,18,.6);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 9px;
  color: #f1f5f9;
  padding: .52rem .75rem .52rem 2.2rem;
  outline: none;
  transition: border-color .25s, box-shadow .25s;
}
.crew-search::placeholder { color: rgba(148,163,184,.35); }
.crew-search:focus {
  border-color: rgba(99,102,241,.5);
  box-shadow: 0 0 0 3px rgba(99,102,241,.1);
}

.crew-select {
  font-family: 'Space Grotesk', sans-serif;
  font-size: .8rem;
  min-width: 120px;
  background: rgba(3,7,18,.6);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 9px;
  color: #f1f5f9;
  padding: .52rem .75rem;
  outline: none;
  cursor: pointer;
  appearance: none;
  transition: border-color .25s;
}
.crew-select:focus { border-color: rgba(99,102,241,.5); }

.btn-sort-order {
  font-family: 'Space Grotesk', sans-serif;
  padding: .52rem .85rem;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,.07);
  background: rgba(3,7,18,.6);
  color: rgba(148,163,184,.7);
  cursor: pointer;
  display: flex; align-items: center;
  transition: all .25s;
}
.btn-sort-order:hover {
  border-color: rgba(99,102,241,.4);
  color: #a78bfa;
  background: rgba(99,102,241,.08);
}

.crew-count-badge {
  margin-left: auto;
  font-family: 'DM Mono', monospace;
  font-size: .68rem;
  color: rgba(148,163,184,.45);
  white-space: nowrap;
}

/* ── CREW CARD ── */
.crew-card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.07);
  background: rgba(10,16,30,.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 1.4rem;
  position: relative;
  overflow: hidden;
  transition: border-color .3s, background .3s, box-shadow .3s, transform .2s;
  cursor: default;
}
.crew-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent, rgba(99,102,241,.35) 30%,
    rgba(139,92,246,.35) 70%, transparent);
  transform: scaleX(0);
  transition: transform .4s cubic-bezier(.4,0,.2,1);
}
/* BG micro-grid on each card */
.crew-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.03) 1px, transparent 1px);
  background-size: 22px 22px;
  pointer-events: none;
  opacity: 0;
  transition: opacity .35s;
}
.crew-card:hover {
  border-color: rgba(99,102,241,.32);
  background: rgba(13,20,36,.88);
  box-shadow:
    0 16px 48px rgba(0,0,0,.4),
    0 0 0 1px rgba(99,102,241,.1),
    inset 0 0 30px rgba(99,102,241,.03);
}
.crew-card:hover::before { transform: scaleX(1); }
.crew-card:hover::after  { opacity: 1; }

.crew-card.blocked {
  border-color: rgba(239,68,68,.25);
  opacity: .55;
}
.crew-card.blocked::before {
  background: linear-gradient(90deg, transparent, rgba(239,68,68,.3), transparent);
}

/* Avatar */
.crew-avatar {
  width: 52px; height: 52px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.05rem; font-weight: 700;
  letter-spacing: -.02em;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: box-shadow .3s;
}
.crew-avatar-active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
}
.crew-avatar-active::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,.12), transparent);
}
.crew-avatar-blocked {
  background: rgba(30,41,59,.8);
  color: rgba(100,116,139,.6);
  border: 1px solid rgba(100,116,139,.2);
}
.crew-card:hover .crew-avatar-active {
  box-shadow: 0 0 22px rgba(99,102,241,.5), 0 0 8px rgba(139,92,246,.3);
}

/* Name / role */
.crew-name {
  font-size: .97rem; font-weight: 600;
  letter-spacing: -.01em;
  color: #f1f5f9;
  transition: color .25s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.crew-card:hover .crew-name { color: #a78bfa; }
.crew-role {
  font-size: .75rem;
  color: #6366f1;
  font-weight: 500;
  margin-top: .15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Rating & XP row */
.crew-meta-row {
  display: flex; align-items: center; gap: .9rem;
  margin-top: .75rem;
}
.crew-meta-item {
  display: flex; align-items: center; gap: .3rem;
  font-size: .75rem;
  color: rgba(148,163,184,.6);
  font-family: 'DM Mono', monospace;
}
.crew-rating { color: #fbbf24; }

/* Divider */
.crew-card-divider {
  height: 1px;
  background: linear-gradient(90deg,
    transparent, rgba(255,255,255,.07), transparent);
  margin: .85rem 0 .75rem;
}

/* Footer row */
.crew-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.crew-projects-info {
  display: flex; flex-direction: column; gap: .15rem;
}
.crew-projects-val {
  font-family: 'DM Mono', monospace;
  font-size: .72rem;
  color: rgba(148,163,184,.5);
}

/* Toggle status button */
.btn-toggle-status {
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,.07);
  background: rgba(3,7,18,.5);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .25s;
  color: rgba(148,163,184,.5);
}
.btn-toggle-status.active:hover {
  background: rgba(239,68,68,.1);
  border-color: rgba(239,68,68,.3);
  color: #ef4444;
}
.btn-toggle-status.blocked {
  color: #ef4444;
  border-color: rgba(239,68,68,.25);
}
.btn-toggle-status.blocked:hover {
  background: rgba(34,197,94,.1);
  border-color: rgba(34,197,94,.3);
  color: #22c55e;
}

/* Status badge */
.status-pip {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pip-active  { background: #34d399; box-shadow: 0 0 6px rgba(52,211,153,.6); }
.pip-blocked { background: #ef4444; box-shadow: 0 0 6px rgba(239,68,68,.5); }

/* Skeleton */
@keyframes sk-shimmer {
  0%   { background-position: -700px 0; }
  100% { background-position:  700px 0; }
}
.skeleton-card {
  border-radius: 16px;
  height: 168px;
  background: linear-gradient(90deg,
    rgba(10,16,30,.8) 25%,
    rgba(30,40,70,.4) 50%,
    rgba(10,16,30,.8) 75%);
  background-size: 700px 100%;
  animation: sk-shimmer 1.6s infinite;
}

/* Empty */
.crew-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center; gap: 1rem;
  padding: 5rem 2rem;
  text-align: center;
  color: rgba(148,163,184,.35);
}
.empty-icon-wrap {
  width: 60px; height: 60px;
  border-radius: 16px;
  border: 1px solid rgba(99,102,241,.18);
  background: rgba(99,102,241,.07);
  display: flex; align-items: center; justify-content: center;
  color: rgba(99,102,241,.5);
}

@media (max-width: 640px) {
  .crew-content { padding: 1rem 1rem 3rem; }
  .crew-header-panel { padding: 1.5rem 1.25rem; }
}
`;

/* ─── SVG NETWORK NODES (deterministic so no hydration issues) ─── */
const NODES = [
  { cx: 120,  cy: 80,  r: 2.5, op: .7, delay: "0s",   dur: "8s",  drift: "-14px" },
  { cx: 340,  cy: 55,  r: 1.8, op: .5, delay: "1.2s", dur: "11s", drift: "-18px" },
  { cx: 600,  cy: 130, r: 3,   op: .6, delay: ".5s",  dur: "9s",  drift: "-10px" },
  { cx: 900,  cy: 70,  r: 2,   op: .4, delay: "2s",   dur: "13s", drift: "-20px" },
  { cx: 1100, cy: 160, r: 2.5, op: .5, delay: ".9s",  dur: "10s", drift: "-12px" },
  { cx: 200,  cy: 280, r: 1.8, op: .4, delay: "1.8s", dur: "12s", drift: "-16px" },
  { cx: 480,  cy: 320, r: 3,   op: .6, delay: ".3s",  dur: "7s",  drift: "-8px"  },
  { cx: 750,  cy: 250, r: 2,   op: .5, delay: "2.5s", dur: "15s", drift: "-22px" },
  { cx: 1050, cy: 340, r: 2.5, op: .5, delay: "1s",   dur: "9s",  drift: "-14px" },
  { cx: 60,   cy: 420, r: 1.8, op: .3, delay: "3s",   dur: "14s", drift: "-18px" },
  { cx: 320,  cy: 500, r: 2.8, op: .5, delay: ".7s",  dur: "10s", drift: "-10px" },
  { cx: 640,  cy: 460, r: 2,   op: .4, delay: "1.5s", dur: "11s", drift: "-16px" },
  { cx: 880,  cy: 520, r: 3,   op: .6, delay: ".2s",  dur: "8s",  drift: "-12px" },
  { cx: 1150, cy: 480, r: 2,   op: .4, delay: "2.2s", dur: "13s", drift: "-20px" },
  { cx: 160,  cy: 620, r: 2.5, op: .5, delay: "1.4s", dur: "9s",  drift: "-14px" },
  { cx: 430,  cy: 680, r: 1.8, op: .35,delay: ".6s",  dur: "12s", drift: "-18px" },
  { cx: 720,  cy: 650, r: 2.8, op: .5, delay: "2.8s", dur: "16s", drift: "-10px" },
  { cx: 980,  cy: 700, r: 2,   op: .4, delay: "1.1s", dur: "10s", drift: "-16px" },
];

/* Build edges (connect nearby nodes) */
const EDGES = (() => {
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      const dx = NODES[i].cx - NODES[j].cx;
      const dy = NODES[i].cy - NODES[j].cy;
      if (Math.sqrt(dx * dx + dy * dy) < 280) {
        edges.push({ x1: NODES[i].cx, y1: NODES[i].cy, x2: NODES[j].cx, y2: NODES[j].cy });
      }
    }
  }
  return edges;
})();

/* ─── SORT OPTIONS ─── */
const SORT_OPTS = [
  { value: "name",     label: "Name" },
  { value: "role",     label: "Role" },
  { value: "rating",   label: "Rating" },
  { value: "projects", label: "Projects" },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Crew() {
  const [crew, setCrew]             = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy]         = useState("name");
  const [sortOrder, setSortOrder]   = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  /* Filter + sort */
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return [...crew]
      .filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.role?.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        let av: any, bv: any;
        switch (sortBy) {
          case "name":     av = a.name.toLowerCase();   bv = b.name.toLowerCase();   break;
          case "role":     av = a.role?.toLowerCase() || ""; bv = b.role?.toLowerCase() || ""; break;
          case "rating":   av = a.rating   || 0;        bv = b.rating   || 0;        break;
          case "projects": av = a.projects || 0;        bv = b.projects || 0;        break;
          default:         return 0;
        }
        if (av < bv) return sortOrder === "asc" ? -1 : 1;
        if (av > bv) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [crew, searchQuery, sortBy, sortOrder]);

  const fetchCrew = async () => {
    try {
      const data = await movieAPI.getTalent("crew");
      setCrew(data);
    } catch {
      toast({ title: "Error", description: "Failed to fetch crew", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCrew(); }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const next = currentStatus === "active" ? "blocked" : "active";
    try {
      await movieAPI.updateTalentStatus("crew", id, next);
      setCrew(c => c.map(m => m._id === id ? { ...m, status: next } : m));
      toast({ title: next === "blocked" ? "Crew Member Blocked" : "Crew Member Unblocked" });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  /* Initials helper */
  const initials = (name: string) =>
    name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <style>{STYLES}</style>

      <div className="crew-root">

        {/* ══════════════════════════════════
            BACKGROUND LAYER
        ══════════════════════════════════ */}
        <div className="crew-canvas-wrap">
          {/* Layered grids */}
          <div className="crew-subgrid" />
          <div className="crew-line-grid" />
          <div className="crew-dot-grid" />
          <div className="crew-diag" />

          {/* Horizontal accent lines */}
          <div className="crew-hline crew-hline-1" />
          <div className="crew-hline crew-hline-2" />
          <div className="crew-hline crew-hline-3" />

          {/* Ambient blobs */}
          <div className="crew-blob crew-blob-1" />
          <div className="crew-blob crew-blob-2" />
          <div className="crew-blob crew-blob-3" />

          {/* SVG network graph */}
          <svg
            className="crew-network-svg"
            viewBox="0 0 1280 800"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="node-grad-blue" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#60a5fa" stopOpacity="1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="node-grad-purple" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#a78bfa" stopOpacity="1" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </radialGradient>
              {/* Glow filter */}
              <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {EDGES.map((e, i) => (
              <line
                key={i}
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke="rgba(99,102,241,0.12)"
                strokeWidth=".6"
              />
            ))}

            {/* Nodes */}
            {NODES.map((n, i) => (
              <g key={i} filter="url(#node-glow)">
                {/* Halo */}
                <circle
                  cx={n.cx} cy={n.cy}
                  r={n.r * 3.5}
                  fill={i % 2 === 0
                    ? "url(#node-grad-blue)"
                    : "url(#node-grad-purple)"}
                  opacity={n.op * .3}
                />
                {/* Core */}
                <circle
                  cx={n.cx} cy={n.cy}
                  r={n.r}
                  fill={i % 2 === 0 ? "#60a5fa" : "#a78bfa"}
                  opacity={n.op}
                />
              </g>
            ))}

            {/* Animated "data packet" travelling along a random edge */}
            {[0, 7, 14, 20].map((ei, idx) => {
              const edge = EDGES[ei % EDGES.length];
              if (!edge) return null;
              return (
                <circle key={`pkt-${idx}`} r="2.5" fill="#a78bfa" opacity=".8">
                  <animateMotion
                    dur={`${6 + idx * 2.5}s`}
                    repeatCount="indefinite"
                    begin={`${idx * 1.8}s`}
                  >
                    <mpath>
                      <path d={`M${edge.x1},${edge.y1} L${edge.x2},${edge.y2}`} />
                    </mpath>
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;.8;.8;0"
                    dur={`${6 + idx * 2.5}s`}
                    repeatCount="indefinite"
                    begin={`${idx * 1.8}s`}
                  />
                </circle>
              );
            })}
          </svg>

          {/* Scanline */}
          <div className="crew-scanline" />

          {/* Corner crosshairs */}
          <div className="crew-crosshair ch-tl" />
          <div className="crew-crosshair ch-tr" />
          <div className="crew-crosshair ch-bl" />
          <div className="crew-crosshair ch-br" />
        </div>

        {/* ══════════════════════════════════
            CONTENT
        ══════════════════════════════════ */}
        <div className="crew-content">

          {/* ── HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6, ease: [.4,0,.2,1] }}
            className="crew-header-panel"
            style={{ marginBottom: "1.25rem" }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div className="crew-eyebrow"><Users size={10} /> Production Team</div>
                <h1 className="crew-title">Crew Center</h1>
                <p className="crew-desc">
                  Manage your elite production team with precision and control.
                </p>
              </div>
              <button
                className="btn-add-crew"
                onClick={() => setIsModalOpen(true)}
              >
                <UserPlus size={15} />
                Add Crew
              </button>
            </div>
          </motion.div>

          <AddTalentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            type="crew"
            onSuccess={fetchCrew}
          />

          {/* ── CONTROLS ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .18 }}
            className="crew-controls"
          >
            <div className="crew-search-wrap">
              <Search size={14} />
              <input
                className="crew-search"
                placeholder="Search crew by name or role…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="crew-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <button
              className="btn-sort-order"
              onClick={() => setSortOrder(p => p === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc size={15} /> : <SortDesc size={15} />}
            </button>

            <span className="crew-count-badge">
              {filtered.length} / {crew.length} members
            </span>
          </motion.div>

          {/* ── GRID ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "1rem",
          }}>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.length ? filtered.map((member, i) => (
                  <motion.div
                    key={member._id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: .96 }}
                    transition={{ delay: i * .04, duration: .35 }}
                    whileHover={{ y: -5 }}
                    className={`crew-card ${member.status === "blocked" ? "blocked" : ""}`}
                  >
                    {/* Top section */}
                    <div style={{ display: "flex", gap: ".9rem", alignItems: "flex-start" }}>
                      {/* Avatar */}
                      <div className={`crew-avatar ${
                        member.status === "blocked" ? "crew-avatar-blocked" : "crew-avatar-active"
                      }`}>
                        {initials(member.name)}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".45rem", justifyContent: "space-between" }}>
                          <div className="crew-name">{member.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: ".3rem", flexShrink: 0 }}>
                            <div className={`status-pip ${member.status === "active" ? "pip-active" : "pip-blocked"}`} />
                            {member.status === "blocked" && (
                              <ShieldAlert size={13} style={{ color: "#ef4444" }} />
                            )}
                          </div>
                        </div>
                        <div className="crew-role">{member.role}</div>

                        <div className="crew-meta-row">
                          <div className="crew-meta-item crew-rating">
                            <Star size={11} style={{ fill: "#fbbf24" }} />
                            {member.rating ?? "—"}
                          </div>
                          <div className="crew-meta-item">
                            <Briefcase size={10} />
                            {member.experience ?? "—"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="crew-card-divider" />

                    {/* Footer */}
                    <div className="crew-card-footer">
                      <div className="crew-projects-info">
                        <span className="crew-projects-val">
                          {member.projects ?? 0} projects
                        </span>
                        <span style={{
                          fontSize: ".67rem",
                          color: "rgba(148,163,184,.35)",
                        }}>
                          by {member.createdBy?.name ?? "System"}
                        </span>
                      </div>

                      <motion.button
                        whileTap={{ scale: .88 }}
                        whileHover={{ scale: 1.12 }}
                        className={`btn-toggle-status ${member.status === "active" ? "active" : "blocked"}`}
                        onClick={() => toggleStatus(member._id, member.status)}
                        title={member.status === "active" ? "Block crew member" : "Unblock crew member"}
                      >
                        {member.status === "active"
                          ? <ShieldAlert size={14} />
                          : <ShieldCheck size={14} />}
                      </motion.button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="crew-empty">
                    <div className="empty-icon-wrap">
                      <Users size={24} />
                    </div>
                    <div style={{ fontSize: ".95rem", fontWeight: 500 }}>No crew members found</div>
                    <div style={{ fontSize: ".78rem" }}>Try adjusting your search or add new crew</div>
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </>
  );
}