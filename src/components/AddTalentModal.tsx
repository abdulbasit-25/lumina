import { motion, AnimatePresence } from "framer-motion";
import { X, Save, UserPlus, Briefcase, Star, FlaskConical } from "lucide-react";
import { useState } from "react";
import { movieAPI } from "@/services/movieAPI";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { genres } from "@/lib/mockData";

interface AddTalentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "cast" | "crew";
  onSuccess: () => void;
}

export default function AddTalentModal({ isOpen, onClose, type, onSuccess }: AddTalentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    role: "",
    experience: "mid" as const,
    rating: 8.5,
    name: "",
    genre: "",
    role: "",
    experience: "mid",
    rating: 8.5,
    projects: 5,
    popularity: 50,
    available: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data: Record<string, unknown> = type === 'cast' ? {
        name: formData.name,
        genres: [formData.genre],
        role: formData.role,
        projects: formData.projects,
        rating: formData.rating,
        popularity: formData.popularity,
        available: formData.available
      } : {
        name: formData.name,
        role: formData.role,
        experience: formData.experience,
        rating: formData.rating,
        projects: formData.projects
      };
      await movieAPI.addTalent({ ...data, type });
      toast({ title: "Success", description: `${type === 'cast' ? 'Actor' : 'Crew member'} added successfully` });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-4">
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${type === 'cast' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'}`}>
                {type === 'cast' ? <UserPlus className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
              </div>
              <h2 className="text-2xl font-black text-white">Add New <span className={type === 'cast' ? 'text-cyan-500' : 'text-purple-500'}>{type === 'cast' ? 'Cast' : 'Crew'}</span></h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500/50 outline-none" />
              </div>

              {type === "cast" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Genre</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-left focus:border-cyan-500/50 outline-none flex items-center justify-between"
                        >
                          {formData.genre || "Select genre..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command value={formData.genre} onValueChange={(value) => setFormData({...formData, genre: value})}>
                          <CommandInput placeholder="Search genres..." />
                          <CommandList>
                            <CommandEmpty>No genre found.</CommandEmpty>
                            <CommandGroup>
                              {genres.map((genre) => (
                                <CommandItem
                                  key={genre}
                                  value={genre}
                                  onSelect={(value) => {
                                    setFormData({...formData, genre: value});
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.genre === genre ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {genre}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Role</label>
                    <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                      placeholder="e.g. Lead Actor"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500/50 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Projects</label>
                      <input type="number" value={formData.projects} onChange={e => setFormData({...formData, projects: +e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Rating</label>
                      <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: +e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Popularity</label>
                      <input type="number" value={formData.popularity} onChange={e => setFormData({...formData, popularity: +e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Available</label>
                      <select value={formData.available} onChange={e => setFormData({...formData, available: e.target.value === 'true'})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Role</label>
                    <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                      placeholder="e.g. Director of Photography"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-purple-500/50 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Exp Level</label>
                      <select value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none">
                        <option value="rookie">Rookie</option>
                        <option value="mid">Mid-Level</option>
                        <option value="veteran">Veteran</option>
                        <option value="legend">Legend</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Rating</label>
                      <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: +e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Projects</label>
                    <input type="number" value={formData.projects} onChange={e => setFormData({...formData, projects: +e.target.value})}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" />
                  </div>
                </>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-2 mt-4 ${type === 'cast' ? 'bg-cyan-600 shadow-cyan-900/20' : 'bg-purple-600 shadow-purple-900/20'}`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Confirm Addition
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
