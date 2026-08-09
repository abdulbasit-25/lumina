import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Film,
  Sparkles,
  Users,
  Calendar,
  DollarSign,
  Crosshair,
  Brain,
  ArrowRight,
  Play,
  ChevronDown,
  Zap,
  Shield,
  TrendingUp,
  Star,
  Target,
  Code,
} from "lucide-react";
import demoVideo from "@/assets/Demo-vid.mp4";
import bannerImg from "@/assets/banner.png";
import logoIcon from "@/assets/image.png";

/* ─────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #09090f;
  --surf1:     #0f0f1a;
  --surf2:     #141422;
  --surf3:     #1a1a2e;
  --bdr:       rgba(120,120,220,0.12);
  --bdr2:      rgba(120,120,220,0.22);
  --bdr3:      rgba(120,120,220,0.35);
  --txt:       #e8e8f4;
  --muted:     rgba(200,200,240,0.52);
  --muted2:    rgba(200,200,240,0.3);
  --blue:      #4f8ef7;
  --blue2:     #6366f1;
  --purple:    #8b5cf6;
  --cyan:      #22d3ee;
  --green:     #34d399;
  --amber:     #fbbf24;
  --red:       #f87171;
  --pink:      #f472b6;

  --glow-b:    rgba(79,142,247,0.28);
  --glow-p:    rgba(139,92,246,0.24);
  --glow-c:    rgba(34,211,238,0.18);

  --ff-head:   'Syne', sans-serif;
  --ff-body:   'DM Sans', sans-serif;
  --ff-mono:   'DM Mono', monospace;

  --ease:      cubic-bezier(.22,1,.36,1);
  --r-sm:      10px;
  --r-md:      16px;
  --r-lg:      22px;
  --r-xl:      28px;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--txt);
  font-family: var(--ff-body);
  font-weight: 400;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ── PAGE AMBIENT ── */
body::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 70% 60% at 20% 0%, rgba(99,102,241,0.06) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 100%, rgba(139,92,246,0.05) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 80% 20%, rgba(34,211,238,0.03) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ── TYPOGRAPHY ── */
h1, h2, h3, h4, h5 { font-family: var(--ff-head); }

