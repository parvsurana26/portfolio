import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const row1Skills = [
  "React", "Next.js", "Tailwind CSS", "GSAP", "Three.js", "WebGL", "Framer Motion", "TypeScript",
  "React", "Next.js", "Tailwind CSS", "GSAP", "Three.js", "WebGL", "Framer Motion", "TypeScript"
];

const row2Skills = [
  "Node.js", "Python", "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "GraphQL",
  "Node.js", "Python", "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "GraphQL"
];

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Marquee 1 (moves left)
      if (row1Ref.current) {
        gsap.to(row1Ref.current, {
          xPercent: -50,
          repeat: -1,
          duration: 25,
          ease: "none",
        });
      }

      // Marquee 2 (moves right)
      if (row2Ref.current) {
        gsap.set(row2Ref.current, { xPercent: -50 });
        gsap.to(row2Ref.current, {
          xPercent: 0,
          repeat: -1,
          duration: 30,
          ease: "none",
        });
      }

      // Add scroll velocity effect
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const timeScale = 1 + Math.abs(velocity / 400);
          
          gsap.to([row1Ref.current, row2Ref.current], {
            timeScale: timeScale,
            duration: 0.2,
            overwrite: "auto"
          });
          
          gsap.to([row1Ref.current, row2Ref.current], {
            timeScale: 1,
            duration: 1,
            delay: 0.2,
            overwrite: "auto"
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" data-scroll-section className="overflow-hidden border-t border-white/10 bg-black pt-24 pb-32">
      <div className="mb-16 px-6 md:px-12">
        <h2 className="font-display text-[clamp(2.2rem,8vw,7rem)] font-extrabold uppercase leading-[0.9] text-white">
          Capabilities
        </h2>
        <p className="mt-4 max-w-sm text-sm uppercase tracking-[0.2em] text-white/50">
          The stack that powers the experience.
        </p>
      </div>

      <div className="relative flex flex-col gap-6 md:gap-10">
        {/* Row 1 */}
        <div className="flex w-fit whitespace-nowrap" ref={row1Ref}>
          {row1Skills.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className={`mx-2 md:mx-3 flex items-center justify-center rounded-full border px-4 py-2 md:px-8 md:py-4 font-display text-xl font-bold uppercase tracking-wide sm:text-2xl md:text-4xl lg:text-6xl ${
                index % 2 === 0
                  ? "border-white/20 text-white"
                  : "border-transparent text-stroke"
              }`}
            >
              {skill}
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex w-fit whitespace-nowrap" ref={row2Ref}>
          {row2Skills.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className={`mx-2 md:mx-3 flex items-center justify-center rounded-full border px-4 py-2 md:px-8 md:py-4 font-display text-xl font-bold uppercase tracking-wide sm:text-2xl md:text-4xl lg:text-6xl ${
                index % 2 !== 0
                  ? "border-white/20 text-white"
                  : "border-transparent text-stroke"
              }`}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
