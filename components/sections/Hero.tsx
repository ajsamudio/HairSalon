import Image from "next/image";
import { clientConfig } from "@/client.config";

export default function Hero() {
  const { neighborhood, city } = clientConfig.business;

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden bg-pastel-wash"
    >
      {/* Decorative pastel blobs */}
      <div
        className="blob animate-float"
        style={{ width: 380, height: 380, background: "#F6D6E0", top: -80, right: -80 }}
        aria-hidden
      />
      <div
        className="blob animate-float"
        style={{
          width: 300,
          height: 300,
          background: "#E8D5F0",
          bottom: -100,
          left: -60,
          animationDelay: "1.5s",
        }}
        aria-hidden
      />

      {/* Soft photo on the right, hidden behind wash on mobile */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 opacity-40 md:opacity-70">
        <Image
          src="https://placehold.co/1200x1400/F6D6E0/4A2E3B.png?text=Stylist+at+work"
          alt={`Hair stylist at work in ${neighborhood}, ${city}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF1F4] via-[#FFF1F4]/60 to-transparent md:via-[#FFF1F4]/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-xl">
          {/* Trust pills */}
          <div className="flex flex-wrap gap-2 mb-6 animate-fade-down">
            {["★ 4.9 on Google", `5 years in ${neighborhood}`, "Same-day appointments"].map(
              (pill) => (
                <span
                  key={pill}
                  className="text-xs font-medium text-ink bg-white/70 backdrop-blur-sm border border-accent-2 rounded-full px-3 py-1 shadow-sm"
                >
                  {pill}
                </span>
              )
            )}
          </div>

          <h1
            className="font-heading text-5xl md:text-6xl lg:text-7xl font-medium italic text-ink leading-[1.05] mb-5 text-balance animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Hair that fits <br />
            <span className="text-accent not-italic font-semibold">your life.</span>
          </h1>
          <p
            className="text-lg md:text-xl text-ink-soft mb-9 max-w-md leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            Walk in. Sit back. Walk out feeling like yourself. {neighborhood}, {city}.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#book"
              className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-brand bg-accent text-white font-semibold text-base transition-all active:scale-[0.98] hover:brightness-105 hover:shadow-lg shadow-accent/30 text-center"
            >
              Book Now
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-brand bg-white/70 backdrop-blur-sm border border-accent-2 text-ink font-semibold text-base transition-all active:scale-[0.98] hover:bg-white text-center"
            >
              See Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
