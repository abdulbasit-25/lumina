// src/pages/Features.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Film,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const features = [
  {
    icon: Film,
    title: "Production Pipeline",
    desc: "Manage projects from concept to release with a centralized production workflow.",
  },
  {
    icon: Calendar,
    title: "AI Scheduling",
    desc: "Automatically optimize call sheets, timelines, and shoot schedules.",
  },
  {
    icon: Users,
    title: "Cast & Crew",
    desc: "Coordinate talent, contracts, and departments with real-time collaboration.",
  },
  {
    icon: DollarSign,
    title: "Budget Intelligence",
    desc: "Track spending, forecast overruns, and monitor financial health instantly.",
  },
  {
    icon: Brain,
    title: "Predictive AI",
    desc: "AI-driven insights help identify risks before they impact production.",
  },
  {
    icon: Sparkles,
    title: "Market Analytics",
    desc: "Understand audience sentiment and optimize distribution strategy.",
  },
];

export default function Features() {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-[-200px] right-[-150px] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
            ? "bg-[#030712]/90 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* LOGO */}
          <a
            href="/"
            className="flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              <Film size={18} color="white" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Lumina
              <em className="text-blue-400 not-italic">Studio</em>
            </span>
          </a>

          {/* NAV LINKS */}
          <ul className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <li>
              <button
                onClick={() => navigate("/about")}
                className="hover:text-white transition-colors"
              >
                About
              </button>
            </li><li>
              <a
                href="/features"
                className="text-white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/features");
                }}
              >
                Features
              </a>
            </li>

            <li>
              <a
                href="/workflow"
                className="hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/workflow");
                }}
              >
                Workflow
              </a>
            </li>

            <li>
              <a
                href="/pricing"
                className="hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/pricing");
                }}
              >
                Pricing
              </a>
            </li>

            <li>
              <a
                href="/enterprise"
                className="hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/enterprise");
                }}
              >
                Enterprise
              </a>
            </li>
          </ul>

          {/* LOGIN */}
          <button
            className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all duration-300"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 px-6 pt-36 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-xs uppercase tracking-[0.2em] mb-6">
              Platform Features
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Everything your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                studio needs.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-8">
              Built for filmmakers, producers, and enterprise studios managing
              modern productions with AI-powered workflows.
            </p>
          </div>

          {/* FEATURES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* STEP NUMBER */}
                <div className="absolute top-6 right-6 text-6xl font-bold text-white/5">
                  0{index + 1}
                </div>

                {/* ICON */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_40px_rgba(59,130,246,0.35)]">
                  <feature.icon size={24} />
                </div>

                {/* TITLE */}
                <h2 className="text-2xl font-bold mb-4 relative z-10">
                  {feature.title}
                </h2>

                {/* DESC */}
                <p className="text-slate-400 leading-8 relative z-10">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-24">
            <button
              onClick={() => navigate("/pricing")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold flex items-center gap-3 mx-auto hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.35)]"
            >
              View Pricing
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* EXTRA SECTION */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-6xl mx-auto rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 md:p-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs uppercase tracking-[0.2em] mb-6">
                Why Lumina
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                AI-first tools built for
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  modern filmmaking.
                </span>
              </h2>

              <p className="text-slate-400 leading-8 text-lg">
                Replace disconnected production tools with one unified
                intelligent platform for scheduling, budgeting, collaboration,
                and distribution.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-8">
                <div className="text-4xl font-bold text-blue-400 mb-3">
                  85%
                </div>

                <p className="text-slate-400">
                  Faster scheduling workflows
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-8">
                <div className="text-4xl font-bold text-purple-400 mb-3">
                  40%
                </div>

                <p className="text-slate-400">
                  Reduction in production delays
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-8">
                <div className="text-4xl font-bold text-pink-400 mb-3">
                  24/7
                </div>

                <p className="text-slate-400">
                  Real-time AI production monitoring
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-8">

              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* BRAND */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Film size={18} color="white" />
                </div>

                <span className="text-xl font-bold">
                  Lumina
                  <em className="text-blue-400 not-italic">
                    Studio
                  </em>
                </span>
              </div>

              <p className="text-slate-400 leading-7">
                AI-powered production intelligence for the future of filmmaking.
              </p>
            </div>

            {/* PRODUCT */}
            <div>
              <h3 className="font-semibold mb-5 text-white">
                Product
              </h3>

              <ul className="space-y-3 text-slate-400">
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/features")}
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate("/workflow")}
                    className="hover:text-white transition-colors"
                  >
                    Workflow
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate("/pricing")}
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="font-semibold mb-5 text-white">
                Company
              </h3>

              <span>Powered by </span>


              <a
                href="https://abdulbasit-archer.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  style={{
                    color: "#4f46e5",
                    fontWeight: 600,
                    fontSize: "16px",
                    letterSpacing: "0.5px",
                  }}
                >
                  Archer
                </span>
              </a>
            </div>

            {/* SOCIAL */}
            <div>
              <h3 className="font-semibold mb-5 text-white">
                Follow Us
              </h3>

              <div className="flex items-center gap-4">
                <h1>Coming Soon</h1>

              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2026 LuminaStudio. All rights reserved.</p>

            <div className="flex items-center gap-6">
              <button className="hover:text-white transition-colors">
                Privacy Policy
              </button>

              <button className="hover:text-white transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}