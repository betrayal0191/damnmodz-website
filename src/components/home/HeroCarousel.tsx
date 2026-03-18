'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { HeroSlide } from '@/data/hero-banners';

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(
    () => setActive((c) => (c === 0 ? slides.length - 1 : c - 1)),
    [slides.length],
  );

  const next = useCallback(
    () => setActive((c) => (c === slides.length - 1 ? 0 : c + 1)),
    [slides.length],
  );

  /* Auto-rotate every 6s unless paused */
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden bg-dark-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide track ── */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.id} className="relative w-full h-full flex-shrink-0">
            {/* Background image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />

            {/* Gradient overlays — left-heavy + bottom */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* ── Content overlay ── */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
              {/* Title */}
              <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-lg leading-tight max-w-[65%]">
                {slide.title}
              </h2>

              {/* Platforms */}
              {slide.platforms && slide.platforms.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-white/70 text-xs font-medium">Available on:</span>
                  <div className="flex items-center gap-1.5">
                    {slide.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2.5 py-0.5 rounded-full border border-white/40 text-white text-[11px] font-semibold tracking-wide"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {slide.description && (
                <p className="text-white/70 text-sm md:text-base mt-2.5 max-w-md leading-relaxed drop-shadow">
                  {slide.description}
                </p>
              )}

              {/* CTA button + price */}
              <div className="flex items-center gap-4 mt-4">
                <Link
                  href={slide.href}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors no-underline shadow-lg shadow-accent/20"
                >
                  {slide.buttonText || 'Shop Now'}
                </Link>
                {slide.price && (
                  <span className="text-white/80 text-sm font-semibold">
                    {slide.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Left arrow ── */}
      {slides.length > 1 && (
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* ── Right arrow ── */}
      {slides.length > 1 && (
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* ── Dot indicators — bottom right ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === active
                  ? 'bg-accent scale-110'
                  : 'bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
