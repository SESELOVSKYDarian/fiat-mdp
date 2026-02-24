"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx;
    let smoother;

    async function init() {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const scrollSmootherModule = await import("gsap/ScrollSmoother");

      const gsap = gsapModule.gsap || gsapModule.default;
      const { ScrollTrigger } = scrollTriggerModule;
      const { ScrollSmoother } = scrollSmootherModule;

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      ctx = gsap.context(() => {
        const current = ScrollSmoother.get();
        if (current) current.kill();

        smoother = ScrollSmoother.create({
          smooth: 1,
          effects: true
        });

        gsap.utils.toArray(".gsap-reveal").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 44 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.95,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 84%",
                once: true
              }
            }
          );
        });

        gsap.utils.toArray(".gsap-reveal-text").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true
              }
            }
          );
        });
      });
    }

    init();

    return () => {
      if (smoother) smoother.kill();
      if (ctx) ctx.revert();
    };
  }, [pathname]);

  return null;
}
