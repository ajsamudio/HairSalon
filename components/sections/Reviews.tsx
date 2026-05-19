import { clientConfig } from "@/client.config";
import { reviews } from "@/content/reviews";
import Reveal from "@/components/Reveal";

export default function Reviews() {
  const googleUrl = clientConfig.social.googleReviewsUrl ?? "#";

  return (
    <section aria-labelledby="reviews-heading" className="py-20 md:py-28 relative overflow-hidden">
      <div className="blob" style={{ width: 320, height: 320, background: "#F6D6E0", top: 40, left: -120 }} aria-hidden />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 relative">
        <Reveal className="mb-12 text-center">
          <p className="text-accent font-medium tracking-wide uppercase text-xs mb-3">
            Kind Words
          </p>
          <h2
            id="reviews-heading"
            className="font-heading text-4xl md:text-5xl font-medium italic text-ink mb-3"
          >
            Loved by clients
          </h2>
          <p className="text-ink-soft">A few notes from the chair.</p>
        </Reveal>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-none">
          {reviews.map((review, i) => (
            <Reveal
              key={i}
              delay={(((i % 3) + 1) as 1 | 2 | 3)}
              as="article"
              className="snap-start shrink-0 w-[85vw] md:w-auto bg-white/70 backdrop-blur-sm rounded-brand p-7 border border-accent-2 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <span
                aria-hidden
                className="font-heading text-6xl text-accent leading-none -mb-4"
              >
                &ldquo;
              </span>
              <blockquote className="font-heading italic text-xl text-ink leading-relaxed flex-1">
                {review.quote}
              </blockquote>
              <footer className="text-sm text-ink-soft pt-3 border-t border-accent-2/60">
                <strong className="text-ink font-semibold not-italic">
                  {review.name}
                </strong>
                <span className="block text-xs mt-0.5">{review.service}</span>
              </footer>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-accent font-semibold hover:underline min-h-[44px]"
          >
            Read more on Google →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
