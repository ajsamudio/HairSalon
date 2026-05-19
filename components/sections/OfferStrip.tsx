import { clientConfig } from "@/client.config";

export default function OfferStrip() {
  const { welcomeOfferText } = clientConfig.booking;
  if (!welcomeOfferText) return null;

  return (
    <div className="bg-accent-2 border-b border-line">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-sm font-medium text-ink">
        <span>{welcomeOfferText}</span>
        <a
          href="#book"
          className="inline-flex items-center gap-1 text-accent font-semibold underline-offset-2 hover:underline min-h-[44px] sm:min-h-0"
        >
          Claim Offer →
        </a>
      </div>
    </div>
  );
}
