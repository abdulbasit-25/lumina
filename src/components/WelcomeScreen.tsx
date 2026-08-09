// // import { motion } from "framer-motion";
// // import { useEffect, useState } from "react";
// // import { useAuth } from "@/contexts/AuthContext";
// // import { useNavigate } from "react-router-dom";

// // type Props = {
// //   username: string;
// //   email: string;
// //   password: string;
// // };

// // const LOGS = [
// //   "Verifying identity...",
// //   "Validating security tokens...",
// //   "Establishing encrypted session...",
// //   "Integrity check passed.",
// //   "Authentication successful.",
// // ];

// // export default function WelcomeScreen({ username, email, password }: Props) {
// //   const [logs, setLogs] = useState<string[]>([]);
// //   const [progress, setProgress] = useState(0);
// //   const [complete, setComplete] = useState(false);
// //   const [countdown, setCountdown] = useState(6);

// //   const { login } = useAuth();
// //   const navigate = useNavigate();

// //   // Log sequence
// //   useEffect(() => {
// //     let i = 0;

// //     const interval = setInterval(() => {
// //       setLogs((prev) => [...prev, LOGS[i]]);
// //       setProgress(((i + 1) / LOGS.length) * 100);

// //       i++;
// //       if (i === LOGS.length) {
// //         clearInterval(interval);
// //         setComplete(true);
// //       }
// //     }, 900);

// //     return () => clearInterval(interval);
// //   }, []);

// //   // Countdown
// //   useEffect(() => {
// //     if (!complete) return;

// //     const timer = setInterval(() => {
// //       setCountdown((prev) => {
// //         if (prev <= 1) {
// //           clearInterval(timer);
// //           // Perform login and navigate
// //           (async () => {
// //             const success = await login(email, password);
// //             if (success) {
// //               navigate("/dashboard");
// //             }
// //           })();
// //         }
// //         return prev - 1;
// //       });
// //     }, 1000);

// //     return () => clearInterval(timer);
// //   }, [complete, email, password, login, navigate]);

// //   return (
// //     <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden px-4">

// //       {/* Background blobs */}
// //       <div className="absolute w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-gradient-neon/5 blur-[150px] rounded-full top-[-200px] left-[-150px]" />
// //       <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-subtle blur-[150px] rounded-full bottom-[-150px] right-[-100px]" />

// //       {/* Grid */}
// //       <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(var(--neon-blue)_1px,transparent_1px),linear-gradient(90deg,var(--neon-blue)_1px,transparent_1px)] bg-[size:40px_40px]" />

// //       {/* Main Card */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 30, scale: 0.96 }}
// //         animate={{ opacity: 1, y: 0, scale: 1 }}
// //         className="relative w-full max-w-md sm:max-w-lg rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 sm:p-10 shadow-2xl"
// //       >
// //         {/* Scan line */}
// //         <motion.div
// //           animate={{ y: ["-100%", "100%"] }}
// //           transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
// //           className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent"
// //         />

// //         {/* Top Row */}
// //         <div className="flex justify-between items-center mb-6">
// //           <div className="flex items-center gap-2 text-success text-xs font-mono border border-success/30 px-3 py-1 rounded-full bg-success/10">
// //             <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
// //             SECURE SESSION
// //           </div>
// //           <div className="text-xs text-muted-foreground font-mono">
// //             {new Date().toLocaleTimeString([], {
// //               hour: "2-digit",
// //               minute: "2-digit",
// //             })}
// //           </div>
// //         </div>

// //         {/* Progress Ring */}
// //         <div className="flex justify-center mb-6 relative">
// //           <div className="relative w-28 h-28 sm:w-32 sm:h-32">
// //             <svg className="w-full h-full -rotate-90">
// //               <circle
// //                 cx="50%"
// //                 cy="50%"
// //                 r="45"
// //                 stroke="rgba(255,255,255,0.08)"
// //                 strokeWidth="6"
// //                 fill="none"
// //               />
// //               <motion.circle
// //                 cx="50%"
// //                 cy="50%"
// //                 r="45"
// //                 stroke="url(#progressGradient)"
// //                 strokeWidth="6"
// //                 fill="none"
// //                 strokeDasharray={283}
// //                 strokeDashoffset={283 - (progress / 100) * 283}
// //                 strokeLinecap="round"
// //               />
// //               <defs>
// //                 <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
// //                   <stop offset="0%" stopColor="hsl(var(--neon-blue))" />
// //                   <stop offset="100%" stopColor="hsl(var(--neon-purple))" />
// //                 </linearGradient>
// //               </defs>
// //             </svg>

