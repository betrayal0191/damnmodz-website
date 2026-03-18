/* ── Banner type definitions ─────────────────────────────────── */

export interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  buttonText: string;
  image: string;
  href: string;
}

export interface PromoBanner {
  id: number;
  image: string;
  href: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

/* ── Static defaults (used as fallback when DB is empty) ────── */

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Marathon',
    subtitle: '',
    buttonText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=550&fit=crop',
    href: '#',
  },
  {
    id: 2,
    title: 'Elden Ring',
    subtitle: '',
    buttonText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=550&fit=crop',
    href: '#',
  },
  {
    id: 3,
    title: 'Cyberpunk 2077',
    subtitle: '',
    buttonText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=550&fit=crop',
    href: '#',
  },
];

export const defaultSideBanners: PromoBanner[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=260&fit=crop',
    href: '#',
    alt: 'Software Bundles',
    title: '',
    subtitle: '',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=500&h=260&fit=crop',
    href: '#',
    alt: 'Gift Cards',
    title: '',
    subtitle: '',
  },
];

export const defaultBottomBanners: PromoBanner[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500&h=280&fit=crop',
    href: '#',
    alt: 'Xbox Deals',
    title: '',
    subtitle: '',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=280&fit=crop',
    href: '#',
    alt: 'PlayStation Deals',
    title: '',
    subtitle: '',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&h=280&fit=crop',
    href: '#',
    alt: 'New Releases',
    title: '',
    subtitle: '',
  },
];
