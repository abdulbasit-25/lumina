import { motion, AnimatePresence } from "framer-motion";
import {
  Star, UserPlus, ShieldAlert, ShieldCheck,
  Search, SortAsc, SortDesc, Clapperboard, Film
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { movieAPI } from "@/services/movieAPI";
import { useToast } from "@/hooks/use-toast";
import AddTalentModal from "@/components/AddTalentModal";

/* ─────────────────────────────────────────────────────────────────
   SCOPED STYLES
───────────────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Outfit:wght@200;300;400;500;600&family=DM+Mono:wght@300;400&display=swap');

.cast-root {
  font-family: 'Outfit', sans-serif;
  position: relative;
  min-height: 100vh;
  color: #f1f5f9;
  overflow: hidden;
}

/* ════════════════════════════════
   BACKGROUND SYSTEM
════════════════════════════════ */
.cast-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* Fine dot matrix */
.cast-dots {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(99,102,241,.14) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 110% 110% at 50% 0%, black 0%, transparent 80%);
}

/* Blueprint grid */
.cast-grid-major {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.04) 1px, transparent 1px);
  background-size: 72px 72px;
}
.cast-grid-minor {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.02) 1px, transparent 1px);
  background-size: 18px 18px;
}

/* Diagonal hatching */
.cast-hatch {
  position: absolute; inset: -300px;
  background-image: repeating-linear-gradient(
    -60deg,
    transparent, transparent 90px,
    rgba(139,92,246,.02) 90px,
    rgba(139,92,246,.02) 91px
  );
}

/* Ambient colour blobs */
.cast-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}
.cast-blob-1 {
  width: 800px; height: 700px;
  top: -200px; left: -150px;
  background: radial-gradient(ellipse, rgba(6,182,212,.08) 0%, transparent 70%);
  animation: cast-b1 22s ease-in-out infinite;
}
.cast-blob-2 {
  width: 700px; height: 600px;
  bottom: -150px; right: -100px;
  background: radial-gradient(ellipse, rgba(139,92,246,.08) 0%, transparent 70%);
  animation: cast-b2 18s ease-in-out infinite;
}
.cast-blob-3 {
  width: 500px; height: 400px;
  top: 40%; left: 55%;
  background: radial-gradient(ellipse, rgba(99,102,241,.05) 0%, transparent 70%);
  animation: cast-b3 14s ease-in-out infinite;
}
@keyframes cast-b1 {
  0%,100% { transform: translate(0,0) scale(1); }
  45%      { transform: translate(60px,-30px) scale(1.07); }
}
@keyframes cast-b2 {
  0%,100% { transform: translate(0,0) scale(1); }
  40%      { transform: translate(-45px,25px) scale(1.05); }
}
@keyframes cast-b3 {
  0%,100% { transform: translate(0,0) scale(1); }
  50%      { transform: translate(25px,-40px) scale(1.08); }
}

/* SVG network */
.cast-network-svg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
}

/* Horizontal accent lines */
.cast-hline {
  position: absolute; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%, rgba(6,182,212,.1) 25%,
    rgba(99,102,241,.12) 50%, rgba(6,182,212,.1) 75%,
    transparent 100%);
  animation: hline-breathe 5s ease-in-out infinite;
}
.cast-hline-1 { top: 20%; animation-delay: 0s; }
.cast-hline-2 { top: 50%; animation-delay: 1.8s; }
.cast-hline-3 { top: 78%; animation-delay: 3.2s; }
@keyframes hline-breathe {
  0%,100% { opacity: .35; }
  50%      { opacity: .9; }
}

