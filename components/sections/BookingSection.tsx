import { clientConfig } from "@/client.config";
import BookingEmbed from "@/components/booking/BookingEmbed";

export default function BookingSection() {
  const { phone } = clientConfig.business;
  const smsHref = `sms:${phone.replace(/\D/g, "")}`;

  return (
    <section
      id="book"
      aria-labelledby="booking-heading"
      className="py-16 md:py-24 bg-surface"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <h2
          id="booking-heading"
          className="font-heading text-3xl md:text-4xl font-bold text-ink mb-2"
        >
          Book your appointment
        </h2>
        <p className="text-ink-soft mb-8">
          Real-time availability. Deposit held securely via Stripe.
        </p>

        <BookingEmbed />

        {/* Fallback contact */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 text-sm text-ink-soft">
          <span>
            Prefer to text?{" "}
            <a
              href={smsHref}
              className="text-accent font-medium hover:underline min-h-[44px] inline-flex items-center"
            >
              {phone}
            </a>
          </span>
          <span>Cancellation policy: 24 hours notice, please.</span>
        </div>
      </div>
    </section>
  );
}
