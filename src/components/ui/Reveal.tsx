"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

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
  const Tag = as as ElementType;
  return (
    <Tag ref={ref} className={cls}>
      {children}
    </Tag>
  );
}
