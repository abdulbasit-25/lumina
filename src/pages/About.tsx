// src/pages/About.tsx
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Film,
  Sparkles,
  Code2,
  Users,
  Rocket,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Star,
  BookOpen,
  GraduationCap,
  Award,
  Mail,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #04040d;
    --surf:      #0a0a18;
    --surf2:     #0f0f20;
    --bdr:       rgba(99,102,241,.14);
    --bdr-hover: rgba(99,102,241,.35);
    --blue:      #6366f1;
    --blue2:     #4f8ef7;
    --purple:    #a78bfa;
    --cyan:      #22d3ee;
    --amber:     #fbbf24;
    --txt:       #eeeef8;
    --muted:     rgba(210,210,240,.55);
    --muted-sm:  rgba(210,210,240,.42);
    --font-sans: 'DM Sans', sans-serif;
    --font-syne: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --radius-sm: 11px;
    --radius-md: 16px;
    --radius-lg: 22px;
    --radius-xl: 28px;
    --transition: all .28s cubic-bezier(.22,1,.36,1);
  }

  /* ── Keyframes ── */
  @keyframes float-up {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes fade-in  { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  {
    from { background-position: -200% center; }
    to   { background-position:  200% center; }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 18px rgba(99,102,241,.25); }
    50%      { box-shadow: 0 0 36px rgba(99,102,241,.55); }
  }
  @keyframes scanline {
    from { transform: translateY(-100%); }
    to   { transform: translateY(100vh); }
  }
  @keyframes orbit  {
    from { transform: rotate(0deg)    translateX(54px) rotate(0deg);    }
    to   { transform: rotate(360deg)  translateX(54px) rotate(-360deg); }
  }
  @keyframes orbit2 {
    from { transform: rotate(120deg)  translateX(70px) rotate(-120deg); }
    to   { transform: rotate(480deg)  translateX(70px) rotate(-480deg); }
  }
  @keyframes orbit3 {
    from { transform: rotate(240deg)  translateX(88px) rotate(-240deg); }
    to   { transform: rotate(600deg)  translateX(88px) rotate(-600deg); }
  }
  @keyframes border-spin {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }

  /* ── Base ── */
  body { background: var(--bg); }

  .page {
    min-height: 100vh;
    background: var(--bg);
    color: var(--txt);
    font-family: var(--font-sans);
    overflow-x: hidden;
  }

  /* ── Typography helpers ── */
  .syne  { font-family: var(--font-syne) !important; }
  .mono  { font-family: var(--font-mono) !important; }

  .grad {
    background: linear-gradient(135deg, var(--blue2) 0%, var(--blue) 35%, var(--purple) 70%, var(--cyan) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 5s linear infinite;
  }

  /* ── Reveal ── */
  .reveal {
    opacity: 0;
    animation: float-up .7s cubic-bezier(.22,1,.36,1) forwards;
  }

  /* ── Badge ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 16px;
    border-radius: 9999px;
    border: 1px solid rgba(99,102,241,.25);
    background: rgba(99,102,241,.08);
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(147,151,255,.85);
  }

  /* ── Glass card ── */
  .glass {
    background: rgba(15,15,32,.7);
    border: 1px solid var(--bdr);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
    transition: var(--transition);
  }
  .glass::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,rgba(99,102,241,.04) 0%,transparent 55%);
    pointer-events: none;
    border-radius: inherit;
  }
  .glass:hover {
    border-color: var(--bdr-hover);
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0,0,0,.4), 0 0 0 1px rgba(99,102,241,.12);
  }

  /* ── Stat card ── */
  .stat-card {
    padding: 28px 24px;
    text-align: center;
    border-radius: var(--radius-lg);
    border: 1px solid var(--bdr);
    background: var(--surf);
    position: relative;
    overflow: hidden;
    transition: var(--transition);
  }
  .stat-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg,transparent,var(--blue),var(--purple),transparent);
    opacity: 0;
    transition: opacity .3s;
  }
  .stat-card:hover::after   { opacity: 1; }
  .stat-card:hover          { border-color: var(--bdr-hover); transform: translateY(-3px); }
  .stat-card h3             { font-size: 36px; font-weight: 800; color: var(--txt); line-height: 1; margin-bottom: 6px; }
  .stat-card p              { font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted-sm); }

  /* ── Team card ── */
  .team-card {
    padding: 32px 28px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--bdr);
    background: var(--surf);
    position: relative;
    overflow: hidden;
    transition: var(--transition);
  }
  .team-card:hover {
    border-color: var(--bdr-hover);
    transform: translateY(-6px);
    box-shadow: 0 24px 56px rgba(0,0,0,.45), 0 0 40px rgba(99,102,241,.08);
  }
  .team-card .top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    opacity: .7;
  }
  .team-card .avatar {
    width: 62px; height: 62px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-syne);
    font-weight: 800;
    font-size: 18px;
    color: white;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }
  .team-card h3             { font-size: 22px; font-weight: 800; color: var(--txt); margin-bottom: 4px; position: relative; z-index: 1; }
  .team-card .roll          { font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted-sm); margin-bottom: 10px; position: relative; z-index: 1; }
  .team-card .role-pill     { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 9999px; background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.2); margin-bottom: 14px; position: relative; z-index: 1; }
  .team-card .role-pill span{ font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: #818cf8; }
  .team-card .focus         { font-size: 13px; color: var(--muted-sm); line-height: 1.7; position: relative; z-index: 1; }

  /* ── Instructor card ── */
  .instructor-card {
    margin-top: 36px;
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    padding: 28px 30px;
    background: linear-gradient(145deg, rgba(15,23,42,.96), rgba(30,41,59,.92));
    border: 1px solid rgba(99,102,241,.22);
    box-shadow: 0 10px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04);
    display: flex;
    align-items: center;
    gap: 22px;
    backdrop-filter: blur(14px);
  }
  .instructor-card .icon-wrap {
    width: 72px; height: 72px;
    min-width: 72px;
    border-radius: 22px;
    background: linear-gradient(135deg, var(--blue) 0%, #8b5cf6 45%, var(--purple) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 30px rgba(99,102,241,.35), inset 0 1px 0 rgba(255,255,255,.18);
    position: relative;
    z-index: 2;
    flex-shrink: 0;
  }
  .instructor-card .content { position: relative; z-index: 2; flex: 1; }
  .instructor-card h3       { font-size: 28px; line-height: 1.1; font-weight: 800; color: #f8fafc; letter-spacing: -.03em; }
  .instructor-card p        { margin-top: 10px; margin-bottom: 16px; font-size: 14.5px; line-height: 1.75; color: rgba(226,232,240,.72); max-width: 700px; }
  .instructor-card .meta-row{ display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
  .instructor-card .meta-pill{ padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.06); color: rgba(241,245,249,.8); font-size: 12px; font-weight: 500; }
  .instructor-card .email-link {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 11px 18px; border-radius: 14px;
    background: linear-gradient(135deg,rgba(99,102,241,.18),rgba(167,139,250,.18));
    border: 1px solid rgba(167,139,250,.24);
    color: #d8d4ff;
    text-decoration: none;
    font-size: 13px; font-weight: 600;
    transition: var(--transition);
  }
  .instructor-card .email-link:hover {
    background: linear-gradient(135deg,rgba(99,102,241,.28),rgba(167,139,250,.28));
  }
  .instructor-card .course-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 12px; border-radius: 999px;
    background: rgba(99,102,241,.12); border: 1px solid rgba(99,102,241,.18);
    color: #b8b9ff; font-size: 10px; letter-spacing: .16em; text-transform: uppercase;
    margin-bottom: 14px; font-weight: 600;
  }
  .instructor-card .course-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #8b5cf6; box-shadow: 0 0 12px #8b5cf6;
  }

  /* ── Nav ── */
  .navbar {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 50;
    transition: var(--transition);
  }
  .navbar.scrolled {
    background: rgba(4,4,13,.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--bdr);
  }
  .navbar-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 18px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    background: none; border: none; cursor: pointer;
  }
  .nav-logo-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, var(--blue), var(--purple));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 24px rgba(99,102,241,.4);
    animation: pulse-glow 4s ease-in-out infinite;
  }
  .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  .nav-link {
    background: none; border: none; cursor: pointer;
    font-size: 13.5px; font-family: var(--font-sans);
    color: var(--muted-sm); transition: color .2s;
    padding-bottom: 2px;
  }
  .nav-link:hover  { color: var(--txt); }
  .nav-link.active { color: #c7d2fe; border-bottom: 1px solid rgba(99,102,241,.5); }
  .nav-login {
    padding: 9px 22px; border-radius: var(--radius-sm);
    background: rgba(99,102,241,.12); border: 1px solid rgba(99,102,241,.22);
    color: #c7d2fe; font-family: var(--font-sans); font-size: 13.5px; font-weight: 500;
    cursor: pointer; transition: background .25s;
  }
  .nav-login:hover { background: rgba(99,102,241,.22); }

  /* ── Spin button ── */
  .btn-spin-wrap {
    position: relative; display: inline-flex;
  }
  .btn-spin-wrap::before {
    content: '';
    position: absolute; inset: -2px;
    border-radius: 18px;
    background: conic-gradient(from 0deg, transparent 270deg, var(--blue), var(--purple), transparent);
    animation: border-spin 3s linear infinite;
    opacity: .7;
  }
  .btn-spin-inner {
    position: relative; z-index: 1;
    padding: 14px 32px; border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--blue), var(--purple));
    color: white; font-family: var(--font-syne);
    font-weight: 700; font-size: 15px;
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; border: none;
    transition: opacity .2s, transform .15s;
    box-shadow: 0 0 28px rgba(99,102,241,.35);
  }
  .btn-spin-inner:hover { opacity: .92; transform: scale(1.02); }

  /* ── Orbit ── */
  .orbit-wrap {
    position: relative; width: 200px; height: 200px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .orbit-ring {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(99,102,241,.15);
  }
  .orbit-center {
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, var(--blue), var(--purple));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 32px rgba(99,102,241,.5);
    z-index: 1; position: relative;
    animation: pulse-glow 3s ease-in-out infinite;
  }
  .orbit-dot-wrapper {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .orbit-dot {
    width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── Section layout ── */
  .section          { position: relative; z-index: 10; padding: 80px 28px; }
  .section-sm       { position: relative; z-index: 10; padding: 72px 28px; }
  .section-hero     { position: relative; z-index: 10; padding: 172px 28px 80px; text-align: center; }
  .section-cta      { position: relative; z-index: 10; padding: 80px 28px 100px; }
  .section-footer   { position: relative; z-index: 10; }

  .container        { max-width: 1100px; margin: 0 auto; }
  .container-md     { max-width: 960px;  margin: 0 auto; }
  .container-sm     { max-width: 760px;  margin: 0 auto; }
  .container-team   { max-width: 900px;  margin: 0 auto; }

  .section-label    { text-align: center; margin-bottom: 52px; }
  .section-label .badge { margin-bottom: 16px; }
  .section-h2       { font-size: clamp(28px,4vw,46px); font-weight: 800; line-height: 1.15; }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg,transparent,var(--bdr-hover) 30%,var(--bdr-hover) 70%,transparent);
  }

  /* ── Timeline ── */
  .timeline         { position: relative; }
  .timeline-line    { position: absolute; left: 4px; top: 8px; bottom: 8px; width: 1px; background: linear-gradient(to bottom,var(--blue),var(--purple),transparent); }
  .timeline-list    { display: flex; flex-direction: column; gap: 28px; padding-left: 32px; }
  .timeline-item    { position: relative; display: flex; gap: 16px; align-items: flex-start; }
  .timeline-dot     { position: absolute; left: -28px; width: 10px; height: 10px; border-radius: 50%; background: var(--blue); box-shadow: 0 0 12px rgba(99,102,241,.7); flex-shrink: 0; margin-top: 5px; }
  .timeline-card    { flex: 1; padding: 16px 20px; border-radius: 12px; background: var(--surf); border: 1px solid var(--bdr); transition: border-color .3s; }
  .timeline-card:hover { border-color: var(--bdr-hover); }
  .timeline-card .label { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #818cf8; margin-bottom: 5px; }
  .timeline-card p      { font-size: 13.5px; color: var(--muted); line-height: 1.6; }

  /* ── Tech stack ── */
  .tech-pill {
    padding: 8px 18px; border-radius: 9999px;
    font-family: var(--font-mono); font-size: 11.5px; font-weight: 500;
    letter-spacing: .04em; transition: var(--transition);
  }

  /* ── Feature card ── */
  .feature-icon-wrap {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .feature-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--txt); }
  .feature-card p  { color: var(--muted-sm); line-height: 1.78; font-size: 14px; }

  /* ── CTA box ── */
  .cta-box {
    text-align: center; padding: 60px 48px;
    border-radius: var(--radius-xl);
    background: linear-gradient(135deg,rgba(99,102,241,.06),rgba(167,139,250,.06));
    border: 1px solid rgba(99,102,241,.18);
    position: relative; overflow: hidden;
  }
  .cta-box h2 { font-size: clamp(24px,3.5vw,38px); font-weight: 800; margin-bottom: 14px; line-height: 1.2; }
  .cta-box p  { color: var(--muted-sm); font-size: 15px; margin-bottom: 36px; line-height: 1.75; }

  /* ── Footer ── */
  footer            { border-top: 1px solid rgba(99,102,241,.12); }
  .footer-inner     { max-width: 1160px; margin: 0 auto; padding: 64px 28px 40px; }
  .footer-grid      { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 56px; }
  .footer-brand p   { color: var(--muted-sm); font-size: 13.5px; line-height: 1.8; max-width: 260px; margin-top: 12px; }
  .footer-col h4    { font-weight: 700; font-size: 14px; color: var(--txt); margin-bottom: 18px; }
  .footer-links     { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .footer-link      { background: none; border: none; cursor: pointer; font-family: var(--font-sans); font-size: 13.5px; color: var(--muted-sm); transition: color .2s; text-align: left; }
  .footer-link:hover{ color: var(--txt); }
  .footer-bottom    { border-top: 1px solid rgba(99,102,241,.1); padding-top: 28px; display: flex; align-items: center; justify-content: space-between; }
  .footer-bottom p  { font-size: 11px; color: rgba(210,210,240,.3); }
  .footer-legal     { display: flex; gap: 24px; }

  /* ── Background ── */
  .bg-layer         { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .bg-orb           { position: absolute; border-radius: 50%; filter: blur(20px); }
  .bg-grid          { position: absolute; inset: 0; opacity: .018; background-image: linear-gradient(rgba(99,102,241,1) 1px,transparent 1px), linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px); background-size: 52px 52px; }
  .bg-topline       { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,transparent,rgba(99,102,241,.5),rgba(167,139,250,.5),transparent); }
  .bg-scanline      { position: absolute; left: 0; right: 0; height: 200px; background: linear-gradient(to bottom,transparent,rgba(99,102,241,.012),transparent); animation: scanline 14s linear infinite; }
  .noise            { position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: .022; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 160px; }
  .cursor-glow      { position: fixed; pointer-events: none; z-index: 1; transform: translate(-50%,-50%); width: 380px; height: 380px; border-radius: 50%; background: radial-gradient(circle,rgba(99,102,241,.045) 0%,transparent 70%); transition: left .12s, top .12s; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .footer-grid   { grid-template-columns: 1fr 1fr; }
    .stats-grid    { grid-template-columns: repeat(2,1fr) !important; }
    .features-grid { grid-template-columns: 1fr !important; }
    .team-grid     { grid-template-columns: 1fr !important; }
    .instructor-card { flex-direction: column; }
  }
  @media (max-width: 640px) {
    .navbar-inner  { padding: 14px 16px; }
    .nav-links     { display: none; }
    .section       { padding: 60px 16px; }
    .section-hero  { padding: 120px 16px 60px; }
    .footer-grid   { grid-template-columns: 1fr; }
    .cta-box       { padding: 40px 24px; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "About", path: "/about" },
  { label: "Features", path: "/features" },
  { label: "Workflow", path: "/workflow" },
  { label: "Pricing", path: "/pricing" },
  { label: "Enterprise", path: "/enterprise" },
];

