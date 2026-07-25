"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type Props = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional action rendered on the right of the header (does not toggle). */
  right?: React.ReactNode;
  /** Short summary shown on the right when collapsed. */
  summary?: React.ReactNode;
  defaultOpen?: boolean;
  storageKey?: string;
  /** Opens automatically when a matching "bdpc:open-section" event fires. */
  sectionId?: string;
  /** Render as a lightweight header bar instead of a full card. */
  bare?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function CollapsibleCard({
  icon: Icon, title, description, right, summary,
  defaultOpen = false, storageKey, sectionId, bare = false, className, children,
}: Props) {
  const [open, setOpen] = React.useState(defaultOpen);

  React.useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw != null) setOpen(raw === "1");
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const toggle = () => {
    setOpen((v) => {
      const next = !v;
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, next ? "1" : "0");
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  };

  React.useEffect(() => {
    if (!sectionId) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === sectionId) setOpen(true);
    };
    window.addEventListener("bdpc:open-section", handler);
    return () => window.removeEventListener("bdpc:open-section", handler);
  }, [sectionId]);

  const header = (
    <div className={cn("flex items-center gap-3", bare ? "px-4 py-3" : "p-5 sm:p-6")}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {Icon ? (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <span className="min-w-0">
          <span className="block truncate font-semibold leading-tight">{title}</span>
          {description ? (
            <span className="mt-0.5 block truncate text-sm text-muted-foreground">{description}</span>
          ) : null}
        </span>
      </button>
      {!open && summary ? (
        <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">{summary}</span>
      ) : null}
      {right}
      <button
        type="button"
        onClick={toggle}
        aria-label={title}
        aria-expanded={open}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
      >
        <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", open && "rotate-180")} />
      </button>
    </div>
  );

  const body = (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: "hidden" }}
        >
          <div className={cn(bare ? "pt-3" : "px-5 pb-5 sm:px-6 sm:pb-6")}>{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  if (bare) {
    return (
      <div className={className}>
        <div className="rounded-xl border border-border/60 bg-card">{header}</div>
        {body}
      </div>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {header}
      {body}
    </Card>
  );
}
