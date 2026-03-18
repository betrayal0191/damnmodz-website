import Link from 'next/link';
import type { PromoBanner as PromoBannerType } from '@/data/hero-banners';

interface PromoBannerProps {
  banner: PromoBannerType;
  className?: string;
}

export default function PromoBanner({ banner, className = '' }: PromoBannerProps) {
  const hasOverlay = banner.title || banner.subtitle;

  return (
    <Link
      href={banner.href}
      className={`relative block rounded-xl overflow-hidden group ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.image}
        alt={banner.alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Subtle dark overlay on hover */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

      {/* Optional text overlay */}
      {hasOverlay && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          {banner.title && (
            <h3 className="text-white text-lg font-bold drop-shadow-lg">{banner.title}</h3>
          )}
          {banner.subtitle && (
            <p className="text-white/80 text-sm mt-0.5 drop-shadow-lg">{banner.subtitle}</p>
          )}
        </div>
      )}
    </Link>
  );
}
