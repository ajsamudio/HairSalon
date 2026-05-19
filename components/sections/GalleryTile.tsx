"use client";

import Image from "next/image";

interface GalleryTileProps {
  src: string;
  alt: string;
  onClick: () => void;
}

export default function GalleryTile({ src, alt, onClick }: GalleryTileProps) {
  return (
    <button
      onClick={onClick}
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
    </button>
  );
}