const STATS = [
  {
    value: 12,
    suffix: "+",
    label: "AI Modules",
    icon: <Cpu size={18} color="#6366f1" />,
  },
  {
    value: 25,
    suffix: "+",
    label: "UI Screens",
    icon: <Layers size={18} color="#a78bfa" />,
  },
  {
    value: 4,
    suffix: "th",
    label: "Semester",
    icon: <GraduationCap size={18} color="#22d3ee" />,
  },
  {
    value: 2,
    suffix: "",
    label: "Developers",
    icon: <Users size={18} color="#fbbf24" />,
  },
];

const FEATURES = [
  {
    icon: <Rocket size={22} color="#6366f1" />,
    accent: "#6366f1",
    title: "Project Vision",
    body: "Simulate a real-world production intelligence platform featuring AI scheduling, budget forecasting, and workflow automation — built to demonstrate fullstack database-driven design.",
  },
  {
    icon: <Database size={22} color="#a78bfa" />,
    accent: "#a78bfa",
    title: "DBMS Integration",
    body: "Schema-driven data models, relational queries, and backend-connected production pipelines — the backbone of a truly functional film management system.",
  },
  {
    icon: <Code2 size={22} color="#22d3ee" />,
    accent: "#22d3ee",
    title: "Engineering Focus",
    body: "Modular React architecture, reusable component systems, TypeScript-strict codebases, and responsive layouts built for real-world scalability.",
  },
];

