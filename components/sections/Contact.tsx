import { MapPin, Phone, Mail } from "lucide-react";
import { clientConfig } from "@/client.config";
import Reveal from "@/components/Reveal";

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export default function Contact() {
  const { address, phone, email, hours } = clientConfig.business;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const telHref = `tel:${phone.replace(/\D/g, "")}`;
  const hoursEntries = Object.entries(hours) as [string, string | null][];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-20 md:py-28 bg-surface/60">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal className="mb-10 text-center">
          <p className="text-accent font-medium tracking-wide uppercase text-xs mb-3">
            Come Say Hi
          </p>
          <h2 id="contact-heading" className="font-heading text-4xl md:text-5xl font-medium italic text-ink">
            Visit the studio
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact info */}
          <Reveal className="flex flex-col gap-6">
            {/* Address */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 items-start text-ink hover:text-accent transition-colors group min-h-[44px]"
              aria-label="Get directions"
            >
              <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-accent" aria-hidden />
              <address className="not-italic leading-relaxed">{address}</address>
            </a>

            {/* Phone */}
            <a
              href={telHref}
              className="flex gap-3 items-center text-ink hover:text-accent transition-colors min-h-[44px]"
            >
              <Phone className="w-5 h-5 shrink-0 text-accent" aria-hidden />
              <span>{phone}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="flex gap-3 items-center text-ink hover:text-accent transition-colors min-h-[44px]"
            >
              <Mail className="w-5 h-5 shrink-0 text-accent" aria-hidden />
              <span>{email}</span>
            </a>

            {/* Hours */}
            <div>
              <h3 className="font-semibold text-ink mb-3">Hours</h3>
              <table className="text-sm w-full max-w-xs">
                <tbody>
                  {hoursEntries.map(([day, hrs]) => (
                    <tr key={day}>
                      <td className="py-1 pr-4 text-ink-soft font-medium capitalize">
                        {DAY_LABELS[day] ?? day}
                      </td>
                      <td className="py-1 text-ink">{hrs ?? "Closed"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={2} className="rounded-brand overflow-hidden h-60 md:h-80 bg-line shadow-md shadow-accent/10">
            <iframe
              src={mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${address}`}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
