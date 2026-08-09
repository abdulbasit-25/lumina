// src/pages/Enterprise.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Globe,
  Database,
  Cpu,
  Lock,
  ArrowRight,
  Film,
  Twitter,
  Linkedin,
  Instagram,
  Sparkles,
  CheckCircle2,
  Building2,
  Server,
} from "lucide-react";

const enterpriseFeatures = [
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Advanced encryption, compliance controls, and secure production infrastructure.",
  },
  {
    icon: Globe,
    title: "Global Collaboration",
    desc: "Coordinate productions across countries, studios, and remote teams in real-time.",
  },
  {
    icon: Database,
    title: "Private Infrastructure",
    desc: "Dedicated cloud environments with scalable architecture built for enterprise workloads.",
  },
  {
    icon: Cpu,
    title: "Custom AI Models",
    desc: "Train AI systems tailored to your studio workflows, pipelines, and production style.",
  },
  {
    icon: Lock,
    title: "SSO & Access Control",
    desc: "Granular permissions, enterprise authentication, audit logging, and secure workflows.",
  },
  {
    icon: Server,
    title: "Scalable Architecture",
    desc: "Designed to support global studios handling large productions and distributed teams.",
  },
];

const enterpriseStats = [
  {
    value: "99.99%",
    label: "Enterprise uptime",
  },
  {
    value: "120+",
    label: "Studio teams onboarded",
  },
  {
    value: "24/7",
    label: "Dedicated support",
  },
  {
    value: "40%",
    label: "Production efficiency gain",
  },
];

export default function Enterprise() {
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
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-[-250px] right-[-200px] w-[700px] h-[700px] rounded-full bg-purple-500/10 blur-3xl" />

        <div className="absolute top-[35%] left-[45%] w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-3xl" />
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-[0_0_35px_rgba(59,130,246,0.35)]">
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
                </li>
                <li>
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
                className="text-white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/enterprise");
                }}
              >
                Enterprise
              </a>
            </li>
          </ul>

          {/* LOGIN BUTTON */}
          <button
            className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all duration-300"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative px-6 pt-40 pb-28">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-xs uppercase tracking-[0.2em] mb-6">
              <Sparkles size={14} />
              Enterprise Solutions
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Infrastructure built for
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                global film studios.
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-slate-400 text-lg leading-8">
              Enterprise-grade production intelligence for modern studios,
              media companies, and large-scale cinematic productions.
            </p>
          </div>

          {/* HERO CARD */}
          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 md:p-16 mb-24">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 blur-3xl rounded-full" />

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              {/* LEFT */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs uppercase tracking-[0.2em] mb-6">
                  <Building2 size={14} />
                  Enterprise Platform
                </div>

                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                  Scale productions with
                  <span className="block text-blue-400">
                    AI-powered infrastructure.
                  </span>
                </h2>

                <p className="text-slate-400 text-lg leading-8 mb-8">
                  From blockbuster productions to distributed creative teams,
                  Lumina gives enterprise studios intelligent workflow
                  automation, security, and operational visibility.
                </p>

                <div className="space-y-4">
                  {[
                    "Enterprise-grade security & compliance",
                    "AI scheduling & predictive analytics",
                    "Dedicated cloud infrastructure",
                    "Global team collaboration",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-green-400"
                      />

                      <span className="text-slate-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="grid grid-cols-2 gap-6">
                {enterpriseStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/10 bg-black/20 p-8 hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                      {stat.value}
                    </div>

                    <p className="text-slate-400 leading-6">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 hover:border-blue-500/30 hover:bg-white/[0.05] hover:-translate-y-2 transition-all duration-500"
              >
                {/* NUMBER */}
                <div className="absolute top-5 right-5 text-6xl font-bold text-white/5">
                  0{index + 1}
                </div>

                {/* ICON */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-8 shadow-[0_0_35px_rgba(59,130,246,0.35)] group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={28} />
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
          <div className="mt-28 text-center">
            <div className="max-w-4xl mx-auto rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-12 md:p-16">
              <div className="inline-flex px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-xs uppercase tracking-[0.2em] mb-6">
                Enterprise Access
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Ready to scale your
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  production pipeline?
                </span>
              </h2>

              <p className="text-slate-400 text-lg leading-8 max-w-2xl mx-auto mb-10">
                Connect with our enterprise team to explore custom
                infrastructure, AI workflows, and scalable production systems.
              </p>

              <button
                onClick={() => navigate("/pricing")}
                className="px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-lg flex items-center gap-3 mx-auto hover:scale-105 transition-all duration-300 shadow-[0_0_45px_rgba(59,130,246,0.35)]"
              >
                Contact Enterprise Sales
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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