import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "./types";

// Import local assets
import ideasosImg from "../../assets/Ideasos.png";
import gtaImg from "../../assets/gta.png";
import gymImg from "../../assets/gym.png";
import goldImg from "../../assets/gold.png";

gsap.registerPlugin(ScrollTrigger);

const projects: Project[] = [
  {
    title: "IdeaOS",
    subtitle: "AI assisted product command center",
    image: ideasosImg,
    link: "https://ideaos.netlify.app",
    tags: ["React", "AI", "Dashboard"],
  },
  {
    title: "Gold Book",
    subtitle: "Modern Gold Business Management",
    image: goldImg,
    link: "https://goldbook.netlify.app",
    tags: ["React 19", "Tailwind", "Dashboard", "Supabase"],
  },
  {
    title: "GTAVI Landing",
    subtitle: "Immersive gaming promotional site",
    image: gtaImg,
    link: "https://gta-landing.netlify.app",
    tags: ["GSAP", "Three.js", "UI"],
  },
  {
    title: "Fitclub",
    subtitle: "Premium fitness club platform",
    image: gymImg,
    link: "https://parvgym.netlify.app",
    tags: ["React", "Tailwind", "Booking"],
  },
];

export function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        // Natively pull the evaluated width of the w-max track
        const trackWidth = track.scrollWidth;
        const screenWidth = window.innerWidth;
        if (trackWidth <= screenWidth) return 0;

        // Translate the track exactly to map its right edge to the screen's right edge
        return -(trackWidth - screenWidth);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="projects" data-scroll-section className="relative h-screen w-full overflow-hidden border-t border-white/10 bg-black pt-24 md:pt-32">
      <div className="relative z-10 mb-10 flex w-full flex-col px-6 md:flex-row md:items-end md:justify-between md:px-12">
        <h2 className="font-display text-[clamp(2.2rem,8vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-[0.03em] text-white">
          Projects
        </h2>
        <p className="mt-4 max-w-sm text-sm uppercase tracking-[0.2em] text-white/50 md:mt-0">
          Engineered with clarity, motion, and measurable outcomes.
        </p>
      </div>

      <div ref={trackRef} className="flex h-[55vh] w-max items-center gap-6 px-6 pb-8 md:h-[65vh] md:px-12 xl:gap-12">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="project-card group relative h-full w-[85vw] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-black sm:w-[500px] lg:w-[650px] block"
          >
            <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-20 z-10 mix-blend-overlay"></div>
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 md:p-8">
              <div className="flex justify-between items-end gap-4">
                <div>
                  <h3 className="font-display text-3xl font-semibold uppercase tracking-wide text-white md:text-5xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.16em] text-white/70">{project.subtitle}</p>
                </div>
                <div className="mb-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
