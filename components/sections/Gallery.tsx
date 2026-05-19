"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import GalleryTile from "./GalleryTile";

type GalleryFilter = "all" | "cuts" | "color" | "balayage" | "extensions" | "updos";

interface GalleryItem {
  src: string;
  alt: string;
  category: Exclude<GalleryFilter, "all">;
}

const FILTERS: { value: GalleryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "cuts", label: "Cuts" },
  { value: "color", label: "Color" },
  { value: "balayage", label: "Balayage" },
  { value: "extensions", label: "Extensions" },
  { value: "updos", label: "Updos" },
];

const galleryItems: GalleryItem[] = [
  { src: "https://placehold.co/600x750.png?text=Modern+bob+clean+lines", alt: "Modern bob, clean lines", category: "cuts" },
  { src: "https://placehold.co/600x750.png?text=Curtain+bangs+soft+layers", alt: "Curtain bangs, soft layers", category: "cuts" },
  { src: "https://placehold.co/600x750.png?text=Men%27s+textured+crop", alt: "Men's textured crop", category: "cuts" },
  { src: "https://placehold.co/600x750.png?text=Long+layers+glossy+back", alt: "Long layers, glossy back view", category: "cuts" },
  { src: "https://placehold.co/600x750.png?text=Rich+brunette+gloss", alt: "Rich brunette gloss", category: "color" },
  { src: "https://placehold.co/600x750.png?text=Copper+red+transformation", alt: "Copper/red transformation", category: "color" },
  { src: "https://placehold.co/600x750.png?text=Platinum+cool+blonde", alt: "Platinum cool blonde", category: "color" },
  { src: "https://placehold.co/600x750.png?text=Lived-in+dimensional+brunette", alt: "Lived-in dimensional brunette", category: "color" },
  { src: "https://placehold.co/600x750.png?text=Beachy+bronde+waves", alt: "Beachy bronde beach waves", category: "balayage" },
  { src: "https://placehold.co/600x750.png?text=Money+piece+face+frame", alt: "Money piece face frame", category: "balayage" },
  { src: "https://placehold.co/600x750.png?text=Sombre+gradient", alt: "Sombré gradient", category: "balayage" },
  { src: "https://placehold.co/600x750.png?text=Babylights+ultra+natural", alt: "Babylights ultra natural", category: "balayage" },
  { src: "https://placehold.co/600x750.png?text=Extensions+before+after+length", alt: "Extensions before/after length", category: "extensions" },
  { src: "https://placehold.co/600x750.png?text=Extensions+volume+length", alt: "Extensions volume and length", category: "extensions" },
  { src: "https://placehold.co/600x750.png?text=Soft+romantic+updo", alt: "Soft romantic updo", category: "updos" },
  { src: "https://placehold.co/600x750.png?text=Sleek+modern+updo", alt: "Sleek modern updo", category: "updos" },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  const visible =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="py-16 md:py-24 bg-surface">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-6">
          <h2 id="gallery-heading" className="font-heading text-3xl md:text-4xl font-bold text-ink mb-2">
            Recent work
          </h2>
          <p className="text-ink-soft">Real clients, real results. Tap any look to see it up close.</p>
        </div>

        {/* Filter chips */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none snap-x"
          role="group"
          aria-label="Filter gallery by category"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              aria-pressed={activeFilter === f.value}
              className={cn(
                "shrink-0 snap-start min-h-[44px] px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                activeFilter === f.value
                  ? "bg-accent text-white"
                  : "bg-bg text-ink-soft border border-line hover:border-accent hover:text-accent"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {visible.map((item) => (
            <GalleryTile
              key={item.src}
              src={item.src}
              alt={item.alt}
              onClick={() => {
                setLightboxSrc(item.src);
                setLightboxAlt(item.alt);
              }}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          role="dialog"
          aria-label={lightboxAlt}
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-2xl w-full max-h-[85vh] aspect-[4/5]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt={lightboxAlt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          <p className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-sm">
            <a href="#book" onClick={() => setLightboxSrc(null)} className="underline text-white hover:text-accent">
              Book this look
            </a>
          </p>
        </div>
      )}
    </section>
  );
}
