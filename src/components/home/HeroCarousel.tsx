'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { heroSlides } from '@/data/hero-banners';
import { useTranslation } from '@/i18n/TranslationProvider';

export default function HeroCarousel() {
  const { dict } = useTranslation();
  const hero = (dict as Record<string, Record<string, string>>).hero;
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((c) => (c === 0 ? heroSlides.length - 1 : c - 1));

  const next = () =>
    setActive((c) => (c === heroSlides.length - 1 ? 0 : c + 1));

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-dark-card">
      {/* ── Slide track — all slides in a row, translate to show active ── */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {heroSlides.map((slide, i) => (
          <div key={slide.id} className="relative w-full h-full flex-shrink-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 65vw"
              priority={i === 0}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Title + Shop Now */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <h2 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                {slide.title}
              </h2>
              <Link
                href={slide.href}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors no-underline shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current stroke-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {hero.shopNow}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Left arrow ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* ── Right arrow ── */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === active ? 'bg-accent' : 'bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