.grad-text {
  background: linear-gradient(100deg, var(--blue) 0%, var(--blue2) 35%, var(--purple) 70%, var(--cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.grad-text-soft {
  background: linear-gradient(100deg, var(--blue) 0%, var(--purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─────────────────────────────────────────────────────────────────
   ANIMATIONS
───────────────────────────────────────────────────────────────── */
@keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:none; } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes bounceY  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(7px); } }
@keyframes scanline {
  0%   { transform:translateY(-4px); opacity:0; }
  8%   { opacity:1; }
  92%  { opacity:1; }
  100% { transform:translateY(100vh); opacity:0; }
}
@keyframes orbit {
  from { transform:rotate(0deg) translateX(var(--r)) rotate(0deg); }
  to   { transform:rotate(360deg) translateX(var(--r)) rotate(-360deg); }
}
@keyframes floatBlob {
  0%,100% { transform:translate(0,0) scale(1); }
  33%     { transform:translate(40px,-22px) scale(1.05); }
  66%     { transform:translate(-22px,15px) scale(0.97); }
}
@keyframes glowPulse {
  0%,100% { box-shadow: 0 0 24px var(--glow-b), 0 6px 32px rgba(79,142,247,0.2); }
  50%     { box-shadow: 0 0 48px var(--glow-b), 0 6px 60px rgba(139,92,246,0.25), 0 0 100px rgba(79,142,247,0.12); }
}
@keyframes aiPulse {
  0%,100% { opacity:1; box-shadow:0 0 22px var(--glow-b); }
  50%     { opacity:0.72; box-shadow:0 0 52px var(--glow-b), 0 0 90px rgba(79,142,247,0.18); }
}
@keyframes shimmer {
  0%   { background-position:-800px 0; }
  100% { background-position: 800px 0; }
}
@keyframes barGrow { from { width:0; } }
@keyframes pipBlink {
  0%,100% { opacity:1; }
  50%     { opacity:0.35; }
}
@keyframes ticker {
  0%   { transform:translateX(-100%); }
  100% { transform:translateX(400%); }
}

.anim-glow-pulse { animation: glowPulse 2.8s ease-in-out infinite; }
.anim-ai-pulse   { animation: aiPulse 3s ease-in-out infinite; }
.anim-shimmer {
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.1), transparent);
  background-size: 800px 100%;
  animation: shimmer 3s linear infinite;
}

/* ─────────────────────────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────────────────────────── */
.reveal {
  opacity:0;
  transform:translateY(30px);
  transition: opacity .8s var(--ease), transform .8s var(--ease);
}
.reveal.visible { opacity:1; transform:none; }

/* ─────────────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────────────── */
.nav {
  position: fixed; top:0; left:0; right:0; z-index:200;
  display: flex; align-items:center; justify-content:space-between;
  padding: 1.1rem 2.5rem;
  border-bottom: 1px solid transparent;
  transition: background .45s, border-color .45s, backdrop-filter .45s;
}
.nav.scrolled {
  background: rgba(9,9,15,0.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-color: var(--bdr2);
}

.nav-logo {
  display:flex; align-items:center; gap:.65rem;
  text-decoration:none;
}
.nav-logo-img {
  width:36px; height:36px;
  border-radius:10px;
  object-fit:cover;
  border:1px solid var(--bdr3);
  box-shadow: 0 0 16px rgba(99,102,241,0.3);
}
.nav-logo-name {
  font-family: var(--ff-head);
  font-size:1.15rem; font-weight:700;
  letter-spacing:.04em;
  color:var(--txt);
}
.nav-logo-name em {
  font-style:normal;
  background: linear-gradient(90deg, var(--blue), var(--purple));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-clip:text;
}

.nav-links { display:flex; gap:2rem; list-style:none; }
.nav-links a {
  color:var(--muted);
  font-size:.82rem; font-weight:400;
  text-decoration:none;
  letter-spacing:.02em;
  transition:color .25s;
  position:relative;
}
.nav-links a::after {
  content:'';
  position:absolute; bottom:-3px; left:0; right:0; height:1px;
  background:linear-gradient(90deg,var(--blue),var(--purple));
  transform:scaleX(0);
  transition:transform .3s;
}
.nav-links a:hover { color:var(--txt); }
.nav-links a:hover::after { transform:scaleX(1); }

.btn-nav {
  font-family:var(--ff-head);
  font-size:.82rem; font-weight:600;
  letter-spacing:.06em;
  padding:.5rem 1.4rem;
  border-radius:var(--r-sm);
  border:1px solid var(--bdr3);
  background:rgba(79,142,247,0.08);
  color:var(--blue);
  cursor:pointer;
  transition:all .25s;
}
.btn-nav:hover {
  background:rgba(79,142,247,0.18);
  border-color:var(--blue);
  box-shadow:0 0 20px rgba(79,142,247,0.25);
  color:#fff;
}

/* ─────────────────────────────────────────────────────────────────
   HERO — full-bleed banner
───────────────────────────────────────────────────────────────── */
.hero {
  position:relative;
  min-height:100vh;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  text-align:center;
  padding:9rem 1.5rem 6rem;
  overflow:hidden;
}

/* banner image */
.hero-banner {
  position:absolute; inset:0;
  width:100%; height:100%;
  object-fit:cover;
  object-position:center 30%;
  z-index:0;
}

/* layered overlays */
.hero-overlay-1 {
  position:absolute; inset:0; z-index:1;
  background:
    linear-gradient(to bottom, rgba(9,9,15,0.45) 0%, rgba(9,9,15,0.78) 60%, rgba(9,9,15,1) 100%),
    linear-gradient(to right, rgba(9,9,15,0.3), transparent 50%, rgba(9,9,15,0.3));
}
.hero-overlay-tint {
  position:absolute; inset:0; z-index:1;
  background:rgba(79,100,247,0.08);
  mix-blend-mode:screen;
}
.hero-scanlines {
  position:absolute; inset:0; z-index:2;
  background-image:repeating-linear-gradient(
    0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px
  );
  pointer-events:none;
}
.hero-vignette {
  position:absolute; inset:0; z-index:2;
  box-shadow:inset 0 0 200px rgba(9,9,15,0.7);
  pointer-events:none;
}

/* grid */
.hero-grid {
  position:absolute; inset:0; z-index:2;
  background-image:
    linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px);
  background-size:56px 56px;
  mask-image:radial-gradient(ellipse 80% 70% at 50% 50%,black 10%,transparent 80%);
  pointer-events:none;
}

/* blobs */
.blob {
  position:absolute; border-radius:50%;
  filter:blur(100px); pointer-events:none; z-index:2;
}
.blob-1 {
  width:700px; height:500px; top:-80px; left:-100px;
  background:radial-gradient(ellipse,rgba(79,142,247,.1) 0%,transparent 70%);
  animation:floatBlob 18s ease-in-out infinite;
}
.blob-2 {
  width:700px; height:600px; bottom:-120px; right:-80px;
  background:radial-gradient(ellipse,rgba(139,92,246,.09) 0%,transparent 70%);
  animation:floatBlob 22s ease-in-out infinite reverse;
}
.blob-3 {
  width:400px; height:300px; top:40%; left:50%; transform:translateX(-50%);
  background:radial-gradient(ellipse,rgba(99,102,241,.06) 0%,transparent 70%);
  animation:floatBlob 12s ease-in-out infinite 4s;
}

/* scanline beam */
.scanline-beam {
  position:absolute; top:0; left:0; right:0; z-index:3;
  height:3px;
  background:linear-gradient(90deg,transparent,rgba(99,102,241,.22) 30%,rgba(139,92,246,.22) 70%,transparent);
  animation:scanline 12s linear infinite;
  pointer-events:none;
}

/* orbit */
.rings {
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%);
  pointer-events:none; z-index:3;
}
.ring {
  position:absolute; border-radius:50%;
  border:1px solid rgba(99,102,241,.09);
  transform:translate(-50%,-50%);
}
.ring-1 { width:200px; height:200px; }
.ring-2 { width:380px; height:380px; border-color:rgba(99,102,241,.055); }
.ring-3 { width:560px; height:560px; border-color:rgba(99,102,241,.035); }
.orbit-dot {
  position:absolute; top:50%; left:50%; border-radius:50%;
  animation:orbit var(--dur,10s) linear infinite;
}
.od-1 {
  width:7px; height:7px; margin:-3.5px 0 0 -3.5px;
  background:var(--blue);
  box-shadow:0 0 12px var(--blue),0 0 28px rgba(79,142,247,.5);
  --r:100px; --dur:11s;
}
.od-2 {
  width:5px; height:5px; margin:-2.5px 0 0 -2.5px;
  background:var(--purple);
  box-shadow:0 0 12px var(--purple),0 0 28px rgba(139,92,246,.5);
  --r:190px; --dur:17s;
  animation-direction:reverse;
}
.od-3 {
  width:4px; height:4px; margin:-2px 0 0 -2px;
  background:var(--cyan);
  box-shadow:0 0 10px var(--cyan);
  --r:280px; --dur:25s;
}

