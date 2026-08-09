import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/image.png";
import { Link } from "react-router-dom";


// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --bg:      #09090f;
    --surf1:   #0f0f1a;
    --surf2:   #141422;
    --surf3:   #1a1a2e;
    --bdr:     rgba(120,120,220,0.12);
    --bdr2:    rgba(120,120,220,0.26);
    --txt:     #e8e8f4;
    --muted:   rgba(200,200,240,0.45);
    --muted2:  rgba(200,200,240,0.28);
    --blue:    #4f8ef7;
    --blue2:   #6366f1;
    --purple:  #8b5cf6;
    --cyan:    #22d3ee;
    --amber:   #fbbf24;
    --red:     #f87171;

    --glow-blue:   rgba(79,142,247,0.18);
    --glow-purple: rgba(139,92,246,0.14);

    --font-sans: 'DM Sans', sans-serif;
    --font-syne: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;

    --radius-sm: 10px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --ease: cubic-bezier(.22,1,.36,1);
  }

  .ll * { box-sizing: border-box; margin: 0; padding: 0; }

  .ll {
    font-family: var(--font-sans);
    min-height: 100vh;
    background: var(--bg);
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
    position: relative;
  }

  /* ── GLOBAL AMBIENT ── */
  .ll::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 15% 50%, rgba(99,102,241,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 85% 20%, rgba(139,92,246,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 85% 80%, rgba(34,211,238,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ────────────────────────────────────────────────────────
     LEFT PANEL
  ──────────────────────────────────────────────────────── */
  .ll-left {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 48px 52px;
  }

  /* hero image */
  .ll-hero-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 1;
  }

  /* gradient overlays on top of image */
  .ll-left-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background:
      linear-gradient(to top,   rgba(9,9,15,0.96) 0%, rgba(9,9,15,0.55) 45%, rgba(9,9,15,0.2) 100%),
      linear-gradient(to right, rgba(9,9,15,0.0)  60%, rgba(9,9,15,0.85) 100%);
  }

  /* subtle blue tint overlay */
  .ll-left-tint {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: rgba(79,142,247,0.06);
    mix-blend-mode: screen;
  }

  /* scan-line texture */
  .ll-scanlines {
    position: absolute;
    inset: 0;
    z-index: 3;
    background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.06) 2px,
      rgba(0,0,0,0.06) 4px
    );
    pointer-events: none;
  }

  /* vignette corners */
  .ll-vignette {
    position: absolute;
    inset: 0;
    z-index: 3;
    box-shadow: inset 0 0 120px rgba(9,9,15,0.6);
    pointer-events: none;
  }

  /* edge accent lines */
  .ll-left-frame {
    position: absolute;
    inset: 24px;
    z-index: 4;
    border: 1px solid rgba(99,102,241,0.12);
    border-radius: var(--radius-lg);
    pointer-events: none;
  }
  .ll-left-frame::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: var(--radius-lg);
    background: linear-gradient(
      135deg,
      rgba(99,102,241,0.22) 0%,
      transparent 40%,
      transparent 60%,
      rgba(139,92,246,0.14) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    padding: 1px;
  }

  /* corner ticks on the frame */
  .ll-frame-tick {
    position: absolute;
    width: 20px;
    height: 20px;
  }
  .ll-frame-tick--tl { top: -1px; left: -1px; border-top: 2px solid var(--blue); border-left: 2px solid var(--blue); border-radius: 4px 0 0 0; }
  .ll-frame-tick--tr { top: -1px; right: -1px; border-top: 2px solid var(--purple); border-right: 2px solid var(--purple); border-radius: 0 4px 0 0; }
  .ll-frame-tick--bl { bottom: -1px; left: -1px; border-bottom: 2px solid var(--blue); border-left: 2px solid var(--blue); border-radius: 0 0 0 4px; }
  .ll-frame-tick--br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--purple); border-right: 2px solid var(--purple); border-radius: 0 0 4px 0; }

  /* top status bar */
  .ll-statusbar {
    position: absolute;
    top: 40px;
    left: 52px;
    right: 52px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ll-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ll-brand-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--blue2) 0%, var(--purple) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(99,102,241,0.4);
  }
  .ll-brand-name {
    font-family: var(--font-syne);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--txt);
  }
  .ll-brand-name span {
    background: linear-gradient(90deg, var(--blue), var(--purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .ll-badge {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--cyan);
    padding: 5px 12px;
    border: 1px solid rgba(34,211,238,0.2);
    border-radius: 100px;
    background: rgba(34,211,238,0.05);
    backdrop-filter: blur(8px);
  }

  /* copy area */
  .ll-copy {
    position: relative;
    z-index: 10;
  }

  .ll-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 16px;
  }
  .ll-eyebrow-line {
    width: 32px;
    height: 1px;
    background: linear-gradient(90deg, var(--blue), transparent);
  }

  .ll-headline {
    font-family: var(--font-syne);
    font-size: clamp(44px, 5.5vw, 72px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.02em;
    color: var(--txt);
    margin-bottom: 18px;
  }
  .ll-headline-accent {
    display: block;
    background: linear-gradient(90deg, var(--blue) 0%, var(--purple) 60%, var(--cyan) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ll-tagline {
    font-size: 13.5px;
    color: var(--muted);
    line-height: 1.75;
    max-width: 300px;
    font-weight: 300;
  }

  .ll-meta {
    margin-top: 28px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .ll-meta-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .ll-meta-val {
    font-family: var(--font-syne);
    font-size: 22px;
    font-weight: 700;
    color: var(--txt);
    line-height: 1;
  }
  .ll-meta-val span {
    font-size: 14px;
    background: linear-gradient(90deg, var(--blue), var(--cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .ll-meta-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted2);
  }
  .ll-meta-sep {
    width: 1px;
    height: 32px;
    background: var(--bdr2);
  }

  /* progress bar at bottom */
  .ll-progress {
    position: absolute;
    bottom: 24px;
    left: 52px;
    right: 52px;
    z-index: 10;
    height: 2px;
    background: rgba(79,142,247,0.1);
    border-radius: 100px;
    overflow: hidden;
  }
  .ll-progress-bar {
    height: 100%;
    width: 35%;
    background: linear-gradient(90deg, var(--blue2), var(--purple), var(--cyan));
    border-radius: 100px;
    animation: ll-progress 3s ease-in-out infinite;
  }
  @keyframes ll-progress {
    0%   { transform: translateX(-120%); }
    100% { transform: translateX(380%); }
  }

  /* ────────────────────────────────────────────────────────
     RIGHT PANEL
  ──────────────────────────────────────────────────────── */
  .ll-right {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    background: transparent;
  }
  .ll-right::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 560px; height: 560px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%);
    pointer-events: none;
  }

  .ll-divider {
    position: absolute;
    left: 0; top: 64px; bottom: 64px;
    width: 1px;
    background: linear-gradient(to bottom,
      transparent 0%,
      rgba(99,102,241,0.3) 25%,
      rgba(139,92,246,0.3) 75%,
      transparent 100%
    );
  }

  /* ────────────────────────────────────────────────────────
     CARD
  ──────────────────────────────────────────────────────── */
  .ll-card {
    width: 100%;
    max-width: 400px;
    position: relative;
    z-index: 10;
    padding: 40px;
    background: rgba(15,15,26,0.7);
    border: 1px solid var(--bdr);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(99,102,241,0.06) inset,
      0 32px 64px rgba(0,0,0,0.4),
      0 0 80px rgba(99,102,241,0.05);
  }

  /* card corner accents */
  .ll-c {
    position: absolute;
    width: 18px; height: 18px;
    pointer-events: none;
  }
  .ll-c-tl { top: -1px; left: -1px; border-top: 1.5px solid var(--blue2); border-left: 1.5px solid var(--blue2); border-radius: 4px 0 0 0; }
  .ll-c-tr { top: -1px; right: -1px; border-top: 1.5px solid var(--purple); border-right: 1.5px solid var(--purple); border-radius: 0 4px 0 0; }
  .ll-c-bl { bottom: -1px; left: -1px; border-bottom: 1.5px solid var(--blue2); border-left: 1.5px solid var(--blue2); border-radius: 0 0 0 4px; }
  .ll-c-br { bottom: -1px; right: -1px; border-bottom: 1.5px solid var(--purple); border-right: 1.5px solid var(--purple); border-radius: 0 0 4px 0; }

  /* form header */
  .ll-form-hd { margin-bottom: 32px; }
  .ll-form-overline {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    background: linear-gradient(90deg, var(--blue), var(--cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 10px;
    display: block;
  }
  .ll-form-title {
    font-family: var(--font-syne);
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--txt);
    line-height: 1;
    margin-bottom: 8px;
  }
  .ll-form-sub {
    font-size: 13px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.6;
  }

  /* ── Inputs ── */
  .ll-field { position: relative; margin-bottom: 14px; }
  .ll-field-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(79,142,247,0.7);
    margin-bottom: 7px;
    transition: color 0.2s;
  }
  .ll-field:focus-within .ll-field-label { color: var(--blue); }

  .ll-input-wrap { position: relative; }

  .ll-input {
    width: 100%;
    height: 50px;
    padding: 0 44px 0 16px;
    background: rgba(20,20,34,0.8);
    border: 1px solid var(--bdr);
    border-radius: var(--radius-sm);
    color: var(--txt);
    font-family: var(--font-sans);
    font-size: 14.5px;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    caret-color: var(--blue);
    -webkit-appearance: none;
  }
  .ll-input::placeholder { color: var(--muted2); }
  .ll-input:focus {
    border-color: rgba(99,102,241,0.4);
    background: rgba(26,26,46,0.9);
    box-shadow:
      0 0 0 3px rgba(99,102,241,0.08),
      inset 0 0 0 1px rgba(99,102,241,0.06);
  }
  .ll-input:disabled { opacity: 0.4; cursor: not-allowed; }

  .ll-input-glow {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--blue), var(--purple));
    border-radius: 2px 0 0 2px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .ll-field:focus-within .ll-input-glow { opacity: 1; }

  .ll-pw-toggle {
    position: absolute;
    right: 13px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--muted2);
    display: flex; align-items: center;
    transition: color 0.2s;
    padding: 4px;
  }
  .ll-pw-toggle:hover { color: var(--blue); }

  /* ── Error ── */
  .ll-error {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 14px; border-radius: var(--radius-sm);
    background: rgba(248,113,113,0.06);
    border: 1px solid rgba(248,113,113,0.2);
    color: var(--red);
    font-family: var(--font-mono);
    font-size: 11px; letter-spacing: 0.04em;
    overflow: hidden;
    margin-bottom: 12px;
  }

  /* ── Submit ── */
  .ll-submit-wrap { margin-top: 22px; }
  .ll-submit {
    width: 100%; height: 52px;
    border: none;
    border-radius: var(--radius-sm);
    background: linear-gradient(135deg, var(--blue2) 0%, var(--blue) 50%, var(--purple) 100%);
    background-size: 200% 100%;
    color: #fff;
    font-family: var(--font-syne);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.06em;
    cursor: pointer;
    position: relative; overflow: hidden;
    transition: background-position 0.4s var(--ease), box-shadow 0.3s, opacity 0.2s;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 32px rgba(99,102,241,0.3), 0 4px 16px rgba(0,0,0,0.3);
  }
  .ll-submit:hover {
    background-position: 100% 0;
    box-shadow: 0 0 48px rgba(99,102,241,0.45), 0 8px 24px rgba(0,0,0,0.3);
  }
  .ll-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    pointer-events: none;
  }
  .ll-submit:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
  .ll-submit-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; }

  .ll-spin {
    width: 15px; height: 15px;
    border: 1.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ll-spin 0.7s linear infinite;
  }
  @keyframes ll-spin { to { transform: rotate(360deg); } }

  /* ── Footer status ── */
  .ll-foot {
    margin-top: 24px;
    display: flex; align-items: center; gap: 12px;
    font-family: var(--font-mono);
    font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--muted2);
  }
  .ll-foot::before, .ll-foot::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, var(--bdr2), transparent);
  }
  .ll-foot-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--blue);
    box-shadow: 0 0 6px var(--blue);
    animation: ll-pulse 2s ease-in-out infinite;
  }
  @keyframes ll-pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--blue); }
    50%       { opacity: 0.4; box-shadow: 0 0 2px var(--blue); }
  }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .ll { grid-template-columns: 1fr; }
    .ll-left { display: none; }
    .ll-right { padding: 32px 20px; min-height: 100vh; }
    .ll-divider { display: none; }
    .ll-card { padding: 32px 24px; }
  }
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Login() {
  // ── ALL STATE & LOGIC: completely untouched ──
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [mouse,        setMouse]        = useState({ x: 0, y: 0 });

  const { login } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    const move = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/welcome");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };
  // ── END untouched logic ──

  const leftRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ y: 0 });
  useEffect(() => {
    const el = leftRef.current;
    if (!el) return;
    const { top, height } = el.getBoundingClientRect();
    setParallax({ y: (mouse.y - (top + height / 2)) / height * 8 });
  }, [mouse]);

  return (
    <>
      <style>{CSS}</style>
      <div className="ll">

        {/* ── LEFT: cinematic image panel ── */}
        <div className="ll-left" ref={leftRef}>

          {/* hero image with parallax */}
          <motion.img
            src={heroBg}
            alt=""
            className="ll-hero-img"
            aria-hidden="true"
            animate={{ y: parallax.y * 0.6, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />

          {/* overlays */}
          <div className="ll-left-overlay" aria-hidden="true" />
          <div className="ll-left-tint"    aria-hidden="true" />
          <div className="ll-scanlines"    aria-hidden="true" />
          <div className="ll-vignette"     aria-hidden="true" />

          {/* decorative frame */}
          <div className="ll-left-frame" aria-hidden="true">
            <div className="ll-frame-tick ll-frame-tick--tl" />
            <div className="ll-frame-tick ll-frame-tick--tr" />
            <div className="ll-frame-tick ll-frame-tick--bl" />
            <div className="ll-frame-tick ll-frame-tick--br" />
          </div>

          {/* top brand + badge */}
          <motion.div
            className="ll-statusbar"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
           <Link to="/" className="ll-brand">
  <div className="ll-brand-icon">
    <Film size={18} color="#fff" strokeWidth={2.2} />
  </div>

  <span className="ll-brand-name">
    Lumina<span>Studio</span>
  </span>
</Link>
            <span className="ll-badge">AI Production Suite</span>
          </motion.div>

          {/* hero copy */}
          <motion.div
            className="ll-copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.75, ease: [0.22,1,0.36,1] }}
          >
            <div className="ll-eyebrow">
              <span className="ll-eyebrow-line" />
              Next-Gen Film Production
            </div>

            <h1 className="ll-headline">
              Where<br />Stories<br />
              <span className="ll-headline-accent">Come Alive</span>
            </h1>

            <p className="ll-tagline">
              Manage productions, crews, and budgets with intelligence built for the modern studio.
            </p>

            {/* <div className="ll-meta">
              <div className="ll-meta-item">
                <div className="ll-meta-val">2.4K<span>+</span></div>
                <div className="ll-meta-label">Productions</div>
              </div>
              <div className="ll-meta-sep" />
              <div className="ll-meta-item">
                <div className="ll-meta-val">98<span>%</span></div>
                <div className="ll-meta-label">On-Time Rate</div>
              </div>
              <div className="ll-meta-sep" />
              <div className="ll-meta-item">
                <div className="ll-meta-val">40<span>+</span></div>
                <div className="ll-meta-label">Countries</div>
              </div>
            </div> */}
          </motion.div>

          {/* bottom progress glow */}
          <div className="ll-progress" aria-hidden="true">
            <div className="ll-progress-bar" />
          </div>
        </div>

        {/* ── RIGHT: form ── */}
        <div className="ll-right">
          <div className="ll-divider" aria-hidden="true" />

          <motion.div
            className="ll-card"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.65, ease: [0.22,1,0.36,1] }}
          >
            {/* corner accents */}
            {(["tl","tr","bl","br"] as const).map(c => (
              <div key={c} className={`ll-c ll-c-${c}`} aria-hidden="true" />
            ))}

            {/* header */}
            <div className="ll-form-hd">
              <motion.span
                className="ll-form-overline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Studio Access
              </motion.span>
              <motion.h2
                className="ll-form-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                Sign In
              </motion.h2>
              <motion.p
                className="ll-form-sub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Enter your credentials to access the production suite.
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              <motion.div
                className="ll-field"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label className="ll-field-label" htmlFor="ll-email">Email address</label>
                <div className="ll-input-wrap">
                  <div className="ll-input-glow" aria-hidden="true" />
                  <input
                    id="ll-email"
                    className="ll-input"
                    type="email"
                    placeholder="you@studio.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </motion.div>

              <motion.div
                className="ll-field"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62 }}
              >
                <label className="ll-field-label" htmlFor="ll-password">Password</label>
                <div className="ll-input-wrap">
                  <div className="ll-input-glow" aria-hidden="true" />
                  <input
                    id="ll-password"
                    className="ll-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="ll-pw-toggle"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="ll-error"
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{    opacity: 0, height: 0 }}
                  >
                    <AlertCircle size={13} aria-hidden="true" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="ll-submit-wrap"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  type="submit"
                  className="ll-submit"
                  disabled={loading}
                  whileTap={{ scale: loading ? 1 : 0.975 }}
                >
                  <span className="ll-submit-inner">
                    {loading
                      ? <><div className="ll-spin" aria-hidden="true" /> Authenticating</>
                      : <>Enter Studio <ArrowRight size={16} aria-hidden="true" /></>
                    }
                  </span>
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              className="ll-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              <span className="ll-foot-dot" />
              {loading ? "verifying identity" : "encrypted · secure · ai-protected"}
            </motion.div>
          </motion.div>
        </div>

      </div>
    </>
  );
}