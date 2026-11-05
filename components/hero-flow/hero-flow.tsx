"use client";

import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { HeroFlowWindow } from "./hero-flow-window";
import { HeroFlowMobile } from "./hero-flow-mobile";
import { HeroFlowStatic } from "./hero-flow-static";

export function HeroFlow() {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <HeroFlowStatic />;
  }

  return (
    <>
      <div className="hidden lg:block">
        <HeroFlowWindow />
      </div>
      <div className="lg:hidden">
        <HeroFlowMobile />
      </div>
    </>
  );
}