// //             {/* Shield */}
// //             <div className="absolute inset-0 flex items-center justify-center text-2xl">
// //               {complete ? "✅" : "🔒"}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Titles */}
// //         {!complete ? (
// //           <div className="text-center mb-4">
// //             <h2 className="text-xl font-semibold text-muted-foreground">
// //               Verifying Access
// //             </h2>
// //             <p className="text-xs text-muted-foreground/60">
// //               Authentication in progress...
// //             </p>
// //           </div>
// //         ) : (
// //           <div className="text-center mb-4">
// //             <h1 className="text-2xl sm:text-3xl font-bold">
// //               Access Granted
// //             </h1>
// //             <p className="text-sm text-muted-foreground mt-1">
// //               Welcome back,{" "}
// //               <span className="text-neon-cyan font-semibold">
// //                 {username}
// //               </span>
// //             </p>
// //           </div>
// //         )}

// //         {/* Divider */}
// //         <div className="h-px bg-border my-4" />

// //         {/* Logs */}
// //         <div className="space-y-2 font-mono text-xs text-muted-foreground min-h-[100px]">
// //           {logs.map((log, i) => (
// //             <motion.div
// //               key={i}
// //               initial={{ opacity: 0, x: -10 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               className={`flex gap-2 ${
// //                 i === LOGS.length - 1 ? "text-neon-cyan" : ""
// //               }`}
// //             >
// //               <span>{i === LOGS.length - 1 ? "✓" : "›"}</span>
// //               {log}
// //             </motion.div>
// //           ))}
// //         </div>

// //         {/* Redirect */}
// //         {complete && (
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             className="mt-6 p-4 rounded-lg border border-border bg-muted/30 flex justify-between items-center"
// //           >
// //             <div>
// //               <p className="text-sm">Redirecting to dashboard</p>
// //               <p className="text-xs text-muted-foreground">
// //                 {countdown > 0
// //                   ? `${countdown}s remaining`
// //                   : "Loading..."}
// //               </p>
// //             </div>

// //             {/* Countdown ring */}
// //             <svg className="w-8 h-8 -rotate-90">
// //               <circle
// //                 cx="16"
// //                 cy="16"
// //                 r="12"
// //                 stroke="rgba(255,255,255,0.1)"
// //                 strokeWidth="2"
// //                 fill="none"
// //               />
// //               <circle
// //                 cx="16"
// //                 cy="16"
// //                 r="12"
// //                 stroke="url(#countdownGradient)"
// //                 strokeWidth="2"
// //                 fill="none"
// //                 strokeDasharray={75}
// //                 strokeDashoffset={75 - ((6 - countdown) / 6) * 75}
// //               />
// //               <defs>
// //                 <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
// //                   <stop offset="0%" stopColor="hsl(var(--neon-blue))" />
// //                   <stop offset="100%" stopColor="hsl(var(--neon-purple))" />
// //                 </linearGradient>
// //               </defs>
// //             </svg>
// //           </motion.div>
// //         )}

// //         {/* Footer */}
// //         <div className="flex flex-wrap justify-between mt-6 text-xs font-mono text-muted-foreground gap-2">
// //           <span>256-bit AES</span>
// //           <span>TLS 1.3 Active</span>
// //           <span className="text-neon-cyan">Secure Connection</span>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // }

// import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
// import { useEffect, useState, useRef } from "react";

