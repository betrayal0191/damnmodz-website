/* ── Banner type definitions ─────────────────────────────────── */

export interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  image: string;
  href: string;
  platforms?: string[];
  price?: string;
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
    subtitle: 'The next chapter begins',
    description: 'Enter a sci-fi PvP extraction shooter where every run counts. Team up, gear up, and fight to survive.',
    buttonText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=550&fit=crop',
    href: '#',
    platforms: ['PC', 'XBOX', 'PS5'],
    price: 'Starting at USD 59.99+',
  },
  {
    id: 2,
    title: 'Elden Ring',
    subtitle: 'Shadow of the Erdtree',
    description: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.',
    buttonText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=550&fit=crop',
    href: '#',
    platforms: ['PC', 'XBOX', 'PS5', 'PS4'],
    price: 'Starting at USD 49.99+',
  },
  {
    id: 3,
    title: 'Cyberpunk 2077',
    subtitle: 'Phantom Liberty',
    description: 'Become an urban mercenary equipped with cybernetic enhancements in the open world of Night City.',
    buttonText: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=550&fit=crop',
    href: '#',
    platforms: ['PC', 'XBOX', 'PS5'],
    price: 'Starting at USD 29.99+',
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