/* hero content */
.hero-content { position:relative; z-index:10; }

.hero-badge {
  display:inline-flex; align-items:center; gap:.5rem;
  padding:.32rem .95rem .32rem .48rem;
  border-radius:999px;
  border:1px solid rgba(79,142,247,.3);
  background:rgba(79,142,247,.08);
  backdrop-filter:blur(12px);
  font-family:var(--ff-mono);
  font-size:.68rem; letter-spacing:.12em; text-transform:uppercase;
  color:var(--blue);
  margin-bottom:2.5rem;
  animation:fadeUp .7s .1s both;
}
.badge-pip {
  width:20px; height:20px; border-radius:50%;
  background:rgba(79,142,247,.2);
  display:flex; align-items:center; justify-content:center;
}
.badge-pip-dot {
  width:7px; height:7px; border-radius:50%;
  background:var(--blue);
  animation:aiPulse 2s ease-in-out infinite;
}

.hero-h1 {
  font-size:clamp(3rem,9vw,7.5rem);
  font-weight:800;
  line-height:.95;
  letter-spacing:-0.04em;
  margin-bottom:1.6rem;
  animation:fadeUp .9s .22s both;
}
.hero-h1-sub {
  display:block;
  color:var(--txt);
  opacity:.92;
}

.hero-p {
  font-size:clamp(.88rem,1.8vw,1.05rem);
  font-weight:300;
  line-height:1.85;
  color:var(--muted);
  max-width:520px;
  margin:0 auto 3rem;
  animation:fadeUp .9s .38s both;
  font-style:italic;
}
.hero-p strong {
  font-style:normal; font-weight:600;
  background:linear-gradient(90deg,var(--blue),var(--purple));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}

.hero-actions {
  display:flex; gap:1rem; align-items:center; justify-content:center;
  flex-wrap:wrap;
  animation:fadeUp .9s .52s both;
}

.btn-primary {
  font-family:var(--ff-head);
  font-size:.88rem; font-weight:700; letter-spacing:.06em;
  padding:.9rem 2.2rem;
  border-radius:var(--r-sm); border:none;
  background:linear-gradient(135deg,var(--blue2) 0%,var(--blue) 45%,var(--purple) 100%);
  background-size:200% 100%;
  color:#fff;
  cursor:pointer;
  display:inline-flex; align-items:center; gap:.5rem;
  position:relative; overflow:hidden;
  transition:transform .2s,box-shadow .3s,background-position .4s;
  box-shadow:0 0 36px rgba(99,102,241,0.35),0 4px 20px rgba(0,0,0,0.3);
}
.btn-primary::before {
  content:'';
  position:absolute; inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);
  transform:translateX(-120%); transition:transform .5s;
}
.btn-primary:hover::before { transform:translateX(120%); }
.btn-primary:hover {
  transform:translateY(-2px);
  box-shadow:0 0 56px rgba(99,102,241,0.5),0 8px 32px rgba(0,0,0,0.3);
  background-position:100% 0;
}
.btn-primary:active { transform:none; }
.btn-primary svg { transition:transform .25s; }
.btn-primary:hover svg { transform:translateX(4px); }

.btn-ghost {
  font-family:var(--ff-head);
  font-size:.88rem; font-weight:600; letter-spacing:.04em;
  padding:.9rem 1.8rem;
  border-radius:var(--r-sm);
  border:1px solid var(--bdr2);
  background:rgba(15,15,26,0.6);
  backdrop-filter:blur(12px);
  color:var(--muted);
  cursor:pointer;
  display:inline-flex; align-items:center; gap:.55rem;
  transition:border-color .25s,color .25s,background .25s,box-shadow .25s;
}
.btn-ghost:hover {
  border-color:var(--bdr3);
  color:var(--txt);
  background:rgba(26,26,46,0.8);
  box-shadow:0 0 24px rgba(99,102,241,0.12);
}
.play-pill {
  width:26px; height:26px; border-radius:50%;
  border:1px solid var(--bdr2);
  display:flex; align-items:center; justify-content:center;
  transition:border-color .25s,background .25s;
}
.btn-ghost:hover .play-pill {
  border-color:var(--purple);
  background:rgba(139,92,246,.14);
}

.scroll-cue {
  position:absolute; bottom:2.5rem; left:50%; transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:.4rem;
  color:var(--muted2);
  font-family:var(--ff-mono);
  font-size:.6rem; letter-spacing:.2em; text-transform:uppercase;
  animation:fadeIn 1s 1.6s both; z-index:10;
}
.scroll-cue svg { animation:bounceY 2s ease-in-out infinite; }

