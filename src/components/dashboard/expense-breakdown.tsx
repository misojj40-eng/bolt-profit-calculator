"use client";

import * as React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { PieChartIcon, BarChart3 } from "lucide-react";
import type { CostSettings, ProfitResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { energyLabelKey } from "@/lib/calculator";

type Props = { result: ProfitResult; currency: string; fuelType: CostSettings["fuelType"] };

export function ExpenseBreakdown({ result, currency, fuelType }: Props) {
  const { t, money } = useI18n();
  const total = result.totalCosts;

  const labelFor = (key: string) =>
    key === "fuel" ? t(energyLabelKey(fuelType)) : t(`line.${key}`);

  const data = result.lines
    .filter((l) => l.amount > 0)
    .map((l) => ({ ...l, name: labelFor(l.key) }));

  const TooltipContent = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    const pct = total > 0 ? (p.amount / total) * 100 : 0;
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
        <div className="font-medium">{p.name}</div>
        <div className="tabular-nums text-muted-foreground">
          {money(p.amount, currency, 0)} · {pct.toFixed(1)}%
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("expense.title")}</CardTitle>
        <CardDescription>
          {t("expense.subtitle", { amount: money(total, currency, 0) })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="donut">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donut" className="gap-1.5">
              <PieChartIcon className="h-4 w-4" /> {t("expense.split")}
            </TabsTrigger>
            <TabsTrigger value="bar" className="gap-1.5">
              <BarChart3 className="h-4 w-4" /> {t("expense.ranking")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donut">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative h-52 w-full sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} dataKey="amount" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={2} strokeWidth={0}>
                      {data.map((d) => (<Cell key={d.key} fill={d.color} />))}
                    </Pie>
                    <Tooltip content={<TooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground">{t("expense.total")}</span>
                  <span className="text-lg font-bold tabular-nums">{money(total, currency, 0)}</span>
                </div>
              </div>
              <ul className="w-full space-y-2 sm:w-1/2">
                {data.map((d) => {
                  const pct = total > 0 ? (d.amount / total) * 100 : 0;
                  return (
                    <li key={d.key} className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="flex-1 truncate">{d.name}</span>
                      <span className="tabular-nums text-muted-foreground">{pct.toFixed(0)}%</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="bar">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={96} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<TooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                    {data.map((d) => (<Cell key={d.key} fill={d.color} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
