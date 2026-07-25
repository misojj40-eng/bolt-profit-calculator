"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import type { ProfitResult } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { AnimatedNumber } from "./animated-number";
import { cn } from "@/lib/utils";

type Props = { result: ProfitResult; currency: string };

export function ProfitHero({ result, currency }: Props) {
  const { t, money, num } = useI18n();
  const positive = result.netProfit >= 0;
  const fmt = (n: number) => money(n, currency, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="relative overflow-hidden border-primary/20 gradient-mesh p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={positive ? "success" : "destructive"} className="gap-1">
            <Wallet className="h-3.5 w-3.5" />
            {t("hero.badge")}
          </Badge>
          <Badge variant="outline" className="tabular-nums">
            {t("hero.margin", { pct: num(result.margin * 100, 0) })}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
          <AnimatedNumber
            value={result.netProfit}
            format={fmt}
            className={cn(
              "text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl",
              positive ? "text-foreground" : "text-destructive"
            )}
          />
          <span
            className={cn(
              "mb-1.5 inline-flex items-center gap-1 text-sm font-semibold",
              positive ? "text-primary" : "text-destructive"
            )}
          >
            {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {t("hero.ofEarned", { amount: fmt(result.earnings) })}
          </span>
        </div>

        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          {t("hero.keepLine", { kept: fmt(result.margin * 100), per: fmt(100) })}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md sm:gap-4">
          <div className="rounded-xl bg-background/60 p-3 backdrop-blur">
            <div className="text-xs text-muted-foreground">{t("hero.gross")}</div>
            <div className="text-base font-bold tabular-nums sm:text-lg">{fmt(result.earnings)}</div>
          </div>
          <div className="rounded-xl bg-background/60 p-3 backdrop-blur">
            <div className="text-xs text-muted-foreground">{t("hero.totalCosts")}</div>
            <div className="text-base font-bold tabular-nums text-destructive sm:text-lg">
              −{fmt(result.totalCosts)}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
