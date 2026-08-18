"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";

export default function Reveal({
  as = "div",
  className = "",
  delay = 0,
  children,
}: {
  as?: string;
  className?: string;
  delay?: 0 | 1 | 2;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = ["rv", delay ? `d${delay}` : "", inView ? "in" : "", className]
    .filter(Boolean)
    .join(" ");
  return createElement(as, { ref, className: cls }, children);
}
