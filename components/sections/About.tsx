import Image from "next/image";
import { clientConfig } from "@/client.config";
import Reveal from "@/components/Reveal";

const specialties = ["Balayage", "Curtain Bangs", "Color Correction", "Bridal Hair", "Men's Cuts"];
const stats = [
  { value: "8+", label: "years behind the chair" },
  { value: "500+", label: "five-star clients" },
];

export default function About() {
  const { neighborhood, city } = clientConfig.business;

  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 md:py-28 bg-surface/60 relative overflow-hidden">
      <div className="blob" style={{ width: 340, height: 340, background: "#E8D5F0", bottom: -100, right: -80 }} aria-hidden />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          {/* Photo */}
          <Reveal className="w-full md:w-[40%] shrink-0">
            <div className="relative aspect-[4/5] rounded-brand overflow-hidden shadow-lg shadow-accent/10">
              <Image
                src="/images/owner-portrait.jpg"
                alt="Hair stylist portrait"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </Reveal>

          {/* Bio */}
          <Reveal delay={2} className="flex flex-col gap-6 md:pt-4">
            <div>
              <p className="text-accent font-medium tracking-wide uppercase text-xs mb-3">
                Meet Your Stylist
              </p>
              <h2 id="about-heading" className="font-heading text-4xl md:text-5xl font-medium italic text-ink mb-5">
                Made for you.
              </h2>
              <div className="space-y-4 text-ink-soft leading-relaxed">
                <p>
                  Hi, I&apos;m <strong className="text-ink">Alex Demo</strong>.
                </p>
                <p>
                  Licensed cosmetologist with 8 years behind the chair, specializing in lived-in color and modern cuts.
                </p>
                <p>
                  I take the time to actually listen to what you want, then tell you honestly what&apos;s achievable in one session. No surprises, no upsells, no rushing.
                </p>
                <p>
                  Born and raised in {city}. Previously at a top {neighborhood} salon — now doing exactly what I love, on my own terms.
                </p>
              </div>
            </div>

            {/* Specialty pills */}
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <span key={s} className="text-sm bg-white/70 border border-accent-2 text-ink rounded-full px-3 py-1.5">
                  {s}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading text-4xl font-semibold italic text-accent">{stat.value}</div>
                  <div className="text-sm text-ink-soft">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#book"
              className="inline-flex items-center justify-center self-start min-h-[52px] px-8 rounded-brand bg-accent text-white font-semibold transition-all active:scale-[0.98] hover:brightness-105 hover:shadow-lg shadow-accent/30"
            >
              Book Now
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
