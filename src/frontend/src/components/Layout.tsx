import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  BookMarked,
  Briefcase,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Settings,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
  Icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/", Icon: LayoutDashboard },
  { label: "Watchlist", path: "/watchlist", Icon: BookMarked },
  { label: "Portfolio", path: "/portfolio", Icon: Briefcase },
  { label: "Settings", path: "/settings", Icon: Settings },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const location = useLocation();
  const active = location.pathname;

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center flex-shrink-0">
          <TrendingUp
            className="w-4 h-4 text-primary-foreground"
            strokeWidth={2.5}
          />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display font-bold text-sm tracking-wide text-foreground">
            QUANTUM
          </span>
          <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
            Trade
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p className="data-label px-3 pb-2 pt-1">Navigation</p>
        {NAV_ITEMS.map(({ label, path, Icon, badge }) => {
          const isActive =
            path === "/" ? active === "/" : active.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              onClick={onNav}
              data-ocid={`nav.${label.toLowerCase()}_link`}
              className={cn("sidebar-nav-item", isActive && "active")}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 min-w-0 truncate">{label}</span>
              {badge && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1 py-0 h-4"
                >
                  {badge}
                </Badge>
              )}
              {isActive && (
                <ChevronRight className="w-3 h-3 opacity-40 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="opacity-40" />

      {/* Status footer */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
          <span>Markets Open</span>
          <span className="ml-auto font-mono tabular-nums">NYSE</span>
        </div>
      </div>
    </div>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 border-r border-sidebar-border bg-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close menu overlay"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 flex flex-col border-r border-sidebar-border md:hidden transition-transform duration-200 bg-sidebar",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex justify-end px-2 pt-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            data-ocid="nav.close_button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <SidebarContent onNav={() => setMobileOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 h-12 border-b border-border bg-card flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            data-ocid="nav.hamburger_button"
          >
            <Menu className="w-4 h-4" />
          </Button>

          <div className="flex-1 min-w-0" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative"
              aria-label="Notifications"
              data-ocid="nav.notifications_button"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
