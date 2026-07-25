"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, ExternalLink, CalendarClock, PartyPopper } from "lucide-react";
import type { DriveMode } from "@/lib/hotspots/engine";
import {
  getCity, rankSpots, dayPlan, mapsUrl, type DriveContext,
} from "@/lib/hotspots/engine";
import { isThaiHoliday, isPaydayWindow } from "@/lib/hotspots/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CITIES } from "@/lib/hotspots/engine";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type Props = {
  cityId: string;
  onChangeCity: (id: string) => void;
  mode: DriveMode;
  onChangeMode: (m: DriveMode) => void;
};

function hourLabel(h: number): string {
  return `${String(((h % 24) + 24) % 24).padStart(2, "0")}:00`;
}

export function HotspotCard({ cityId, onChangeCity, mode, onChangeMode }: Props) {
  const { t, lang } = useI18n();
  const [now, setNow] = React.useState(() => new Date());
  const [previewHour, setPreviewHour] = React.useState<number | null>(null);

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const city = getCity(cityId);
  const cityName = lang === "th" ? city.nameTh : city.name;
  const hour = previewHour ?? now.getHours();
  const dow = now.getDay();
  const isHoliday = isThaiHoliday(now);
  const isPayday = isPaydayWindow(now);
  const isWeekend = dow === 5 || dow === 6;

  const ctx: DriveContext = { hour, dow, mode, isHoliday, isPayday };
  const ranked = React.useMemo(() => rankSpots(city, ctx), [city, hour, dow, mode, isHoliday, isPayday]);
  const plan = React.useMemo(
    () => dayPlan(city, { dow, mode, isHoliday, isPayday }),
    [city, dow, mode, isHoliday, isPayday]
  );

  const top = ranked[0]?.spot ?? null;
  const next = ranked.slice(1, 3).map((r) => r.spot);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Navigation className="h-4 w-4" />
              </span>
              {t("hotspot.title")}
            </CardTitle>
            <CardDescription className="mt-1">{t("hotspot.desc")}</CardDescription>
          </div>
          <Select value={cityId} onValueChange={onChangeCity}>
            <SelectTrigger className="w-[130px]" aria-label={t("hotspot.city")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {lang === "th" ? c.nameTh : c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-2">
          {(["rides", "delivery"] as const).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onChangeMode(m)}
                aria-pressed={active}
                className={cn(
                  "flex min-h-11 items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground hover:bg-accent"
                )}
              >
                {m === "rides" ? t("hotspot.rides") : t("hotspot.delivery")}
              </button>
            );
          })}
        </div>

        {/* Context banners */}
        {(isHoliday || isPayday || isWeekend) ? (
          <div className="flex flex-wrap gap-2">
            {isHoliday ? (
              <Badge variant="default" className="gap-1"><PartyPopper className="h-3.5 w-3.5" />{t("hotspot.holiday")}</Badge>
            ) : null}
            {isPayday ? <Badge variant="secondary">{t("hotspot.payday")}</Badge> : null}
            {isWeekend && !isHoliday ? <Badge variant="secondary">{t("hotspot.weekend")}</Badge> : null}
          </div>
        ) : null}

        {/* Right now hero */}
        <motion.div
          key={top?.id ?? "none"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-4"
        >
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-primary">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{t("hotspot.now")}</span>
            <span className="tabular-nums text-muted-foreground">{hourLabel(hour)}</span>
          </div>
          {top ? (
            <div className="mt-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-lg font-bold">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{top.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">{top.area}</div>
                <div className="mt-1 text-sm font-medium text-primary">{t(top.reason)}</div>
              </div>
              <a
                href={mapsUrl(`${top.mapsQuery} ${cityName}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-input px-2.5 py-2 text-xs font-medium hover:bg-accent"
              >
                <ExternalLink className="h-3.5 w-3.5" /> {t("hotspot.openMaps")}
              </a>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{t("hotspot.none")}</p>
          )}

          {next.length ? (
            <div className="mt-3 border-t border-border/60 pt-3">
              <div className="text-xs text-muted-foreground">{t("hotspot.next")}</div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {next.map((s) => (
                  <span key={s.id} className="text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground"> · {t(s.reason)}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* Time scrubber */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" /> {t("hotspot.previewTime")}
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tabular-nums">{hourLabel(hour)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={() => setPreviewHour(null)}
              >
                {t("hotspot.useNow")}
              </Button>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={23}
            step={1}
            value={hour}
            onChange={(e) => setPreviewHour(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))]"
            aria-label={t("hotspot.previewTime")}
          />
        </div>

        {/* Day game plan */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">{t("hotspot.plan")}</div>
          <ul className="space-y-1.5">
            {plan.map((b) => {
              const isNowBlock = Math.abs(b.hour - hour) <= 1;
              return (
                <li
                  key={b.hour}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm",
                    isNowBlock ? "border-primary/40 bg-primary/5" : "border-border/60"
                  )}
                >
                  <span className="w-16 shrink-0 text-xs font-medium text-muted-foreground">
                    {t(`block.${b.hour}`)}
                  </span>
                  <span className="w-12 shrink-0 tabular-nums text-xs text-muted-foreground">
                    {hourLabel(b.hour)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {b.spot ? b.spot.name : "—"}
                  </span>
                  {b.spot ? (
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                      {t(b.spot.reason)}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">{t("hotspot.note")}</p>
      </CardContent>
    </Card>
  );
}
