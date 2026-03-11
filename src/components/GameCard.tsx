import Link from 'next/link';
import StarRating from './StarRating';

interface GameCardProps {
  thumbnail: string;
  name: string;
  rating: number;
  price: string;
  href: string;
}

export default function GameCard({ thumbnail, name, rating, price, href }: GameCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-2 py-2.5 rounded-lg no-underline transition-colors hover:bg-dark-card-hover"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt={name}
        className="w-[52px] h-[52px] rounded-md object-cover flex-shrink-0"
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[13px] font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </span>
        <div>
          <StarRating rating={rating} />
        </div>
        <span className="text-xs font-semibold text-accent">{price}</span>
      </div>
    </Link>
  );
}
