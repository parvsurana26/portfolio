import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatedHeroSection } from "../ui/animated-hero-section";

type HeroSectionProps = {
  onCursorEnter: (text: string) => void;
  onCursorLeave: () => void;
  loadingComplete?: boolean;
};

const TAGLINE_TEXT = "Creative Web Developer | Building Fast | Modern Experiences";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export function HeroSection({
  onCursorEnter,
  onCursorLeave,
  loadingComplete = true,
}: HeroSectionProps) {
  const [animatedTagline, setAnimatedTagline] = useState(TAGLINE_TEXT);
  const scrambleTimerRef = useRef<number | null>(null);

  const taglineChars = useMemo(() => TAGLINE_TEXT.split(""), []);

  useEffect(() => {
    if (!loadingComplete) {
      setAnimatedTagline(TAGLINE_TEXT);
      return;
    }

    let frame = 0;
    const warmupFrames = 9;

    if (scrambleTimerRef.current !== null) {
      window.clearInterval(scrambleTimerRef.current);
    }

    scrambleTimerRef.current = window.setInterval(() => {
      frame += 1;
      const revealedCount = Math.max(0, frame - warmupFrames);

      const nextFrame = taglineChars
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealedCount) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");

      setAnimatedTagline(nextFrame);

      if (revealedCount >= taglineChars.length) {
        if (scrambleTimerRef.current !== null) {
          window.clearInterval(scrambleTimerRef.current);
          scrambleTimerRef.current = null;
        }
        setAnimatedTagline(TAGLINE_TEXT);
      }
    }, 42);

    return () => {
      if (scrambleTimerRef.current !== null) {
        window.clearInterval(scrambleTimerRef.current);
        scrambleTimerRef.current = null;
      }
    };
  }, [loadingComplete, taglineChars]);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden border-b border-white/10 bg-black"
      onMouseEnter={() => onCursorEnter("Explore")}
      onMouseLeave={onCursorLeave}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hero-video absolute inset-0 z-0 h-full w-full object-cover opacity-50 mix-blend-lighten"
        src="https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4"
      />
      
      <div className="absolute inset-0 z-0 bg-black/60"></div>

      <AnimatedHeroSection
        line1="PARV SURANA"
        line2="Full Stack Developer"
        className="hero-canvas absolute inset-0 z-[1] h-full w-full"
      />

      <div className="hero-glow-overlay pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.09),transparent_46%)]" />
      <div className="hero-grid-overlay pointer-events-none absolute inset-0 z-[1] opacity-35 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:78px_78px]" />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center"
      >
        <p className="hero-tagline text-[0.72rem] uppercase tracking-[0.28em] text-white/55">{animatedTagline}</p>
      </div>
    </section>
  );
}
