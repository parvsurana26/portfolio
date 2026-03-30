import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

type CustomCursorProps = {
  visible: boolean;
  active: boolean;
  text: string;
};

export function CustomCursor({ visible, active, text }: CustomCursorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    
    // Create zero-latency gsap quickTo trackers
    const xTo = gsap.quickTo(rootRef.current, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(rootRef.current, "y", { duration: 0.15, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      // 22px offset horizontally and vertically centers the 44px container
      xTo(e.clientX - 22);
      yTo(e.clientY - 22);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useLayoutEffect(() => {
    if (!rootRef.current || !circleRef.current || !textRef.current) return;

    gsap.to(rootRef.current, {
      opacity: visible ? 1 : 0,
      scale: visible ? 1 : 0.8,
      duration: 0.22,
      ease: "power2.out",
    });

    gsap.to(circleRef.current, {
      scale: active ? 2.8 : 1,
      duration: 0.35,
      ease: "power3.out",
    });

    gsap.to(textRef.current, {
      opacity: active ? 1 : 0,
      scale: active ? 1 : 0,
      duration: 0.25,
      delay: active ? 0.05 : 0,
      ease: "power2.out",
    });
  }, [active, visible]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block mix-blend-difference"
      aria-hidden="true"
    >
      <div className="relative flex h-[44px] w-[44px] items-center justify-center">
        <span
          ref={circleRef}
          className="absolute h-[16px] w-[16px] rounded-full bg-white transition-colors duration-200"
        />
        <span
          ref={textRef}
          className="absolute text-[6px] font-black uppercase tracking-[0.2em] text-black whitespace-nowrap pointer-events-none"
        >
          {text}
        </span>
      </div>
    </div>
  );
}
