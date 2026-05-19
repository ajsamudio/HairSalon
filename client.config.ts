export const clientConfig = {
  business: {
    name: "Demo Salon",
    tagline: "Cuts, color, and care in your neighborhood.",
    city: "Los Angeles",
    neighborhood: "Silver Lake",
    address: "1234 Sunset Blvd, Los Angeles, CA 90026",
    phone: "(323) 555-0100",
    email: "hello@demosalon.com",
    hours: {
      monday: null,
      tuesday: "10am – 7pm",
      wednesday: "10am – 7pm",
      thursday: "10am – 7pm",
      friday: "10am – 7pm",
      saturday: "9am – 6pm",
      sunday: "10am – 5pm",
    },
    timezone: "America/Los_Angeles",
  },
  brand: {
    preset: "approachable-modern" as
      | "approachable-modern"
      | "editorial-luxe"
      | "edgy-studio",
    primaryColor: "#E8A4B8",
    accentColor: "#F6D6E0",
  },
  social: {
    instagram: "demosalon",
    tiktok: "demosalon",
    googleReviewsUrl: null as string | null,
  },
  booking: {
    mode: "native" as "native" | "iframe",
    iframeSrc: null as string | null,
    minNoticeHours: 2,
    maxDaysAhead: 60,
    slotStepMinutes: 15,
    defaultDepositPercent: 25,
    welcomeOfferText: "New client? Get 15% off your first service.",
  },
  admin: {
    allowedEmails: ["demo@demosalon.com"],
  },
  seo: {
    title: "Demo Salon — Hair Stylist in Silver Lake, Los Angeles",
    description:
      "Silver Lake's trusted hair stylist for cuts, color, balayage, and extensions. Book online — same-day appointments.",
    ogImage: "/og-share.jpg",
  },
} as const;

export type ClientConfig = typeof clientConfig;