/* Scanline */
.cast-scanline {
  position: absolute; top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent, rgba(6,182,212,.25) 35%,
    rgba(99,102,241,.25) 65%, transparent);
  animation: cast-scan 16s linear infinite;
}
@keyframes cast-scan {
  0%   { transform: translateY(-2px); opacity: 0; }
  3%   { opacity: 1; }
  97%  { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

/* Corner brackets */
.cast-bracket {
  position: absolute;
  width: 28px; height: 28px;
  opacity: .2;
}
.cast-bracket::before,
.cast-bracket::after {
  content: '';
  position: absolute;
  background: rgba(6,182,212,.9);
}
/* TL */
.cb-tl { top: 1.5rem; left: 1.5rem; }
.cb-tl::before { width: 1px; height: 100%; top: 0; left: 0; }
.cb-tl::after  { height: 1px; width: 100%; top: 0; left: 0; }
/* TR */
.cb-tr { top: 1.5rem; right: 1.5rem; }
.cb-tr::before { width: 1px; height: 100%; top: 0; right: 0; }
.cb-tr::after  { height: 1px; width: 100%; top: 0; right: 0; }
/* BL */
.cb-bl { bottom: 1.5rem; left: 1.5rem; }
.cb-bl::before { width: 1px; height: 100%; bottom: 0; left: 0; }
.cb-bl::after  { height: 1px; width: 100%; bottom: 0; left: 0; }
/* BR */
.cb-br { bottom: 1.5rem; right: 1.5rem; }
.cb-br::before { width: 1px; height: 100%; bottom: 0; right: 0; }
.cb-br::after  { height: 1px; width: 100%; bottom: 0; right: 0; }

/* ════════════════════════════════
   CONTENT
════════════════════════════════ */
.cast-content {
  position: relative; z-index: 1;
  max-width: 1300px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 5rem;
}

/* ── HEADER ── */
.cast-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}
.cast-title-block {}
.cast-eyebrow {
  display: inline-flex;
  align-items: center; gap: .4rem;
  font-size: .62rem; font-weight: 600;
  letter-spacing: .22em; text-transform: uppercase;
  color: rgba(6,182,212,.8);
  margin-bottom: .6rem;
  font-family: 'DM Mono', monospace;
}
.cast-h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 5.5vw, 4rem);
  font-weight: 400;
  line-height: .95;
  letter-spacing: -.01em;
  color: #f1f5f9;
}
.cast-h1 em {
  font-style: italic;
  background: linear-gradient(120deg, #22d3ee 0%, #818cf8 60%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.cast-h1-sub {
  display: block;
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  color: rgba(241,245,249,.3);
  font-weight: 300;
}
.cast-desc {
  font-size: .82rem; font-weight: 300;
  color: rgba(148,163,184,.55);
  margin-top: .65rem;
  max-width: 400px;
  line-height: 1.7;
}

/* Add artist button */
.btn-add-artist {
  font-family: 'Outfit', sans-serif;
  font-size: .8rem; font-weight: 500;
  letter-spacing: .06em;
  padding: .72rem 1.6rem;
  border-radius: 10px;
  border: 1px solid rgba(6,182,212,.4);
  background: rgba(6,182,212,.08);
  color: #22d3ee;
  cursor: pointer;
  display: inline-flex;
  align-items: center; gap: .5rem;
  transition: all .3s;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}
.btn-add-artist::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(6,182,212,.12), transparent);
  transform: translateX(-100%);
  transition: transform .5s;
}
.btn-add-artist:hover::before { transform: translateX(100%); }
.btn-add-artist:hover {
  background: rgba(6,182,212,.16);
  border-color: rgba(6,182,212,.7);
  color: #fff;
  box-shadow: 0 0 24px rgba(6,182,212,.2), 0 4px 20px rgba(0,0,0,.3);
  transform: translateY(-1px);
}