const DEVS = [
  {
    name: "Abdul Basit",
    roll: "24108150",
    role: "Frontend Developer",
    focus: "UI Architecture · AI Integration · Component Systems",
    gradient: "linear-gradient(135deg,#6366f1,#4f8ef7)",
    glow: "rgba(99,102,241,.35)",
    initial: "AB",
  },
  // {
  //   name: "Hadiya Shahazad",
  //   roll: "24108168",
  //   role: "UI/UX Designer",
  //   focus: "Feature Design · Visual Systems · User Experience",
  //   gradient: "linear-gradient(135deg,#a78bfa,#ec4899)",
  //   glow: "rgba(167,139,250,.35)",
  //   initial: "HS",
  // },
];

const TIMELINE = [
  {
    label: "Spring 2026",
    note: "Project kickoff — requirement analysis & schema design",
  },
  {
    label: "Database Layer",
    note: "Entity-relationship modelling, normalization, SQL queries",
  },
  {
    label: "Frontend Build",
    note: "React + TypeScript component library, routing, state management",
  },
  {
    label: "AI Feature Layer",
    note: "Predictive analytics, scheduling engine, budget risk model",
  },
  {
    label: "Submission",
    note: "Submitted to  PFAi Lab & DBMS LAB, 4th Sem",
  },
];

