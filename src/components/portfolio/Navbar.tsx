import { Menu, X, Instagram, Github, Linkedin, Download } from "lucide-react";
import resumePdf from "../../assets/Parv Surana Resume.pdf";

type NavbarProps = {
  open: boolean;
  onToggle: () => void;
};

const menuItems = ["Home", "About", "Projects", "Skills", "Contact"];

export function Navbar({ open, onToggle }: NavbarProps) {
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 mix-blend-difference sm:px-6 md:px-12 md:py-6">
        <div className="pointer-events-auto font-display text-2xl font-bold uppercase tracking-[0.18em] text-white md:text-3xl">
          PS
        </div>
        <button
          onClick={onToggle}
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-white text-white transition-colors hover:bg-white hover:text-black md:h-12 md:w-12"
          type="button"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <aside
        className={`menu-panel-blur fixed right-0 top-0 z-40 flex h-[100svh] w-full max-w-[460px] flex-col justify-between border-l border-white/10 p-5 pt-8 transition-transform duration-700 sm:p-8 md:p-12 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="mt-16 flex-1 space-y-5 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] md:mt-20 md:space-y-6 [&::-webkit-scrollbar]:hidden">
          {menuItems.map((item, idx) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={onToggle}
              className="menu-item block border-b border-white/25 pb-4 font-display text-3xl font-semibold uppercase tracking-wide text-white/90 transition-colors duration-500 hover:border-white/70 hover:text-white sm:text-4xl md:text-5xl"
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Creative Socials & CV Button Block */}
        <div 
          className="mt-8 flex w-full flex-col gap-4 pb-3 md:gap-6 md:pb-4"
          style={{ opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.4s' }}
        >
           {/* Social Circular Buttons */}
           <div className="flex items-center justify-between gap-3 sm:gap-4">
              <a href="https://www.instagram.com/parvsurana68?igsh=MXVtNTc4N29oemtt&utm_source=qr" target="_blank" rel="noreferrer" className="group relative flex h-12 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-full border border-white/20 transition-colors duration-500 hover:border-white hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] sm:h-14">
                 <Instagram strokeWidth={1.5} className="absolute h-5 w-5 text-white transition-all duration-500 group-hover:scale-110 group-hover:text-black" />
              </a>
              <a href="https://github.com/parvsurana26" target="_blank" rel="noreferrer" className="group relative flex h-12 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-full border border-white/20 transition-colors duration-500 hover:border-white hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] sm:h-14">
                 <Github strokeWidth={1.5} className="absolute h-5 w-5 text-white transition-all duration-500 group-hover:scale-110 group-hover:text-black" />
              </a>
              <a href="https://www.linkedin.com/in/parv-surana-919229357" target="_blank" rel="noreferrer" className="group relative flex h-12 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-full border border-white/20 transition-colors duration-500 hover:border-white hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] sm:h-14">
                 <Linkedin strokeWidth={1.5} className="absolute h-5 w-5 text-white transition-all duration-500 group-hover:scale-110 group-hover:text-black" />
              </a>
           </div>

           {/* Grand Download Button */}
           <a 
             href={resumePdf}
             target="_blank"
             rel="noreferrer"
             download="Parv_Surana_Resume.pdf"
             className="group relative flex w-full items-center justify-between overflow-hidden rounded-full border border-white/20 bg-transparent px-5 py-4 transition-colors duration-500 hover:border-white hover:bg-white sm:px-8 md:py-5"
           >
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-white transition-transform duration-700 ease-out group-hover:translate-x-0" />
              <span className="relative z-10 font-display text-xs md:text-sm font-bold uppercase tracking-widest text-white transition-colors duration-500 group-hover:text-black delay-100">
                Download Resume
              </span>
              <div className="relative z-10 flex h-5 w-5 items-center justify-center overflow-hidden">
                <Download className="absolute h-5 w-5 text-white transition-transform duration-500 group-hover:translate-y-8" />
                <Download className="absolute h-5 w-5 text-black -translate-y-8 transition-transform duration-500 group-hover:translate-y-0 delay-100" />
              </div>
           </a>
        </div>
      </aside>
    </>
  );
}
