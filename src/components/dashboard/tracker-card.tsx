"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { CalendarPlus, Trash2, TrendingUp, NotebookPen } from "lucide-react";
import type { TripEntry } from "@/lib/trips";
import { sortByDateAsc, sortByDateDesc, summarize } from "@/lib/trips";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";

type Props = {
  trips: TripEntry[];
  currency: string;
  logDate: string;
  onChangeDate: (iso: string) => void;
  onLog: () => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-base font-bold tabular-nums sm:text-lg">{value}</div>
    </div>
  );
}

export function TrackerCard({
  trips, currency, logDate, onChangeDate, onLog, onDelete, onClear,
}: Props) {
  const { t, money, num, dateShort } = useI18n();
  const summary = React.useMemo(() => summarize(trips), [trips]);
  const chartData = React.useMemo(
    () =>
      sortByDateAsc(trips)
        .slice(-30)
        .map((tr) => ({ date: tr.date, net: Math.round(tr.netProfit), label: dateShort(tr.date) })),
    [trips, dateShort]
  );
  const history = React.useMemo(() => sortByDateDesc(trips), [trips]);

  const TooltipContent = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
        <div className="font-medium">{p.label}</div>
        <div className="tabular-nums text-muted-foreground">{money(p.net, currency, 0)}</div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <NotebookPen className="h-4 w-4" />
          </span>
          {t("tracker.title")}
        </CardTitle>
        <CardDescription>{t("tracker.desc")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Log controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <label htmlFor="logDate" className="text-sm font-medium">
              {t("tracker.date")}
            </label>
            <input
              id="logDate"
              type="date"
              value={logDate}
              onChange={(e) => onChangeDate(e.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
            />
          </div>
          <Button onClick={onLog} className="h-11 flex-1 sm:flex-none">
            <CalendarPlus className="h-4 w-4" /> {t("tracker.logToday")}
          </Button>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryTile label={t("tracker.daysLogged")} value={num(summary.count, 0)} />
          <SummaryTile label={t("tracker.thisWeek")} value={money(summary.weekNet, currency, 0)} />
          <SummaryTile label={t("tracker.thisMonth")} value={money(summary.monthNet, currency, 0)} />
          <SummaryTile label={t("tracker.avgPerDay")} value={money(summary.avgNet, currency, 0)} />
        </div>

        {trips.length === 0 ? (
          <p className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            {t("tracker.empty")}
          </p>
        ) : (
          <>
            {/* Trend */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-muted-foreground" /> {t("tracker.trend")}
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis hide />
                    <Tooltip content={<TooltipContent />} cursor={{ stroke: "hsl(var(--border))" }} />
                    <Line type="monotone" dataKey="net" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Separator />

            {/* History */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{t("tracker.history")}</span>
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onClear}>
                  {t("tracker.clearAll")}
                </Button>
              </div>
              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {history.map((tr) => (
                    <motion.li
                      key={tr.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{dateShort(tr.date)}</div>
                        <div className="truncate text-xs text-muted-foreground tabular-nums">
                          {num(tr.distanceKm, 0)} {t("unit.km")} · {num(tr.hours, 1)} {t("unit.hour")} · {money(tr.earnings, tr.currency, 0)}
                        </div>
                      </div>
                      <div className={tr.netProfit >= 0 ? "text-sm font-bold tabular-nums text-primary" : "text-sm font-bold tabular-nums text-destructive"}>
                        {money(tr.netProfit, tr.currency, 0)}
                      </div>
                      <button
                        type="button"
                        aria-label={t("tracker.delete")}
                        onClick={() => onDelete(tr.id)}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
