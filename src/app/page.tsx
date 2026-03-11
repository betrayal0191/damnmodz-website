import FeaturedBanner from '@/components/FeaturedBanner';
import DiscountedSidebar from '@/components/DiscountedSidebar';

export default function HomePage() {
  return (
    <main className="flex gap-5 px-10 py-[30px] max-w-[1400px] mx-auto">
      <FeaturedBanner />
      <DiscountedSidebar />
    </main>
  );
}
