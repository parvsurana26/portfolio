import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = "0123456789!<>-_\\/[]{}—=+*^?#";

function ScrambleText({ text, isHovered }: { text: string; isHovered: boolean }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((_, index) => {
            if (index < iteration) {
              return text[index];
            }
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return <>{displayText}</>;
}

const timeline = [
  {
    company: "ITEGOSS",
    role: "WEB DEVELOPER & CREATIVE INTERN",
    year: "2026",
    points: [
      "Built and enhanced responsive web interfaces using modern frontend technologies like React and Tailwind CSS.",
      "Worked on UI/UX improvements and developed visually engaging components for better user experience.",
      "Designed creative assets including landing pages, social media creatives, and branding elements.",
      "Collaborated with team members to implement interactive animations and optimize performance."
    ],
  },
  {
    company: "Zillionite",
    role: "HR Role & Digital Marketing",
    year: "2025",
    points: [
      "Assisted with recruitment, onboarding, and HR documentation.",
      "Supported digital marketing activities including social media content creation and coordination.",
      "Tracked basic performance metrics and collaborated with the team on day-to-day operations."
    ],
  },
  {
    company: "Destinaro Dreams Travels LLP",
    role: "Frontend & Digital Marketing",
    year: "2025",
    points: [
      "Built the company’s travel website using HTML, CSS, and JavaScript with responsive design and booking features.",
      "Worked on SEO optimization and successfully improved Google search rankings.",
      "Contributed to user experience, visual design, and keyword-based content targeting."
    ],
  },
];

export function ExperienceSection() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw the vertical line smoothly scrubbed to the scroll position
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 1,
            },
          }
        );
      }

      // Fade in each experience block sequentially as you reach it
      itemsRef.current.forEach((item) => {
        if (!item) return;
        const indexSpan = item.querySelector(".timeline-dot");

        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            },
          }
        );

        if (indexSpan) {
          gsap.fromTo(
            indexSpan,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              delay: 0.2,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="experience" data-scroll-section className="border-t border-black/10 bg-white px-6 py-24 md:px-12 md:py-32">
      <h2 className="font-display text-[clamp(2.2rem,8vw,7rem)] font-extrabold uppercase leading-[0.9] text-black">
        Experience
      </h2>

      <div className="relative mt-16 pl-8 md:pl-16">
        <div className="absolute left-[3px] top-0 h-full w-[1px] bg-black/10" />
        <div ref={lineRef} className="absolute left-[3px] top-0 h-full w-[1.5px] origin-top bg-black" />

        {timeline.map((item, index) => (
          <article
            key={item.company}
            ref={(el) => { itemsRef.current[index] = el; }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="experience-block group relative mb-10 last:mb-0"
          >
            {/* Dot glow and dot */}
            <div className="absolute -left-[35px] top-2.5 flex h-[10px] w-[10px] items-center justify-center md:-left-[61.5px]">
              <span className="absolute h-full w-full rounded-full bg-black/20 blur-md transition-all duration-500 group-hover:scale-[3] group-hover:bg-black/40" />
              <span className="timeline-dot absolute h-[10px] w-[10px] rounded-full bg-black ring-[5px] ring-white transition-transform duration-500 group-hover:scale-125" />
            </div>

            <div className="rounded-2xl border border-transparent p-4 sm:p-6 transition-all duration-500 hover:-translate-y-1 hover:border-black/5 hover:bg-black/[0.02] hover:shadow-xl hover:shadow-black/[0.03] md:-mx-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold uppercase text-black transition-colors duration-500 md:text-5xl">
                    {item.company}
                  </h3>
                  <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-black/50 transition-colors duration-500 group-hover:text-black/80 md:text-sm">
                    {item.role}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="font-display text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-black/20 transition-colors duration-500 group-hover:text-black tracking-tighter uppercase whitespace-nowrap">
                    <ScrambleText text={item.year} isHovered={hoveredIndex === index} />
                  </span>
                </div>
              </div>

              <ul className="mt-6 space-y-4 text-black/70">
                {item.points.map((point) => (
                  <li key={`${index}-${point}`} className="group/item flex max-w-3xl items-start gap-4 text-sm leading-relaxed transition-colors hover:text-black">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 -translate-x-2 text-black/0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:text-black" />
                    <span className="-ml-6 transition-transform duration-300 group-hover/item:translate-x-2">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
