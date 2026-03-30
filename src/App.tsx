import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutSection } from "./components/portfolio/AboutSection";
import { ContactSection } from "./components/portfolio/ContactSection";
import { CustomCursor } from "./components/portfolio/CustomCursor";
import { ExperienceSection } from "./components/portfolio/ExperienceSection";
import { FooterSection } from "./components/portfolio/FooterSection";
import { HeroSection } from "./components/portfolio/HeroSection";
import { InteractiveSection } from "./components/portfolio/InteractiveSection";
import { LoaderScreen } from "./components/portfolio/LoaderScreen";
import { Navbar } from "./components/portfolio/Navbar";
import { ProjectsSection } from "./components/portfolio/ProjectsSection";
import { ServicesSection } from "./components/portfolio/ServicesSection";
import { SkillsSection } from "./components/portfolio/SkillsSection";
import LocomotiveScroll from "locomotive-scroll";

gsap.registerPlugin(ScrollTrigger);

const INTERACTIVE_CURSOR_SELECTOR = "a, button, input, textarea, select, [role='button'], [data-cursor]";

function App() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const locomotiveScroll = new LocomotiveScroll();
    return () => {
      locomotiveScroll.destroy();
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hideLoader, setHideLoader] = useState(false);
  const [cursorText, setCursorText] = useState("Explore");
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);

  const handleCursorEnter = (text: string) => {
    setCursorText(text);
    setCursorActive(true);
  };

  const handleCursorLeave = () => {
    setCursorText("Explore");
    setCursorActive(false);
  };

  useEffect(() => {
    if (loading) {
      setCursorVisible(false);
      setCursorActive(false);
      return;
    }

    const resolveCursorLabel = (element: Element | null) => {
      if (!element) return "Explore";

      const explicitLabel = element.getAttribute("data-cursor");
      if (explicitLabel) return explicitLabel;

      const tag = element.tagName.toLowerCase();
      if (tag === "a") return "Visit";
      if (tag === "button") return "Click";
      if (tag === "input" || tag === "textarea" || tag === "select") return "Type";
      return "Open";
    };

    const closestInteractive = (target: EventTarget | null) =>
      target instanceof Element
        ? target.closest(INTERACTIVE_CURSOR_SELECTOR)
        : null;

    const onMove = () => {
      setCursorVisible(true);
    };

    const onMouseEnterWindow = () => {
      setCursorVisible(true);
    };

    const onMouseLeaveWindow = () => {
      setCursorVisible(false);
    };

    const onMouseOver = (event: MouseEvent) => {
      const interactiveTarget = closestInteractive(event.target);
      if (!interactiveTarget) return;

      setCursorText(resolveCursorLabel(interactiveTarget));
      setCursorActive(true);
    };

    const onMouseOut = (event: MouseEvent) => {
      const fromTarget = closestInteractive(event.target);
      if (!fromTarget) return;

      const toTarget = closestInteractive(event.relatedTarget);
      if (toTarget === fromTarget) return;

      setCursorText("Explore");
      setCursorActive(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseenter", onMouseEnterWindow);
    window.addEventListener("mouseleave", onMouseLeaveWindow);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseenter", onMouseEnterWindow);
      window.removeEventListener("mouseleave", onMouseLeaveWindow);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, [loading]);

  useEffect(() => {
    const loaderTimeline = gsap.timeline();
    loaderTimeline.fromTo(
      ".loader-line > span",
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.9,
        ease: "power4.out",
      },
    );

    loaderTimeline.to(
      ".loader-progress-fill",
      {
        scaleX: 1,
        duration: 3.6,
        ease: "power1.inOut",
      },
      0,
    );

    const hideTimeout = window.setTimeout(() => setHideLoader(true), 3900);
    const removeTimeout = window.setTimeout(() => setLoading(false), 4700);

    return () => {
      window.clearTimeout(hideTimeout);
      window.clearTimeout(removeTimeout);
      loaderTimeline.kill();
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    ScrollTrigger.refresh();
  }, [loading, menuOpen]);

  useLayoutEffect(() => {
    if (loading || !scrollRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-letter", {
        yPercent: 115,
        opacity: 0,
        stagger: 0.045,
        duration: 1.3,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.from(".hero-canvas", {
        scale: 1.06,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(".hero-grid-overlay", {
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
      });

      gsap.from(".hero-tagline", {
        y: 18,
        opacity: 0,
        duration: 1,
        delay: 0.45,
        ease: "power3.out",
      });

      gsap.to(".hero-glow-overlay", {
        opacity: 0.42,
        duration: 2.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils
        .toArray<HTMLElement>(
          ".project-card, .service-card, .reveal-card, .timeline-item, #contact form, footer",
        )
        .forEach((element) => {
          gsap.from(element, {
            y: 64,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
            },
          });
        });

      gsap.utils.toArray<HTMLElement>(".about-line-item span").forEach((line) => {
        gsap.from(line, {
          yPercent: 115,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: line,
            start: "top 92%",
            end: "top 72%",
            scrub: 0.55,
          },
        });
      });

      gsap.from(".menu-item", {
        x: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, scrollRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <>
      {loading && <LoaderScreen hide={hideLoader} />}

      <Navbar open={menuOpen} onToggle={() => setMenuOpen((prev) => !prev)} />

      <CustomCursor
        visible={cursorVisible && !loading}
        active={cursorActive}
        text={cursorText}
      />

      <main ref={scrollRef} className="noise-overlay">
        <HeroSection
          onCursorEnter={handleCursorEnter}
          onCursorLeave={handleCursorLeave}
          loadingComplete={!loading}
        />
        <AboutSection />
        <ProjectsSection />
        <ServicesSection />
        <SkillsSection />
        <ExperienceSection />
        <InteractiveSection />
        <ContactSection />
        <FooterSection />
      </main>
    </>
  );
}

export default App;
