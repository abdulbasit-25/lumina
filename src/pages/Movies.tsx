import { motion, AnimatePresence } from "framer-motion";
import { Film, Plus, Search, Edit, Trash2, SortAsc, SortDesc, Star, Sparkles } from "lucide-react";
import { useProductions } from "@/contexts/ProductionsContext";
import { Button } from "@/components/ui/button";
import { ProductionForm } from "@/components/ProductionForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useMemo } from "react";

// ─────────────────────────────────────────────
// Keyframe + global style injection (once)
// ─────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

  .cineos-root {
    font-family: 'Inter', sans-serif;
  }
  .cineos-root .font-display {
    font-family: 'Space Grotesk', sans-serif !important;
  }

  /* Grid background */
  .cineos-grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(59,130,246,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.045) 1px, transparent 1px);
    background-size: 56px 56px;
  }
  .cineos-grid-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 40% at 15% 0%, rgba(59,130,246,0.08), transparent),
      radial-gradient(ellipse 50% 35% at 85% 60%, rgba(139,92,246,0.07), transparent),
      linear-gradient(to bottom, transparent 55%, rgba(4,8,17,0.9) 100%);
  }

  /* Text gradient */
  .cineos-text-gradient {
    background: linear-gradient(135deg, #fff 0%, #cbd5e1 35%, #818cf8 65%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Neon text */
  .cineos-neon-text {
    color: #3b82f6;
    text-shadow: 0 0 16px rgba(59,130,246,0.55), 0 0 40px rgba(59,130,246,0.25);
  }
  .cineos-neon-text-purple {
    color: #8b5cf6;
    text-shadow: 0 0 16px rgba(139,92,246,0.55), 0 0 40px rgba(139,92,246,0.25);
  }
  .cineos-neon-text-emerald {
    color: #10b981;
    text-shadow: 0 0 16px rgba(16,185,129,0.45);
  }

  /* Glass panels */
  .cineos-glass {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .cineos-glass-strong {
    background: rgba(255,255,255,0.055);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.12);
  }

  /* Gradient border wrapper */
  .cineos-grad-border {
    position: relative;
    border-radius: 22px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(59,130,246,0.35), rgba(139,92,246,0.35), rgba(6,182,212,0.15));
  }

  /* Stat card */
  .cineos-stat-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    padding: 18px 20px;
    transition: border-color 0.3s, background 0.3s, transform 0.25s, box-shadow 0.3s;
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  .cineos-stat-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(59,130,246,0.04), transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 18px;
  }
  .cineos-stat-card:hover {
    border-color: rgba(59,130,246,0.3);
    background: rgba(255,255,255,0.045);
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.1);
  }
  .cineos-stat-card:hover::before { opacity: 1; }

  /* Movie card */
  .cineos-movie-card {
    position: relative;
    border-radius: 22px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.025);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(.22,.68,0,1.2), border-color 0.3s, box-shadow 0.3s;
  }
  .cineos-movie-card::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 22px;
    padding: 1px;
    background: linear-gradient(135deg, transparent 40%, rgba(59,130,246,0.15), rgba(139,92,246,0.1));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  .cineos-movie-card:hover {
    transform: translateY(-6px) scale(1.005);
    border-color: rgba(59,130,246,0.28);
    box-shadow:
      0 24px 64px rgba(0,0,0,0.55),
      0 0 0 1px rgba(59,130,246,0.1),
      0 0 40px rgba(59,130,246,0.06);
  }
  .cineos-movie-card:hover::after { opacity: 1; }

  /* Poster zoom */
  .cineos-poster-img {
    transition: transform 0.7s cubic-bezier(.25,.46,.45,.94);
  }
  .cineos-movie-card:hover .cineos-poster-img {
    transform: scale(1.08);
  }

  /* Search input focus glow */
  .cineos-search:focus {
    border-color: rgba(59,130,246,0.45) !important;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1), 0 0 20px rgba(59,130,246,0.12);
  }

  /* Pulse (header live dot) */
  @keyframes cineos-pulse {
    0%,100% { opacity:1; transform:scale(1); box-shadow:0 0 0 0 rgba(59,130,246,0.5); }
    50%      { opacity:.75; transform:scale(.94); box-shadow:0 0 0 6px rgba(59,130,246,0); }
  }
  .cineos-live-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #3b82f6;
    box-shadow: 0 0 8px rgba(59,130,246,0.8);
    animation: cineos-pulse 2.2s ease-in-out infinite;
    display: inline-block;
    flex-shrink: 0;
  }

  /* Glow pulse (CTA button) */
  @keyframes cineos-glow-pulse {
    0%,100% { box-shadow: 0 0 18px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.18); }
    50%      { box-shadow: 0 0 32px rgba(59,130,246,0.65), 0 0 72px rgba(59,130,246,0.32), 0 0 100px rgba(139,92,246,0.18); }
  }
  .cineos-glow-pulse { animation: cineos-glow-pulse 2.8s ease-in-out infinite; }

  /* Shimmer */
  @keyframes cineos-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .cineos-shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
    background-size: 200% auto;
    animation: cineos-shimmer 2.5s linear infinite;
  }

  /* Action button hover glow */
  .cineos-action-edit:hover {
    background: rgba(37,99,235,0.75) !important;
    color: #fff !important;
    box-shadow: 0 0 16px rgba(59,130,246,0.5);
  }
  .cineos-action-delete:hover {
    background: rgba(220,38,38,0.75) !important;
    color: #fff !important;
    box-shadow: 0 0 16px rgba(220,38,38,0.5);
  }

  /* Empty state */
  .cineos-empty-icon-wrap {
    width: 88px; height: 88px;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    position: relative;
  }
  .cineos-empty-icon-wrap::after {
    content: '';
    position: absolute;
    inset: -12px;
    border-radius: 36px;
    background: radial-gradient(ellipse, rgba(59,130,246,0.08), transparent 70%);
  }

  /* Sort button */
  .cineos-sort-btn {
    transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .cineos-sort-btn:hover {
    border-color: rgba(59,130,246,0.4) !important;
    color: #3b82f6 !important;
    box-shadow: 0 0 12px rgba(59,130,246,0.2);
  }

  /* Add production button glow */
  .cineos-add-btn {
    transition: all 0.25s;
  }
  .cineos-add-btn:hover {
    box-shadow: 0 0 24px rgba(59,130,246,0.4), 0 4px 16px rgba(0,0,0,0.3);
    transform: translateY(-1px);
  }

  /* Responsive */
  @media (max-width: 640px) {
    .cineos-stat-card { padding: 14px 16px; }
    .cineos-movie-card { border-radius: 16px; }
  }
`;

function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: STYLES }} />;
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function Movies() {
  // ── All backend logic preserved exactly ───────────────────────────────
  const { productions, deleteProduction } = useProductions();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredAndSortedProductions = useMemo(() => {
    let filtered = productions.filter(
      (production) =>
        production.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        production.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (production.suggestedDirector &&
          production.suggestedDirector
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "genre":
          aValue = a.genre.toLowerCase();
          bValue = b.genre.toLowerCase();
          break;
        case "budget":
          aValue = a.budget;
          bValue = b.budget;
          break;
        case "progress":
          aValue = a.progress;
          bValue = b.progress;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [productions, searchQuery, sortBy, sortOrder]);

  const handleDelete = async (id, title) => {
    await deleteProduction(id);
    toast.success(`Production "${title}" deleted successfully`);
  };
  // ─────────────────────────────────────────────────────────────────────

  // Derived stats (UI only)
  const totalBudget = productions.reduce((s, p) => s + (p.budget || 0), 0);
  const avgProgress = productions.length
    ? Math.round(productions.reduce((s, p) => s + p.progress, 0) / productions.length)
    : 0;
  const activeCount = productions.filter((p) => p.status === "In Production").length;

  // Status badge config
  const getStatusStyle = (status) => {
    switch (status) {
      case "In Production":
        return {
          background: "rgba(59,130,246,0.12)",
          color: "#93c5fd",
          border: "1px solid rgba(59,130,246,0.25)",
          boxShadow: "0 0 10px rgba(59,130,246,0.15)",
        };
      case "Post-Production":
        return {
          background: "rgba(139,92,246,0.12)",
          color: "#c4b5fd",
          border: "1px solid rgba(139,92,246,0.25)",
          boxShadow: "0 0 10px rgba(139,92,246,0.15)",
        };
      case "Completed":
        return {
          background: "rgba(16,185,129,0.12)",
          color: "#6ee7b7",
          border: "1px solid rgba(16,185,129,0.25)",
          boxShadow: "0 0 10px rgba(16,185,129,0.12)",
        };
      default:
        return {
          background: "rgba(100,116,139,0.15)",
          color: "#94a3b8",
          border: "1px solid rgba(100,116,139,0.2)",
        };
    }
  };

  // Progress ring helper
  const ringCircumference = 2 * Math.PI * 16;
  const ringOffset = (progress) =>
    ringCircumference - ((progress || 0) / 100) * ringCircumference;

  // ─────────────────────────────────────────────
  // Stats config
  // ─────────────────────────────────────────────
  const stats = [
    {
      label: "Total Productions",
      value: productions.length,
      colorClass: "cineos-text-gradient",
      icon: "🎬",
    },
    {
      label: "In Production",
      value: activeCount,
      colorClass: "cineos-neon-text",
      icon: "⚡",
    },
    {
      label: "Total Budget",
      value: `$${(totalBudget / 1e6).toFixed(0)}M`,
      colorClass: "cineos-neon-text-purple",
      icon: "💎",
    },
    {
      label: "Avg. Progress",
      value: `${avgProgress}%`,
      colorClass: "cineos-neon-text-emerald",
      icon: "📈",
    },
  ];

  return (
    <div className="cineos-root relative min-h-full">
      <StyleInjector />

      {/* ── Grid Background ── */}
      <div className="cineos-grid-bg" aria-hidden="true" />

      {/* ── Atmosphere Blobs ── */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "-130px",
            width: "620px",
            height: "620px",
            borderRadius: "50%",
            background: "rgba(59,130,246,0.09)",
            filter: "blur(130px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "33%",
            right: "-100px",
            width: "460px",
            height: "460px",
            borderRadius: "50%",
            background: "rgba(139,92,246,0.09)",
            filter: "blur(130px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "35%",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "rgba(6,182,212,0.06)",
            filter: "blur(110px)",
          }}
        />
      </div>

      {/* ── Page Content ── */}
      <div className="space-y-8 max-w-7xl" style={{ position: "relative", zIndex: 1 }}>

        {/* ══ HEADER ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 0.68, 0, 1] }}
          className="flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            {/* Eyebrow */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#3b82f6",
                marginBottom: "12px",
                padding: "5px 12px",
                borderRadius: "100px",
                border: "1px solid rgba(59,130,246,0.22)",
                background: "rgba(59,130,246,0.07)",
              }}
            >
              <span className="cineos-live-dot" />
              Studio Slate
            </div>

            {/* Headline */}
            <h1
              className="font-display cineos-text-gradient"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(36px, 5vw, 52px)",
                fontWeight: 700,
                letterSpacing: "-1.5px",
                lineHeight: 1.05,
                marginBottom: "8px",
              }}
            >
              Productions
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#475569",
                fontWeight: 400,
                letterSpacing: "0.2px",
              }}
            >
              Manage and track all studio productions
            </p>
          </div>

          {/* Add Production CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              className="cineos-add-btn cineos-glow-pulse"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
                borderRadius: "12px",
                padding: "1px",
              }}
            >
              <div style={{ borderRadius: "11px", background: "linear-gradient(135deg,#1d4ed8,#6d28d9)" }}>
                <ProductionForm />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══ STATS ROW ════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 0.68, 0, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              className="cineos-stat-card"
            >
              {/* Shimmer overlay */}
              <div
                className="cineos-shimmer"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "18px",
                  opacity: 0.6,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  fontSize: "18px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {stat.icon}
              </div>
              <p
                style={{
                  fontSize: "10px",
                  color: "#475569",
                  marginBottom: "6px",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </p>
              <p
                className={`font-display ${stat.colorClass}`}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "26px",
                  fontWeight: 700,
                  letterSpacing: "-0.8px",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ══ SEARCH & SORT ════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "15px",
                height: "15px",
                color: "#475569",
                pointerEvents: "none",
              }}
            />
            <Input
              placeholder="Search by title, genre, or director…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cineos-search cineos-glass"
              style={{
                paddingLeft: "42px",
                height: "42px",
                borderRadius: "12px",
                fontSize: "13px",
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                outline: "none",
                transition: "all 0.25s",
              }}
            />
          </div>

          {/* Sort select */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              style={{
                width: "148px",
                height: "42px",
                borderRadius: "12px",
                fontSize: "13px",
                color: "#cbd5e1",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="genre">Genre</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="createdAt">Date Added</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort direction */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="cineos-sort-btn cineos-glass"
            style={{
              height: "42px",
              width: "42px",
              padding: 0,
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#64748b",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {sortOrder === "asc" ? (
              <SortAsc style={{ width: "15px", height: "15px" }} />
            ) : (
              <SortDesc style={{ width: "15px", height: "15px" }} />
            )}
          </Button>
        </motion.div>

        {/* ══ SECTION LABEL ════════════════════════════════════ */}
        {filteredAndSortedProductions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              paddingBottom: "4px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#3b82f6",
              }}
            >
              {filteredAndSortedProductions.length} production
              {filteredAndSortedProductions.length !== 1 ? "s" : ""}
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "linear-gradient(to right, rgba(59,130,246,0.3), transparent)",
              }}
            />
          </motion.div>
        )}

        {/* ══ PRODUCTIONS GRID ═════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProductions.map((movie, i) => {
              const spentM = (movie.spent / 1e6).toFixed(0);
              const budgetM = (movie.budget / 1e6).toFixed(0);
              const budgetPct =
                movie.budget > 0
                  ? Math.min((movie.spent / movie.budget) * 100, 100)
                  : 0;
              const isOverBudget = budgetPct > 80;
              const statusStyle = getStatusStyle(movie.status);

              return (
                <motion.div
                  key={movie._id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.4,
                    ease: [0.22, 0.68, 0, 1],
                  }}
                  className="cineos-movie-card group"
                >
                  {/* ── Poster Banner ── */}
                  <div
                    style={{
                      position: "relative",
                      height: "168px",
                      overflow: "hidden",
                      background: "#060c18",
                    }}
                  >
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="cineos-poster-img"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0c1a2e 100%)",
                          position: "relative",
                        }}
                      >
                        {/* Decorative grid inside poster */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage:
                              "linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                          }}
                        />
                        <Film
                          style={{
                            width: "36px",
                            height: "36px",
                            color: "rgba(59,130,246,0.18)",
                            position: "relative",
                            zIndex: 1,
                          }}
                        />
                      </div>
                    )}

                    {/* Fade overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(6,9,18,0.96) 0%, rgba(6,9,18,0.3) 50%, transparent 100%)",
                      }}
                    />

                    {/* Horizontal glow accent at bottom of poster */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: isOverBudget
                          ? "linear-gradient(to right, transparent, rgba(245,158,11,0.5), transparent)"
                          : "linear-gradient(to right, transparent, rgba(59,130,246,0.4), rgba(139,92,246,0.3), transparent)",
                      }}
                    />

                    {/* Status badge */}
                    <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                      <span
                        style={{
                          ...statusStyle,
                          fontSize: "9px",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          borderRadius: "100px",
                          backdropFilter: "blur(10px)",
                          display: "inline-block",
                        }}
                      >
                        {movie.status || "Pre-Production"}
                      </span>
                    </div>

                    {/* Action buttons on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        display: "flex",
                        gap: "6px",
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ProductionForm
                        production={movie}
                        trigger={
                          <Button
                            size="sm"
                            className="cineos-action-edit"
                            style={{
                              height: "32px",
                              width: "32px",
                              padding: 0,
                              borderRadius: "9px",
                              background: "rgba(10,20,40,0.8)",
                              backdropFilter: "blur(12px)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#64748b",
                              transition: "all 0.2s",
                            }}
                          >
                            <Edit style={{ width: "13px", height: "13px" }} />
                          </Button>
                        }
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            className="cineos-action-delete"
                            style={{
                              height: "32px",
                              width: "32px",
                              padding: 0,
                              borderRadius: "9px",
                              background: "rgba(10,20,40,0.8)",
                              backdropFilter: "blur(12px)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#64748b",
                              transition: "all 0.2s",
                            }}
                          >
                            <Trash2 style={{ width: "13px", height: "13px" }} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Production</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{movie.title}"? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(movie._id, movie.title)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </motion.div>
                  </div>

                  {/* ── Card Body ── */}
                  <div style={{ padding: "18px 20px 20px" }}>

                    {/* Title row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <h3
                        className="font-display"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          fontSize: "16px",
                          color: "#f1f5f9",
                          lineHeight: 1.25,
                          letterSpacing: "-0.3px",
                        }}
                      >
                        {movie.title}
                      </h3>
                      {movie.prediction === "Successful" && (
                        <Star
                          style={{
                            width: "14px",
                            height: "14px",
                            color: "#fbbf24",
                            fill: "#fbbf24",
                            flexShrink: 0,
                            marginTop: "2px",
                            filter: "drop-shadow(0 0 6px rgba(251,191,36,0.6))",
                          }}
                        />
                      )}
                    </div>

                    {/* Genre · Director */}
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "0",
                      }}
                    >
                      <span>{movie.genre}</span>
                      <span
                        style={{
                          width: "3px",
                          height: "3px",
                          borderRadius: "50%",
                          background: "#334155",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      <span>Dir. {movie.suggestedDirector || "TBD"}</span>
                    </p>

                    {/* ── Budget Bar ── */}
                    <div style={{ marginTop: "18px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "7px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#334155",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            fontWeight: 500,
                          }}
                        >
                          Budget
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            fontVariantNumeric: "tabular-nums",
                            fontWeight: 500,
                          }}
                        >
                          ${spentM}M{" "}
                          <span style={{ color: "#334155" }}>/</span> ${budgetM}M
                        </span>
                      </div>
                      {/* Track */}
                      <div
                        style={{
                          height: "3px",
                          borderRadius: "100px",
                          background: "rgba(255,255,255,0.05)",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${budgetPct}%` }}
                          transition={{ delay: i * 0.06 + 0.3, duration: 0.8, ease: "easeOut" }}
                          style={{
                            height: "100%",
                            borderRadius: "100px",
                            background: isOverBudget
                              ? "linear-gradient(to right, #f59e0b, #ef4444)"
                              : "linear-gradient(to right, #2563eb, #7c3aed)",
                            boxShadow: isOverBudget
                              ? "0 0 8px rgba(245,158,11,0.5)"
                              : "0 0 8px rgba(59,130,246,0.4)",
                          }}
                        />
                      </div>
                    </div>

                    {/* ── Progress + Ring ── */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#334155",
                            marginBottom: "4px",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            fontWeight: 500,
                          }}
                        >
                          Completion
                        </p>
                        <p
                          className="font-display"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 700,
                            fontSize: "24px",
                            color: "#f1f5f9",
                            lineHeight: 1,
                            letterSpacing: "-1px",
                          }}
                        >
                          {movie.progress}
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#475569",
                              fontWeight: 400,
                              marginLeft: "2px",
                            }}
                          >
                            %
                          </span>
                        </p>
                      </div>

                      {/* SVG ring */}
                      <div style={{ position: "relative", width: "48px", height: "48px" }}>
                        <svg
                          style={{
                            width: "100%",
                            height: "100%",
                            transform: "rotate(-90deg)",
                          }}
                          viewBox="0 0 44 44"
                        >
                          {/* Glow filter */}
                          <defs>
                            <filter id={`glow-${movie._id}`}>
                              <feGaussianBlur stdDeviation="1.5" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                            <linearGradient
                              id={`ringGrad-${movie._id}`}
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop offset="0%" stopColor="#2563eb" />
                              <stop offset="100%" stopColor="#7c3aed" />
                            </linearGradient>
                          </defs>
                          {/* Track */}
                          <circle
                            cx="22"
                            cy="22"
                            r="16"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="3"
                          />
                          {/* Progress arc */}
                          <circle
                            cx="22"
                            cy="22"
                            r="16"
                            fill="none"
                            stroke={`url(#ringGrad-${movie._id})`}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={ringCircumference}
                            strokeDashoffset={ringOffset(movie.progress)}
                            filter={`url(#glow-${movie._id})`}
                            style={{ transition: "stroke-dashoffset 0.9s ease" }}
                          />
                        </svg>
                        {/* Center label */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "9px",
                            fontWeight: 700,
                            color: "#3b82f6",
                            textShadow: "0 0 8px rgba(59,130,246,0.7)",
                            fontFamily: "'Space Grotesk', sans-serif",
                          }}
                        >
                          {movie.progress}%
                        </div>
                      </div>
                    </div>

                    {/* ── Footer ── */}
                    <div
                      style={{
                        marginTop: "16px",
                        paddingTop: "14px",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "10px",
                        color: "#334155",
                      }}
                    >
                      <span>
                        by{" "}
                        <span style={{ color: "#64748b", fontWeight: 500 }}>
                          {movie.createdBy?.name || "AI System"}
                        </span>
                      </span>
                      <span>
                        {new Date(movie.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ══ EMPTY STATE ══════════════════════════════════════ */}
        <AnimatePresence>
          {filteredAndSortedProductions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center", paddingTop: "80px", paddingBottom: "80px" }}
            >
              <div className="cineos-empty-icon-wrap">
                <Film
                  style={{
                    width: "36px",
                    height: "36px",
                    color: "rgba(59,130,246,0.18)",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              </div>
              <h3
                className="font-display"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "8px",
                  letterSpacing: "-0.5px",
                }}
              >
                {searchQuery
                  ? "No productions match your search"
                  : "No productions yet"}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#1e293b",
                  marginBottom: "28px",
                }}
              >
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first production"}
              </p>
              {!searchQuery && (
                <div
                  className="cineos-glow-pulse"
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
                    borderRadius: "12px",
                    padding: "1px",
                  }}
                >
                  <ProductionForm />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}