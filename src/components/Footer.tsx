'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/TranslationProvider';

export default function Footer() {
  const { dict, locale } = useTranslation();
  const f = dict.footer;

  return (
    <footer className="bg-dark-header border-t border-dark-border mt-auto">
      {/* ── Main footer columns ─────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-5">
              <svg viewBox="0 0 2293 2060" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footer-ok-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#4225a3"/>
                    <stop offset="100%" stopColor="#c696d2"/>
                  </linearGradient>
                </defs>
                <path fill="url(#footer-ok-grad)" d="M2136,652.22,1640.56,156.8C1539.64,55.88,1405.36,0,1262.74,0S985.84,55.88,884.92,156.8L508.35,533l240.2,240.2,54.21-53.79,25.86-26.27H829L1125.12,397a194.31,194.31,0,0,1,275.23,0l495.42,495.42c37.11,36.7,57.13,85.91,57.13,137.62a193.32,193.32,0,0,1-57.13,138l-495.42,495.42a194.31,194.31,0,0,1-275.23,0L748.55,1286.92l-240.2,240.2,58.8,58.8,317.77,317.77c100.92,100.92,235.19,156.38,377.82,156.38s276.9-55.46,377.82-156.38L2136,1408.28c101.33-100.93,156.79-235.2,156.79-378.24C2292.77,887.42,2237.31,753.14,2136,652.22Z"/>
                <polygon fill="url(#footer-ok-grad)" points="1331.35 949.57 458.99 949.57 568.41 841.61 386.23 659.42 0 1045.65 386.23 1414.77 568.73 1232.27 458.99 1122.53 1083.32 1122.53 1083.32 1367.04 1245.61 1367.04 1245.61 1122.53 1331.39 1122.53 1331.35 949.57"/>
              </svg>
              <span className="text-xl font-bold tracking-tight leading-none">
                <span className="text-accent">Opus</span><span className="text-white">Keys</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {f.description}
            </p>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">{f.legal}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/terms-of-service`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.termsOfService}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy-policy`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/refund-policy`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.refundPolicy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Gaming Platforms column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">{f.gamingPlatforms}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/?platform=pc`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.pc}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/?platform=ps5`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.playstation5}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/?platform=xbox`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.xboxSeriesXS}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/?platform=switch`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.nintendoSwitch}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">{f.socialLinks}</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.instagram}
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.twitter}
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.youtube}
                </a>
              </li>
            </ul>
          </div>

          {/* Other column */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">{f.other}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/contact-us`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.contactUs}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.faq}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/refund-policy`} className="text-gray-400 text-sm hover:text-accent transition-colors">
                  {f.refundPolicy}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar with genre links ─────────────────── */}
      <div className="border-t border-dark-border">
        <div className="max-w-[1400px] mx-auto px-10 py-4 flex justify-end">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {(['action', 'adventure', 'casual', 'horror', 'indie', 'racing'] as const).map((genre) => (
              <Link
                key={genre}
                href={`/${locale}/?genre=${genre}`}
                className="text-gray-300 text-sm font-medium hover:text-white transition-colors"
              >
                {f[genre]}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