/* ── CONTROLS ── */
.cast-controls {
  display: flex;
  flex-wrap: wrap;
  gap: .7rem;
  align-items: center;
  padding: .9rem 1.1rem;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.05);
  background: rgba(3,7,18,.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  margin-bottom: 2rem;
}
.cast-search-wrap {
  flex: 1; min-width: 200px;
  position: relative;
}
.cast-search-wrap svg {
  position: absolute; left: .7rem; top: 50%;
  transform: translateY(-50%);
  color: rgba(148,163,184,.4);
  pointer-events: none;
}
.cast-search {
  font-family: 'Outfit', sans-serif;
  font-size: .82rem; width: 100%;
  background: rgba(3,7,18,.6);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 9px;
  color: #f1f5f9;
  padding: .52rem .75rem .52rem 2.1rem;
  outline: none;
  transition: border-color .25s, box-shadow .25s;
}
.cast-search::placeholder { color: rgba(148,163,184,.3); }
.cast-search:focus {
  border-color: rgba(6,182,212,.45);
  box-shadow: 0 0 0 3px rgba(6,182,212,.08);
}
.cast-select {
  font-family: 'Outfit', sans-serif;
  font-size: .8rem; min-width: 120px;
  background: rgba(3,7,18,.6);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 9px; color: #f1f5f9;
  padding: .52rem .75rem;
  outline: none; cursor: pointer; appearance: none;
  transition: border-color .25s;
}
.cast-select:focus { border-color: rgba(6,182,212,.45); }
.cast-btn-sort {
  padding: .52rem .85rem;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,.06);
  background: rgba(3,7,18,.6);
  color: rgba(148,163,184,.6);
  cursor: pointer;
  display: flex; align-items: center;
  transition: all .25s;
}
.cast-btn-sort:hover {
  border-color: rgba(6,182,212,.4);
  color: #22d3ee;
  background: rgba(6,182,212,.06);
}
.cast-count {
  margin-left: auto;
  font-family: 'DM Mono', monospace;
  font-size: .66rem;
  color: rgba(148,163,184,.35);
}

/* ════════════════════════════════
   ACTOR CARD  — cinematic strip
════════════════════════════════ */
.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.1rem;
}

.actor-card {
  position: relative;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.06);
  background: rgba(6,13,28,.7);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  overflow: hidden;
  transition: border-color .35s, background .35s, box-shadow .35s, transform .2s;
  cursor: default;
}

/* Card inner grid overlay */
.actor-card::after {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(6,182,212,.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6,182,212,.02) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0;
  transition: opacity .4s;
  pointer-events: none;
}

/* Top gradient line */
.actor-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg,
    transparent, rgba(6,182,212,.5) 30%,
    rgba(99,102,241,.5) 70%, transparent);
  transform: scaleX(0);
  transition: transform .45s cubic-bezier(.4,0,.2,1);
  z-index: 2;
}

.actor-card:hover {
  border-color: rgba(6,182,212,.28);
  background: rgba(6,13,28,.92);
  box-shadow:
    0 20px 56px rgba(0,0,0,.5),
    0 0 0 1px rgba(6,182,212,.1),
    inset 0 0 40px rgba(6,182,212,.03);
}
.actor-card:hover::before { transform: scaleX(1); }
.actor-card:hover::after  { opacity: 1; }

.actor-card.blocked {
  border-color: rgba(239,68,68,.2);
  opacity: .5;
}
.actor-card.blocked::before {
  background: linear-gradient(90deg,
    transparent, rgba(239,68,68,.35), transparent);
}

/* Film-strip side bar */
.actor-filmstrip {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 5px;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(6,182,212,.5) 20%,
    rgba(99,102,241,.5) 50%,
    rgba(6,182,212,.5) 80%,
    transparent 100%);
  opacity: 0;
  transition: opacity .35s;
}
.actor-card:hover .actor-filmstrip { opacity: 1; }

/* Perforations on the strip */
.actor-filmstrip::before {
  content: '';
  position: absolute; inset: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 10px,
    rgba(0,0,0,.6) 10px,
    rgba(0,0,0,.6) 14px
  );
}

/* Card body */
.actor-body {
  padding: 1.4rem 1.4rem 1.2rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Avatar + info row */
.actor-top-row {
  display: flex;
  gap: .9rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.actor-avatar {
  width: 54px; height: 54px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem; font-weight: 600;
  position: relative;
  overflow: hidden;
  transition: box-shadow .35s;
  letter-spacing: -.02em;
}
.actor-avatar-active {
  background: linear-gradient(135deg, #0e7490 0%, #4f46e5 100%);
  color: #fff;
}
.actor-avatar-active::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,.15), transparent 60%);
}
.actor-avatar-blocked {
  background: rgba(30,41,59,.8);
  color: rgba(100,116,139,.5);
  border: 1px solid rgba(71,85,105,.3);
}
.actor-card:hover .actor-avatar-active {
  box-shadow: 0 0 22px rgba(6,182,212,.45), 0 0 8px rgba(99,102,241,.3);
}

