"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
      <SelectTrigger className="w-[76px] gap-1" aria-label={t("nav.language")}>
        <Languages className="h-4 w-4 shrink-0 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGS.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.short}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