// const SYSTEM_LOGS = [
//   { text: "Verifying identity...", delay: 0 },
//   { text: "Validating security tokens...", delay: 900 },
//   { text: "Establishing encrypted session...", delay: 1900 },
//   { text: "Integrity check passed.", delay: 2900 },
//   { text: "Authentication successful.", delay: 3800 },
// ];

// const REDIRECT_SECONDS = 6;

// function CircularProgress({ progress }) {
//   const r = 54;
//   const circ = 2 * Math.PI * r;
//   const dash = circ * progress;

//   return (
//     <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
//       {/* Track */}
//       <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(0,229,255,0.08)" strokeWidth="6" />
//       {/* Segmented ticks */}
//       {Array.from({ length: 32 }).map((_, i) => {
//         const angle = (i / 32) * 360;
//         const rad = (angle * Math.PI) / 180;
//         const x1 = 70 + 62 * Math.cos(rad);
//         const y1 = 70 + 62 * Math.sin(rad);
//         const x2 = 70 + 66 * Math.cos(rad);
//         const y2 = 70 + 66 * Math.sin(rad);
//         return (
//           <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
//             stroke="rgba(0,229,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
//         );
//       })}
//       {/* Progress arc */}
//       <circle
//         cx="70" cy="70" r={r}
//         fill="none"
//         stroke="url(#progressGrad)"
//         strokeWidth="5"
//         strokeLinecap="round"
//         strokeDasharray={`${dash} ${circ}`}
//         style={{ transition: "stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1)", filter: "drop-shadow(0 0 6px #00E5FF)" }}
//       />
//       <defs>
//         <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//           <stop offset="0%" stopColor="#14B8A6" />
//           <stop offset="100%" stopColor="#00E5FF" />
//         </linearGradient>
//         <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
//           <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
//           <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
//         </radialGradient>
//       </defs>
//     </svg>
//   );
// }

// function ShieldIcon({ done }) {
//   return (
//     <div style={{ position: "relative", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
//       {/* Glow halo */}
//       <motion.div
//         animate={{ opacity: done ? [0.5, 1, 0.5] : [0.2, 0.4, 0.2], scale: done ? [1, 1.15, 1] : [1, 1.05, 1] }}
//         transition={{ repeat: Infinity, duration: done ? 1.8 : 3, ease: "easeInOut" }}
//         style={{
//           position: "absolute", inset: -14, borderRadius: "50%",
//           background: done ? "radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)" : "radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 70%)",
//           pointerEvents: "none"
//         }}
//       />
//       <svg width="56" height="60" viewBox="0 0 56 60" fill="none">
//         <motion.path
//           d="M28 2L6 12V30C6 42.7 15.6 54.5 28 58C40.4 54.5 50 42.7 50 30V12L28 2Z"
//           stroke={done ? "#10B981" : "#00E5FF"}
//           strokeWidth="2"
//           fill={done ? "rgba(16,185,129,0.12)" : "rgba(0,229,255,0.08)"}
//           animate={{ stroke: done ? "#10B981" : "#00E5FF" }}
//           style={{ filter: done ? "drop-shadow(0 0 8px #10B981)" : "drop-shadow(0 0 8px #00E5FF)" }}
//         />
//         {done ? (
//           <motion.path
//             d="M19 30l7 7 11-13"
//             stroke="#10B981"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             initial={{ pathLength: 0 }}
//             animate={{ pathLength: 1 }}
//             transition={{ duration: 0.5 }}
//           />
//         ) : (
//           <rect x="22" y="24" width="12" height="10" rx="2"
//             fill="none" stroke="#00E5FF" strokeWidth="1.8" opacity="0.7" />
//         )}
//       </svg>
//     </div>
//   );
// }

// function ScanLine() {
//   return (
//     <motion.div
//       initial={{ top: "0%" }}
//       animate={{ top: ["0%", "100%", "0%"] }}
//       transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
//       style={{
//         position: "absolute", left: 0, right: 0, height: 2,
//         background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.25), transparent)",
//         pointerEvents: "none", zIndex: 20,
//       }}
//     />
//   );
// }

