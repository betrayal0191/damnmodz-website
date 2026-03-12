import GameCard from './GameCard';
import { createClient } from '@/lib/supabase/server';
import content from '@/data/content.json';

interface DiscountedGamesData {
  section_title: string;
  games: {
    thumbnail: string;
    name: string;
    rating: number;
    price: string;
    href: string;
  }[];
}

export default async function DiscountedSidebar() {
  let data: DiscountedGamesData = content.discounted_games;

  try {
    const supabase = await createClient();
    const { data: row } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'discounted_games')
      .single();

    if (row?.value && typeof row.value === 'object' && 'games' in (row.value as object)) {
      data = row.value as DiscountedGamesData;
    }
  } catch {
    // Fall back to static content.json
  }

  const { section_title, games } = data;

  return (
    <aside className="w-[280px] min-w-[280px] bg-dark-card rounded-xl p-5 flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center gap-2.5 mb-[18px] pb-[14px] border-b border-dark-border">
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 className="text-[15px] font-semibold text-white tracking-[0.3px]">
          {section_title}
        </h3>
      </div>

      {/* Game List */}
      <div className="flex flex-col gap-0.5">
        {games.map((game) => (
          <GameCard
            key={game.name}
            thumbnail={game.thumbnail}
            name={game.name}
            rating={game.rating}
            price={game.price}
            href={game.href}
          />
        ))}
      </div>
    </aside>
  );
}
