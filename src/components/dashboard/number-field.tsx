"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  hint?: string;
  className?: string;
};

export function NumberField({
  id, label, value, onChange, prefix, suffix, step = 1, min = 0, hint, className,
}: Props) {
  const [focused, setFocused] = React.useState(false);
  const [draft, setDraft] = React.useState<string>("");

  // While the user is editing we show their raw draft; otherwise mirror the value.
  const display = focused ? draft : value === 0 && !focused ? "" : String(value);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label || hint ? (
        <Label htmlFor={id} className="flex items-center justify-between">
          <span>{label}</span>
          {hint ? <span className="text-xs font-normal text-muted-foreground">{hint}</span> : null}
        </Label>
      ) : null}
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          step={step}
          min={min}
          placeholder="0"
          value={display}
          onFocus={(e) => {
            setDraft(value === 0 ? "" : String(value));
            setFocused(true);
            requestAnimationFrame(() => e.target.select());
          }}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, "");
            setDraft(raw);
            if (raw === "" || raw === ".") {
              onChange(0);
              return;
            }
            const n = parseFloat(raw);
            if (Number.isFinite(n)) onChange(n);
          }}
          className={cn(prefix && "pl-7", suffix && "pr-16")}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
