'use client';

import Link from 'next/link';

/* ── Game card data ── */
interface GameCard {
  name: string;
  gradient: string;
}

const leftGames: GameCard[] = [
  { name: 'GTA 5', gradient: 'from-green-500 to-emerald-900' },
  { name: 'Arc Raiders', gradient: 'from-orange-500 to-red-800' },
  { name: 'Black Ops 7', gradient: 'from-orange-700 to-neutral-900' },
  { name: 'Fortnite', gradient: 'from-yellow-400 to-orange-600' },
];

const rightGames: GameCard[] = [
  { name: 'Forza Horizon 5', gradient: 'from-pink-500 to-purple-800' },
  { name: 'Battlefield 6', gradient: 'from-sky-600 to-slate-800' },
  { name: 'Elden Ring', gradient: 'from-amber-500 to-yellow-800' },
  { name: 'Hell Divers 2', gradient: 'from-red-600 to-neutral-900' },
];

/* ── Stats data ── */
const stats = [
  {
    value: '100k+',
    label: 'ORDERS',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    value: '24/7',
    label: 'SUPPORT',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    value: '100%',
    label: 'SECURE',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    value: '4.9',
    label: 'RATING',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

/* ── Floating game card ── */
function GameCardEl({ game, delay }: { game: GameCard; delay: number }) {
  return (
    <div
      className="game-float-card"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Card */}
      <div className="w-[100px] bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-lg shadow-black/30 game-card-glow">
        {/* Image placeholder */}
        <div className={`aspect-square bg-gradient-to-br ${game.gradient} flex items-center justify-center p-2`}>
          <span className="text-white text-xs font-bold text-center leading-tight drop-shadow-md">
            {game.name}
          </span>
        </div>
        {/* Label */}
        <div className="px-2 py-1.5 text-center">
          <span className="text-white text-[10px] font-medium leading-tight line-clamp-1">
            {game.name}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main section ── */
export default function ModdedAccountsSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* ── Background dashed circles ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="dashed-circle w-[500px] h-[500px] md:w-[650px] md:h-[650px]" />
        <div className="dashed-circle w-[380px] h-[380px] md:w-[480px] md:h-[480px] absolute" />
      </div>

      {/* ── Floating game cards — LEFT ── */}
      <div className="hidden lg:block absolute left-4 xl:left-12 2xl:left-24 top-0 bottom-0 w-[130px]">
        <div className="relative h-full flex flex-col justify-around py-8">
          {leftGames.map((game, i) => (
            <GameCardEl key={game.name} game={game} delay={i * 0.7} />
          ))}
        </div>
      </div>

      {/* ── Floating game cards — RIGHT ── */}
      <div className="hidden lg:block absolute right-4 xl:right-12 2xl:right-24 top-0 bottom-0 w-[130px]">
        <div className="relative h-full flex flex-col justify-around py-8">
          {rightGames.map((game, i) => (
            <GameCardEl key={game.name} game={game} delay={i * 0.7 + 0.35} />
          ))}
        </div>
      </div>

      {/* ── Small decorative emojis ── */}
      <div className="absolute left-[18%] top-[38%] text-lg opacity-40 pointer-events-none animate-pulse">🎯</div>
      <div className="absolute right-[20%] top-[32%] text-lg opacity-30 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>🎮</div>

      {/* ── Center content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl mx-auto">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-dark-card/80 border border-dark-border rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
          <span className="text-yellow-400 text-sm tracking-wider">★★★★★</span>
          <span className="text-neutral-300 text-sm">
            Trusted by <strong className="text-white">50k+</strong> gamers
          </span>
        </div>

        {/* Main heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-2 tracking-tight">
          <span className="text-white">Modded Accounts</span>
          <br />
          <span className="text-white">&amp;</span>
        </h2>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold italic leading-tight mb-6 tracking-tight boosting-gradient">
          Boosting Services
        </h2>

        {/* Subtitle */}
        <p className="text-neutral-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
          Premium boosting services with guaranteed results.<br />
          Fast, secure, and 100% anonymous.
        </p>

        {/* CTA button */}
        <Link
          href="/browse-games"
          className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-8 py-3 text-sm transition-colors shadow-lg shadow-red-600/25 mb-10 no-underline"
        >
          {/* Gamepad icon */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 12h4M8 10v4" />
            <circle cx="15" cy="11" r="0.5" fill="currentColor" stroke="none" />
            <circle cx="17" cy="13" r="0.5" fill="currentColor" stroke="none" />
          </svg>
          TOP GAMES
          {/* Dropdown chevron */}
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Link>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1.5 bg-dark-card/70 border border-dark-border rounded-xl px-3 py-4 backdrop-blur-sm"
            >
              <span className="text-neutral-400">{stat.icon}</span>
              <span className="text-white font-bold text-lg leading-none">{stat.value}</span>
              <span className="text-neutral-500 text-[10px] font-semibold tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
