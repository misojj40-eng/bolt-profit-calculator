"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Target, Flame } from "lucide-react";
import type { Goal } from "@/lib/goals";
import type { TripEntry } from "@/lib/trips";
import { computeGoalStats } from "@/lib/goals";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { NumberField } from "./number-field";

type Props = {
  goal: Goal;
  onChangeGoal: (patch: Partial<Goal>) => void;
  trips: TripEntry[];
  todayNetLive: number;
  currency: string;
  symbol: string;
};

function Ring({ pct, label, value, sub }: { pct: number; label: string; value: string; sub: string }) {
  const clamped = Math.max(0, Math.min(1, pct));
  const r = 34;
  const c = 2 * Math.PI * r;
  const hit = pct >= 1;
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-[84px] w-[84px] shrink-0">
        <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
          <circle cx="42" cy="42" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="9" />
          <motion.circle
            cx="42" cy="42" r={r} fill="none"
            stroke={hit ? "hsl(var(--primary))" : "hsl(158 84% 45%)"}
            strokeWidth="9" strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - clamped * c }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums">
          {Math.round(pct * 100)}%
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-bold tabular-nums">{value}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

export function GoalCard({ goal, onChangeGoal, trips, todayNetLive, currency, symbol }: Props) {
  const { t, money } = useI18n();
  const stats = React.useMemo(
    () => computeGoalStats(trips, goal, todayNetLive),
    [trips, goal, todayNetLive]
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-4 w-4" />
              </span>
              {t("goal.title")}
            </CardTitle>
            <CardDescription className="mt-1">{t("goal.desc")}</CardDescription>
          </div>
          <Badge variant={stats.streak > 0 ? "success" : "secondary"} className="gap-1">
            <Flame className="h-3.5 w-3.5" />
            {stats.streak > 0 ? t("goal.streak", { n: stats.streak }) : t("goal.streakNone")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Ring
            pct={stats.todayPct}
            label={t("goal.today")}
            value={money(stats.todayNet, currency, 0)}
            sub={t("goal.ofTarget", { target: money(goal.dailyTarget, currency, 0) })}
          />
          <Ring
            pct={stats.weekPct}
            label={t("goal.week")}
            value={money(stats.weekNet, currency, 0)}
            sub={t("goal.ofTarget", { target: money(stats.weekTarget, currency, 0) })}
          />
        </div>

        {stats.todayPct >= 1 ? (
          <div className="rounded-lg bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
            {t("goal.hitToday")}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            id="dailyTarget"
            label={t("goal.dailyTarget")}
            prefix={symbol}
            step={100}
            value={goal.dailyTarget}
            onChange={(n) => onChangeGoal({ dailyTarget: n })}
          />
          <NumberField
            id="daysPerWeek"
            label={t("goal.daysPerWeek")}
            step={1}
            min={1}
            value={goal.daysPerWeek}
            onChange={(n) => onChangeGoal({ daysPerWeek: Math.max(1, Math.min(7, n)) })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
