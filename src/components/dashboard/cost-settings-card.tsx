"use client";

import * as React from "react";
import { Wrench, ShieldCheck, RotateCcw } from "lucide-react";
import type { CostSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/calculator";
import { CollapsibleCard } from "./collapsible-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import { NumberField } from "./number-field";

type Props = {
  value: CostSettings;
  onChange: (patch: Partial<CostSettings>) => void;
  onReset: () => void;
  symbol: string;
};

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {children}
    </div>
  );
}

export function CostSettingsCard({ value, onChange, onReset, symbol }: Props) {
  const { t } = useI18n();
  return (
    <CollapsibleCard
      icon={Wrench}
      title={t("costs.title")}
      description={t("costs.desc")}
      storageKey="bdpc.ui.costs"
      sectionId="costs"
      defaultOpen={false}
      right={
        <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
          <RotateCcw className="h-4 w-4" /> {t("costs.reset")}
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <SectionTitle icon={Wrench}>{t("costs.wear")}</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <NumberField id="depreciation" label={t("costs.depreciation")} suffix={t("unit.perKm")} prefix={symbol} step={0.1} value={value.depreciationPerKm} onChange={(n) => onChange({ depreciationPerKm: n })} />
            <NumberField id="maintenance" label={t("costs.maintenance")} suffix={t("unit.perKm")} prefix={symbol} step={0.1} value={value.maintenancePerKm} onChange={(n) => onChange({ maintenancePerKm: n })} />
            <NumberField id="tyresCost" label={t("costs.tyreSet")} prefix={symbol} step={100} value={value.tyresSetCost} onChange={(n) => onChange({ tyresSetCost: n })} />
            <NumberField id="tyresLife" label={t("costs.tyreLife")} suffix={t("unit.km")} step={1000} value={value.tyresLifespanKm} onChange={(n) => onChange({ tyresLifespanKm: n })} />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <SectionTitle icon={ShieldCheck}>{t("costs.recurringTax")}</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <NumberField id="insurance" label={t("costs.insurance")} suffix={t("unit.perMonth")} prefix={symbol} step={50} value={value.insuranceMonthly} onChange={(n) => onChange({ insuranceMonthly: n })} />
            <NumberField id="phone" label={t("costs.phone")} suffix={t("unit.perMonth")} prefix={symbol} step={50} value={value.phoneMonthly} onChange={(n) => onChange({ phoneMonthly: n })} />
            <NumberField id="other" label={t("costs.other")} suffix={t("unit.perMonth")} prefix={symbol} step={50} value={value.otherMonthly} onChange={(n) => onChange({ otherMonthly: n })} />
            <NumberField id="tax" label={t("costs.tax")} suffix="%" step={0.5} value={value.taxRatePercent} onChange={(n) => onChange({ taxRatePercent: n })} />
            <NumberField id="days" label={t("costs.workingDays")} suffix={t("unit.perMonth")} step={1} min={1} value={value.workingDaysPerMonth} onChange={(n) => onChange({ workingDaysPerMonth: n })} className="col-span-2" />
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
}

export { DEFAULT_SETTINGS };
