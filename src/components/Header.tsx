import Link from 'next/link';
import content from '@/data/content.json';
import UserDropdown from '@/components/UserDropdown';

export default function Header() {
  const { logo, nav } = content.header;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-10 h-[50px] bg-dark-header border-b-2 border-accent">
      {/* Logo */}
      <div className="text-base font-bold tracking-[2px] uppercase whitespace-nowrap">
        <Link href={logo.href} className="no-underline">
          <span className="text-white">{logo.text_left}</span>
          <span className="text-accent">{logo.text_right}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-[35px]">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-neutral-400 no-underline text-xs font-medium tracking-[1.5px] uppercase whitespace-nowrap transition-colors hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Header Icons */}
      <div className="flex items-center gap-[18px]">
        <button aria-label="Search" className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center group">
          <svg
            viewBox="0 0 24 24"
            className="w-[18px] h-[18px] fill-none stroke-neutral-400 stroke-2 [stroke-linecap:round] [stroke-linejoin:round] transition-colors group-hover:stroke-white"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <UserDropdown />
        <button aria-label="Cart" className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center group">
          <svg
            viewBox="0 0 24 24"
            className="w-[18px] h-[18px] fill-none stroke-neutral-400 stroke-2 [stroke-linecap:round] [stroke-linejoin:round] transition-colors group-hover:stroke-white"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}
