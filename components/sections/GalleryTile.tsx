"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface GalleryTileProps {
  src: string;
  alt: string;
  onClick: () => void;
}

export default function GalleryTile({ src, alt, onClick }: GalleryTileProps) {
  const [captionVisible, setCaptionVisible] = useState(false);

  const handleClick = useCallback(() => {
    // On touch devices: first tap shows caption, second tap opens lightbox
    if (!captionVisible) {
      setCaptionVisible(true);
    } else {
      setCaptionVisible(false);
      onClick();
    }
  }, [captionVisible, onClick]);

  return (
    <button
      onClick={handleClick}
      onMouseLeave={() => setCaptionVisible(false)}
      className="relative aspect-[4/5] overflow-hidden rounded-brand block w-full cursor-pointer group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      aria-label={`View: ${alt}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Caption overlay — CSS hover on desktop, state-driven on mobile */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 bottom-0 px-3 py-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent",
          "transition-opacity duration-200",
          // desktop: driven by CSS hover
          "opacity-0 group-hover:opacity-100",
          // mobile tap: driven by state
          captionVisible && "opacity-100"
        )}
      >
        <p className="text-white text-xs font-medium leading-snug drop-shadow">
          {alt}
        </p>
        {/* Hint shown only on first mobile tap */}
        {captionVisible && (
          <p className="text-white/60 text-[10px] mt-0.5 md:hidden">
            Tap again to enlarge
          </p>
        )}
      </div>
    </button>
  );
}
