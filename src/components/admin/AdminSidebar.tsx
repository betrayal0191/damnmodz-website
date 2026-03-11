'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/admin',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-dark-header border-r border-dark-border min-h-[calc(100vh-60px)] flex flex-col">
      {/* ── Header ──────────────────────────────────── */}
      <div className="px-5 py-5 border-b border-dark-border">
        <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent fill-current">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
          </svg>
          Admin Panel
        </h2>
        <p className="text-neutral-500 text-xs mt-1 truncate">{email}</p>
      </div>

      {/* ── Navigation ──────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ──────────────────────────────────── */}
      <div className="px-3 py-4 border-t border-dark-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 no-underline transition-colors hover:text-white hover:bg-white/5"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
