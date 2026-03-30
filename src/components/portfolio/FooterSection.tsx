import { useEffect, useRef } from "react";
import { MagneticElement } from "./MagneticElement";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FooterSection() {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance animation
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { y: "100%", opacity: 0, rotate: 2 },
          {
            y: "0%",
            opacity: 1,
            rotate: 0,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 95%",
            },
          }
        );
      }

      // 2. Infinite Marquee Loop
      gsap.to(".marquee-track", {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: "linear",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer data-scroll-section className="relative overflow-hidden border-t border-white/10 bg-[#050505] px-6 pt-24 pb-8 md:px-12 md:pt-32">
      
      {/* Top Grid: Links and Info */}
      <div className="mb-24 flex flex-col justify-between gap-16 md:mb-32 md:flex-row md:gap-8 relative z-10 w-full max-w-[1400px] mx-auto">
        
        <div className="flex flex-col gap-6 max-w-sm">
          <h3 className="text-xl font-display font-bold uppercase text-white/90">
            Parv Surana
          </h3>
          <p className="text-xs uppercase tracking-[0.2em] leading-relaxed text-white/40">
            Elevating digital experiences through robust engineering and uncompromising design aesthetics.
          </p>
          <MagneticElement>
            <a 
              href="mailto:hello@parvsurana.com" 
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
            >
              Start a Conversation <ArrowUpRight className="h-3 w-3" />
            </a>
          </MagneticElement>
        </div>

        <div className="flex gap-16 md:gap-24">
          <div className="flex flex-col gap-5">
            <h4 className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
              Socials
            </h4>
            <MagneticElement>
              <a href="https://www.linkedin.com/in/parv-surana-919229357" target="_blank" rel="noreferrer" className="w-fit text-xs font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white">LinkedIn</a>
            </MagneticElement>
            <MagneticElement>
              <a href="https://github.com/parvsurana26" target="_blank" rel="noreferrer" className="w-fit text-xs font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white">GitHub</a>
            </MagneticElement>
            <MagneticElement>
              <a href="https://www.instagram.com/parvsurana68?igsh=MXVtNTc4N29oemtt&utm_source=qr" target="_blank" rel="noreferrer" className="w-fit text-xs font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white">Instagram</a>
            </MagneticElement>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
              Index
            </h4>
            <MagneticElement>
              <a href="#home" className="w-fit text-xs font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white">Intro</a>
            </MagneticElement>
            <MagneticElement>
              <a href="#projects" className="w-fit text-xs font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white">Work</a>
            </MagneticElement>
            <MagneticElement>
              <a href="#experience" className="w-fit text-xs font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white">Experience</a>
            </MagneticElement>
            <MagneticElement>
              <a href="#contact" className="w-fit text-xs font-bold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white">Contact</a>
            </MagneticElement>
          </div>
        </div>

      </div>

      {/* Massive Marquee Divider */}
      <div className="relative z-0 w-full border-b border-t border-white/10 py-6 mb-6 overflow-hidden">
        {/* The wrapper that slides up on scroll */}
        <div ref={textRef} className="opacity-0">
          
          {/* The track that infinitely loops horizontally */}
          <div className="marquee-track flex w-max items-center">
            
            {/* Set 1 */}
            <div className="flex items-center gap-4 sm:gap-8 md:gap-16 pr-4 sm:pr-8 md:pr-16">
              <h1 className="font-display text-[12vw] md:text-[15vw] leading-[0.8] font-black uppercase tracking-tighter text-white select-none">
                PARV SURANA
              </h1>
              <span className="text-[4vw] md:text-[6vw] text-white/20 select-none">✦</span>
              <h1 className="font-display text-[12vw] md:text-[15vw] leading-[0.8] font-black uppercase tracking-tighter text-transparent select-none" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}>
                CREATIVE DEVELOPER
              </h1>
              <span className="text-[4vw] md:text-[6vw] text-white/20 select-none">✦</span>
            </div>

            {/* Set 2 (Exact Duplicate for Seamless Loop) */}
            <div className="flex items-center gap-4 sm:gap-8 md:gap-16 pr-4 sm:pr-8 md:pr-16">
              <h1 className="font-display text-[12vw] md:text-[15vw] leading-[0.8] font-black uppercase tracking-tighter text-white select-none">
                PARV SURANA
              </h1>
              <span className="text-[4vw] md:text-[6vw] text-white/20 select-none">✦</span>
              <h1 className="font-display text-[12vw] md:text-[15vw] leading-[0.8] font-black uppercase tracking-tighter text-transparent select-none" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}>
                CREATIVE DEVELOPER
              </h1>
              <span className="text-[4vw] md:text-[6vw] text-white/20 select-none">✦</span>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Legal / Quote Bar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 opacity-60 md:flex-row md:items-end w-full max-w-[1400px] mx-auto">
        <div className="flex gap-2 items-center">
           <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
           <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white">
             Open for new opportunities
           </p>
        </div>

        <p className="text-center text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.15em] sm:tracking-[0.25em] text-white">
          Consistency beats perfection
        </p>

        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          © {new Date().getFullYear()} — India
        </p>
      </div>
      
    </footer>
  );
}
