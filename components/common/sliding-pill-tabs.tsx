"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/tienIch";

type SlidingPillTabItem<T extends string> = {
  id: T;
  label: string;
};

type IndicatorStyle = {
  height: number;
  left: number;
  opacity: number;
  top: number;
  width: number;
};

interface SlidingPillTabsProps<T extends string> {
  activeKey: T;
  className?: string;
  items: SlidingPillTabItem<T>[];
  onChange: (key: T) => void;
  size?: "sm" | "md";
}

const sizeClasses = {
  md: {
    button: "h-11 px-5 text-sm",
    container: "gap-2 p-1.5",
  },
  sm: {
    button: "h-9 px-3.5 text-[0.72rem]",
    container: "gap-1.5 p-1.5",
  },
};

export function SlidingPillTabs<T extends string>({
  activeKey,
  className,
  items,
  onChange,
  size = "md",
}: SlidingPillTabsProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Partial<Record<T, HTMLButtonElement | null>>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    height: 0,
    left: 0,
    opacity: 0,
    top: 0,
    width: 0,
  });

  useEffect(() => {
    const updateIndicator = () => {
      const container = containerRef.current;
      const activeButton = buttonRefs.current[activeKey];

      if (!container || !activeButton) return;

      const containerRect = container.getBoundingClientRect();
      const activeRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        height: activeRect.height,
        left: activeRect.left - containerRect.left,
        opacity: 1,
        top: activeRect.top - containerRect.top,
        width: activeRect.width,
      });
    };

    updateIndicator();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateIndicator())
        : null;

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateIndicator);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeKey, items]);

  const classes = sizeClasses[size];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate inline-flex flex-wrap rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(16,19,24,0.92),rgba(8,11,14,0.94))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-1px_0_rgba(255,255,255,0.02),0_16px_36px_rgba(0,0,0,0.24)] backdrop-blur-xl",
        classes.container,
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_38%)] opacity-70" />
      <span
        className="pointer-events-none absolute z-0 rounded-full border border-[var(--brand-accent)]/24 bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(30,215,96,0.24))] shadow-[0_12px_28px_rgba(6,182,212,0.12),0_0_36px_rgba(30,215,96,0.1),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 ease-out"
        style={{
          height: indicatorStyle.height,
          left: indicatorStyle.left,
          opacity: indicatorStyle.opacity,
          top: indicatorStyle.top,
          width: indicatorStyle.width,
        }}
      />

      {items.map((item) => {
        const isActive = item.id === activeKey;

        return (
          <button
            key={item.id}
            ref={(element) => {
              buttonRefs.current[item.id] = element;
            }}
            onClick={() => onChange(item.id)}
            aria-pressed={isActive}
            className={cn(
              "relative z-10 inline-flex items-center rounded-full font-medium transition-all duration-300 ease-out",
              classes.button,
              isActive
                ? "text-white drop-shadow-[0_2px_10px_rgba(34,211,238,0.14)]"
                : "text-white/42 hover:text-white/74",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
