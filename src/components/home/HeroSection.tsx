import HeroCarousel from './HeroCarousel';
import PromoBanner from './PromoBanner';
import { sideBanners, bottomBanners } from '@/data/hero-banners';

export default function HeroSection() {
  return (
    <section className="flex flex-col gap-4">
      {/* ── Top row: carousel + side banners ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.52fr] gap-4" style={{ minHeight: 380 }}>
        {/* Carousel */}
        <HeroCarousel />

        {/* Stacked side banners */}
        <div className="hidden lg:grid grid-rows-2 gap-4">
          {sideBanners.map((banner) => (
            <PromoBanner key={banner.id} banner={banner} className="h-full" />
          ))}
        </div>
      </div>

      {/* ── Bottom row: 3 equal promo cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bottomBanners.map((banner) => (
          <PromoBanner
            key={banner.id}
            banner={banner}
            className="aspect-[16/9]"
          />
        ))}
      </div>
    </section>
  );
}
