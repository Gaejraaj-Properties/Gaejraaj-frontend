"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string; // e.g. "500+" or "6+"
  duration?: number; // ms
}

/** Parses "500+" → { num: 500, suffix: "+" }. Falls back to raw string if not numeric. */
function parse(val: string): { num: number; suffix: string } | null {
  const match = val.match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

export default function AnimatedCounter({ value, duration = 1400 }: Props) {
  const parsed = parse(value);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!parsed) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * parsed.num));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed, duration]);

  if (!parsed) return <span>{value}</span>;

  return (
    <span ref={ref}>
      {count}
      {parsed.suffix}
    </span>
  );
}
