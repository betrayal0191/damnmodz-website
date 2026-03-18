import HeroSection from '@/components/home/HeroSection';
import ModdedAccountsSection from '@/components/home/ModdedAccountsSection';

export default function HomePage() {
  return (
    <main>
      <div className="px-10 py-[30px] max-w-[1400px] mx-auto">
        <HeroSection />
      </div>
      <ModdedAccountsSection />
    </main>
  );
}
