# i18n (Internationalization) Architecture Plan

## Overview

Add multi-language support to the OpusKeys website with **en** (English, default), **es** (Spanish), and **pl** (Polish) — designed to be easily expandable to more languages. Uses Next.js App Router's `[locale]` dynamic segment for locale-prefixed URLs. Admin panel remains English-only.

---

## Architecture

```mermaid
graph TD
    A[User visits /] --> B{Middleware}
    B -->|No locale prefix| C[Detect from Accept-Language header or cookie]
    C --> D[Redirect to /en or /es or /pl]
    B -->|Has locale prefix /es/...| E[Pass through]
    B -->|Path starts with /admin| F[Skip i18n - pass through]
    E --> G[App Router: /app/[locale]/layout.tsx]
    G --> H[Load dictionary for locale]
    H --> I[Server components get dict directly]
    H --> J[TranslationProvider wraps client components]
    J --> K[Client components use useTranslation hook]
```

## URL Structure

| Current Route | New Route Pattern |
|---|---|
| `/` | `/en` or `/es` or `/pl` — redirect from `/` |
| `/login` | `/en/login`, `/es/login`, `/pl/login` |
| `/signup` | `/en/signup`, `/es/signup`, `/pl/signup` |
| `/contact-us` | `/en/contact-us`, `/es/contact-us`, `/pl/contact-us` |
| `/affiliate-program` | `/en/affiliate-program`, etc. |
| `/admin/*` | `/admin/*` — **unchanged, no locale prefix** |
| `/auth/callback` | `/auth/callback` — **unchanged, technical route** |

## File Structure

```
src/
├── i18n/
│   ├── config.ts              # Supported locales, default locale, type definitions
│   ├── dictionaries/
│   │   ├── en.json            # English strings - the source of truth
│   │   ├── es.json            # Spanish translations
│   │   └── pl.json            # Polish translations
│   ├── getDictionary.ts       # Server-side dictionary loader
│   └── TranslationProvider.tsx # React context for client components
├── app/
│   ├── globals.css            # unchanged
│   ├── [locale]/              # NEW - locale-aware route group
│   │   ├── layout.tsx         # Wraps children with TranslationProvider, sets <html lang>
│   │   ├── page.tsx           # Homepage
│   │   ├── (auth)/
│   │   │   ├── _components/
│   │   │   │   └── AuthCard.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── contact-us/page.tsx
│   │   └── affiliate-program/page.tsx
│   ├── admin/                 # STAYS HERE - not under [locale]
│   │   └── ...                # unchanged
│   └── auth/                  # STAYS HERE - technical callback route
│       └── callback/route.ts
├── components/
│   ├── Header.tsx             # Modified to receive dictionary
│   ├── HeaderActions.tsx      # Modified to use TranslationProvider
│   ├── UserDropdown.tsx       # Modified to use TranslationProvider
│   └── LanguageSwitcher.tsx   # NEW - dropdown to switch locale
├── middleware.ts              # Modified for locale detection + redirect
└── data/
    └── content.json           # Nav icons/hrefs stay, labels become translation keys
```

## Dictionary Structure (en.json)

```json
{
  "nav": {
    "inGameItems": "In-Game Items",
    "gameCoins": "Game Coins",
    "topUps": "Top-Ups",
    "accounts": "Accounts"
  },
  "header": {
    "searchPlaceholder": "Search for products",
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "owner": "Owner",
    "wishlist": "Wishlist",
    "cart": "Cart"
  },
  "auth": {
    "welcomeBack": "Welcome back!",
    "createAccount": "Create an account",
    "signInToAccount": "Sign in to your OpusKeys account",
    "joinToday": "Join OpusKeys today",
    "emailAddress": "Email address",
    "emailPlaceholder": "you@example.com",
    "sendMagicLink": "Send magic link",
    "sendingLink": "Sending link…",
    "or": "or",
    "continueWithGoogle": "Continue with Google",
    "signUpWithGoogle": "Sign up with Google",
    "noAccount": "Don't have an account?",
    "alreadyHaveAccount": "Already have an account?",
    "checkYourEmail": "Check your email",
    "magicLinkSent": "We sent a magic link to",
    "clickToSignIn": "Click it to sign in.",
    "clickToCreate": "Click it to create your account.",
    "back": "← Back",
    "redirecting": "Redirecting…",
    "sending": "Sending...",
    "createAccountBtn": "Create Account",
    "sentConfirmation": "We sent a confirmation link to",
    "sentLogin": "We sent a login link to",
    "checkInboxSignUp": "Check your inbox and click the link to complete sign up.",
    "checkInboxSignIn": "Check your inbox and click the link to sign in.",
    "useDifferentEmail": "← Use a different email"
  },
  "dropdown": {
    "adminPanel": "Admin Panel",
    "signOut": "Sign Out"
  },
  "pages": {
    "contactUs": {
      "title": "Contact Us",
      "description": "Have questions? Get in touch with our support team."
    },
    "affiliateProgram": {
      "title": "Affiliate Program",
      "description": "Join our affiliate program and earn commissions on every sale."
    }
  },
  "languageSwitcher": {
    "en": "English",
    "es": "Español",
    "pl": "Polski"
  }
}
```