// function NetworkBackground() {
//   const nodes = [
//     { x: 10, y: 15 }, { x: 85, y: 10 }, { x: 20, y: 80 }, { x: 75, y: 75 },
//     { x: 50, y: 5 }, { x: 5, y: 50 }, { x: 95, y: 50 }, { x: 50, y: 95 },
//     { x: 30, y: 40 }, { x: 70, y: 35 }, { x: 15, y: 65 }, { x: 88, y: 70 },
//   ];
//   const connections = [
//     [0, 4], [0, 5], [1, 4], [1, 6], [2, 5], [2, 7], [3, 6], [3, 7],
//     [4, 8], [4, 9], [8, 9], [9, 10], [10, 5], [9, 11], [11, 3],
//   ];

//   return (
//     <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}>
//       {connections.map(([a, b], i) => (
//         <motion.line
//           key={i}
//           x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
//           x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
//           stroke="#00E5FF" strokeWidth="0.8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: [0, 0.5, 0] }}
//           transition={{ delay: i * 0.3, duration: 3, repeat: Infinity, repeatDelay: Math.random() * 4 + 2 }}
//         />
//       ))}
//       {nodes.map((n, i) => (
//         <motion.circle
//           key={i}
//           cx={`${n.x}%`} cy={`${n.y}%`} r="2.5"
//           fill="#00E5FF"
//           animate={{ opacity: [0.3, 1, 0.3], r: [2, 3, 2] }}
//           transition={{ delay: i * 0.2, duration: 2.5, repeat: Infinity, repeatDelay: Math.random() * 3 }}
//         />
//       ))}
//     </svg>
//   );
// }

// function CountdownRing({ seconds, total }) {
//   const pct = 1 - seconds / total;
//   const r = 12;
//   const circ = 2 * Math.PI * r;
//   return (
//     <svg width="34" height="34" viewBox="0 0 34 34" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
//       <circle cx="17" cy="17" r={r} fill="none" stroke="rgba(0,229,255,0.1)" strokeWidth="2.5" />
//       <circle cx="17" cy="17" r={r} fill="none"
//         stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round"
//         strokeDasharray={`${circ * pct} ${circ}`}
//         style={{ transition: "stroke-dasharray 1s linear", filter: "drop-shadow(0 0 3px #00E5FF)" }}
//       />
//     </svg>
//   );
// }

// export default function SecureWelcomeScreen({ username = "Alex Morgan", countdown: initCountdown = REDIRECT_SECONDS }) {
//   const [visibleLogs, setVisibleLogs] = useState([]);
//   const [authDone, setAuthDone] = useState(false);
//   const [countdown, setCountdown] = useState(initCountdown);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     // Sequential log reveals
//     SYSTEM_LOGS.forEach((log, i) => {
//       setTimeout(() => {
//         setVisibleLogs(prev => [...prev, log.text]);
//         setProgress((i + 1) / SYSTEM_LOGS.length);
//         if (i === SYSTEM_LOGS.length - 1) setAuthDone(true);
//       }, log.delay + 400);
//     });
//   }, []);

//   useEffect(() => {
//     if (!authDone) return;
//     const interval = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) { clearInterval(interval); return 0; }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [authDone]);

//   return (
//     <div style={{
//       minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
//       background: "linear-gradient(135deg, #060D1F 0%, #0A1628 50%, #060D1F 100%)",
//       fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
//       overflow: "hidden", position: "relative",
//     }}>
//       {/* Font import */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

//         * { box-sizing: border-box; margin: 0; padding: 0; }

