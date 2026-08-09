import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductions } from "@/contexts/ProductionsContext";
import { genres } from "@/lib/mockData";
import { movieAPI } from "@/services/movieAPI";
import { Plus, Image as ImageIcon, X, Film, Sparkles, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// Injected styles — scoped to .pf-root
// ─────────────────────────────────────────────────────────────
const PF_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

  /* ── Dialog overlay darkening ── */
  [data-radix-dialog-overlay] {
    backdrop-filter: blur(6px) !important;
    background: rgba(4,8,17,0.75) !important;
  }

  /* ── Dialog content shell ── */
  [data-radix-dialog-content].pf-dialog-content {
    background: #070d1a !important;
    border: 1px solid rgba(59,130,246,0.18) !important;
    border-radius: 24px !important;
    box-shadow:
      0 0 0 1px rgba(139,92,246,0.1),
      0 32px 80px rgba(0,0,0,0.7),
      0 0 60px rgba(59,130,246,0.08) !important;
    overflow: hidden;
    padding: 0 !important;
    max-width: 1050px !important;
    width: min(95vw, 1050px) !important;
  }

  /* ── Root wrapper ── */
  .pf-root {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #e2e8f0;
    position: relative;
  }

  /* Inner grid background */
  .pf-grid-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(59,130,246,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.035) 1px, transparent 1px);
    background-size: 44px 44px;
    border-radius: 24px;
    opacity: 0.6;
  }
  .pf-grid-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    background:
      radial-gradient(ellipse 60% 40% at 20% 0%, rgba(59,130,246,0.07), transparent),
      radial-gradient(ellipse 50% 40% at 85% 80%, rgba(139,92,246,0.06), transparent);
  }

  /* Header bar */
  .pf-header {
    position: relative;
    z-index: 1;
    padding: 28px 32px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding-bottom: 20px;
    margin-bottom: 0;
  }
  .pf-header::after {
    content: '';
    position: absolute;
    bottom: 0; left: 32px; right: 32px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(59,130,246,0.3), rgba(139,92,246,0.2), transparent);
  }

  .pf-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #fff 0%, #cbd5e1 40%, #818cf8 70%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 4px;
  }
  .pf-desc {
    font-size: 12px;
    color: #475569;
    margin: 0;
    font-weight: 400;
    letter-spacing: 0.1px;
  }

  /* Eyebrow tag */
  .pf-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #3b82f6;
    padding: 4px 10px;
    border-radius: 100px;
    border: 1px solid rgba(59,130,246,0.22);
    background: rgba(59,130,246,0.07);
    margin-bottom: 10px;
  }
  .pf-eyebrow-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #3b82f6;
    box-shadow: 0 0 6px rgba(59,130,246,0.8);
    animation: pf-pulse 2s ease-in-out infinite;
  }
  @keyframes pf-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.6; transform:scale(.85); }
  }

  /* Form body scroll area */
  .pf-body {
    position: relative;
    z-index: 1;
    padding: 24px 32px;
    overflow-y: auto;
    max-height: 65vh;
    scrollbar-width: thin;
    scrollbar-color: rgba(59,130,246,0.2) transparent;
  }
  .pf-body::-webkit-scrollbar { width: 4px; }
  .pf-body::-webkit-scrollbar-track { background: transparent; }
  .pf-body::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius: 4px; }

  /* Two-col grid */
  .pf-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 42px;
  }
  @media (max-width: 560px) {
    .pf-grid { grid-template-columns: 1fr; }
    .pf-header { padding: 20px 20px 16px; }
    .pf-body { padding: 16px 20px; }
    .pf-footer { padding: 16px 20px; }
    [data-radix-dialog-content].pf-dialog-content { border-radius: 18px !important; }
  }

  /* Section label */
  .pf-section-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #3b82f6;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pf-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, rgba(59,130,246,0.25), transparent);
  }

  /* Field label */
  .pf-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 7px;
  }
  .pf-label-required::after {
    content: ' *';
    color: #3b82f6;
  }

  /* Field wrapper */
  .pf-field { margin-bottom: 16px; }

  /* Input base */
  .pf-input {
    width: 100%;
    height: 38px;
    padding: 0 13px;
    background: rgba(255,255,255,0.04) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 10px !important;
    font-size: 13px !important;
    color: #e2e8f0 !important;
    font-family: 'Inter', sans-serif !important;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s !important;
    outline: none !important;
  }
  .pf-input::placeholder { color: #334155 !important; }
  .pf-input:focus {
    border-color: rgba(59,130,246,0.45) !important;
    background: rgba(255,255,255,0.06) !important;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1), 0 0 16px rgba(59,130,246,0.1) !important;
  }
  .pf-input:hover:not(:focus) {
    border-color: rgba(255,255,255,0.14) !important;
  }

  /* Number input arrows hidden */
  .pf-input[type="number"]::-webkit-outer-spin-button,
  .pf-input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
  .pf-input[type="number"] { -moz-appearance: textfield; }

  /* Error text */
  .pf-error {
    font-size: 11px;
    color: #f87171;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .pf-error::before { content: '⚠'; font-size: 10px; }

  /* Select trigger override */
  .pf-select-trigger {
    height: 38px !important;
    background: rgba(255,255,255,0.04) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 10px !important;
    font-size: 13px !important;
    color: #e2e8f0 !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;
  }
  .pf-select-trigger:focus, .pf-select-trigger[data-state="open"] {
    border-color: rgba(59,130,246,0.4) !important;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important;
  }

  /* Range slider */
  .pf-range {
    -webkit-appearance: none;
    width: 100%;
    height: 3px;
    border-radius: 100px;
    background: rgba(255,255,255,0.06);
    outline: none;
    cursor: pointer;
  }
  .pf-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    box-shadow: 0 0 10px rgba(59,130,246,0.5);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .pf-range::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 16px rgba(59,130,246,0.7);
  }
  .pf-range::-moz-range-thumb {
    width: 16px; height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    border: none;
    box-shadow: 0 0 10px rgba(59,130,246,0.5);
    cursor: pointer;
  }
  .pf-range-track {
    position: relative;
    margin-top: 4px;
  }
  .pf-range-fill {
    position: absolute;
    top: 0; left: 0;
    height: 3px;
    border-radius: 100px;
    background: linear-gradient(to right, #2563eb, #7c3aed);
    box-shadow: 0 0 8px rgba(59,130,246,0.4);
    pointer-events: none;
    transition: width 0.15s ease;
  }
  .pf-range-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 10px;
    color: #334155;
  }

  /* Poster panel */
  .pf-poster-panel {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 16px;
    position: relative;
    overflow: hidden;
  }
  .pf-poster-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(59,130,246,0.03), transparent 60%);
    border-radius: 14px;
    pointer-events: none;
  }

  /* Poster preview */
  .pf-poster-wrap {
    width: 90px;
    height: 130px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
    background: linear-gradient(135deg, #0f172a, #1a1040);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 0 auto 14px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .pf-poster-inner-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  .pf-poster-clear {
    position: absolute;
    top: 6px; right: 6px;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: rgba(0,0,0,0.75);
    border: 1px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
    z-index: 2;
  }
  .pf-poster-clear:hover { background: rgba(220,38,38,0.75); }

  /* File upload area */
  .pf-file-zone {
    border: 1px dashed rgba(59,130,246,0.2);
    border-radius: 8px;
    padding: 10px 12px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
  }
  .pf-file-zone:hover {
    border-color: rgba(59,130,246,0.4);
    background: rgba(59,130,246,0.04);
  }
  .pf-file-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
  }
  .pf-file-zone-text {
    font-size: 11px;
    color: #475569;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  /* Footer */
  .pf-footer {
    position: relative;
    z-index: 1;
    padding: 16px 32px 28px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .pf-footer::before {
    content: '';
    position: absolute;
    top: 0; left: 32px; right: 32px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(59,130,246,0.2), transparent);
  }

  /* Cancel button */
  .pf-btn-cancel {
    height: 38px;
    padding: 0 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    color: #64748b;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex; align-items: center;
  }
  .pf-btn-cancel:hover {
    color: #94a3b8;
    border-color: rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.07);
  }

  /* Submit button */
  .pf-btn-submit {
    height: 38px;
    padding: 0 24px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    color: #fff;
    background: linear-gradient(135deg, #1d4ed8, #6d28d9);
    border: none;
    cursor: pointer;
    transition: all 0.25s;
    display: inline-flex; align-items: center; gap: 7px;
    position: relative;
    overflow: hidden;
    letter-spacing: 0.2px;
  }
  .pf-btn-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
  }
  .pf-btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 0 20px rgba(59,130,246,0.45), 0 6px 20px rgba(0,0,0,0.3);
  }
  .pf-btn-submit:active:not(:disabled) { transform: scale(0.98); }
  .pf-btn-submit:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  @keyframes pf-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .pf-btn-submit-loading {
    background: linear-gradient(90deg, #1d4ed8 0%, #6d28d9 40%, #1d4ed8 80%);
    background-size: 200% auto;
    animation: pf-shimmer 1.8s linear infinite;
  }

  /* Default trigger button */
  .pf-trigger-btn {
    height: 38px;
    padding: 0 18px;
    border-radius: 11px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    color: #fff;
    background: linear-gradient(135deg, #1d4ed8, #6d28d9);
    border: none;
    cursor: pointer;
    transition: all 0.25s;
    display: inline-flex; align-items: center; gap: 7px;
    letter-spacing: 0.2px;
    position: relative;
    overflow: hidden;
  }
  .pf-trigger-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  }
  .pf-trigger-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 20px rgba(59,130,246,0.45), 0 4px 16px rgba(0,0,0,0.3);
  }

  /* Two-col mini grid */
  .pf-col-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* Progress display */
  .pf-progress-val {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -1px;
    background: linear-gradient(135deg, #3b82f6, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  /* Status dot in select */
  .pf-status-indicator {
    width: 7px; height: 7px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 7px;
    flex-shrink: 0;
  }
`;

function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: PF_STYLES }} />;
}

// ─────────────────────────────────────────────────────────────
// StatusDot helper
// ─────────────────────────────────────────────────────────────
function statusColor(status) {
  switch (status) {
    case "In Production":    return "#3b82f6";
    case "Post-Production":  return "#8b5cf6";
    case "Completed":        return "#10b981";
    default:                 return "#64748b";
  }
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export function ProductionForm({ production, trigger, onSuccess }) {
  // ── All backend logic preserved exactly ────────────────────────────────
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    budget: 0,
    runtime: 120,
    status: "Pre-Production",
    progress: 0,
    spent: 0,
    prediction: "",
    success_probability: 0,
    poster: undefined,
    poster_url: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const { addProduction, updateProduction } = useProductions();

  useEffect(() => {
    if (production) {
      setFormData({
        title: production.title || "",
        genre: production.genre || "",
        budget: production.budget || 0,
        runtime: production.runtime || 120,
        status: production.status,
        progress: production.progress || 0,
        spent: production.spent || 0,
        prediction: production.prediction || "",
        success_probability: production.success_probability || 0,
        poster: undefined,
        poster_url: production.poster_url || "",
      });
      setImagePreview(production.poster_url || null);
    } else {
      setFormData({
        title: "",
        genre: "",
        budget: 0,
        runtime: 120,
        status: "Pre-Production",
        progress: 0,
        spent: 0,
        prediction: "",
        success_probability: 0,
        poster: undefined,
        poster_url: "",
      });
      setImagePreview(null);
    }
  }, [production, open]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, poster: "Please select an image file" }));
        return;
      }
      try {
        const base64 = await movieAPI.fileToBase64(file);
        setFormData((prev) => ({ ...prev, poster: base64 }));
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, poster: "" }));
      } catch {
        setErrors((prev) => ({ ...prev, poster: "Failed to process image" }));
      }
    }
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, poster: undefined, poster_url: "" }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.genre) newErrors.genre = "Genre is required";
    if (formData.budget <= 0) newErrors.budget = "Budget must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (production) {
        await updateProduction(production._id, formData);
      } else {
        await addProduction({
          ...formData,
          prediction: "Successful",
          success_probability: 75,
          popularity: 50,
          vote_average: 7.0,
          vote_count: 100,
        });
      }
      setOpen(false);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };
  // ───────────────────────────────────────────────────────────────────────

  const isEdit = Boolean(production);
  const hasPoster = imagePreview || formData.poster_url;

  const defaultTrigger = (
    <button className="pf-trigger-btn">
      <Plus style={{ width: "14px", height: "14px", position: "relative", zIndex: 1 }} />
      <span style={{ position: "relative", zIndex: 1 }}>Add Production</span>
    </button>
  );

  return (
    <>
      <StyleInjector />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>

        <DialogContent className="pf-dialog-content">
          <div className="pf-root">
            {/* Grid BG */}
            <div className="pf-grid-bg" aria-hidden="true" />

            {/* ── Header ── */}
            <div className="pf-header">
              <div className="pf-eyebrow">
                <span className="pf-eyebrow-dot" />
                {isEdit ? "Editing Production" : "New Production"}
              </div>
              <h2 className="pf-title">
                {isEdit ? "Update Production" : "Add New Production"}
              </h2>
              <p className="pf-desc">
                {isEdit
                  ? "Update the details of this production below."
                  : "Fill in the details to create a new production entry."}
              </p>
            </div>

            {/* ── Body ── */}
            <form onSubmit={handleSubmit}>
              <div className="pf-body">
                <div className="pf-grid">

                  {/* ════ LEFT COL ════ */}
                  <div>
                    <div className="pf-section-label">Details</div>

                    {/* Title */}
                    <div className="pf-field">
                      <label className="pf-label pf-label-required">Title</label>
                      <input
                        className="pf-input"
                        placeholder="e.g. Inception III"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, title: e.target.value }))
                        }
                      />
                      {errors.title && (
                        <p className="pf-error">{errors.title}</p>
                      )}
                    </div>

                    {/* Genre + Runtime */}
                    <div className="pf-col-2">
                      <div className="pf-field">
                        <label className="pf-label pf-label-required">Genre</label>
                        <Select
                          value={formData.genre}
                          onValueChange={(v) =>
                            setFormData((p) => ({ ...p, genre: v }))
                          }
                        >
                          <SelectTrigger className="pf-select-trigger">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {genres.map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.genre && (
                          <p className="pf-error">{errors.genre}</p>
                        )}
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Runtime (min)</label>
                        <input
                          className="pf-input"
                          type="number"
                          value={formData.runtime}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, runtime: Number(e.target.value) }))
                          }
                        />
                      </div>
                    </div>

                    {/* Budget + Spent */}
                    <div className="pf-col-2">
                      <div className="pf-field">
                        <label className="pf-label pf-label-required">Budget ($)</label>
                        <input
                          className="pf-input"
                          type="number"
                          value={formData.budget}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, budget: Number(e.target.value) }))
                          }
                        />
                        {errors.budget && (
                          <p className="pf-error">{errors.budget}</p>
                        )}
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Spent ($)</label>
                        <input
                          className="pf-input"
                          type="number"
                          value={formData.spent}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, spent: Number(e.target.value) }))
                          }
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="pf-field">
                      <label className="pf-label">Status</label>
                      <Select
                        value={formData.status}
                        onValueChange={(v) =>
                          setFormData((p) => ({ ...p, status: v }))
                        }
                      >
                        <SelectTrigger className="pf-select-trigger">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Pre-Production", "In Production", "Post-Production", "Completed"].map((s) => (
                            <SelectItem key={s} value={s}>
                              <span
                                className="pf-status-indicator"
                                style={{ background: statusColor(s) }}
                              />
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Progress */}
                    <div className="pf-field">
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "10px" }}>
                        <label className="pf-label" style={{ marginBottom: 0 }}>Progress</label>
                        <span className="pf-progress-val">{formData.progress}%</span>
                      </div>
                      <div className="pf-range-track">
                        <div
                          className="pf-range-fill"
                          style={{ width: `${formData.progress}%` }}
                        />
                        <input
                          className="pf-range"
                          type="range"
                          min="0"
                          max="100"
                          value={formData.progress}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, progress: Number(e.target.value) }))
                          }
                        />
                      </div>
                      <div className="pf-range-labels">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  {/* ════ RIGHT COL ════ */}
                  <div>
                    <div className="pf-section-label">Poster & AI</div>

                    {/* Poster panel */}
                    <div className="pf-poster-panel" style={{ marginBottom: "16px" }}>
                      {/* Preview */}
                      <div className="pf-poster-wrap">
                        {hasPoster ? (
                          <>
                            <img
                              src={formData.poster || formData.poster_url || imagePreview || ""}
                              alt="Poster preview"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <button
                              type="button"
                              className="pf-poster-clear"
                              onClick={clearImage}
                              title="Remove poster"
                            >
                              <X style={{ width: "10px", height: "10px", color: "#e2e8f0" }} />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="pf-poster-inner-grid" />
                            <Film
                              style={{
                                width: "24px",
                                height: "24px",
                                color: "rgba(59,130,246,0.2)",
                                position: "relative",
                                zIndex: 1,
                              }}
                            />
                          </>
                        )}
                      </div>

                      {/* Upload zone */}
                      <div className="pf-file-zone">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          title="Upload poster"
                        />
                        <div className="pf-file-zone-text">
                          <Upload style={{ width: "12px", height: "12px", color: "#3b82f6" }} />
                          <span>Upload image</span>
                        </div>
                      </div>

                      {/* URL input */}
                      <input
                        className="pf-input"
                        placeholder="Or paste image URL…"
                        value={formData.poster_url}
                        onChange={(e) => {
                          const url = e.target.value;
                          setFormData((p) => ({ ...p, poster_url: url, poster: undefined }));
                          if (url) setImagePreview(url);
                        }}
                        style={{ marginTop: "0" }}
                      />
                      {errors.poster && (
                        <p className="pf-error">{errors.poster}</p>
                      )}
                    </div>

                    {/* Prediction + Success % */}
                    <div className="pf-section-label" style={{ marginTop: "4px" }}>AI Prediction</div>
                    <div className="pf-col-2">
                      <div className="pf-field">
                        <label className="pf-label">Prediction</label>
                        <Select
                          value={formData.prediction}
                          onValueChange={(v) =>
                            setFormData((p) => ({ ...p, prediction: v }))
                          }
                        >
                          <SelectTrigger className="pf-select-trigger">
                            <SelectValue placeholder="—" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Successful">
                              ✦ Successful
                            </SelectItem>
                            <SelectItem value="Unsuccessful">
                              ✕ Unsuccessful
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pf-field">
                        <label className="pf-label">Success %</label>
                        <input
                          className="pf-input"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.success_probability}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              success_probability: Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Success probability mini bar */}
                    {formData.success_probability > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: "10px",
                          padding: "12px 14px",
                          marginTop: "-4px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "10px", color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase", fontWeight: 600 }}>
                            Success Probability
                          </span>
                          <span
                            style={{
                              fontSize: "13px",
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 700,
                              color: formData.success_probability >= 60 ? "#10b981" : formData.success_probability >= 40 ? "#f59e0b" : "#f87171",
                              textShadow: `0 0 10px ${formData.success_probability >= 60 ? "rgba(16,185,129,0.4)" : formData.success_probability >= 40 ? "rgba(245,158,11,0.4)" : "rgba(248,113,113,0.4)"}`,
                            }}
                          >
                            {formData.success_probability}%
                          </span>
                        </div>
                        <div style={{ height: "3px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(formData.success_probability, 100)}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            style={{
                              height: "100%",
                              borderRadius: "100px",
                              background: formData.success_probability >= 60
                                ? "linear-gradient(to right, #059669, #10b981)"
                                : formData.success_probability >= 40
                                  ? "linear-gradient(to right, #d97706, #f59e0b)"
                                  : "linear-gradient(to right, #dc2626, #f87171)",
                              boxShadow: `0 0 8px ${formData.success_probability >= 60 ? "rgba(16,185,129,0.4)" : "rgba(245,158,11,0.3)"}`,
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Footer ── */}
              <div className="pf-footer">
                <div style={{ fontSize: "11px", color: "#334155", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span className="pf-eyebrow-dot" style={{ width: "4px", height: "4px" }} />
                  {isEdit ? "Changes will sync immediately" : "Production will be created instantly"}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="pf-btn-cancel"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`pf-btn-submit ${isSubmitting ? "pf-btn-submit-loading" : ""}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span style={{ position: "relative", zIndex: 1 }}>
                          {isEdit ? "Updating…" : "Creating…"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles style={{ width: "13px", height: "13px", position: "relative", zIndex: 1 }} />
                        <span style={{ position: "relative", zIndex: 1 }}>
                          {isEdit ? "Update Production" : "Create Production"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}