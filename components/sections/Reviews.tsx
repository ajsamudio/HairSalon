import { Star } from "lucide-react";
import { clientConfig } from "@/client.config";
import { reviews } from "@/content/reviews";

export default function Reviews() {
  const googleUrl = clientConfig.social.googleReviewsUrl ?? "#";

  return (
    <section aria-labelledby="reviews-heading" className="py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h2 id="reviews-heading" className="font-heading text-3xl md:text-4xl font-bold text-ink mb-2">
            What clients say
          </h2>
          <p className="text-ink-soft">★ 4.9 average · {reviews.length}+ reviews on Google</p>
        </div>

        {/* Mobile: scroll-snap carousel | Desktop: 3-col grid */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-none">
          {reviews.map((review, i) => (
            <article
              key={i}
              className="snap-start shrink-0 w-[85vw] md:w-auto bg-surface rounded-brand p-6 border border-line flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" aria-hidden />
                ))}
              </div>
              {/* Quote */}
              <blockquote className="text-ink leading-relaxed flex-1">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              {/* Attribution */}
              <footer className="text-sm text-ink-soft">
                <strong className="text-ink">{review.name}</strong> · {review.service}
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-6">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-accent font-medium hover:underline min-h-[44px]"
          >
            Read all reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
