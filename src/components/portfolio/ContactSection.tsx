import { useState } from "react";
import type { FormEvent } from "react";
import { MagneticElement } from "./MagneticElement";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formsubmit.co/ajax/parvsurana26@gmail.com", {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section
      id="contact"
      data-scroll-section
      className="border-t border-black/10 bg-white px-6 py-24 text-black md:px-12 md:py-32"
    >
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <div>
          <MagneticElement strength={0.15}>
            <p className="text-xs uppercase tracking-[0.24em] text-black/50">Contact</p>
          </MagneticElement>
          <MagneticElement strength={0.1}>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,8vw,7rem)] font-extrabold uppercase leading-[0.9] text-black">
              Let us build
              <br />
              your next edge
            </h2>
          </MagneticElement>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-black/20 bg-white p-6 md:p-8"
        >
          {/* FormSubmit Config */}
          <input type="hidden" name="_subject" value="New Inquiry from Portfolio" />
          <input type="hidden" name="_template" value="box" />
          <input type="hidden" name="_captcha" value="false" />

          <input
            name="name"
            required
            className="w-full border-b border-black/25 bg-transparent px-0 py-3 text-sm uppercase tracking-[0.16em] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
            placeholder="Your Name"
            type="text"
          />
          <input
            name="email"
            required
            className="w-full border-b border-black/25 bg-transparent px-0 py-3 text-sm uppercase tracking-[0.16em] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
            placeholder="Email"
            type="email"
          />
          <textarea
            name="message"
            required
            className="min-h-[140px] w-full border-b border-black/25 bg-transparent px-0 py-3 text-sm uppercase tracking-[0.16em] text-black placeholder:text-black/35 focus:border-black focus:outline-none"
            placeholder="Project Brief"
          />
          <MagneticElement strength={0.2} className="w-full mt-4">
            <button
              disabled={status === "submitting" || status === "success"}
              className={`w-full rounded-full border px-6 py-4 text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-xl ${
                status === "success" 
                  ? "bg-green-500 text-white border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] pointer-events-none" 
                  : status === "submitting"
                  ? "bg-black/5 text-black/50 border-black/10 cursor-wait animate-pulse"
                  : status === "error"
                  ? "bg-red-500 text-white border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                  : "border-black/45 text-black hover:bg-black hover:text-white"
              }`}
              type="submit"
            >
              {status === "idle" && "Transmit Inquiry"}
              {status === "submitting" && "Establishing Link..."}
              {status === "success" && "Transmission Successful ✓"}
              {status === "error" && "Link Failed - Retry"}
            </button>
          </MagneticElement>
        </form>
      </div>
    </section>
  );
}
