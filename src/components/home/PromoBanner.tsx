import Image from 'next/image';
import Link from 'next/link';
import type { PromoBanner as PromoBannerType } from '@/data/hero-banners';

interface PromoBannerProps {
  banner: PromoBannerType;
  className?: string;
}

export default function PromoBanner({ banner, className = '' }: PromoBannerProps) {
  return (
    <Link
      href={banner.href}
      className={`relative block rounded-xl overflow-hidden group ${className}`}
    >
      <Image
        src={banner.image}
        alt={banner.alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 35vw"
      />
      {/* Subtle dark overlay on hover */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
    </Link>
  );
}
