// src/pages/Workflow.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Film,
  Calendar,
  Camera,
  Clapperboard,
  Rocket,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const workflow = [
  {
    icon: Film,
    title: "Pre Production",
    desc: "Plan scripts, budgets, casting, and production timelines with AI assistance.",
  },
  {
    icon: Calendar,
    title: "Scheduling",
    desc: "Generate optimized schedules and call sheets automatically.",
  },
  {
    icon: Camera,
    title: "Production",
    desc: "Coordinate crews, monitor progress, and track live production updates.",
  },
  {
    icon: Clapperboard,
    title: "Post Production",
    desc: "Manage editing, VFX, sound design, and approvals from one workspace.",
  },
  {
    icon: Rocket,
    title: "Distribution",
    desc: "Analyze markets, audience trends, and optimize global releases.",
  },
];

export default function Workflow() {
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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
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
                </li> <li>
              <a
                href="/features"
                className="hover:text-white transition-colors"
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
                className="text-white"
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
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs uppercase tracking-[0.2em] mb-6">
            Production Workflow
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Built for the
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              entire pipeline.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-8">
            From script development to theatrical release, Lumina streamlines
            every stage of modern film production.
          </p>
        </div>
      </section>

      {/* WORKFLOW STEPS */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {workflow.map((item, index) => (
              <div
                key={item.title}
                className="group relative flex flex-col md:flex-row gap-6 items-start rounded-3xl border border-white/10 bg-white/[0.03] p-8 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300"
              >
                {/* STEP NUMBER */}
                <div className="absolute top-6 right-6 text-6xl font-bold text-white/5">
                  0{index + 1}
                </div>

                {/* ICON */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <item.icon size={26} />
                </div>

                {/* CONTENT */}
                <div className="relative z-10">
                  <div className="text-sm text-blue-400 mb-2 tracking-wide">
                    STEP {index + 1}
                  </div>

                  <h2 className="text-3xl font-bold mb-4">
                    {item.title}
                  </h2>

                  <p className="text-slate-400 leading-8 text-lg">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-24">
            <button
              onClick={() => navigate("/pricing")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold flex items-center gap-3 mx-auto hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.3)]"
            >
              Start Building
              <ArrowRight size={18} />
            </button>
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
                </li> <li>
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