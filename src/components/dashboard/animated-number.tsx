"use client";

import * as React from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";

type Props = {
  value: number;
  format: (n: number) => string;
  className?: string;
  duration?: number;
};

/** Smoothly counts from the previous value to the new one. */
export function AnimatedNumber({ value, format, className, duration = 0.7 }: Props) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = React.useState(() => format(value));

  useMotionValueEvent(mv, "change", (latest) => {
    setDisplay(format(latest));
  });

  React.useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [value, mv, duration]);

  return <span className={className}>{display}</span>;
}
