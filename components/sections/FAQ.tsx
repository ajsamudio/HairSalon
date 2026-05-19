import { ChevronDown } from "lucide-react";
import { faqs } from "@/content/faqs";
import { clientConfig } from "@/client.config";

export default function FAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-16 md:py-24 bg-surface">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 id="faq-heading" className="font-heading text-3xl md:text-4xl font-bold text-ink mb-8">
          Frequently asked questions
        </h2>

        <div className="max-w-2xl divide-y divide-line">
          {faqs.map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-4 text-ink font-medium">
                {faq.question}
                <ChevronDown
                  className="w-5 h-5 shrink-0 text-ink-soft transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-4 text-ink-soft leading-relaxed text-sm">{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* Still have questions */}
        <p className="mt-8 text-sm text-ink-soft">
          Still have questions?{" "}
          <a
            href={`mailto:${clientConfig.business.email}`}
            className="text-accent font-medium hover:underline"
          >
            Email us
          </a>{" "}
          or{" "}
          <a
            href={`sms:${clientConfig.business.phone.replace(/\D/g, "")}`}
            className="text-accent font-medium hover:underline"
          >
            text {clientConfig.business.phone}
          </a>
          .
        </p>
      </div>

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