/* ── TICKER TAPE ── */
.ticker-wrap {
  position:relative; z-index:10;
  border-top:1px solid var(--bdr);
  border-bottom:1px solid var(--bdr);
  background:rgba(15,15,26,0.6);
  backdrop-filter:blur(16px);
  overflow:hidden; padding:.6rem 0;
}
.ticker-inner {
  display:flex; gap:3rem; width:max-content;
  animation:ticker 22s linear infinite;
}
.ticker-item {
  display:flex; align-items:center; gap:.5rem;
  font-family:var(--ff-mono);
  font-size:.7rem; letter-spacing:.14em; text-transform:uppercase;
  color:var(--muted2); white-space:nowrap;
}
.ticker-dot {
  width:4px; height:4px; border-radius:50%;
  background:var(--blue); opacity:.7;
}

/* ─────────────────────────────────────────────────────────────────
   STATS BAR
───────────────────────────────────────────────────────────────── */
.stats-bar {
  display:flex; justify-content:center;
  border-bottom:1px solid var(--bdr);
  background:rgba(9,9,15,0.8);
}
.stat-card {
  flex:1; max-width:260px;
  padding:2.25rem 1.5rem;
  text-align:center;
  border-right:1px solid var(--bdr);
  position:relative; overflow:hidden;
  transition:background .3s;
}
.stat-card:last-child { border-right:none; }
.stat-card:hover { background:rgba(99,102,241,.04); }
.stat-shimmer { position:absolute; inset:0; pointer-events:none; }
.stat-num {
  font-family:var(--ff-head);
  font-size:2.6rem; font-weight:800; line-height:1;
  display:block; margin-bottom:.4rem;
  letter-spacing:-0.02em;
}
.stat-lbl {
  font-family:var(--ff-mono);
  font-size:.65rem; color:var(--muted2);
  letter-spacing:.14em; text-transform:uppercase;
}
.stat-bar {
  position:absolute; bottom:0; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent,var(--blue),var(--purple),transparent);
  transform:scaleX(0); transition:transform .45s;
}
.stat-card:hover .stat-bar { transform:scaleX(1); }

/* ─────────────────────────────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────────────────────────────── */
.section {
  max-width:1200px; margin:0 auto; padding:7rem 1.5rem;
}
.eyebrow {
  display:inline-flex; align-items:center; gap:.5rem;
  font-family:var(--ff-mono);
  font-size:.66rem; font-weight:500;
  letter-spacing:.2em; text-transform:uppercase;
  color:var(--blue); margin-bottom:1.25rem;
}
.eyebrow::before {
  content:''; display:block;
  width:24px; height:1px;
  background:linear-gradient(90deg,var(--blue),transparent);
}
.sec-title {
  font-family:var(--ff-head);
  font-size:clamp(1.9rem,4.5vw,3.2rem);
  font-weight:800; letter-spacing:-0.025em; line-height:1.1;
  margin-bottom:.9rem;
}
.sec-desc {
  font-size:.88rem; color:var(--muted); line-height:1.82;
  max-width:480px; margin-bottom:3.5rem; font-weight:300;
}

/* ─────────────────────────────────────────────────────────────────
   FEATURES GRID
───────────────────────────────────────────────────────────────── */
.feat-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1px;
  background:var(--bdr);
  border:1px solid var(--bdr);
  border-radius:var(--r-lg);
  overflow:hidden;
}
.feat-tile {
  background:var(--surf1);
  padding:2.25rem 1.75rem;
  position:relative; overflow:hidden;
  transition:background .35s;
}
.feat-tile::before {
  content:'';
  position:absolute; top:0; left:0; right:0; height:1px;
  background:linear-gradient(90deg,transparent,var(--blue) 30%,var(--purple) 70%,transparent);
  transform:scaleX(0); transition:transform .5s;
}
.feat-tile:hover { background:var(--surf2); }
.feat-tile:hover::before { transform:scaleX(1); }

.feat-icon {
  width:46px; height:46px; border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  margin-bottom:1.5rem;
  transition:border-color .3s,background .3s,box-shadow .3s;
}
.feat-icon-blue {
  border:1px solid rgba(79,142,247,.2);
  background:rgba(79,142,247,.08); color:var(--blue);
}
.feat-icon-purple {
  border:1px solid rgba(139,92,246,.2);
  background:rgba(139,92,246,.08); color:var(--purple);
}
.feat-tile:hover .feat-icon-blue {
  border-color:rgba(79,142,247,.5); background:rgba(79,142,247,.16);
  box-shadow:0 0 24px rgba(79,142,247,.22);
}
.feat-tile:hover .feat-icon-purple {
  border-color:rgba(139,92,246,.5); background:rgba(139,92,246,.16);
  box-shadow:0 0 24px rgba(139,92,246,.22);
}
.feat-tile h3 {
  font-size:.98rem; font-weight:700; letter-spacing:-.01em; margin-bottom:.5rem;
}
.feat-tile p { font-size:.8rem; color:var(--muted); line-height:1.75; }

/* ─────────────────────────────────────────────────────────────────
   AI HIGHLIGHT
───────────────────────────────────────────────────────────────── */
.ai-section { max-width:1200px; margin:0 auto; padding:0 1.5rem 7rem; }

