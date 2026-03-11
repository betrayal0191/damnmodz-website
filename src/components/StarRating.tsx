export default function StarRating({ rating }: { rating: number }) {
  const max = 5;
  const filled = Math.min(Math.max(Math.round(rating), 0), max);
  const stars = '★'.repeat(filled) + '☆'.repeat(max - filled);

  return <span className="text-xs text-[#f5a623] tracking-[1px]">{stars}</span>;
}