const TECH_STACK = [
  { label: "React 18", c: "#61dafb" },
  { label: "TypeScript", c: "#3178c6" },
  { label: "Tailwind CSS", c: "#38bdf8" },
  { label: "Framer Motion", c: "#a78bfa" },
  { label: "Lucide Icons", c: "#6366f1" },
  { label: "React Router", c: "#f43f5e" },
  { label: "Recharts", c: "#22d3ee" },
  { label: "REST API", c: "#fbbf24" },
  { label: "SQL / DBMS", c: "#34d399" },
  { label: "Vite", c: "#646cff" },
];

const INSTRUCTOR = {
  name: "DBMS & PFAI Lab Instructor",
  bio: "Lecturer in the Department of Computer Science at SZABIST Islamabad.",
  // email: "qadeerasghar631@gmail.com",
  meta: [
    "Programming for Artificial intelligence Lab",
    "Database Management Systems Lab",
    "4th Semester",
    "Spring 2026",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Animated number counter triggered by IntersectionObserver */
const Counter = memo(
  ({ target, suffix = "" }: { target: number; suffix?: string }) => {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const ob = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          ob.disconnect();
          const dur = 1400;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            setVal(Math.round((1 - (1 - p) ** 3) * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        },
        { threshold: 0.5 },
      );
      ob.observe(el);
      return () => ob.disconnect();
    }, [target]);

    return (
      <span ref={ref}>
        {val}
        {suffix}
      </span>
    );
  },
);
Counter.displayName = "Counter";

