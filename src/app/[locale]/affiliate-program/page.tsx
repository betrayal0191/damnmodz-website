import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  return { title: dict.pages.affiliateProgram.metaTitle };
}

export default async function AffiliateProgramPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return null;
  const dict = await getDictionary(locale as Locale);

  return (
    <main className="px-10 py-[60px] text-white">
      <h1 className="text-[32px] font-bold mb-4">{dict.pages.affiliateProgram.title}</h1>
      <p className="text-base text-neutral-500 leading-relaxed">
        {dict.pages.affiliateProgram.description}
      </p>
    </main>
  );
}
