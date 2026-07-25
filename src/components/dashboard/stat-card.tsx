"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type Tone = "primary" | "neutral" | "danger" | "info";

const toneStyles: Record<Tone, { icon: string; ring: string }> = {
  primary: { icon: "text-primary bg-primary/10", ring: "before:bg-primary/20" },
  neutral: { icon: "text-foreground bg-muted", ring: "before:bg-foreground/10" },
  danger: { icon: "text-destructive bg-destructive/10", ring: "before:bg-destructive/20" },
  info: { icon: "text-sky-500 bg-sky-500/10", ring: "before:bg-sky-500/20" },
};

type Props = {
  label: string;
  icon: LucideIcon;
  tone?: Tone;
  children: React.ReactNode;
  sub?: React.ReactNode;
  delay?: number;
};

export function StatCard({ label, icon: Icon, tone = "neutral", children, sub, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="relative overflow-hidden p-5 h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <div className="text-2xl font-bold tabular-nums leading-tight">{children}</div>
            {sub ? <div className="text-xs text-muted-foreground">{sub}</div> : null}
          </div>
          <div className={cn("grid h-10 w-10 place-items-center rounded-xl", toneStyles[tone].icon)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
