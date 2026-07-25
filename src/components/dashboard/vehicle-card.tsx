"use client";

import * as React from "react";
import { Car, Info, RotateCcw, Zap, Fuel, Home, MapPin, BatteryCharging } from "lucide-react";
import type { CostSettings } from "@/lib/types";
import type { FuelType, VehicleSelection } from "@/lib/vehicles";
import {
  getBrands, getModels, getYears, getFuelTypes, getTrims, getTrim, resolveSelection,
} from "@/lib/vehicles";
import { specToSettingsPatch } from "@/lib/vehicles/apply";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberField } from "./number-field";

type Props = {
  settings: CostSettings;
  onChangeSettings: (patch: Partial<CostSettings>) => void;
  selection: VehicleSelection | null;
  onChangeSelection: (sel: VehicleSelection | null) => void;
  symbol: string;
};

export function VehicleCard({ settings, onChangeSettings, selection, onChangeSelection, symbol }: Props) {
  const { t, num } = useI18n();
  const fuelLabel = (f: FuelType) => t(`fuel.${f}`);

  const brands = getBrands();
  const trim = resolveSelection(selection);
  const isEv = settings.fuelType === "ev";
  const isPhev = settings.fuelType === "phev";
  const electric = isEv || isPhev;
  const liquid = settings.fuelType !== "ev";

  const factoryFuel = trim?.spec.fuelConsumption;
  const factoryEnergy = trim?.spec.energyConsumption;
  const fuelOverridden = factoryFuel != null && Math.abs(factoryFuel - settings.fuelConsumption) > 0.01;
  const energyOverridden = factoryEnergy != null && Math.abs(factoryEnergy - settings.energyConsumption) > 0.01;

  const applyTrim = (brandId: string, modelId: string, fuelType: FuelType, trimId: string) => {
    const tr = getTrim({ brandId, modelId, trimId });
    if (tr) onChangeSettings(specToSettingsPatch(tr, settings));
  };

  const onBrand = (brandId: string) => {
    const model = getModels(brandId)[0];
    if (!model) {
      onChangeSelection({ brandId, modelId: "", year: 0, fuelType: settings.fuelType, trimId: "" });
      return;
    }
    const fuel = getFuelTypes(brandId, model.id)[0];
    const tr = getTrims(brandId, model.id, fuel)[0];
    onChangeSelection({ brandId, modelId: model.id, year: model.years[0], fuelType: fuel, trimId: tr?.id ?? "" });
    if (tr) applyTrim(brandId, model.id, fuel, tr.id);
  };

  const onModel = (modelId: string) => {
    if (!selection) return;
    const fuel = getFuelTypes(selection.brandId, modelId)[0];
    const tr = getTrims(selection.brandId, modelId, fuel)[0];
    onChangeSelection({ ...selection, modelId, year: getYears(selection.brandId, modelId)[0], fuelType: fuel, trimId: tr?.id ?? "" });
    if (tr) applyTrim(selection.brandId, modelId, fuel, tr.id);
  };

  const onYear = (year: string) => selection && onChangeSelection({ ...selection, year: Number(year) });

  const onFuel = (fuel: FuelType) => {
    if (!selection) return;
    const tr = getTrims(selection.brandId, selection.modelId, fuel)[0];
    onChangeSelection({ ...selection, fuelType: fuel, trimId: tr?.id ?? "" });
    if (tr) applyTrim(selection.brandId, selection.modelId, fuel, tr.id);
  };

  const onTrim = (trimId: string) => {
    if (!selection) return;
    onChangeSelection({ ...selection, trimId });
    applyTrim(selection.brandId, selection.modelId, selection.fuelType, trimId);
  };

  const resetFuel = () => factoryFuel != null && onChangeSettings({ fuelConsumption: factoryFuel });
  const resetEnergy = () => factoryEnergy != null && onChangeSettings({ energyConsumption: factoryEnergy });

  const models = selection ? getModels(selection.brandId) : [];
  const years = selection ? getYears(selection.brandId, selection.modelId) : [];
  const fuelTypes = selection ? getFuelTypes(selection.brandId, selection.modelId) : [];
  const trims = selection ? getTrims(selection.brandId, selection.modelId, selection.fuelType) : [];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Car className="h-4 w-4" />
              </span>
              {t("vehicle.title")}
            </CardTitle>
            <CardDescription className="mt-1">{t("vehicle.desc")}</CardDescription>
          </div>
          {selection ? (
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => onChangeSelection(null)}>
              {t("vehicle.manual")}
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <Label>{t("vehicle.brand")}</Label>
            <Select value={selection?.brandId ?? ""} onValueChange={onBrand}>
              <SelectTrigger><SelectValue placeholder={t("vehicle.selectBrand")} /></SelectTrigger>
              <SelectContent>{brands.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}</SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>{t("vehicle.model")}</Label>
            <Select value={selection?.modelId ?? ""} onValueChange={onModel} disabled={!selection}>
              <SelectTrigger><SelectValue placeholder={t("vehicle.model")} /></SelectTrigger>
              <SelectContent>{models.map((m) => (<SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>))}</SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>{t("vehicle.year")}</Label>
            <Select value={selection ? String(selection.year) : ""} onValueChange={onYear} disabled={!selection}>
              <SelectTrigger><SelectValue placeholder={t("vehicle.year")} /></SelectTrigger>
              <SelectContent>{years.map((y) => (<SelectItem key={y} value={String(y)}>{y}</SelectItem>))}</SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>{t("vehicle.engineFuel")}</Label>
            <Select value={selection?.fuelType ?? ""} onValueChange={(v) => onFuel(v as FuelType)} disabled={!selection}>
              <SelectTrigger><SelectValue placeholder={t("vehicle.engineFuel")} /></SelectTrigger>
              <SelectContent>{fuelTypes.map((f) => (<SelectItem key={f} value={f}>{fuelLabel(f)}</SelectItem>))}</SelectContent>
            </Select>
          </div>

          {trims.length > 1 ? (
            <div className="space-y-1.5 col-span-2">
              <Label>{t("vehicle.trim")}</Label>
              <Select value={selection?.trimId ?? ""} onValueChange={onTrim} disabled={!selection}>
                <SelectTrigger><SelectValue placeholder={t("vehicle.trim")} /></SelectTrigger>
                <SelectContent>{trims.map((tr) => (<SelectItem key={tr.id} value={tr.id}>{tr.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          ) : null}
        </div>

        {!selection ? (
          <div className="space-y-1.5">
            <Label>{t("vehicle.fuelManual")}</Label>
            <Select value={settings.fuelType} onValueChange={(v) => onChangeSettings({ fuelType: v as FuelType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["petrol", "diesel", "hybrid", "phev", "ev"] as FuelType[]).map((f) => (
                  <SelectItem key={f} value={f}>{fuelLabel(f)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={electric ? "default" : "secondary"} className="gap-1">
            {electric ? <Zap className="h-3.5 w-3.5" /> : <Fuel className="h-3.5 w-3.5" />}
            {fuelLabel(settings.fuelType)}
          </Badge>
          {electric ? (
            <Badge variant="outline" className="gap-1">
              <BatteryCharging className="h-3.5 w-3.5" /> {num(settings.batteryKwh, 0)} {t("unit.kwh")}
            </Badge>
          ) : null}
        </div>

        <Separator />

        <div className="space-y-4">
          {liquid ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>{t("vehicle.fuelEconomy")}</Label>
                  {fuelOverridden ? (
                    <button type="button" onClick={resetFuel} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <RotateCcw className="h-3 w-3" /> {t("vehicle.factory", { v: num(factoryFuel!, 1) })}
                    </button>
                  ) : null}
                </div>
                <NumberField id="fuelCons" label="" suffix={t("unit.lPer100")} step={0.1} value={settings.fuelConsumption} onChange={(n) => onChangeSettings({ fuelConsumption: n })} />
              </div>
              <NumberField id="fuelPrice" label={t("vehicle.fuelPrice")} prefix={symbol} suffix={t("unit.perLitre")} step={0.5} value={settings.fuelPricePerLitre} onChange={(n) => onChangeSettings({ fuelPricePerLitre: n })} />
            </div>
          ) : null}

          {electric ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>{t("vehicle.energyUse")}</Label>
                    {energyOverridden ? (
                      <button type="button" onClick={resetEnergy} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                        <RotateCcw className="h-3 w-3" /> {t("vehicle.factory", { v: num(factoryEnergy!, 1) })}
                      </button>
                    ) : null}
                  </div>
                  <NumberField id="energyCons" label="" suffix={t("unit.kwhPer100")} step={0.5} value={settings.energyConsumption} onChange={(n) => onChangeSettings({ energyConsumption: n })} />
                </div>
                <NumberField id="battery" label={t("vehicle.battery")} suffix={t("unit.kwh")} step={1} value={settings.batteryKwh} onChange={(n) => onChangeSettings({ batteryKwh: n })} />
              </div>

              <div className="space-y-2">
                <Label>{t("vehicle.chargeWhere")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["home", "public"] as const).map((loc) => {
                    const active = settings.chargingLocation === loc;
                    const Icon = loc === "home" ? Home : MapPin;
                    return (
                      <button key={loc} type="button" onClick={() => onChangeSettings({ chargingLocation: loc })}
                        className={cn(
                          "flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                          active ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground hover:bg-accent"
                        )}>
                        <Icon className="h-4 w-4" />
                        {loc === "home" ? t("vehicle.home") : t("vehicle.public")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <NumberField id="homePrice" label={t("vehicle.homeTariff")} prefix={symbol} suffix={t("unit.perKwh")} step={0.1} value={settings.electricityHomePrice} onChange={(n) => onChangeSettings({ electricityHomePrice: n })} />
                <NumberField id="publicPrice" label={t("vehicle.publicTariff")} prefix={symbol} suffix={t("unit.perKwh")} step={0.1} value={settings.electricityPublicPrice} onChange={(n) => onChangeSettings({ electricityPublicPrice: n })} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{t("vehicle.chargingEff")}</Label>
                  <span className="text-sm font-semibold tabular-nums">{num(settings.chargingEfficiencyPercent, 0)}%</span>
                </div>
                <Slider value={[settings.chargingEfficiencyPercent]} min={70} max={100} step={1} onValueChange={([v]) => onChangeSettings({ chargingEfficiencyPercent: v })} />
                <p className="text-xs text-muted-foreground">{t("vehicle.chargingEff.hint")}</p>
              </div>

              {isPhev ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t("vehicle.evShare")}</Label>
                    <span className="text-sm font-semibold tabular-nums">{Math.round(settings.evShare * 100)}%</span>
                  </div>
                  <Slider value={[Math.round(settings.evShare * 100)]} min={0} max={100} step={5} onValueChange={([v]) => onChangeSettings({ evShare: v / 100 })} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>{t("vehicle.note")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
