export function AboutSection() {
  const aboutLines = [
    "I craft production-grade digital products where",
    "engineering precision meets cinematic interaction,",
    "building high-performance web experiences",
    "that feel refined, intentional, and deeply human.",
  ];

  return (
    <section
      id="about"
      data-scroll-section
      className="border-t border-black/10 bg-white px-5 py-20 text-black sm:px-6 md:px-12 md:py-36"
    >
      <p className="mb-4 text-xs uppercase tracking-[0.24em] text-black/50">About</p>
      <div className="max-w-6xl break-words font-display text-[clamp(1.9rem,8.5vw,3.9rem)] font-semibold leading-[1.08] text-black/90 md:text-[clamp(1.5rem,4.35vw,3.9rem)]">
        {aboutLines.map((line, index) => (
          <p key={line} className="about-line-item m-0 overflow-hidden" data-line-index={index}>
            <span className="inline-block max-w-full">{line}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