.actor-info { flex: 1; min-width: 0; }
.actor-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.18rem; font-weight: 500;
  letter-spacing: .01em;
  color: #f1f5f9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color .25s;
  line-height: 1.2;
}
.actor-card:hover .actor-name { color: #22d3ee; }

.actor-genres {
  font-size: .72rem; font-weight: 300;
  color: rgba(148,163,184,.5);
  margin-top: .2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: .02em;
}

/* Genre tags */
.actor-tags {
  display: flex; flex-wrap: wrap; gap: .35rem;
  margin-top: .5rem;
}
.actor-tag {
  font-size: .62rem; font-weight: 400;
  font-family: 'DM Mono', monospace;
  letter-spacing: .06em;
  padding: .2rem .55rem;
  border-radius: 4px;
  border: 1px solid rgba(6,182,212,.2);
  background: rgba(6,182,212,.07);
  color: rgba(34,211,238,.7);
  transition: border-color .2s, background .2s;
}
.actor-card:hover .actor-tag {
  border-color: rgba(6,182,212,.35);
  background: rgba(6,182,212,.12);
}

/* Stats row */
.actor-stats-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: .9rem;
}
.actor-match {
  display: flex; align-items: center; gap: .35rem;
  font-family: 'DM Mono', monospace;
  font-size: .75rem;
}
.actor-match-num {
  font-size: .95rem; font-weight: 500;
  color: #fbbf24;
}
.actor-status-badge {
  font-size: .58rem; font-weight: 500;
  letter-spacing: .14em; text-transform: uppercase;
  padding: .22rem .6rem;
  border-radius: 999px;
  font-family: 'DM Mono', monospace;
}
.badge-active-cast {
  background: rgba(6,182,212,.12);
  border: 1px solid rgba(6,182,212,.3);
  color: #22d3ee;
}
.badge-blocked-cast {
  background: rgba(239,68,68,.1);
  border: 1px solid rgba(239,68,68,.25);
  color: #f87171;
}

/* Match bar */
.actor-bar-wrap {
  height: 3px;
  border-radius: 999px;
  background: rgba(255,255,255,.05);
  margin-top: .65rem;
  overflow: hidden;
}
.actor-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #0891b2, #818cf8);
  transition: width .6s cubic-bezier(.4,0,.2,1);
}

/* Divider */
.actor-divider {
  height: 1px;
  background: linear-gradient(90deg,
    transparent, rgba(255,255,255,.05), transparent);
  margin: .9rem 0 .75rem;
}

/* Footer */
.actor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.actor-added-by {
  font-size: .65rem;
  color: rgba(148,163,184,.35);
  font-family: 'DM Mono', monospace;
}
.actor-added-by span {
  color: rgba(148,163,184,.55);
}

.btn-actor-toggle {
  width: 30px; height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,.06);
  background: rgba(3,7,18,.5);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .25s;
  color: rgba(148,163,184,.45);
}
.btn-actor-toggle:hover.is-active {
  background: rgba(239,68,68,.1);
  border-color: rgba(239,68,68,.3);
  color: #ef4444;
}
.btn-actor-toggle.is-blocked {
  color: #ef4444;
  border-color: rgba(239,68,68,.22);
}
.btn-actor-toggle.is-blocked:hover {
  background: rgba(34,197,94,.1);
  border-color: rgba(34,197,94,.3);
  color: #22c55e;
}

/* Skeleton */
@keyframes cast-shimmer {
  0%   { background-position: -700px 0; }
  100% { background-position:  700px 0; }
}
.cast-skeleton {
  height: 176px; border-radius: 16px;
  background: linear-gradient(90deg,
    rgba(6,13,28,.8) 25%, rgba(20,30,60,.5) 50%, rgba(6,13,28,.8) 75%);
  background-size: 700px 100%;
  animation: cast-shimmer 1.7s infinite;
}

