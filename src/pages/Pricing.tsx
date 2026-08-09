// src/pages/Pricing.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Sparkles,
  Crown,
  Building2,
  Film,
  Twitter,
  Linkedin,
  Instagram,
  Clock3,
  Stars,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    status: "Coming Soon",
    desc: "Perfect for indie creators and small productions.",
    icon: Sparkles,
    featured: false,
    features: [
      "1 Active Production",
      "Basic AI Scheduling",
      "Budget Tracking",
      "Team Collaboration",
      "5 Team Members",
      "Email Support",
    ],
  },
  {
    name: "Professional",
    status: "Coming Soon",
    desc: "Advanced workflow automation for growing studios.",
    icon: Crown,
    featured: true,
    features: [
      "Unlimited Productions",
      "Advanced AI Insights",
      "Predictive Budgeting",
      "Advanced Analytics",
      "Unlimited Team Members",
      "Priority Support",
      "Casting Intelligence",
      "Custom Workflows",
    ],
  },
  {
    name: "Enterprise",
    status: "Coming Soon",
    desc: "Tailored infrastructure for enterprise studios.",
    icon: Building2,
    featured: false,
    features: [
      "Dedicated Infrastructure",
      "Private AI Models",
      "SSO Authentication",
      "Custom Integrations",
      "White Labeling",
      "Dedicated Manager",
      "Advanced Security",
      "24/7 Support",
    ],
  },
];

export default function Pricing() {
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
        <div className="absolute top-[-200px] left-[-150px] w-[700px] h-[700px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-[-200px] right-[-150px] w-[700px] h-[700px] rounded-full bg-purple-500/10 blur-3xl" />

        <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full bg-pink-500/5 blur-3xl" />
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              <Film size={18} color="white" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Lumina
              <em className="text-blue-400 not-italic">Studio</em>
            </span>
          </a>

          {/* LINKS */}
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
                className="text-white"
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
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-xs tracking-[0.2em] uppercase mb-6">
          <Stars size={14} />
          Pricing Plans
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
          Pricing launching
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            very soon.
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-slate-400 text-lg leading-8">
          Lumina Studio is currently in early access. Our team is finalizing
          flexible pricing plans for creators, studios, and enterprise teams.
        </p>

        {/* COMING SOON BADGE */}
        <div className="mt-10 inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-purple-500/20 bg-white/[0.04] backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Clock3 size={20} />
          </div>

          <div className="text-left">
            <p className="font-semibold">
              Pricing plans are coming soon
            </p>

            <p className="text-sm text-slate-400">
              Join the waitlist to get early access updates.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[32px] border backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                plan.featured
                  ? "border-purple-500/40 bg-white/[0.05] shadow-[0_0_60px_rgba(139,92,246,0.25)]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {/* FEATURED TAG */}
              {plan.featured && (
                <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-semibold tracking-wide">
                  MOST POPULAR
                </div>
              )}

              {/* GLOW */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

              <div className="relative z-10 p-8">
                {/* ICON */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    plan.featured
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_40px_rgba(139,92,246,0.35)]"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <plan.icon size={26} />
                </div>

                {/* TITLE */}
                <h2 className="text-3xl font-bold mb-3">
                  {plan.name}
                </h2>

                {/* DESC */}
                <p className="text-slate-400 mb-8 leading-7">
                  {plan.desc}
                </p>

                {/* STATUS */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-300">
                    <Clock3 size={16} />
                    {plan.status}
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => navigate("/login")}
                  className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    plan.featured
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.35)]"
                      : "border border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  Join Waitlist
                  <ArrowRight size={18} />
                </button>

                {/* FEATURES */}
                <div className="mt-10 space-y-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check
                          size={12}
                          className="text-green-400"
                        />
                      </div>

                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-6xl mx-auto rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-12 md:p-20 text-center">
          <div className="inline-flex px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs uppercase tracking-[0.2em] mb-6">
            Early Access
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Build the future of
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              film production.
            </span>
          </h2>

          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-8 mb-10">
            Join studios using Lumina Studio to streamline workflows,
            eliminate delays, and scale productions intelligently with AI.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.35)]"
          >
            Join Early Access
          </button>
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
                </li>  <li>
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