## Key Implementation Details

### 1. i18n Config (`src/i18n/config.ts`)
- Export `locales = ['en', 'es', 'pl'] as const`
- Export `defaultLocale = 'en'`
- Export `Locale` type
- Export `Dictionary` type inferred from en.json

### 2. Middleware (`src/middleware.ts`)
- Skip `/admin`, `/auth/callback`, `/_next`, static assets
- Check if URL already has a valid locale prefix → pass through
- If no locale prefix:
  - Check `NEXT_LOCALE` cookie first
  - Then `Accept-Language` header
  - Fallback to `en`
  - Redirect to `/{detected-locale}{path}`
- Store chosen locale in `NEXT_LOCALE` cookie

### 3. Server Components (Header, pages)
- Import `getDictionary(locale)` directly
- Pass dictionary sections as props to client components

### 4. Client Components (HeaderActions, UserDropdown, AuthCard)
- Receive translations via `TranslationProvider` context
- `useTranslation()` hook returns the dictionary
- Provider wraps children in `[locale]/layout.tsx`

### 5. LanguageSwitcher Component
- Dropdown or button group showing current locale
- On switch: navigate to same path but with new locale prefix
- Sets `NEXT_LOCALE` cookie for persistence

### 6. content.json Changes
- Nav items keep `icon` field
- Replace `label` values with dictionary keys: `"label": "nav.inGameItems"`
- Header.tsx resolves keys from dictionary at render time

### 7. Internal Links
- All `<Link href>` in public pages must include `/${locale}` prefix
- Create a helper `localePath(locale, path)` or use `usePathname` to extract current locale

### 8. Metadata
- Each page generates locale-aware metadata: `title: dict.pages.contactUs.title + ' — OpusKeys'`
- `<html lang={locale}>` set in `[locale]/layout.tsx`

---

## Migration Steps (Execution Order)

1. **Create `src/i18n/config.ts`** — locale list, types
2. **Create `src/i18n/dictionaries/en.json`** — extract all English strings
3. **Create `src/i18n/dictionaries/es.json`** — Spanish translations
4. **Create `src/i18n/dictionaries/pl.json`** — Polish translations
5. **Create `src/i18n/getDictionary.ts`** — server-side loader
6. **Create `src/i18n/TranslationProvider.tsx`** — React context + hook
7. **Update `src/middleware.ts`** — locale detection + redirect + skip admin
8. **Create `src/app/[locale]/layout.tsx`** — load dict, set lang, wrap with provider
9. **Move `src/app/page.tsx` → `src/app/[locale]/page.tsx`**
10. **Move auth pages** into `src/app/[locale]/(auth)/`
11. **Move `contact-us` and `affiliate-program`** into `src/app/[locale]/`
12. **Remove old `src/app/layout.tsx` html/body** tags — move to `[locale]/layout.tsx` or keep a thin root layout
13. **Update Header.tsx** — accept `locale` + `dict` props, translate nav labels
14. **Update HeaderActions.tsx** — use translation context for Sign In/Sign Up/Owner etc.
15. **Update UserDropdown.tsx** — use translation context for all form labels
16. **Update AuthCard.tsx** — use translation context
17. **Update contact-us/page.tsx** and **affiliate-program/page.tsx** — use dict
18. **Create `src/components/LanguageSwitcher.tsx`** — locale switching UI
19. **Add LanguageSwitcher** to Header
20. **Update content.json** — nav labels → dictionary keys
21. **Update all `<Link href>`** in public routes to include locale prefix
22. **Test** all routes compile and render correctly in en/es/pl

---

## What Stays Unchanged

- **Admin panel** (`/admin/*`) — English only, no locale prefix, not translated
- **`/auth/callback`** — technical route, no locale prefix
- **Tailwind config, globals.css** — no changes
- **Supabase integration** — no changes
- **SVG icons** — no text to translate