/** Orbiting icons graphic */
const OrbitGraphic = memo(() => {
  const dots = [
    {
      icon: <Database size={10} color="white" />,
      anim: "orbit 5s linear infinite",
      bg: "#6366f1",
    },
    {
      icon: <Cpu size={10} color="white" />,
      anim: "orbit2 7s linear infinite",
      bg: "#22d3ee",
    },
    {
      icon: <Sparkles size={10} color="white" />,
      anim: "orbit3 9s linear infinite",
      bg: "#a78bfa",
    },
  ];

  return (
    <div className="orbit-wrap" aria-hidden="true">
      {[110, 140, 176].map((s, i) => (
        <div key={i} className="orbit-ring" style={{ width: s, height: s }} />
      ))}
      <div className="orbit-center">
        <Film size={24} color="white" />
      </div>
      {dots.map((d, i) => (
        <div key={i} className="orbit-dot-wrapper">
          <div
            className="orbit-dot"
            style={{
              background: d.bg,
              animation: d.anim,
              boxShadow: `0 0 10px ${d.bg}aa`,
            }}
          >
            {d.icon}
          </div>
        </div>
      ))}
    </div>
  );
});
OrbitGraphic.displayName = "OrbitGraphic";

/** Navbar */
const Navbar = memo(
  ({
    scrolled,
    onNavigate,
  }: {
    scrolled: boolean;
    onNavigate: (p: string) => void;
  }) => (
    <nav
      className={`navbar${scrolled ? " scrolled" : ""}`}
      aria-label="Main navigation"
    >
      <div className="navbar-inner">
        <button
          className="nav-logo syne"
          onClick={() => onNavigate("/")}
          aria-label="LuminaStudio home"
        >
          <div className="nav-logo-icon">
            <Film size={18} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#eeeef8" }}>
            Lumina<span style={{ color: "#818cf8" }}>Studio</span>
          </span>
        </button>

        <ul className="nav-links" role="list">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <button
                className={`nav-link${l.path === "/about" ? " active" : ""}`}
                onClick={() => onNavigate(l.path)}
                aria-current={l.path === "/about" ? "page" : undefined}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <button className="nav-login" onClick={() => onNavigate("/login")}>
          Login
        </button>
      </div>
    </nav>
  ),
);
Navbar.displayName = "Navbar";

