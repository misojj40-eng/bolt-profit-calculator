"use client";

import * as React from "react";
import { Database, Download, Upload, Check, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

/** All localStorage keys the app owns. Keep in sync with the storage keys used
 * across the dashboard so backups are complete. */
const APP_KEYS = [
  "bdpc.inputs.v1",
  "bdpc.settings.v2",
  "bdpc.currency.v1",
  "bdpc.vehicle.v1",
  "bdpc.trips.v1",
  "bdpc.vehicleType.v1",
  "bdpc.goal.v1",
  "bdpc.lang.v1",
];

export function DataCard() {
  const { t } = useI18n();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = React.useState<"idle" | "done" | "error">("idle");

  const exportData = () => {
    const dump: Record<string, unknown> = { _app: "bolt-profit", _version: 1 };
    for (const k of APP_KEYS) {
      try {
        const raw = window.localStorage.getItem(k);
        if (raw != null) dump[k] = JSON.parse(raw);
      } catch {
        /* skip corrupt key */
      }
    }
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bolt-profit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Record<string, unknown>;
        let wrote = 0;
        for (const k of APP_KEYS) {
          if (k in data) {
            window.localStorage.setItem(k, JSON.stringify(data[k]));
            wrote++;
          }
        }
        if (wrote === 0) throw new Error("no keys");
        setStatus("done");
        setTimeout(() => window.location.reload(), 700);
      } catch {
        setStatus("error");
      }
    };
    reader.onerror = () => setStatus("error");
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Database className="h-4 w-4" />
          </span>
          {t("data.title")}
        </CardTitle>
        <CardDescription className="mt-1">{t("data.desc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-11" onClick={exportData}>
            <Download className="h-4 w-4" /> {t("data.export")}
          </Button>
          <Button variant="outline" className="h-11" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> {t("data.import")}
          </Button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
        </div>
        {status === "done" ? (
          <p className="flex items-center gap-2 text-sm text-primary">
            <Check className="h-4 w-4" /> {t("data.importDone")}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" /> {t("data.importError")}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
