import Image from "next/image";
import { clientConfig } from "@/client.config";

const placeholderTiles = Array.from({ length: 6 }, (_, i) => ({
  src: `https://placehold.co/400x400.png?text=IG+Post+${i + 1}`,
  alt: `Recent Instagram post ${i + 1}`,
}));

export default function InstagramFeed() {
  const { instagram } = clientConfig.social;

  return (
    <section aria-labelledby="ig-heading" className="py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
          <div>
            <h2 id="ig-heading" className="font-heading text-2xl md:text-3xl font-bold text-ink">
              Daily looks
            </h2>
            <p className="text-ink-soft mt-1">
              Follow{" "}
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-medium hover:underline"
              >
                @{instagram}
              </a>{" "}
              for fresh transformations.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-1">
          {placeholderTiles.map((tile, i) => (
            <a
              key={i}
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={tile.alt}
              className="relative aspect-square overflow-hidden block focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                loading="lazy"
                className="object-cover hover:opacity-90 transition-opacity"
                sizes="(max-width: 1280px) 33vw, 420px"
              />
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-brand border border-line text-ink font-medium text-sm hover:border-accent hover:text-accent transition-colors"
          >
            Follow on Instagram
          </a>
          {clientConfig.social.tiktok && (
            <a
              href={`https://tiktok.com/@${clientConfig.social.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-brand border border-line text-ink font-medium text-sm hover:border-accent hover:text-accent transition-colors"
            >
              Watch on TikTok
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
