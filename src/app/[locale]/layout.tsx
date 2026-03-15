import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { TranslationProvider } from '@/i18n/TranslationProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <div className="flex flex-col min-h-screen">
      <TranslationProvider dict={dict} locale={locale as Locale}>
        <Header locale={locale as Locale} />
        <div className="flex-1">{children}</div>
        <Footer />
      </TranslationProvider>
    </div>
  );
}