.ai-card {
  position:relative; overflow:hidden;
  border-radius:var(--r-xl);
  background:var(--surf1);
  border:1px solid var(--bdr2);
  box-shadow:0 0 0 1px rgba(99,102,241,0.06) inset, 0 32px 80px rgba(0,0,0,0.4);
}
.ai-card::before {
  content:'';
  position:absolute; inset:0; border-radius:var(--r-xl);
  background:linear-gradient(135deg,rgba(79,142,247,0.06) 0%,transparent 40%,transparent 60%,rgba(139,92,246,0.05) 100%);
  pointer-events:none;
}
.ai-card-shimmer { position:absolute; inset:0; pointer-events:none; }
.ai-inner {
  padding:3.5rem;
  display:grid; grid-template-columns:1fr 1fr;
  gap:4rem; align-items:center;
  position:relative; z-index:1;
}

.ai-badge {
  display:inline-flex; align-items:center; gap:.4rem;
  padding:.28rem .85rem; border-radius:999px;
  font-family:var(--ff-mono); font-size:.65rem; letter-spacing:.12em; text-transform:uppercase;
  background:rgba(139,92,246,.12); border:1px solid rgba(139,92,246,.28);
  color:var(--purple); margin-bottom:1.25rem;
}

.ai-features-list {
  display:flex; gap:1.5rem; flex-wrap:wrap; margin-top:2rem;
}
.ai-feature-item {
  display:flex; align-items:center; gap:.45rem;
  font-size:.78rem; color:var(--muted);
  font-weight:300;
}

/* dashboard widget */
.dash {
  border-radius:var(--r-md);
  border:1px solid var(--bdr2);
  background:rgba(9,9,15,0.85);
  backdrop-filter:blur(12px);
  padding:1.4rem;
  display:flex; flex-direction:column; gap:.9rem;
}
.dash-head {
  display:flex; align-items:center; gap:.5rem;
  padding-bottom:.8rem;
  border-bottom:1px solid var(--bdr);
}
.dash-pip {
  width:9px; height:9px; border-radius:50%;
}
.dash-title {
  font-family:var(--ff-mono); font-size:.65rem; letter-spacing:.1em;
  color:var(--muted2); text-transform:uppercase;
}
.live-dot {
  margin-left:auto;
  display:flex; align-items:center; gap:.4rem;
  font-family:var(--ff-mono); font-size:.62rem; letter-spacing:.1em; color:var(--green);
}
.live-dot::before {
  content:'';
  width:6px; height:6px; border-radius:50%;
  background:var(--green);
  box-shadow:0 0 8px var(--green);
  animation:aiPulse 2s ease-in-out infinite;
}
.dash-row { display:flex; align-items:center; gap:.75rem; }
.dash-lbl {
  font-family:var(--ff-mono); font-size:.65rem; color:var(--muted2);
  width:52px; text-transform:uppercase; letter-spacing:.06em;
}
.dash-track {
  flex:1; height:6px; border-radius:999px;
  background:rgba(120,120,220,.08); overflow:hidden;
}
.dash-fill { height:100%; border-radius:999px; animation:barGrow 1.5s var(--ease) both; }
.fill-1 { background:linear-gradient(90deg,var(--blue),var(--purple)); }
.fill-2 { background:linear-gradient(90deg,var(--purple),var(--pink)); }
.fill-3 { background:linear-gradient(90deg,var(--blue),var(--cyan)); }
.dash-pct {
  font-family:var(--ff-mono); font-size:.68rem; color:var(--muted2);
  width:36px; text-align:right;
}
.dash-metrics {
  display:grid; grid-template-columns:1fr 1fr; gap:.5rem; margin-top:.1rem;
}
.dash-metric {
  border:1px solid var(--bdr); border-radius:var(--r-sm);
  padding:.6rem .8rem; background:rgba(15,15,26,.6);
}
.metric-val {
  font-family:var(--ff-head); font-size:1rem; font-weight:700;
  display:block; line-height:1.2;
}
.metric-lbl {
  font-family:var(--ff-mono); font-size:.58rem; color:var(--muted2);
  text-transform:uppercase; letter-spacing:.08em;
}

/* ─────────────────────────────────────────────────────────────────
   CTA
───────────────────────────────────────────────────────────────── */
.cta-section {
  padding:7rem 1.5rem;
  text-align:center; position:relative; overflow:hidden;
  border-top:1px solid var(--bdr);
}
.cta-section::before {
  content:'';
  position:absolute; top:-300px; left:50%; transform:translateX(-50%);
  width:1000px; height:800px;
  background:radial-gradient(ellipse,rgba(99,102,241,0.07) 0%,transparent 65%);
  pointer-events:none;
}
.cta-section::after {
  content:'';
  position:absolute; bottom:-200px; left:50%; transform:translateX(-50%);
  width:700px; height:500px;
  background:radial-gradient(ellipse,rgba(139,92,246,0.05) 0%,transparent 65%);
  pointer-events:none;
}
.cta-h2 {
  font-family:var(--ff-head);
  font-size:clamp(2.5rem,7vw,5.5rem);
  font-weight:800; letter-spacing:-.04em; line-height:1;
  max-width:680px; margin:0 auto 1.5rem;
}
.cta-p {
  font-size:.9rem; color:var(--muted); max-width:420px;
  margin:0 auto 2.75rem; line-height:1.8; font-weight:300;
}
.btn-cta {
  font-family:var(--ff-head);
  font-size:.95rem; font-weight:700; letter-spacing:.06em;
  padding:1.05rem 2.8rem; border-radius:var(--r-md); border:none;
  background:linear-gradient(135deg,var(--blue2),var(--blue) 45%,var(--purple));
  background-size:200% 100%;
  color:#fff; cursor:pointer;
  display:inline-flex; align-items:center; gap:.6rem;
  position:relative; overflow:hidden;
  transition:transform .2s,box-shadow .3s,background-position .4s;
  box-shadow:0 0 48px rgba(99,102,241,0.4),0 6px 28px rgba(0,0,0,0.3);
}
.btn-cta::before {
  content:'';
  position:absolute; inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);
  transform:translateX(-120%); transition:transform .5s;
}
.btn-cta:hover::before { transform:translateX(120%); }
.btn-cta:hover {
  transform:translateY(-3px); background-position:100% 0;
  box-shadow:0 0 70px rgba(99,102,241,0.55),0 10px 40px rgba(0,0,0,0.3);
}
.btn-cta:active { transform:none; }