//         @keyframes subtleFloat {
//           0%, 100% { transform: translateY(0px) scale(1); }
//           50% { transform: translateY(-18px) scale(1.03); }
//         }
//         @keyframes subtleFloat2 {
//           0%, 100% { transform: translateY(0px) scale(1); }
//           50% { transform: translateY(14px) scale(0.98); }
//         }
//         @keyframes gridPulse {
//           0%, 100% { opacity: 0.03; }
//           50% { opacity: 0.07; }
//         }
//         @keyframes logIn {
//           from { opacity: 0; transform: translateY(6px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .bg-blob-1 {
//           position: absolute; width: 600px; height: 600px;
//           background: radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%);
//           top: -200px; left: -200px; border-radius: 50%;
//           animation: subtleFloat 14s ease-in-out infinite;
//         }
//         .bg-blob-2 {
//           position: absolute; width: 500px; height: 500px;
//           background: radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%);
//           bottom: -150px; right: -150px; border-radius: 50%;
//           animation: subtleFloat2 18s ease-in-out infinite;
//         }
//         .grid-overlay {
//           position: absolute; inset: 0;
//           background-image: linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
//                             linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
//           background-size: 40px 40px;
//           animation: gridPulse 6s ease-in-out infinite;
//         }
//         .glass-card {
//           background: rgba(10, 25, 50, 0.6);
//           backdrop-filter: blur(28px);
//           -webkit-backdrop-filter: blur(28px);
//           border: 1px solid rgba(0, 229, 255, 0.12);
//           border-radius: 20px;
//           box-shadow:
//             0 0 0 1px rgba(0,229,255,0.05),
//             0 24px 80px rgba(0,0,0,0.6),
//             inset 0 1px 0 rgba(255,255,255,0.05);
//           position: relative;
//           overflow: hidden;
//         }
//         .status-badge {
//           display: inline-flex; align-items: center; gap: 7px;
//           padding: 5px 14px; border-radius: 100px;
//           background: rgba(16, 185, 129, 0.1);
//           border: 1px solid rgba(16,185,129,0.25);
//           font-size: 11px; color: #10B981;
//           font-family: 'DM Mono', monospace;
//           letter-spacing: 0.04em;
//         }
//         .log-entry {
//           animation: logIn 0.4s ease forwards;
//           opacity: 0;
//           font-family: 'DM Mono', monospace;
//           font-size: 11.5px;
//           color: rgba(0, 229, 255, 0.6);
//           display: flex; align-items: center; gap: 8px;
//           line-height: 1.5;
//         }
//         .log-entry.last { color: rgba(16,185,129,0.85); }
//         .divider {
//           height: 1px;
//           background: linear-gradient(90deg, transparent, rgba(0,229,255,0.15), transparent);
//         }
//         .info-row {
//           display: flex; align-items: center; gap: 7px;
//           font-size: 11px; color: rgba(0,229,255,0.5);
//           font-family: 'DM Mono', monospace;
//           letter-spacing: 0.02em;
//         }
//         .pulse-dot {
//           width: 6px; height: 6px; border-radius: 50%;
//           background: #10B981;
//           box-shadow: 0 0 6px #10B981;
//           animation: pulseDot 2s ease-in-out infinite;
//           flex-shrink: 0;
//         }
//         @keyframes pulseDot {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.4; transform: scale(0.8); }
//         }
//         @keyframes borderPulse {
//           0%, 100% { box-shadow: 0 0 0 1px rgba(0,229,255,0.05), 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05); }
//           50% { box-shadow: 0 0 0 1px rgba(0,229,255,0.18), 0 24px 80px rgba(0,0,0,0.6), 0 0 30px rgba(0,229,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05); }
//         }
//         .glass-card { animation: borderPulse 3s ease-in-out infinite; }
//       `}</style>

//       {/* Background layers */}
//       <div className="bg-blob-1" />
//       <div className="bg-blob-2" />
//       <div className="grid-overlay" />
//       <NetworkBackground />

//       {/* Main card */}
//       <motion.div
//         initial={{ opacity: 0, y: 32, scale: 0.96 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
//         className="glass-card"
//         style={{ width: "100%", maxWidth: 480, padding: "44px 40px", position: "relative", zIndex: 10 }}
//       >
//         <ScanLine />

//         {/* Top row: status badge + time */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
//           <div className="status-badge">
//             <div className="pulse-dot" />
//             SECURE SESSION
//           </div>
//           <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(0,229,255,0.35)", letterSpacing: "0.04em" }}>
//             {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//           </div>
//         </div>

