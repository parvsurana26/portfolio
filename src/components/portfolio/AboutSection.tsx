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
      className="border-t border-black/10 bg-white px-6 py-28 text-black md:px-12 md:py-36"
    >
      <p className="mb-4 text-xs uppercase tracking-[0.24em] text-black/50">About</p>
      <div className="max-w-6xl font-display text-[clamp(1.5rem,4.35vw,3.9rem)] font-semibold leading-[1.08] text-black/90">
        {aboutLines.map((line, index) => (
          <p key={line} className="about-line-item m-0 overflow-hidden" data-line-index={index}>
            <span className="inline-block">{line}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