/* ─────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────── */
.footer {
  border-top:1px solid var(--bdr);
  background:rgba(9,9,15,0.95);
}
.footer-inner {
  max-width:1200px; margin:0 auto;
  padding:4rem 1.5rem 2rem;
}
.footer-grid {
  display:grid; grid-template-columns:2fr 1fr 1fr 1fr;
  gap:3rem; margin-bottom:3rem;
}
.footer-brand-logo {
  display:flex; align-items:center; gap:.65rem; margin-bottom:1.1rem;
}
.footer-logo-img {
  width:38px; height:38px; border-radius:10px;
  object-fit:cover; border:1px solid var(--bdr3);
  box-shadow:0 0 16px rgba(99,102,241,0.28);
}
.footer-logo-name {
  font-family:var(--ff-head); font-size:1.15rem; font-weight:700;
  letter-spacing:.04em; color:var(--txt);
}
.footer-logo-name em {
  font-style:normal;
  background:linear-gradient(90deg,var(--blue),var(--purple));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}
.footer-tagline {
  font-size:.82rem; color:var(--muted); line-height:1.75; font-weight:300;
}
.footer-col-title {
  font-family:var(--ff-head); font-size:.85rem; font-weight:700;
  letter-spacing:.06em; text-transform:uppercase;
  color:var(--txt); margin-bottom:1.1rem;
}
.footer-links { display:flex; flex-direction:column; gap:.65rem; }
.footer-links button, .footer-links a {
  font-size:.8rem; color:var(--muted);
  background:none; border:none; cursor:pointer;
  text-align:left; text-decoration:none;
  transition:color .22s; padding:0; font-family:var(--ff-body); font-weight:300;
}
.footer-links button:hover, .footer-links a:hover { color:var(--txt); }

.footer-arch-link {
  display:inline-flex; align-items:center; gap:.4rem;
  font-size:.82rem; color:var(--muted); font-weight:300;
  text-decoration:none; transition:color .22s;
}
.footer-arch-link span {
  font-family:var(--ff-head); font-weight:700;
  font-size:.9rem; letter-spacing:.04em;
  background:linear-gradient(90deg,var(--blue2),var(--purple));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}
.footer-arch-link:hover { color:var(--txt); }

.footer-bottom {
  border-top:1px solid var(--bdr);
  padding-top:1.5rem;
  display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:.75rem;
}
.footer-copy {
  font-family:var(--ff-mono); font-size:.68rem;
  letter-spacing:.08em; color:var(--muted2);
}
.footer-legal { display:flex; gap:1.5rem; }
.footer-legal button {
  font-family:var(--ff-mono); font-size:.68rem; letter-spacing:.06em;
  color:var(--muted2); background:none; border:none; cursor:pointer;
  transition:color .22s;
}
.footer-legal button:hover { color:var(--txt); }

