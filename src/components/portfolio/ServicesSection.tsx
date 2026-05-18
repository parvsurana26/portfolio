import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "./types";

gsap.registerPlugin(ScrollTrigger);

const services: Service[] = [
  {
    title: "Frontend Development",
    desc: "Pixel-precise interactive interfaces with modern performance standards.",
    tags: ["React", "Tailwind", "GSAP"],
  },
  {
    title: "Backend Development",
    desc: "Secure and scalable server architecture for data-intensive products.",
    tags: ["Node", "Express", "REST"],
  },
  {
    title: "Full Stack Apps",
    desc: "End-to-end product delivery from architecture to deployment.",
    tags: ["TypeScript", "Cloud", "CI/CD"],
  },
  {
    title: "UI / UX Design",
    desc: "Luxury-grade visual systems with usability and conversion focus.",
    tags: ["Design System", "Motion", "Research"],
  },
];

export function ServicesSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Stagger entrance reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
       gsap.from(".service-row", {
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
       });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="services"
      data-scroll-section
      className="border-t border-black/10 bg-white px-5 py-20 sm:px-6 md:px-12 md:py-32"
    >
      <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-black/40 mb-4">Capabilities</p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-extrabold uppercase leading-[0.9] text-black">
            Solutions
          </h2>
        </div>
        <p className="max-w-xs text-xs uppercase tracking-[0.2em] text-black/50 leading-relaxed md:text-right">
          Architecting premium digital infrastructure from the ground up to deployment.
        </p>
      </div>

      <div className="flex flex-col border-t border-black/10">
        {services.map((service, index) => (
          <div
            key={service.title}
            className="service-row group relative flex flex-col border-b border-black/10 py-8 transition-colors duration-500 hover:bg-black/[0.02] md:flex-row md:py-16"
          >
            {/* Index Number */}
            <div className="md:w-1/6 mb-2 md:mb-0">
               <span className="font-display text-xl md:text-[2rem] leading-none font-black text-black/20 group-hover:text-black transition-colors duration-500">
                 {String(index + 1).padStart(2, '0')}
               </span>
            </div>
            
            {/* Title & Desc */}
            <div className="pr-0 md:w-3/6 md:pr-8">
               <h3 className="font-display text-2xl font-black uppercase tracking-normal text-black transition-transform duration-500 sm:text-3xl md:text-5xl md:group-hover:translate-x-4 lg:text-7xl">
                 {service.title}
               </h3>
               <p className="mt-6 text-xs md:text-sm text-black/50 tracking-widest leading-relaxed md:pr-12 md:opacity-0 md:-translate-y-4 md:transition-all md:duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                 {service.desc}
               </p>
            </div>

            {/* Tags & Animated Arrow */}
            <div className="md:w-2/6 mt-8 md:mt-0 flex flex-col justify-between items-start md:items-end">
               <div className="flex flex-wrap gap-2 md:justify-end">
                 {service.tags.map((tag) => (
                   <span
                     key={tag}
                     className="rounded-full border border-black/20 px-4 py-2 text-[9px] md:text-xs font-bold uppercase tracking-widest text-black/80 transition-colors duration-500 group-hover:border-black group-hover:bg-black group-hover:text-white"
                   >
                     {tag}
                   </span>
                 ))}
               </div>
               
               {/* Clipping Arrow Icon (Sliding through effect) */}
               <div className="mt-8 hidden md:block overflow-hidden relative w-12 h-12 rounded-full border border-black/20 group-hover:bg-black transition-colors duration-500">
                 {/* Exiting arrow */}
                 <ArrowUpRight className="absolute inset-0 m-auto h-5 w-5 text-black transition-transform duration-500 group-hover:-translate-y-12 group-hover:translate-x-12" />
                 {/* Entering arrow */}
                 <ArrowUpRight className="absolute inset-0 m-auto h-5 w-5 text-white translate-y-12 -translate-x-12 transition-transform duration-500 group-hover:translate-y-0 group-hover:translate-x-0" />
               </div>
            </div>

            {/* Subtle glow highlight on hover */}
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-[200px] w-full -translate-y-1/2 bg-black/5 opacity-0 mix-blend-overlay blur-[100px] transition-opacity duration-700 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
