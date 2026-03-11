# DamnModz — Phase 1: Next.js Migration + Supabase Auth

## Scope

Migrate static site to Next.js + Tailwind. Implement passwordless login with Email OTP and Passkey/WebAuthn. No admin dashboard yet.

---

## Architecture

```mermaid
graph TB
    subgraph Next.js App
        A[/ - Home Page]
        B[/login - Auth Page]
        C[/browse-games]
        D[/blog]
        E[/affiliate-program]
        F[/contact-us]
        G[middleware.ts - session refresh]
        H[/auth/callback - route handler]
    end

    subgraph Supabase
        I[Auth - Email OTP]
        J[Auth - Passkey/WebAuthn]
    end

    B -->|signInWithOtp| I
    I -->|6-digit code| B
    B -->|verifyOtp| I
    B -->|signInWithWebAuthn| J
    I -->|session| G
    J -->|session| G
    H -->|exchange code for session| I
```

---

## Project Structure

```
damnmodz-website/
├── .env.local
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── package.json
├── public/
│   └── img/
│       └── dead-island-2-logo.png
├── src/
│   ├── middleware.ts
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── FeaturedBanner.tsx
│   │   ├── DiscountedSidebar.tsx
│   │   ├── GameCard.tsx
│   │   ├── StarRating.tsx
│   │   └── auth/
│   │       ├── EmailOtpForm.tsx
│   │       └── PasskeyLoginButton.tsx
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── browse-games/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── affiliate-program/page.tsx
│   │   ├── contact-us/page.tsx
│   │   ├── login/page.tsx
│   │   └── auth/callback/route.ts
│   └── data/
│       └── content.json
└── old/
```

---

## Auth Flows

### Email OTP

1. User enters email → clicks Send Code
2. `supabase.auth.signInWithOtp({ email })`
3. Supabase sends 6-digit code to email
4. UI switches to 6 separate digit inputs with auto-focus
5. User enters code → `supabase.auth.verifyOtp({ email, token, type: 'email' })`
6. On success → `router.push('/')`

### Passkey/WebAuthn

1. User clicks Login with Passkey
2. `supabase.auth.signInWithWebAuthn()`
3. Browser triggers biometric prompt
4. On success → `router.push('/')`

### Error Handling

- Wrong OTP code → show error message, keep inputs, allow retry
- Passkey fails → show error message with fallback to OTP
- Loading states on all buttons during async operations

---

## Login Page UI

Centered card, dark background, Tailwind styled:

- **Step 1 - Email**: Input field + Send Code button
- **Step 2 - OTP**: 6 separate digit inputs, auto-focus next, paste support, Verify button, Back link
- **Divider**: or
- **Passkey**: Login with Passkey button with fingerprint icon

OTP digit inputs: `w-12 h-14 text-center text-2xl bg-zinc-800 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white`

---

## Supabase Dashboard Setup Guide

### Email OTP:
1. Go to Authentication → Providers → Email
2. Enable Email provider
3. Disable "Confirm email" (OTP handles verification)
4. Set OTP expiry to desired duration

### WebAuthn/Passkeys:
1. Go to Authentication → Providers
2. Enable WebAuthn if available on your plan
3. Set relying party name to "DamnModz"
4. Set relying party ID to your domain

---

## Supabase Client Setup

### Browser Client (`src/lib/supabase/client.ts`)
- `createBrowserClient` from `@supabase/ssr`
- Used in Client Components (login forms)

### Server Client (`src/lib/supabase/server.ts`)
- `createServerClient` from `@supabase/ssr` with `cookies()`
- Used in Server Components and Route Handlers

### Middleware Client (`src/lib/supabase/middleware.ts`)
- `createServerClient` from `@supabase/ssr` with request/response
- Refreshes expired sessions

---

## Tailwind Config

Custom extensions:
- `slideUp` animation keyframe
- Purple accent color `#8b5cf6`
- Dark theme backgrounds

---

## Implementation Order

1. Init Next.js + Tailwind + TypeScript
2. Archive old static files to `old/`
3. Create `.env.local` with placeholders
4. Create Supabase client utilities (3 files)
5. Create middleware for session refresh
6. Create auth callback route handler
7. Build login page with EmailOtpForm + PasskeyLoginButton
8. Create root layout with Header
9. Migrate home page (hero + sidebar from JSON)
10. Migrate sub-pages
11. Port styles to Tailwind
12. Test auth flow
13. Push to GitHub