/* ─────────────────────────────────────────────────────────────────
   RESPONSIVE
───────────────────────────────────────────────────────────────── */
@media (max-width:1024px) {
  .feat-grid { grid-template-columns:repeat(2,1fr); }
  .ai-inner { grid-template-columns:1fr; gap:2.5rem; }
  .footer-grid { grid-template-columns:1fr 1fr; }
  .ring-2,.ring-3 { display:none; }
}
@media (max-width:768px) {
  .nav { padding:1rem 1.25rem; }
  .nav-links { display:none; }
  .stats-bar { flex-wrap:wrap; }
  .stat-card { flex:0 0 50%; max-width:none; }
  .stat-card:nth-child(2) { border-right:none; }
  .ai-inner { padding:2rem 1.5rem; }
  .footer-grid { grid-template-columns:1fr; gap:2rem; }
}
@media (max-width:560px) {
  .feat-grid { grid-template-columns:1fr; }
  .stat-card { flex:0 0 100%; border-right:none; border-bottom:1px solid var(--bdr); }
  .footer-bottom { flex-direction:column; text-align:center; }
}
`;

/* ─── DATA ─── */
const features = [
  {
    icon: Film,
    title: "Production Pipeline",
    desc: "Track every phase from greenlight to delivery. Unified views keep your whole team aligned in real time.",
    blue: true,
  },
  {
    icon: Users,
    title: "Cast & Crew Hub",
    desc: "Talent profiles, contracts, scheduling and on-set coordination — all in one command centre.",
    blue: false,
  },
  {
    icon: Brain,
    title: "AI Intelligence",
    desc: "Predictive analytics surface risks early. Intelligent casting, box-office forecasting, anomaly detection.",
    blue: true,
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "Auto call-sheets, conflict resolution and scene sequencing that save days on your production calendar.",
    blue: false,
  },
  {
    icon: DollarSign,
    title: "Budget Intelligence",
    desc: "Real-time variance dashboards with AI-powered overrun predictions before they hit your bottom line.",
    blue: true,
  },
  {
    icon: Sparkles,
    title: "Market Analytics",
    desc: "Audience sentiment, genre benchmarking and territory-level data for smarter greenlight decisions.",
    blue: false,
  },
];

// const stats = [
//   { num: "2,400+", lbl: "Productions Managed", color: "var(--blue)" },
//   { num: "$8.2B",  lbl: "Budgets Tracked",     color: "var(--purple)" },
//   { num: "97%",    lbl: "On-Time Delivery",    color: "var(--cyan)" },
//   { num: "140+",   lbl: "Countries Active",    color: "var(--blue)" },
// ];

const dashRows = [
  { lbl: "Pre-Prod", pct: "82%", w: "82%", cls: "fill-1", delay: ".1s" },
  { lbl: "Shoot", pct: "67%", w: "67%", cls: "fill-2", delay: ".25s" },
  { lbl: "Post", pct: "45%", w: "45%", cls: "fill-3", delay: ".4s" },
];

const metrics = [
  { val: "$4.2M", lbl: "Budget Used", color: "var(--blue)" },
  { val: "↓12%", lbl: "Variance", color: "var(--green)" },
  { val: "Day 42", lbl: "Shoot Day", color: "var(--purple)" },
  { val: "97%", lbl: "On Schedule", color: "var(--green)" },
];

const tickerItems = [
  "AI Production Intelligence",
  "Smart Scheduling",
  "Budget Forecasting",
  "Cast & Crew Management",
  "Box-Office Analytics",
  "Risk Detection",
  "Scene Optimization",
  "Territory Insights",
  "Greenlight Decisions",
];

/* ─── COMPONENT ─── */
export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.08 },
    );
    revealRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const r = (el: any) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a
          href="/"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <img src={logoIcon} alt="LuminaStudio" className="nav-logo-img" />
          <span className="nav-logo-name">
            Lumina<em>Studio</em>
          </span>
        </a>

        <ul className="nav-links">
          {[
            { label: "About", path: "/about" },
            { label: "Features", path: "/features" },
            { label: "Workflow", path: "/workflow" },
            { label: "Pricing", path: "/pricing" },
            { label: "Enterprise", path: "/enterprise" },
          ].map(({ label, path }) => (
            <li key={label}>
              <a
                href={path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(path);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button className="btn-nav" onClick={() => navigate("/login")}>
          Login
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        {/* banner image */}
        <img
          src={bannerImg}
          alt=""
          className="hero-banner"
          aria-hidden="true"
        />

        {/* overlays */}
        <div className="hero-overlay-1" aria-hidden="true" />
        <div className="hero-overlay-tint" aria-hidden="true" />
        <div className="hero-scanlines" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        {/* blobs */}
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />
        <div className="blob blob-3" aria-hidden="true" />

        {/* scanline beam */}
        <div className="scanline-beam" aria-hidden="true" />

        {/* orbit rings */}
        <div className="rings" aria-hidden="true">
          <div className="ring ring-1">
            <div className="orbit-dot od-1" />
          </div>
          <div className="ring ring-2">
            <div className="orbit-dot od-2" />
          </div>
          <div className="ring ring-3">
            <div className="orbit-dot od-3" />
          </div>
        </div>

        {/* content */}
        <div className="hero-content">
          <div className="hero-badge">
            <div className="badge-pip">
              <div className="badge-pip-dot" />
            </div>
            AI-Powered Film Production Suite
          </div>

          <h1 className="hero-h1">
            <span className="grad-text">Every Frame</span>
            <span className="hero-h1-sub">with AI</span>
          </h1>

          <p className="hero-p">
            <strong>Lumina</strong> unifies your entire production pipeline —
            from concept to delivery — with AI that thinks like a seasoned
            producer and scales like a major studio.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary anim-glow-pulse"
              onClick={() => navigate("/login")}
            >
              Get Started Free <ArrowRight size={16} />
            </button>

            <a
              href={demoVideo}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              <div className="play-pill">
                <Play size={9} fill="var(--purple)" color="var(--purple)" />
              </div>
              Watch Demo
            </a>
          </div>
        </div>

        <div className="scroll-cue">
          <span>Discover</span>
          <ChevronDown size={13} />
        </div>
      </section>

      {/* ── TICKER TAPE ── */}
      <div className="ticker-wrap" aria-hidden="true">
        <div className="ticker-inner">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="ticker-item">
              <div className="ticker-dot" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS BAR ── */}
      {/* <div className="stats-bar" ref={r as any}>
        {stats.map(s => (
          <div key={s.lbl} className="stat-card">
            <div className="anim-shimmer stat-shimmer" />
            <span className="stat-num" style={{ color: s.color }}>{s.num}</span>
            <span className="stat-lbl">{s.lbl}</span>
            <div className="stat-bar" />
          </div>
        ))}
      </div> */}

      {/* ── FEATURES ── */}
      <div className="section">
        <div className="reveal" ref={r}>
          <div className="eyebrow">
            <Zap size={11} /> Platform Capabilities
          </div>
          <h2 className="sec-title">
            Every tool a modern
            <br />
            <span className="grad-text-soft">studio demands.</span>
          </h2>
          <p className="sec-desc">
            Purpose-built for film professionals — not adapted from generic
            project management software.
          </p>
        </div>

        <div
          className="feat-grid reveal"
          ref={r}
          style={{ transitionDelay: ".1s" }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feat-tile reveal"
              ref={r}
              style={{ transitionDelay: `${0.07 * i}s` }}
            >
              <div
                className={`feat-icon ${f.blue ? "feat-icon-blue" : "feat-icon-purple"}`}
              >
                <f.icon size={19} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI HIGHLIGHT ── */}
      <div className="ai-section">
        <div className="ai-card anim-ai-pulse reveal" ref={r}>
          <div className="ai-card-shimmer anim-shimmer" />
          <div className="ai-inner">
            {/* Text */}
            <div>
              <div className="ai-badge">
                <Brain size={11} /> AI Intelligence Layer
              </div>
              <h2 className="sec-title" style={{ marginBottom: "1rem" }}>
                Predictive insights
                <br />
                <span className="grad-text">before you need them.</span>
              </h2>
              <p
                style={{
                  fontSize: ".87rem",
                  color: "var(--muted)",
                  lineHeight: 1.82,
                  fontWeight: 300,
                }}
              >
                Lumina's AI surfaces budget overruns, scheduling conflicts, and
                casting risks days before they become problems — giving your
                team time to act, not react.
              </p>
              <div className="ai-features-list">
                {[
                  { icon: TrendingUp, label: "Budget Forecasting" },
                  { icon: Shield, label: "Risk Alerts" },
                  { icon: Star, label: "Cast Scoring" },
                ].map((item) => (
                  <div key={item.label} className="ai-feature-item">
                    <item.icon size={13} color="var(--blue)" />
                    {item.label}
                  </div>
                ))}
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: "2rem" }}
                onClick={() => navigate("/login")}
              >
                Explore AI Features <ArrowRight size={15} />
              </button>
            </div>

            {/* Live dashboard */}
            <div className="dash">
              <div className="dash-head">
                <div
                  className="dash-pip"
                  style={{
                    background: "var(--blue)",
                    boxShadow: "0 0 10px var(--blue)",
                  }}
                />
                <div
                  className="dash-pip"
                  style={{
                    background: "var(--purple)",
                    boxShadow: "0 0 10px var(--purple)",
                  }}
                />
                <span className="dash-title">Production Dashboard</span>
                <span className="live-dot">Live</span>
              </div>

              {dashRows.map((row) => (
                <div key={row.lbl} className="dash-row">
                  <span className="dash-lbl">{row.lbl}</span>
                  <div className="dash-track">
                    <div
                      className={`dash-fill ${row.cls}`}
                      style={{ width: row.w, animationDelay: row.delay }}
                    />
                  </div>
                  <span className="dash-pct">{row.pct}</span>
                </div>
              ))}

              <div className="dash-metrics">
                {metrics.map((m) => (
                  <div key={m.lbl} className="dash-metric">
                    <span className="metric-val" style={{ color: m.color }}>
                      {m.val}
                    </span>
                    <span className="metric-lbl">{m.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="cta-section">
        <div className="reveal" ref={r}>
          <h2 className="cta-h2">
            Direct
            <span className="grad-text">your vision?</span>
          </h2>
          <p className="cta-p">
            Join the studios redefining modern film production. Start free —
            scale as you grow.
          </p>
          <button className="btn-cta" onClick={() => navigate("/login")}>
            Begin Your Production <ArrowRight size={17} />
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div className="footer-brand-logo">
                <img
                  src={logoIcon}
                  alt="LuminaStudio"
                  className="footer-logo-img"
                />
                <span className="footer-logo-name">
                  Lumina<em>Studio</em>
                </span>
              </div>
              <p className="footer-tagline">
                AI-powered production intelligence for the future of filmmaking.
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="footer-col-title">Product</div>
              <div className="footer-links">
                {["Features", "Workflow", "Pricing"].map((l) => (
                  <button
                    key={l}
                    onClick={() => navigate(`/${l.toLowerCase()}`)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <div className="footer-col-title">Company</div>
              <div className="footer-links">
                <button onClick={() => navigate("/about")}>About</button>
                <button onClick={() => navigate("/enterprise")}>
                  Enterprise
                </button>
                <span
                  style={{
                    fontSize: ".78rem",
                    color: "var(--muted2)",
                    fontWeight: 300,
                  }}
                >
                  Powered by{" "}
                  <a
                    href="https://abdulbasit-archer.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-arch-link"
                  >
                    <span>Archer</span>
                  </a>
                </span>
              </div>
            </div>

            {/* Social */}
            <div>
              <div className="footer-col-title">Follow Us</div>
              <p
                style={{
                  fontSize: ".78rem",
                  color: "var(--muted2)",
                  fontWeight: 300,
                  lineHeight: 1.75,
                }}
              >
                Social channels coming soon.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">
              © 2026 LuminaStudio. All rights reserved.
            </span>
            <div className="footer-legal">
              <button>Privacy Policy</button>
              <button>Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