//         {/* Circular progress + shield */}
//         <div style={{ display: "flex", justifyContent: "center", marginBottom: 32, position: "relative" }}>
//           <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
//             <CircularProgress progress={progress} />
//             <div style={{ position: "absolute" }}>
//               <ShieldIcon done={authDone} />
//             </div>
//           </div>
//         </div>

//         {/* Auth status / title */}
//         <AnimatePresence mode="wait">
//           {authDone ? (
//             <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//               <div style={{ textAlign: "center", marginBottom: 6 }}>
//                 <h1 style={{
//                   fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em",
//                   color: "#fff", lineHeight: 1.1, marginBottom: 8,
//                 }}>
//                   Access Granted
//                 </h1>
//                 <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontWeight: 400, letterSpacing: "0.01em" }}>
//                   Welcome back, <span style={{ color: "rgba(0,229,255,0.85)", fontWeight: 600 }}>{username}</span>
//                 </p>
//               </div>
//             </motion.div>
//           ) : (
//             <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//               <div style={{ textAlign: "center", marginBottom: 6 }}>
//                 <h1 style={{
//                   fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em",
//                   color: "rgba(255,255,255,0.7)", lineHeight: 1.1, marginBottom: 8,
//                 }}>
//                   Verifying Access
//                 </h1>
//                 <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Authentication in progress...</p>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Divider */}
//         <div className="divider" style={{ margin: "28px 0" }} />

