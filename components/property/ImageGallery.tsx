"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Grid2X2, Building2 } from "lucide-react";
import { PropertyImage } from "@/lib/types";

interface Props {
  images: PropertyImage[];
  title: string;
}

/* ── Lightbox ─────────────────────────────────────────────────────────────── */
function Lightbox({
  images,
  index,
  onClose,
}: {
  images: PropertyImage[];
  index: number;
  onClose: () => void;
}) {
  const [cur, setCur] = useState(index);

  const prev = useCallback(() => setCur((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCur((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next, onClose]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/95"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white/70 text-sm font-medium">
          {cur + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main image */}
      <div
        className="flex-1 relative flex items-center justify-center px-14 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-w-5xl mx-auto">
          <Image
            src={images[cur].url}
            alt={`Photo ${cur + 1}`}
            fill
            className="object-contain"
            sizes="90vw"
            priority
          />
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="shrink-0 px-5 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                i === cur ? "border-[#C8922A] opacity-100" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}

/* ── ImageGallery ─────────────────────────────────────────────────────────── */
export default function ImageGallery({ images, title }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mobileIdx, setMobileIdx] = useState(0);

  const primaryIdx = images.findIndex((i) => i.isPrimary);
  const ordered = primaryIdx > 0
    ? [images[primaryIdx], ...images.slice(0, primaryIdx), ...images.slice(primaryIdx + 1)]
    : images;

  /* ── No images ── */
  if (!images || images.length === 0) {
    return (
      <div className="h-64 sm:h-80 md:h-[460px] rounded-2xl bg-[#EEF3FB] flex flex-col items-center justify-center gap-3 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#D6E4F7] flex items-center justify-center">
          <Building2 className="w-7 h-7 text-[#ADC8EE]" />
        </div>
        <span className="text-[#ADC8EE] text-sm font-medium">No photos available</span>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop: AirBnB-style grid ── */}
      <div className="hidden md:block mb-6 sm:mb-8">
        <div
          className="grid gap-2 rounded-2xl overflow-hidden"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "240px 240px",
            height: "484px",
          }}
        >
          {/* Primary — spans 2 rows */}
          <div
            className="relative cursor-pointer group row-span-2"
            onClick={() => setLightboxIndex(0)}
          >
            <Image
              src={ordered[0].url}
              alt={title}
              fill
              className="object-cover group-hover:brightness-90 transition-all duration-300"
              priority
              sizes="50vw"
            />
          </div>

          {/* Small grid: 2×2 on right side */}
          <div className="grid grid-cols-2 gap-2 row-span-2">
            {[1, 2, 3, 4].map((i) =>
              ordered[i] ? (
                <div
                  key={i}
                  className="relative cursor-pointer group overflow-hidden"
                  onClick={() => setLightboxIndex(i)}
                >
                  <Image
                    src={ordered[i].url}
                    alt={`Photo ${i + 1}`}
                    fill
                    className="object-cover group-hover:brightness-90 transition-all duration-300"
                    sizes="25vw"
                  />
                  {/* "View all" overlay on last cell if more than 5 */}
                  {i === 4 && ordered.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">+{ordered.length - 5} more</span>
                    </div>
                  )}
                </div>
              ) : (
                <div key={i} className="bg-[#EEF3FB]" />
              )
            )}
          </div>
        </div>

        {/* View all button */}
        {ordered.length > 1 && (
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setLightboxIndex(0)}
              className="flex items-center gap-2 text-sm font-semibold text-[#1B3F72] hover:text-[#C8922A] transition-colors"
            >
              <Grid2X2 className="w-4 h-4" />
              View all {ordered.length} photos
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile: single image slider ── */}
      <div className="md:hidden mb-5 relative rounded-2xl overflow-hidden h-64 sm:h-72 bg-[#EEF3FB]">
        <Image
          src={ordered[mobileIdx].url}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        {ordered.length > 1 && (
          <>
            <button
              onClick={() => setMobileIdx((i) => (i - 1 + ordered.length) % ordered.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileIdx((i) => (i + 1) % ordered.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Counter badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
              {mobileIdx + 1} / {ordered.length}
            </div>

            {/* View all tap */}
            <button
              onClick={() => setLightboxIndex(mobileIdx)}
              className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
            >
              <Grid2X2 className="w-3 h-3" /> All photos
            </button>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={ordered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
