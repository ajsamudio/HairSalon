import { MapPin, Phone, Mail } from "lucide-react";
import { clientConfig } from "@/client.config";

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export default function Footer() {
  const { name, address, phone, email, hours } = clientConfig.business;
  const { instagram, tiktok, googleReviewsUrl } = clientConfig.social;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/80">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand + NAP */}
          <div className="flex flex-col gap-4">
            <div className="font-heading font-bold text-xl text-white">{name}</div>
            <address className="not-italic text-sm leading-relaxed flex flex-col gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-start hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
                {address}
              </a>
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="flex gap-2 items-center hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden />
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex gap-2 items-center hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden />
                {email}
              </a>
            </address>

            {/* Social icons */}
            <div className="flex gap-3 mt-1">
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-white transition-colors"
                >
                  {/* Instagram icon (inline SVG — no paid icon lib needed) */}
                  <svg className="w-5 h-5" aria-hidden fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              )}
              {tiktok && (
                <a
                  href={`https://tiktok.com/@${tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-white transition-colors"
                >
                  {/* TikTok icon (inline SVG) */}
                  <svg className="w-5 h-5" aria-hidden fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/>
                  </svg>
                </a>
              )}
              {googleReviewsUrl && (
                <a
                  href={googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Google Reviews"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-white transition-colors text-sm font-bold"
                >
                  G
                </a>
              )}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Hours</h3>
            <table className="text-sm w-full">
              <tbody>
                {(Object.entries(hours) as [string, string | null][]).map(([day, hrs]) => (
                  <tr key={day}>
                    <td className="py-1 pr-4 text-white/60">{DAY_LABELS[day] ?? day}</td>
                    <td className="py-1 text-white/90">{hrs ?? "Closed"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Nav links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Quick links</h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2 text-sm">
                {[
                  { href: "#services", label: "Services" },
                  { href: "#gallery", label: "Gallery" },
                  { href: "#about", label: "About" },
                  { href: "#faq", label: "FAQ" },
                  { href: "#contact", label: "Contact" },
                  { href: "#book", label: "Book Now" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-white transition-colors min-h-[44px] flex items-center">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© {year} {name}. All rights reserved.</span>
          <span>Site by Monty&apos;s Media</span>
        </div>
      </div>
    </footer>
  );
}
