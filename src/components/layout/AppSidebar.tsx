import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Users,
  UserCog,
  Calendar,
  DollarSign,
  Brain,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Movies", path: "/movies", icon: Film },
  { title: "Cast", path: "/cast", icon: Users },
  { title: "Crew", path: "/crew", icon: UserCog },
  { title: "Schedule", path: "/schedule", icon: Calendar },
  { title: "Budget", path: "/budget", icon: DollarSign },
  { title: "Models", path: "/model", icon: Brain },

];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* overlay on mobile when sidebar open */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border/50 bg-sidebar transition-all duration-300 lg:static lg:inset-auto lg:h-auto",
          collapsed ? "w-[70px]" : "w-[250px]",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center shrink-0">
          <Film className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-lg text-gradient">Lumina</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-link",
                active && "sidebar-link-active"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </RouterNavLink>
          );
        })}

        {/* AI Command Center - highlighted */}
        <div className="pt-4 mt-4 border-t border-border/30">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
              Intelligence
            </p>
          )}
          <RouterNavLink
            to="/ai-command"
            className={cn(
              "sidebar-link ai-highlight rounded-lg",
              location.pathname === "/ai-command" && "sidebar-link-active neon-glow"
            )}
          >
            <Sparkles className="w-5 h-5 shrink-0 text-neon-blue" />
            {!collapsed && (
              <span className="text-gradient font-semibold">AI Command Center</span>
            )}
          </RouterNavLink>
        </div>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border/50 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
      </button>
    </aside>
    </>
  );
}
