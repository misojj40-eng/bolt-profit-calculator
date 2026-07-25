"use client";

import * as React from "react";
import { LayoutDashboard, NotebookPen, PieChart, Car, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const ITEMS = [
  { id: "overview", icon: LayoutDashboard, key: "nav.overview" },
  { id: "tracker", icon: NotebookPen, key: "nav.tracker" },
  { id: "analytics", icon: PieChart, key: "nav.analytics" },
  { id: "vehicle", icon: Car, key: "nav.vehicle" },
  { id: "costs", icon: Wrench, key: "nav.costs" },
] as const;

export function BottomNav() {
  const { t } = useI18n();
  const [active, setActive] = React.useState<string>("overview");

  React.useEffect(() => {
    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    window.dispatchEvent(new CustomEvent("bdpc:open-section", { detail: id }));
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl pb-safe md:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <li key={item.id} className="flex-1">
              <button
                type="button"
                onClick={() => go(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex min-h-[3.5rem] w-full flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                <span className="truncate">{t(item.key)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
