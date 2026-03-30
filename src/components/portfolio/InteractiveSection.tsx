import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const dragItems = [
  { id: 1, text: "IDEAS", bg: "bg-[#FF3366]", size: "w-28 h-28 sm:w-40 sm:h-40 md:w-64 md:h-64", shape: "rounded-full", rotate: 0 },
  { id: 2, text: "UI / UX", bg: "bg-[#00FFcc]", size: "w-24 h-24 sm:w-36 sm:h-36 md:w-56 md:h-56", shape: "rounded-3xl", rotate: 12 },
  { id: 3, text: "MOTION", bg: "bg-[#7B2CBF]", size: "w-20 h-20 sm:w-28 sm:h-28 md:w-48 md:h-48", shape: "rounded-full", rotate: -15 },
  { id: 4, text: "WEB", bg: "bg-white", size: "w-32 h-14 sm:w-44 sm:h-16 md:w-64 md:h-24", shape: "rounded-full", rotate: 5 },
  { id: 5, text: "CODE", bg: "bg-[#FFD166]", size: "w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44", shape: "rounded-[2rem]", rotate: -5 },
  { id: 6, text: "WOW", bg: "bg-[#00B4D8]", size: "w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40", shape: "rounded-full", rotate: 20 },
];

export function InteractiveSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple hardcoded scatter array based on viewport quadrants to avoid clumping
  const getInitialPosition = (index: number) => {
    const quadrants = [
      { top: "10%", left: "10%" },
      { top: "10%", left: "60%" },
      { top: "50%", left: "20%" },
      { top: "60%", left: "60%" },
      { top: "30%", left: "40%" },
      { top: "70%", left: "10%" },
    ];
    return quadrants[index] || { top: "50%", left: "50%" };
  };

  return (
    <section 
      id="play" 
      data-scroll-section 
      className="border-t border-white/10 relative h-[100svh] w-full overflow-hidden bg-black flex items-center justify-center cursor-crosshair"
    >
      {/* Massive Background Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-20">
        <h2 
          className="font-display text-[15vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent" 
          style={{ WebkitTextStroke: "2px rgba(255,255,255,0.8)" }}
        >
          DRAG &
        </h2>
        <h2 className="font-display text-[15vw] font-black uppercase leading-[0.85] tracking-tighter text-white">
          THROW
        </h2>
      </div>

      <div className="absolute top-12 text-center w-full pointer-events-none z-10">
        <p className="text-white/60 tracking-[0.4em] text-xs md:text-sm uppercase font-bold animate-pulse">
          Grab the shapes and throw them
        </p>
      </div>

      {/* Physics Container Bounds */}
      <div ref={containerRef} className="absolute inset-0 p-4 md:p-12 z-20">
        {mounted && dragItems.map((item, index) => {
          const pos = getInitialPosition(index);
          return (
            <motion.div
              key={item.id}
              drag
              dragConstraints={containerRef}
              dragElastic={0.4}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
              initial={{ 
                top: "50%", 
                left: "50%", 
                scale: 0, 
                opacity: 0,
                rotate: 0,
                x: "-50%",
                y: "-50%"
              }}
              whileInView={{ 
                top: pos.top, 
                left: pos.left, 
                scale: 1, 
                opacity: 1,
                rotate: item.rotate,
                x: 0,
                y: 0,
                transition: { 
                  duration: 1, 
                  delay: index * 0.1, 
                  type: "spring", 
                  bounce: 0.5 
                } 
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.08, zIndex: 100 }}
              whileTap={{ cursor: "grabbing", scale: 0.95, zIndex: 100 }}
              className={`absolute flex items-center justify-center shadow-2xl backdrop-blur-md cursor-grab ${item.bg} ${item.size} ${item.shape}`}
              style={{ touchAction: "none" }} // Prevents scrolling when dragging on mobile
            >
              <span className="font-display font-black text-base sm:text-xl md:text-4xl tracking-wider select-none mix-blend-difference text-white/90">
                {item.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
