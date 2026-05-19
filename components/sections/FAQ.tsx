import { ChevronDown } from "lucide-react";
import { faqs } from "@/content/faqs";
import { clientConfig } from "@/client.config";
import Reveal from "@/components/Reveal";

export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal className="mb-10 text-center">
          <p className="text-accent font-medium tracking-wide uppercase text-xs mb-3">
            Good to Know
          </p>
          <h2 id="faq-heading" className="font-heading text-4xl md:text-5xl font-medium italic text-ink">
            Frequently asked
          </h2>
        </Reveal>

        <Reveal className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm rounded-brand border border-accent-2 p-2">
          {faqs.map((faq, i) => (
            <details key={i} className="group border-b border-accent-2/60 last:border-b-0">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-4 py-4 text-ink font-medium">
                {faq.question}
                <ChevronDown
                  className="w-5 h-5 shrink-0 text-accent transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="px-4 pb-4 text-ink-soft leading-relaxed text-sm">{faq.answer}</p>
            </details>
          ))}
        </Reveal>


        {/* Still have questions */}
        <p className="mt-8 text-sm text-ink-soft text-center max-w-2xl mx-auto">
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

    </section>
  );
}
