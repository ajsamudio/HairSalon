import Image from "next/image";
import { clientConfig } from "@/client.config";

const specialties = ["Balayage", "Curtain Bangs", "Color Correction", "Bridal Hair", "Men's Cuts"];
const stats = [
  { value: "8+", label: "years behind the chair" },
  { value: "500+", label: "five-star clients" },
];

export default function About() {
  const { neighborhood, city } = clientConfig.business;

  return (
    <section id="about" aria-labelledby="about-heading" className="py-16 md:py-24 bg-surface">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Photo */}
          <div className="w-full md:w-[40%] shrink-0">
            <div className="relative aspect-[4/5] rounded-brand overflow-hidden">
              <Image
                src="https://placehold.co/800x1000.png?text=Owner+Portrait"
                alt="Hair stylist portrait"
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-6 md:pt-4">
            <div>
              <h2 id="about-heading" className="font-heading text-3xl md:text-4xl font-bold text-ink mb-4">
                About Your Stylist
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
                <span key={s} className="text-sm bg-accent-2 text-ink rounded-full px-3 py-1.5">
                  {s}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-ink-soft">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#book"
              className="inline-flex items-center justify-center self-start min-h-[52px] px-8 rounded-brand bg-accent text-white font-semibold transition-all active:scale-[0.98] hover:brightness-90"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
