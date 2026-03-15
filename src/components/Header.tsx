import Link from 'next/link';
import content from '@/data/content.json';
import HeaderActions from '@/components/HeaderActions';
import { auth } from '@/lib/auth';
import { isOwner } from '@/lib/auth/owner';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';

/* ── Social icon SVGs ─────────────────────────────────── */
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  );
}

function InGameIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0 translate-y-[0.5px]" fill="none">
      <path d="M8 5L8.758 7.27391C8.90253 7.70751 9.3083 7.99999 9.76536 8H14.2346C14.6917 7.99999 15.0975 7.70751 15.242 7.27391L16 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.39077 5H16.6093C18.5513 5 20.2128 6.39495 20.5489 8.3077L21.966 16.3718C22.1583 17.4661 21.5195 18.536 20.465 18.8859V18.8859C19.6174 19.1672 18.6836 18.9181 18.0886 18.2521L15.1959 15.014H8.8041L5.91141 18.2521C5.31642 18.9181 4.38269 19.1672 3.53504 18.8859V18.8859C2.48052 18.536 1.84175 17.4661 2.03404 16.3718L3.45113 8.3077C3.78725 6.39495 5.44872 5 7.39077 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GameCoinsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] flex-shrink-0" fill="none">
      <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 9C15 7.34 13.66 6.5 12 6.5C10.34 6.5 9 7.84 9 9C9 10.66 10.34 11.5 12 12C13.66 12.5 15 13.34 15 15C15 16.66 13.66 17.5 12 17.5C10.34 17.5 9 16.16 9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TopUpsIcon() {
  return (
    <svg viewBox="0 0 26 26" className="w-6 h-6 flex-shrink-0" fill="none">
      <path d="M22.0037 10.4989V7.49768C22.0037 6.1164 20.884 4.99664 19.5027 4.99664H6.49726C5.11597 4.99664 3.99622 6.1164 3.99622 7.49768V10.9991" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.0037 15.501V18.5023C22.0037 19.8836 20.884 21.0033 19.5027 21.0033H16.0012" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M19.5028 10.499H22.0038C22.5563 10.499 23.0042 10.9469 23.0042 11.4994V14.5006C23.0042 15.0531 22.5563 15.501 22.0038 15.501H19.5028C18.1215 15.501 17.0017 14.3813 17.0017 13V13C17.0017 11.6187 18.1215 10.499 19.5028 10.499V10.4992" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 17.0017H2.99585" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10.9992 14.0004H4.99668C3.89165 14.0004 2.99585 14.8962 2.99585 16.0013V20.0029C2.99585 21.108 3.89165 22.0038 4.99668 22.0038H10.9992C12.1042 22.0038 13 21.108 13 20.0029V16.0013C13 14.8962 12.1042 14.0004 10.9992 14.0004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AccountsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none">
      <path d="M21 11V8C21 5.23858 18.7614 3 16 3H8C5.23858 3 3 5.23858 3 8V16C3 18.7614 5.23858 21 8 21H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14H10C8.89543 14 8 14.8954 8 16V16" stroke="currentColor" strokeWidth="1.4824" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="9.25" r="2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M15 17.9948C15 19.6783 17.1183 20.9244 18.0607 21.3957C18.3373 21.5349 18.6635 21.5348 18.94 21.3953C19.8827 20.9238 22 19.6805 22 17.9948V15.5978C21.9919 15.3363 21.7878 15.1258 21.5268 15.1034C20.6406 15.0221 19.7923 14.7049 19.0702 14.1847C18.7614 13.9384 18.27 13.9384 17.9384 14.1847C17.2076 14.7049 16.3594 15.0221 15.4732 15.1034C15.2122 15.1229 15.0081 15.3363 15 15.5978V17.9948Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const navIcons: Record<string, () => JSX.Element> = {
  ingame: InGameIcon,
  gamecoins: GameCoinsIcon,
  topups: TopUpsIcon,
  accounts: AccountsIcon,
};

/* Map icon key → dictionary key for nav labels */
const navDictKeys: Record<string, string> = {
  ingame: 'inGameItems',
  gamecoins: 'gameCoins',
  topups: 'topUps',
  accounts: 'accounts',
};

const socialIcons: Record<string, () => JSX.Element> = {
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  discord: DiscordIcon,
};

const socialHoverColors: Record<string, string> = {
  instagram: 'social-instagram',
  youtube:   'hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white',
  tiktok:    'hover:bg-black hover:border-black hover:text-white',
  discord:   'hover:bg-[#5865F2] hover:border-[#5865F2] hover:text-white',
};

export default async function Header({ locale }: { locale: Locale }) {
  const session = await auth();
  const user = session?.user ?? null;
  const { logo, nav, social } = content.header;
  const dict = await getDictionary(locale);

  return (
    <header className="sticky top-0 z-50 bg-dark-header border-b border-dark-border">
      <div className="flex items-center h-[72px] px-10">
        {/* ── Logo ──────────────────────────────────────── */}
        <Link href={`/${locale}${logo.href === '/' ? '' : logo.href}`} className="flex items-center gap-2.5 no-underline mr-20 flex-shrink-0">
          {/* OpusKeys icon */}
          <svg viewBox="0 0 2293 2060" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ok-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#4225a3"/>
                <stop offset="100%" stopColor="#c696d2"/>
              </linearGradient>
            </defs>
            <path fill="url(#ok-grad)" d="M2136,652.22,1640.56,156.8C1539.64,55.88,1405.36,0,1262.74,0S985.84,55.88,884.92,156.8L508.35,533l240.2,240.2,54.21-53.79,25.86-26.27H829L1125.12,397a194.31,194.31,0,0,1,275.23,0l495.42,495.42c37.11,36.7,57.13,85.91,57.13,137.62a193.32,193.32,0,0,1-57.13,138l-495.42,495.42a194.31,194.31,0,0,1-275.23,0L748.55,1286.92l-240.2,240.2,58.8,58.8,317.77,317.77c100.92,100.92,235.19,156.38,377.82,156.38s276.9-55.46,377.82-156.38L2136,1408.28c101.33-100.93,156.79-235.2,156.79-378.24C2292.77,887.42,2237.31,753.14,2136,652.22Z"/>
            <polygon fill="url(#ok-grad)" points="1331.35 949.57 458.99 949.57 568.41 841.61 386.23 659.42 0 1045.65 386.23 1414.77 568.73 1232.27 458.99 1122.53 1083.32 1122.53 1083.32 1367.04 1245.61 1367.04 1245.61 1122.53 1331.39 1122.53 1331.35 949.57"/>
          </svg>
          <span className="text-xl font-bold tracking-tight leading-none">
            <span className="text-accent">{logo.text_left}</span><span className="text-white">{logo.text_right}</span>
          </span>
        </Link>

        {/* ── Navigation ────────────────────────────────── */}
        <nav className="flex items-center gap-7 mr-auto">
          {nav.map((item: { label: string; icon?: string }) => {
            const NavIcon = item.icon ? navIcons[item.icon] : null;
            const dictKey = item.icon ? navDictKeys[item.icon] : null;
            const label = dictKey ? (dict.nav as Record<string, string>)[dictKey] ?? item.label : item.label;
            return (
              <span
                key={item.label}
                className="text-neutral-300 text-[15px] font-medium whitespace-nowrap transition-colors hover:text-white cursor-pointer select-none flex items-center gap-1.5"
              >
                {NavIcon && <NavIcon />}
                {label}
              </span>
            );
          })}
        </nav>

        {/* ── Social Icons ──────────────────────────────── */}
        <div className="flex items-center gap-3 mr-7">
          {social.map((s: { label: string; href: string; icon: string }) => {
            const Icon = socialIcons[s.icon];
            return (
              <a
                key={s.icon}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={`w-9 h-9 rounded-full border border-zinc-600 flex items-center justify-center text-neutral-400 transition-colors ${socialHoverColors[s.icon] ?? 'hover:text-white hover:border-zinc-400'}`}
              >
                {Icon && <Icon />}
              </a>
            );
          })}
        </div>

        {/* ── Search Bar ────────────────────────────────── */}
        <div className="flex items-center mr-7">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={dict.header.searchPlaceholder}
              className="w-72 h-9 pl-4 pr-11 bg-transparent border border-zinc-600 rounded-full text-sm text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors"
            />
            <button
              aria-label="Search"
              className="absolute right-0 top-0 h-9 w-9 rounded-full bg-accent flex items-center justify-center transition-colors hover:bg-accent-hover"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-white stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Right Icons (Sign In text + User + Wishlist + Cart) ── */}
        <HeaderActions initialEmail={user?.email ?? null} initialIsOwner={isOwner(user)} locale={locale} />
      </div>
    </header>
  );
}
