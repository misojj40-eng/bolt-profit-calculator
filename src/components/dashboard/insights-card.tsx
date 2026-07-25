"use client";

import * as React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Sparkles, CalendarHeart, Timer, Trophy } from "lucide-react";
import type { TripEntry } from "@/lib/trips";
import { computeInsights } from "@/lib/insights";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

type Props = { trips: TripEntry[]; currency: string };

function Tile({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-0.5 text-base font-bold tabular-nums sm:text-lg">{value}</div>
    </div>
  );
}

export function InsightsCard({ trips, currency }: Props) {
  const { t, money, weekdayShort, dateShort } = useI18n();
  const ins = React.useMemo(() => computeInsights(trips), [trips]);

  const chartData = ins.byWeekday.map((w) => ({
    label: weekdayShort(w.dow),
    avg: Math.round(w.avg),
    isBest: ins.bestWeekday?.dow === w.dow && w.count > 0,
  }));

  const TooltipContent = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
        <div className="font-medium">{p.label}</div>
        <div className="tabular-nums text-muted-foreground">{money(p.avg, currency, 0)}</div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          {t("insights.title")}
        </CardTitle>
        <CardDescription>{t("insights.desc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ins.count < 2 ? (
          <p className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            {t("insights.empty")}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Tile
                icon={CalendarHeart}
                label={t("insights.bestDay")}
                value={ins.bestWeekday ? weekdayShort(ins.bestWeekday.dow) : "—"}
              />
              <Tile icon={Timer} label={t("insights.avgPerHour")} value={money(ins.avgPerHour, currency, 0)} />
              <Tile icon={Sparkles} label={t("insights.avgPerDay")} value={money(ins.avgNet, currency, 0)} />
              <Tile
                icon={Trophy}
                label={t("insights.bestSingle")}
                value={ins.bestDay ? money(ins.bestDay.netProfit, currency, 0) : "—"}
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold">{t("insights.byWeekday")}</div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis hide />
                    <Tooltip content={<TooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
                    <Bar dataKey="avg" radius={[5, 5, 0, 0]}>
                      {chartData.map((d, i) => (
                        <Cell key={i} fill={d.isBest ? "hsl(var(--primary))" : "hsl(215 20% 55%)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
