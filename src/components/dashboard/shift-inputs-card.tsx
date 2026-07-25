"use client";

import * as React from "react";
import { Banknote, Route, Clock } from "lucide-react";
import type { ShiftInputs } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";
import { NumberField } from "./number-field";

type Props = {
  value: ShiftInputs;
  onChange: (patch: Partial<ShiftInputs>) => void;
  symbol: string;
};

export function ShiftInputsCard({ value, onChange, symbol }: Props) {
  const { t, num } = useI18n();
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Banknote className="h-4 w-4" />
          </span>
          {t("shift.title")}
        </CardTitle>
        <CardDescription>{t("shift.desc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NumberField
          id="earnings"
          label={t("shift.earnings")}
          hint={t("shift.earnings.hint")}
          prefix={symbol}
          step={10}
          value={value.earnings}
          onChange={(n) => onChange({ earnings: n })}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Route className="h-4 w-4 text-muted-foreground" /> {t("shift.distance")}
            </Label>
            <span className="text-sm font-semibold tabular-nums">
              {num(value.distanceKm, 0)} {t("unit.km")}
            </span>
          </div>
          <Slider
            value={[value.distanceKm]}
            min={0}
            max={600}
            step={5}
            onValueChange={([v]) => onChange({ distanceKm: v })}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" /> {t("shift.hours")}
            </Label>
            <span className="text-sm font-semibold tabular-nums">
              {num(value.hours, 1)} {t("unit.hour")}
            </span>
          </div>
          <Slider
            value={[value.hours]}
            min={0}
            max={16}
            step={0.5}
            onValueChange={([v]) => onChange({ hours: v })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
