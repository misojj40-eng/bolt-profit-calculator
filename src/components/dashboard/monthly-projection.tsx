"use client";

import * as React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { CalendarRange, TrendingUp } from "lucide-react";
import type { ProfitResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

type Props = { result: ProfitResult; currency: string; workingDays: number };

export function MonthlyProjection({ result, currency, workingDays }: Props) {
  const { t, money, num } = useI18n();
  const data = [
    { name: t("monthly.earnings"), value: result.monthly.earnings, color: "hsl(199 89% 48%)" },
    { name: t("monthly.costs"), value: result.monthly.costs, color: "hsl(0 72% 55%)" },
    { name: t("monthly.net"), value: result.monthly.net, color: "hsl(158 84% 42%)" },
  ];

  const TooltipContent = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
        <div className="font-medium">{p.name}</div>
        <div className="tabular-nums text-muted-foreground">{money(p.value, currency, 0)}</div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
          {t("monthly.title")}
        </CardTitle>
        <CardDescription>{t("monthly.desc", { days: num(workingDays, 0) })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl bg-primary/10 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
            <TrendingUp className="h-4 w-4" /> {t("monthly.projectedNet")}
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-primary sm:text-3xl">
            {money(result.monthly.net, currency, 0)}
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis hide />
              <Tooltip content={<TooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((d) => (<Cell key={d.name} fill={d.color} />))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
