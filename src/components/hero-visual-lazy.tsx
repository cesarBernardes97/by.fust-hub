"use client";

import dynamic from "next/dynamic";

const HeroVisual = dynamic(
  () => import("@/components/hero-visual").then((m) => m.HeroVisual),
  {
    ssr: false,
    loading: () => <div className="hero-visual-container hidden lg:block" />,
  },
);

export function HeroVisualLazy() {
  return <HeroVisual />;
}
