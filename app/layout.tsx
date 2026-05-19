import type { Metadata } from "next";
import { Cormorant_Garamond, Quicksand } from "next/font/google";
import { clientConfig } from "@/client.config";
import { faqs } from "@/content/faqs";
import { services } from "@/content/services";
import "./globals.css";

const fontHeading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// NEXT_PUBLIC_SITE_URL is set in Vercel env vars; fall back to VERCEL_URL
// (auto-provided by Vercel) before defaulting to localhost
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: clientConfig.seo.title,
  description: clientConfig.seo.description,
  openGraph: {
    title: clientConfig.seo.title,
    description: clientConfig.seo.description,
    images: [clientConfig.seo.ogImage],
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: clientConfig.seo.title,
    description: clientConfig.seo.description,
    images: [clientConfig.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ─── JSON-LD ────────────────────────────────────────────────────────────────

function buildHairSalonJsonLd() {
  const { business, social } = clientConfig;
  const hoursSpec = Object.entries(business.hours)
    .filter(([, v]) => v !== null)
    .map(([day, hrs]) => {
      const dayMap: Record<string, string> = {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
      };
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${dayMap[day]}`,
        opens: (hrs as string).split("–")[0].trim().replace("am", ":00").replace("pm", ":00"),
        closes: (hrs as string).split("–")[1].trim().replace("am", ":00").replace("pm", ":00"),
      };
    });

  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: business.name,
    description: clientConfig.seo.description,
    url: siteUrl,
    telephone: business.phone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city,
      addressCountry: "US",
    },
    openingHoursSpecification: hoursSpec,
    ...(social.instagram
      ? { sameAs: [`https://instagram.com/${social.instagram}`] }
      : {}),
  };
}

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function buildServicesJsonLd() {
  return services
    .filter((s) => s.is_active)
    .map((s) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.name,
      description: s.description ?? s.name,
      provider: {
        "@type": "HairSalon",
        name: clientConfig.business.name,
      },
      offers: {
        "@type": "Offer",
        price: (s.price_cents / 100).toFixed(0),
        priceCurrency: "USD",
      },
    }));
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hairSalonLd = buildHairSalonJsonLd();
  const faqLd = buildFaqJsonLd();
  const servicesLd = buildServicesJsonLd();

  return (
    <html lang="en" className={`${fontHeading.variable} ${fontBody.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hairSalonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        {servicesLd.map((ld, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
