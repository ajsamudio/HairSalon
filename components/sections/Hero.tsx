import Image from "next/image";
import { clientConfig } from "@/client.config";

export default function Hero() {
  const { neighborhood, city } = clientConfig.business;

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[60vh] md:min-h-[80vh] flex items-center"
    >
      {/* Background image */}
      <Image
        src="https://placehold.co/1600x900.png?text=Hero+Image+%E2%80%94+stylist+at+work"
        alt={`Hair stylist at work in ${neighborhood}, ${city}`}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-xl">
          {/* Trust pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {["★ 4.9 on Google", `5 years in ${neighborhood}`, "Same-day appointments"].map(
              (pill) => (
                <span
                  key={pill}
                  className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1"
                >
                  {pill}
                </span>
              )
            )}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 text-balance drop-shadow-lg">
            Hair that fits your life.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow">
            Walk in. Sit back. Walk out feeling like yourself.{" "}
            {neighborhood}, {city}.
          </p>

          {/* CTAs — stacked on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#book"
              className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-brand bg-accent text-white font-semibold text-base transition-all active:scale-[0.98] hover:brightness-90 text-center"
            >
              Book Now
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-brand bg-white/15 backdrop-blur-sm border border-white/40 text-white font-semibold text-base transition-all active:scale-[0.98] hover:bg-white/25 text-center"
            >
              See Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
