import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import content from '@/data/content.json';

interface Banner {
  background_image: string;
  background_alt: string;
  logo_image: string;
  logo_alt: string;
  title: string;
  platforms: string[];
  platforms_label: string;
  description: string;
  cta_text: string;
  cta_href: string;
  price_label: string;
  price_value: string;
}

export default async function FeaturedBanner() {
  let banners: Banner[] = content.featured_banners;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'featured_banners')
      .single();

    if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
      banners = data.value as Banner[];
    }
  } catch {
    // Fall back to static content.json
  }

  const b = banners[0]; // First banner (carousel-ready)

  return (
    <div className="flex-1 relative rounded-xl overflow-hidden min-h-[420px]">
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={b.background_image}
        alt={b.background_alt}
        className="w-full h-full object-cover block absolute top-0 left-0"
      />

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-[35px] py-[30px] bg-gradient-to-t from-black/90 via-black/60 to-transparent z-[1]">
        {/* Game Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={b.logo_image}
          alt={b.logo_alt}
          className="block max-w-[220px] h-auto mb-3 animate-slide-up"
        />

        {/* Title */}
        <h2 className="text-[28px] font-bold text-white mb-3 [text-shadow:0_2px_8px_rgba(0,0,0,0.5)] animate-slide-up-1">
          {b.title}
        </h2>

        {/* Platform Badges */}
        <div className="flex items-center gap-2 mb-2.5 text-xs text-neutral-400 animate-slide-up-2">
          <span>{b.platforms_label}</span>
          {b.platforms.map((platform) => (
            <span
              key={platform}
              className="inline-block px-2.5 py-[3px] border border-neutral-500 rounded-full text-[11px] font-medium text-white tracking-[0.5px]"
            >
              {platform}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-[13px] text-neutral-400 leading-relaxed mb-4 max-w-[480px] animate-slide-up-3">
          {b.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 animate-slide-up-4">
          <Link
            href={b.cta_href}
            className="inline-block px-6 py-2.5 bg-accent text-white text-[13px] font-semibold no-underline rounded-md transition-colors tracking-[0.3px] hover:bg-accent-hover"
          >
            {b.cta_text}
          </Link>
          <span className="text-[13px] text-neutral-400">
            {b.price_label} <strong className="text-white">{b.price_value}</strong>
          </span>
        </div>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-4 right-5 flex gap-1.5 z-[2]">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors ${
              i === 0 ? 'bg-white' : 'bg-neutral-600 hover:bg-neutral-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
