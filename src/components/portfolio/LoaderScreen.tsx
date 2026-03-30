import CountUp from "../ui/count-up";

const words = ["Code", "Design", "AI"];

type LoaderScreenProps = {
  hide: boolean;
};

export function LoaderScreen({ hide }: LoaderScreenProps) {
  return (
    <div
      id="loader"
      className={`fixed inset-0 z-[120] grid place-items-center bg-black transition-opacity duration-700 ${hide ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <div className="w-[min(92vw,980px)] space-y-8 text-center text-white">
        <div className="mx-auto w-full max-w-4xl border-y border-white/20 py-6">
          <div className="font-display text-[clamp(2rem,5.2vw,4.8rem)] font-semibold leading-[0.96] tracking-[0.03em] text-white">
            <p className="loader-line overflow-hidden">
              <span className="inline-block text-white/90">Build it</span>
              <span
                className="ml-3 inline-flex h-[1.2em] min-w-[5.8ch] items-center justify-center rounded-2xl bg-white px-3 py-1 text-black"
              >
                <span className="loader-word-slot relative inline-flex h-[1.05em] w-[5.2ch] items-center justify-center overflow-hidden align-middle">
                  {words.map((word, idx) => (
                    <span
                      key={`${word}-${idx}`}
                      className="loader-word-item absolute inset-0 flex items-center justify-center"
                      style={{ animationDelay: `${idx * 1.2}s` }}
                    >
                      <em
                        className="flex h-[1.1em] items-center justify-center not-italic"
                      >
                        {word}
                      </em>
                    </span>
                  ))}
                </span>
              </span>
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-xl space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/70">
            <span>Loading</span>
            <span className="font-display text-base tracking-[0.18em] text-white">
              <CountUp to={100} duration={3.6} startWhen />%
            </span>
          </div>

          <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/20">
            <div className="loader-progress-fill h-full w-full origin-left scale-x-0 bg-white" />
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-[0.3em] text-white/35">Crafting your experience</p>
      </div>
    </div>
  );
}