/* Empty */
.cast-empty {
  grid-column: 1/-1;
  display: flex; flex-direction: column;
  align-items: center; gap: 1rem;
  padding: 5rem 2rem;
  text-align: center;
  color: rgba(148,163,184,.3);
}
.cast-empty-icon {
  width: 60px; height: 60px;
  border-radius: 14px;
  border: 1px solid rgba(6,182,212,.15);
  background: rgba(6,182,212,.05);
  display: flex; align-items: center; justify-content: center;
  color: rgba(6,182,212,.4);
}

/* Responsive */
@media (max-width: 640px) {
  .cast-content { padding: 1.25rem 1rem 3rem; }
  .cast-grid { grid-template-columns: 1fr; }
}
`;

/* ── NETWORK NODES ── */
const NODES = [
  { cx: 80,   cy: 60,  r: 2, op: .55, col: "cyan"   },
  { cx: 280,  cy: 40,  r: 3, op: .5,  col: "indigo" },
  { cx: 520,  cy: 100, r: 2, op: .6,  col: "cyan"   },
  { cx: 820,  cy: 50,  r: 2.5,op: .45,col: "indigo" },
  { cx: 1080, cy: 130, r: 2, op: .5,  col: "cyan"   },
  { cx: 1240, cy: 70,  r: 3, op: .55, col: "indigo" },
  { cx: 160,  cy: 220, r: 2, op: .4,  col: "indigo" },
  { cx: 420,  cy: 280, r: 3, op: .55, col: "cyan"   },
  { cx: 700,  cy: 200, r: 2, op: .45, col: "indigo" },
  { cx: 950,  cy: 260, r: 2.5,op: .5, col: "cyan"   },
  { cx: 1180, cy: 240, r: 2, op: .4,  col: "indigo" },
  { cx: 60,   cy: 380, r: 2.5,op: .5, col: "cyan"   },
  { cx: 340,  cy: 450, r: 2, op: .4,  col: "indigo" },
  { cx: 600,  cy: 400, r: 3, op: .55, col: "cyan"   },
  { cx: 870,  cy: 470, r: 2, op: .45, col: "indigo" },
  { cx: 1120, cy: 420, r: 2.5,op: .5, col: "cyan"   },
  { cx: 200,  cy: 580, r: 2, op: .4,  col: "cyan"   },
  { cx: 480,  cy: 620, r: 2.5,op: .5, col: "indigo" },
  { cx: 760,  cy: 570, r: 2, op: .45, col: "cyan"   },
  { cx: 1020, cy: 610, r: 3, op: .55, col: "indigo" },
  { cx: 1260, cy: 560, r: 2, op: .4,  col: "cyan"   },
];

const EDGES = (() => {
  const edges: { x1:number; y1:number; x2:number; y2:number }[] = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      const dx = NODES[i].cx - NODES[j].cx;
      const dy = NODES[i].cy - NODES[j].cy;
      if (Math.sqrt(dx*dx + dy*dy) < 300) {
        edges.push({ x1: NODES[i].cx, y1: NODES[i].cy, x2: NODES[j].cx, y2: NODES[j].cy });
      }
    }
  }
  return edges;
})();

const PACKET_EDGES = [0, 5, 11, 18, 25];

const SORT_OPTS = [
  { value: "name",   label: "Name"   },
  { value: "rating", label: "Match %" },
  { value: "status", label: "Status" },
];

/* ── INITIALS ── */
const initials = (name: string) =>
  name.split(" ").map((n:string) => n[0]).join("").slice(0,2).toUpperCase();

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────── */
export default function Cast() {
  const [cast, setCast]               = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy]           = useState("name");
  const [sortOrder, setSortOrder]     = useState<"asc"|"desc">("asc");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return [...cast]
      .filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.genres?.some((g:string) => g.toLowerCase().includes(q))
      )
      .sort((a,b) => {
        let av:any, bv:any;
        switch (sortBy) {
          case "name":   av = a.name.toLowerCase(); bv = b.name.toLowerCase(); break;
          case "rating": av = a.matchPercent||0;    bv = b.matchPercent||0;    break;
          case "status": av = a.status;             bv = b.status;             break;
          default: return 0;
        }
        if (av < bv) return sortOrder === "asc" ? -1 : 1;
        if (av > bv) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [cast, searchQuery, sortBy, sortOrder]);

  const fetchCast = async () => {
    try {
      const data = await movieAPI.getTalent("cast");
      setCast(data);
    } catch {
      toast({ title: "Error", description: "Failed to fetch cast", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCast(); }, []);

  const toggleStatus = async (id:string, cur:string) => {
    const next = cur === "active" ? "blocked" : "active";
    try {
      await movieAPI.updateTalentStatus("cast", id, next);
      setCast(c => c.map(m => m._id === id ? { ...m, status: next } : m));
      toast({ title: next === "blocked" ? "Actor Blocked" : "Actor Unblocked" });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="cast-root">

        {/* ══════════════ BACKGROUND ══════════════ */}
        <div className="cast-bg">
          <div className="cast-grid-minor" />
          <div className="cast-grid-major" />
          <div className="cast-dots" />
          <div className="cast-hatch" />

          <div className="cast-blob cast-blob-1" />
          <div className="cast-blob cast-blob-2" />
          <div className="cast-blob cast-blob-3" />

          {/* Network SVG */}
          <svg
            className="cast-network-svg"
            viewBox="0 0 1300 700"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="cng-cyan" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#22d3ee" stopOpacity="1" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="cng-indigo" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#818cf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </radialGradient>
              <filter id="cast-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {EDGES.map((e,i) => (
              <line key={i}
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke="rgba(6,182,212,0.1)"
                strokeWidth=".5"
              />
            ))}

            {/* Nodes */}
            {NODES.map((n,i) => (
              <g key={i} filter="url(#cast-glow)">
                <circle
                  cx={n.cx} cy={n.cy} r={n.r * 4}
                  fill={`url(#cng-${n.col})`}
                  opacity={n.op * .25}
                />
                <circle
                  cx={n.cx} cy={n.cy} r={n.r}
                  fill={n.col === "cyan" ? "#22d3ee" : "#818cf8"}
                  opacity={n.op}
                />
              </g>
            ))}

            {/* Data packets */}
            {PACKET_EDGES.map((ei, idx) => {
              const edge = EDGES[ei % EDGES.length];
              if (!edge) return null;
              const dur = `${5 + idx * 2.2}s`;
              const delay = `${idx * 1.5}s`;
              return (
                <circle key={`pkt-${idx}`} r="2.2"
                  fill={idx % 2 === 0 ? "#22d3ee" : "#818cf8"}
                  opacity=".9"
                >
                  <animateMotion dur={dur} repeatCount="indefinite" begin={delay}>
                    <mpath>
                      <path d={`M${edge.x1},${edge.y1} L${edge.x2},${edge.y2}`} />
                    </mpath>
                  </animateMotion>
                  <animate attributeName="opacity"
                    values="0;.9;.9;0" dur={dur}
                    repeatCount="indefinite" begin={delay}
                  />
                </circle>
              );
            })}
          </svg>

          <div className="cast-hline cast-hline-1" />
          <div className="cast-hline cast-hline-2" />
          <div className="cast-hline cast-hline-3" />
          <div className="cast-scanline" />

          <div className="cast-bracket cb-tl" />
          <div className="cast-bracket cb-tr" />
          <div className="cast-bracket cb-bl" />
          <div className="cast-bracket cb-br" />
        </div>

        {/* ══════════════ CONTENT ══════════════ */}
        <div className="cast-content">

          {/* Header */}
          <div className="cast-header">
            <motion.div
              className="cast-title-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .65, ease: [.4,0,.2,1] }}
            >
              <div className="cast-eyebrow">
                <Clapperboard size={10} />
                Talent Roster
              </div>
              <h1 className="cast-h1">
                Cast <em>Management</em>
                <span className="cast-h1-sub">Premium Talent.</span>
              </h1>
              <p className="cast-desc">
                Recruit and manage elite talent for your productions with precision.
              </p>
            </motion.div>

            <motion.button
              className="btn-add-artist"
              onClick={() => setIsModalOpen(true)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .15 }}
              whileTap={{ scale: .97 }}
            >
              <UserPlus size={14} />
              Add Artist
            </motion.button>
          </div>

          <AddTalentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            type="cast"
            onSuccess={fetchCast}
          />

          {/* Controls */}
          <motion.div
            className="cast-controls"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .2 }}
          >
            <div className="cast-search-wrap">
              <Search size={14} />
              <input
                className="cast-search"
                placeholder="Search by name or genre…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="cast-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <button
              className="cast-btn-sort"
              onClick={() => setSortOrder(p => p === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc size={15} /> : <SortDesc size={15} />}
            </button>

            <span className="cast-count">{filtered.length} / {cast.length}</span>
          </motion.div>

          {/* Cards */}
          <div className="cast-grid">
            {loading ? (
              [...Array(6)].map((_,i) => (
                <div key={i} className="cast-skeleton" />
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.length ? filtered.map((member, i) => (
                  <motion.div
                    key={member._id}
                    layout
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: .95 }}
                    transition={{ delay: i * .04, duration: .38 }}
                    whileHover={{ y: -5 }}
                    className={`actor-card ${member.status === "blocked" ? "blocked" : ""}`}
                  >
                    {/* Film-strip side bar */}
                    <div className="actor-filmstrip" />

                    <div className="actor-body">
                      {/* Top row — avatar + name */}
                      <div className="actor-top-row">
                        <div className={`actor-avatar ${
                          member.status === "blocked"
                            ? "actor-avatar-blocked"
                            : "actor-avatar-active"
                        }`}>
                          {initials(member.name)}
                        </div>

                        <div className="actor-info">
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:".4rem" }}>
                            <div className="actor-name">{member.name}</div>
                            {member.status === "blocked" && (
                              <ShieldAlert size={13} style={{ color:"#ef4444", flexShrink:0 }} />
                            )}
                          </div>

                          {/* Genre tags */}
                          <div className="actor-tags">
                            {(member.genres || []).slice(0,3).map((g:string) => (
                              <span key={g} className="actor-tag">{g}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="actor-stats-row">
                        <div className="actor-match">
                          <Star size={12} style={{ fill:"#fbbf24", color:"#fbbf24" }} />
                          <span className="actor-match-num">{member.matchPercent ?? 92}</span>
                          <span style={{ fontSize:".65rem", color:"rgba(148,163,184,.4)" }}>%</span>
                        </div>
                        <span className={`actor-status-badge ${
                          member.status === "active"
                            ? "badge-active-cast"
                            : "badge-blocked-cast"
                        }`}>
                          {member.status}
                        </span>
                      </div>

                      {/* Match bar */}
                      <div className="actor-bar-wrap">
                        <div
                          className="actor-bar-fill"
                          style={{ width: `${member.matchPercent ?? 92}%` }}
                        />
                      </div>

                      <div className="actor-divider" />

                      {/* Footer */}
                      <div className="actor-footer">
                        <div className="actor-added-by">
                          Added by <span>{member.createdBy?.name ?? "System"}</span>
                        </div>
                        <motion.button
                          whileTap={{ scale: .88 }}
                          whileHover={{ scale: 1.12 }}
                          className={`btn-actor-toggle ${
                            member.status === "active" ? "is-active" : "is-blocked"
                          }`}
                          onClick={() => toggleStatus(member._id, member.status)}
                          title={member.status === "active" ? "Block actor" : "Unblock actor"}
                        >
                          {member.status === "active"
                            ? <ShieldAlert size={13} />
                            : <ShieldCheck size={13} />}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="cast-empty">
                    <div className="cast-empty-icon"><Film size={24} /></div>
                    <div style={{ fontSize:".92rem", fontWeight:500 }}>No cast members found</div>
                    <div style={{ fontSize:".77rem" }}>Adjust your search or add new talent</div>
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