/** Background layers */
const Background = memo(
  ({ mousePos }: { mousePos: { x: number; y: number } }) => (
    <>
      <div className="noise" aria-hidden="true" />
      <div
        className="cursor-glow"
        aria-hidden="true"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      <div className="bg-layer" aria-hidden="true">
        <div
          className="bg-orb"
          style={{
            top: -220,
            left: -180,
            width: 680,
            height: 680,
            background:
              "radial-gradient(circle,rgba(99,102,241,.07) 0%,transparent 65%)",
          }}
        />
        <div
          className="bg-orb"
          style={{
            bottom: -260,
            right: -220,
            width: 720,
            height: 720,
            background:
              "radial-gradient(circle,rgba(167,139,250,.06) 0%,transparent 65%)",
          }}
        />
        <div
          className="bg-orb"
          style={{
            top: "40%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 300,
            background:
              "radial-gradient(ellipse,rgba(34,211,238,.03) 0%,transparent 70%)",
            filter: "blur(24px)",
          }}
        />
        <div className="bg-grid" />
        <div className="bg-topline" />
        <div className="bg-scanline" />
      </div>
    </>
  ),
);
Background.displayName = "Background";

/** Section heading helper */
function SectionLabel({
  badge,
  icon,
  title,
}: {
  badge: string;
  icon: React.ReactNode;
  title: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <div className="badge" style={{ marginBottom: 16 }}>
        {icon}
        {badge}
      </div>
      <h2 className="syne section-h2">{title}</h2>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function About() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleNav = useCallback((path: string) => navigate(path), [navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onMouse = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className="page">
        <Background mousePos={mousePos} />
        <Navbar scrolled={scrolled} onNavigate={handleNav} />

        {/* ── HERO ── */}
        <section className="section-hero" aria-labelledby="hero-heading">
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div
              style={{ marginBottom: 28, animation: "fade-in .8s ease both" }}
            >
              <div className="badge">
                <GraduationCap size={12} />
                AI Lab · Spring 2026 · Sir Qadeer Asghar · 4th Semester · E-2-E
              </div>
            </div>

            <h1
              id="hero-heading"
              className="syne"
              style={{
                fontSize: "clamp(38px,7vw,76px)",
                fontWeight: 800,
                lineHeight: 1.06,
                marginBottom: 24,
                animation: "float-up .8s .1s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              About <span className="grad">LuminaStudio</span>
            </h1>

            <p
              style={{
                color: "rgba(210,210,240,.58)",
                fontSize: 18,
                lineHeight: 1.85,
                maxWidth: 620,
                margin: "0 auto 48px",
                animation: "float-up .8s .2s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              A futuristic AI-powered film production management system — built
              as a DBMS Lab academic project demonstrating real-world database
              design, frontend engineering, and intelligent analytics.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
                animation: "fade-in 1s .4s ease both",
              }}
            >
              <OrbitGraphic />
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── TEAM ── */}
        <section className="section" aria-labelledby="team-heading">
          <div className="container-team">
            <SectionLabel
              badge="The Team"
              icon={<Users size={12} />}
              title={<span id="team-heading">Developed By</span>}
            />

            <div
              className="team-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 22,
              }}
            >
              {DEVS.map((dev) => (
                <article key={dev.name} className="team-card">
                  <div
                    className="top-bar"
                    style={{ background: dev.gradient }}
                  />
                  <div
                    className="avatar"
                    style={{
                      background: dev.gradient,
                      boxShadow: `0 0 22px ${dev.glow}`,
                    }}
                  >
                    {dev.initial}
                  </div>
                  <h3 className="syne">{dev.name}</h3>
                  <p className="mono roll">{dev.roll}</p>
                  <div className="role-pill">
                    <span className="mono">{dev.role}</span>
                  </div>
                  <p className="focus">{dev.focus}</p>
                </article>
              ))}
            </div>

            {/* ── Instructor ── */}
            <div
              className="instructor-card"
              aria-label="Course instructor details"
            >
              {/* BG glows */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: -80,
                  right: -80,
                  width: 220,
                  height: 220,
                  background:
                    "radial-gradient(circle,#8b5cf655 0%,transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: -90,
                  left: -70,
                  width: 200,
                  height: 200,
                  background:
                    "radial-gradient(circle,#6366f144 0%,transparent 72%)",
                  pointerEvents: "none",
                }}
              />

              <div className="icon-wrap" aria-hidden="true">
                <Award size={30} color="white" strokeWidth={2.2} />
              </div>

              <div className="content">
                <div className="mono course-badge">
                  <span className="course-badge-dot" />
                  Course Instructor
                </div>
                <h3 className="syne">{INSTRUCTOR.name}</h3>
                <p>{INSTRUCTOR.bio}</p>
                <div className="meta-row">
                  {INSTRUCTOR.meta.map((item) => (
                    <span key={item} className="meta-pill">
                      {item}
                    </span>
                  ))}
                </div>
                {/* <a href={`mailto:${INSTRUCTOR.email}`} className="email-link">
                  <Mail size={15} />
                  {INSTRUCTOR.email}
                </a> */}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="section-sm" aria-label="Project statistics">
          <div className="container-md">
            <div
              className="stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="stat-card"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                    aria-hidden="true"
                  >
                    {s.icon}
                  </div>
                  <h3 className="syne">
                    <Counter target={s.value} suffix={s.suffix} />
                  </h3>
                  <p className="mono">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── FEATURES ── */}
        <section className="section" aria-labelledby="features-heading">
          <div className="container">
            <SectionLabel
              badge="Project Overview"
              icon={<BookOpen size={12} />}
              title={
                <span id="features-heading">
                  Built for <span className="grad">Real-World Impact</span>
                </span>
              }
            />
            <div
              className="features-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 20,
              }}
            >
              {FEATURES.map((f) => (
                <article
                  key={f.title}
                  className="glass feature-card"
                  style={{ padding: "32px 28px" }}
                >
                  <div
                    className="feature-icon-wrap"
                    style={{
                      background: `${f.accent}18`,
                      border: `1px solid ${f.accent}30`,
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="syne">{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── TIMELINE ── */}
        <section className="section" aria-labelledby="timeline-heading">
          <div className="container-sm">
            <SectionLabel
              badge="Development Journey"
              icon={<Star size={12} />}
              title={
                <span id="timeline-heading">
                  From Concept to <span className="grad">Submission</span>
                </span>
              }
            />
            <div className="timeline">
              <div className="timeline-line" aria-hidden="true" />
              <ol className="timeline-list" aria-label="Development timeline">
                {TIMELINE.map((item, i) => (
                  <li key={i} className="timeline-item">
                    <div className="timeline-dot" aria-hidden="true" />
                    <div className="timeline-card">
                      <p className="mono label">{item.label}</p>
                      <p>{item.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── TECH STACK ── */}
        <section className="section-sm" aria-label="Technology stack">
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div className="badge" style={{ marginBottom: 24 }}>
              <Code2 size={12} />
              Tech Stack
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                justifyContent: "center",
              }}
            >
              {TECH_STACK.map((t) => (
                <div
                  key={t.label}
                  className="tech-pill"
                  style={{
                    background: `${t.c}12`,
                    border: `1px solid ${t.c}30`,
                    color: t.c,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = `${t.c}22`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = `${t.c}12`)
                  }
                >
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── CTA ── */}
        <section className="section-cta" aria-labelledby="cta-heading">
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div className="cta-box">
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 400,
                  height: 200,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse,rgba(99,102,241,.08),transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div className="badge" style={{ marginBottom: 24 }}>
                <Sparkles size={12} />
                Explore LuminaStudio
              </div>
              <h2 id="cta-heading" className="syne">
                See the Full <span className="grad">Intelligence System</span>
              </h2>
              <p>
                Explore features, AI workflow, pricing modules, and enterprise
                capabilities of LuminaStudio.
              </p>
              <div className="btn-spin-wrap" style={{ margin: "0 auto" }}>
                <button
                  className="btn-spin-inner"
                  onClick={() => handleNav("/features")}
                  aria-label="Explore LuminaStudio features"
                >
                  Explore Features <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer>
          <div className="footer-inner">
            <div className="footer-grid">
              {/* Brand */}
              <div className="footer-brand">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: "linear-gradient(135deg,#6366f1,#a78bfa)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Film size={17} color="white" />
                  </div>
                  <span
                    className="syne"
                    style={{ fontSize: 18, fontWeight: 800 }}
                  >
                    Lumina<span style={{ color: "#818cf8" }}>Studio</span>
                  </span>
                </div>
                <p>
                  AI-powered production intelligence for the future of
                  filmmaking. A DBMS Lab project, Spring 2026.
                </p>
              </div>

              {/* Product links */}
              <nav className="footer-col" aria-label="Product pages">
                <h4 className="syne">Product</h4>
                <ul className="footer-links" role="list">
                  {[
                    ["About", "/about"],
                    ["Features", "/features"],
                    ["Workflow", "/workflow"],
                    ["Pricing", "/pricing"],
                  ].map(([label, path]) => (
                    <li key={label}>
                      <button
                        className="footer-link"
                        onClick={() => handleNav(path)}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Company */}
              <div className="footer-col">
                <h4 className="syne">Company</h4>
                <p style={{ color: "rgba(210,210,240,.42)", fontSize: 13.5 }}>
                  Powered by{" "}
                  <a
                    href="https://abdulbasit-archer.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="syne"
                    style={{
                      color: "#818cf8",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontSize: 16,
                    }}
                  >
                    Archer
                  </a>
                </p>
              </div>

              {/* Social */}
              <div className="footer-col">
                <h4 className="syne">Follow</h4>
                <p
                  className="mono"
                  style={{
                    fontSize: 10.5,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "rgba(210,210,240,.28)",
                  }}
                >
                  Coming Soon
                </p>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="mono">© 2026 LuminaStudio. All rights reserved.</p>
              <div className="footer-legal">
                {["Privacy Policy", "Terms of Service"].map((label) => (
                  <button
                    key={label}
                    className="footer-link"
                    style={{ fontSize: 12.5 }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
