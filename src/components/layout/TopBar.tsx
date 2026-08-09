import { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, User, X, Film, Users, UserCog, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/contexts/SearchContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onOpenSidebar: () => void;
}

const typeIcons = {
  production: Film,
  cast: Users,
  crew: UserCog,
  schedule: Calendar,
};

export function TopBar({ onOpenSidebar }: TopBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { performSearch, results, query, isSearching } = useSearch();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = async (value: string) => {
    await performSearch(value);
    setIsOpen(value.length > 0);
  };

  const handleResultClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 border-b border-border/50 glass-panel-strong flex items-center justify-between px-3 md:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-md text-slate-300 hover:bg-slate-700/50"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-80 md:w-96" ref={searchRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search productions, cast, crew..."
          className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              performSearch('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search Results Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
            {isSearching ? (
              <div className="p-4 text-center text-muted-foreground">
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => {
                  const Icon = typeIcons[result.type];
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.path)}
                      className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex items-center gap-3"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{result.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{result.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-blue animate-glow-pulse" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
          <div className="w-9 h-9 rounded-full bg-gradient-neon flex items-center justify-center cursor-pointer hover:brightness-110 transition-all">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