//         {/* System log */}
//         <div style={{ marginBottom: 24 }}>
//           <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(0,229,255,0.3)", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>
//             System Log
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 100 }}>
//             {visibleLogs.map((log, i) => (
//               <div
//                 key={i}
//                 className={`log-entry${i === visibleLogs.length - 1 && authDone ? " last" : ""}`}
//                 style={{ animationDelay: "0ms" }}
//               >
//                 <span style={{ color: i === visibleLogs.length - 1 && authDone ? "#10B981" : "rgba(0,229,255,0.4)" }}>
//                   {i === visibleLogs.length - 1 && authDone ? "✓" : "›"}
//                 </span>
//                 {log}
//               </div>
//             ))}
//             {!authDone && (
//               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 {[0, 1, 2].map(i => (
//                   <motion.div
//                     key={i}
//                     animate={{ opacity: [0.2, 1, 0.2] }}
//                     transition={{ delay: i * 0.18, duration: 0.8, repeat: Infinity }}
//                     style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(0,229,255,0.5)" }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Redirect notice */}
//         <AnimatePresence>
//           {authDone && (
//             <motion.div
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               <div style={{
//                 background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.1)",
//                 borderRadius: 12, padding: "14px 18px",
//                 display: "flex", alignItems: "center", justifyContent: "space-between",
//                 marginBottom: 24,
//               }}>
//                 <div>
//                   <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500, marginBottom: 2 }}>
//                     Redirecting to secure dashboard
//                   </div>
//                   <div style={{ fontSize: 11, color: "rgba(0,229,255,0.4)", fontFamily: "'DM Mono', monospace" }}>
//                     {countdown > 0 ? `${countdown}s remaining` : "Loading..."}
//                   </div>
//                 </div>
//                 <CountdownRing seconds={countdown} total={REDIRECT_SECONDS} />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Footer info row */}
//         <div className="divider" style={{ marginBottom: 18 }} />
//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
//           <div className="info-row">
//             <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
//               <path d="M5.5 1L1 3.5V6.5C1 8.8 3 10.8 5.5 11C8 10.8 10 8.8 10 6.5V3.5L5.5 1Z"
//                 stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.8" />
//             </svg>
//             256-bit AES Encrypted
//           </div>
//           <div className="info-row">
//             <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
//               <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
//               <path d="M3 5l1.5 1.5L7 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
//             </svg>
//             TLS 1.3 Active
//           </div>
//           <div className="info-row">
//             <div className="pulse-dot" style={{ width: 5, height: 5 }} />
//             Secure Connection
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck, Check, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LOGS = [
  "Verifying identity...",
  "Validating security tokens...",
  "Establishing encrypted session...",
  "Integrity check passed.",
  "Authentication successful.",
];

const REDIRECT_SECONDS = 6;

export default function WelcomeScreen() {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  const { user } = useAuth();
  const navigate = useNavigate();

  // LOG SEQUENCE
  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setLogs((prev) => [...prev, LOGS[i]]);
      setProgress((i + 1) / LOGS.length);

      i++;
      if (i === LOGS.length) {
        clearInterval(interval);
        setComplete(true);
      }
    }, 900);

    return () => clearInterval(interval);
  }, []);

  // REDIRECT
  useEffect(() => {
    if (!complete) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
        }
        return prev - 1;
      });
    }, 500);

    return () => clearInterval(timer);
  }, [complete, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden px-4">

      {/* BACKGROUND */}
      <div className="absolute w-[700px] h-[700px] bg-neon-blue/5 blur-[150px] rounded-full top-[-200px] left-[-150px]" />
      <div className="absolute w-[600px] h-[600px] bg-neon-purple/5 blur-[150px] rounded-full bottom-[-150px] right-[-100px]" />

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(var(--neon-blue)_1px,transparent_1px),linear-gradient(90deg,var(--neon-blue)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-6xl rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden"
      >

        {/* SCAN LINE */}
        <motion.div
          animate={{ y: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent pointer-events-none"
        />

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">

          {/* ================= LEFT SIDE ================= */}
          <div className="flex flex-col justify-between p-6 sm:p-10 border-r border-border">

            {/* TOP */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-success text-xs font-mono border border-success/30 px-3 py-1 rounded-full bg-success/10">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                SECURE SESSION
              </div>

              <div className="text-xs text-muted-foreground font-mono">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* CENTER CONTENT */}
            <div className="flex flex-col items-center justify-center text-center gap-6">

              {/* PROGRESS RING */}
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="50"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="50"
                    stroke="url(#progressGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={314}
                    strokeDashoffset={314 - progress * 314}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient">
                      <stop offset="0%" stopColor="hsl(var(--neon-blue))" />
                      <stop offset="100%" stopColor="hsl(var(--neon-purple))" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  {complete ? (
                    <ShieldCheck className="w-8 h-8 text-neon-cyan drop-shadow-[0_0_8px_rgba(50,239,255,0.8)]" />
                  ) : (
                    <Lock className="w-8 h-8 text-neon-blue drop-shadow-[0_0_8px_rgba(92,235,255,0.6)]" />
                  )}
                </div>
              </div>

              {/* TEXT */}
              <AnimatePresence mode="wait">
                {!complete ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-xl text-muted-foreground">
                      Verifying Access
                    </h2>
                    <p className="text-xs text-muted-foreground/60">
                      Authentication in progress...
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h1 className="text-3xl font-bold">
                      Access Granted
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Welcome back,{" "}
                      <span className="text-neon-cyan font-semibold">
                        {user?.name || user?.email?.split('@')[0] || 'User'}
                      </span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* FOOTER */}
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>256-bit AES</span>
              <span>TLS 1.3</span>
              <span className="text-neon-cyan">Secure</span>
            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="p-6 sm:p-10 flex flex-col justify-between">

            {/* LOGS */}
            <div>
              <h3 className="text-xs font-mono text-muted-foreground mb-4">
                SYSTEM LOG
              </h3>

              <div className="space-y-2 font-mono text-xs text-muted-foreground min-h-[200px]">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 ${
                      i === LOGS.length - 1 ? "text-neon-cyan" : "text-neon-blue"
                    }`}
                  >
                    {i === LOGS.length - 1 ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span className="text-sm">{log}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* REDIRECT */}
            {complete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 rounded-lg border border-border bg-muted/30 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm">Redirecting to dashboard</p>
                  <p className="text-xs text-muted-foreground">
                    {countdown > 0
                      ? `Loading in ${countdown}....`
                      : "Loading..."}
                  </p>
                </div>

                {/* COUNTDOWN RING */}
                <svg className="w-8 h-8 -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="hsl(var(--neon-blue))"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={75}
                    strokeDashoffset={75 - ((REDIRECT_SECONDS - countdown) / REDIRECT_SECONDS) * 75}
                  />
                </svg>
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}