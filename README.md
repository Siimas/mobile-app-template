# Mobile App Template

*A production-ready React Native starter with authentication, monetization, analytics, and a real-time backend.*

[![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react)](https://reactnative.dev)
[![Convex](https://img.shields.io/badge/Convex-backend-EE342F?style=flat-square)](https://convex.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

Skip the boilerplate. This template gives you a fully wired React Native app with a real-time backend, user authentication, in-app subscriptions, push notifications, analytics, and error tracking — all ready to customize and ship.

## Features

- **Authentication** — Sign up, log in, and social OAuth via [Clerk](https://clerk.com), with JWT-secured access to the Convex backend
- **Onboarding** — Configurable multi-step onboarding flow with support for anonymous users and account linking
- **Subscriptions** — [RevenueCat](https://revenuecat.com) integration with a built-in paywall UI, entitlement gating, and billing issue detection
- **Push Notifications** — Expo push notifications via EAS, with token registration and rate-limited server-side sending
- **Real-time Backend** — [Convex](https://convex.dev) for reactive queries, mutations, row-level security, and rate limiting
- **Analytics** — [PostHog](https://posthog.com) with automatic lifecycle tracking, screen events, and feature flags
- **Error Tracking** — [Sentry](https://sentry.io) with session replay and user feedback integration
- **Performant UI** — [NativeWind](https://nativewind.dev) (Tailwind CSS), [FlashList](https://shopify.github.io/flash-list/), and [MMKV](https://github.com/mrousavy/react-native-mmkv) storage

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 + Expo 54 (managed) |
| Navigation | Expo Router (file-based) |
| Backend | Convex (real-time BaaS) |
| Auth | Clerk |
| Subscriptions | RevenueCat |
| Push Notifications | Expo Push + EAS |
| Styling | NativeWind (Tailwind CSS) |
| Analytics | PostHog |
| Error Tracking | Sentry |
| Storage | MMKV |
| Package Manager | Bun |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) package manager
- [Expo CLI](https://docs.expo.dev/get-started/installation/) and an [Expo account](https://expo.dev)
- Xcode (iOS) or Android Studio (Android)
- Accounts for: [Convex](https://dashboard.convex.dev), [Clerk](https://dashboard.clerk.com), [RevenueCat](https://app.revenuecat.com), [PostHog](https://posthog.com), [Sentry](https://sentry.io)

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <your-repo>
   cd mobile-app-template
   bun install
   ```

2. **Set up environment variables:**

   Copy `.env.example` to `.env.local` and fill in your keys:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Description |
   |---|---|
   | `CONVEX_DEPLOYMENT` | Your Convex deployment ID |
   | `EXPO_PUBLIC_CONVEX_URL` | Convex backend URL |
   | `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
   | `CLERK_SECRET_KEY` | Clerk secret key |
   | `CLERK_JWT_ISSUER_DOMAIN` | Clerk JWT issuer domain |
   | `CLERK_WEBHOOK_SECRET` | Clerk webhook secret |
   | `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS` | RevenueCat iOS API key |
   | `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID` | RevenueCat Android API key |
   | `REVENUECAT_WEBHOOK_AUTH` | RevenueCat webhook auth token |
   | `EXPO_PUBLIC_POSTHOG_API_KEY` | PostHog API key |
   | `EXPO_PUBLIC_POSTHOG_HOST` | PostHog host URL |
   | `SENTRY_AUTH_TOKEN` | Sentry auth token |
   | `EXPO_PUBLIC_PROJECT_ID` | EAS project ID |

3. **Initialize EAS (for push notifications):**

   ```bash
   bunx eas-cli login
   bunx eas-cli init
   ```

4. **Start the Convex backend:**

   ```bash
   bunx convex dev
   ```

5. **Configure webhooks:**
   - In your Clerk dashboard, point the user sync webhook to `<your-convex-site-url>/clerk`
   - In your RevenueCat dashboard, point the webhook to `<your-convex-site-url>/revenuecat`

### Running the App

```bash
# iOS simulator + Convex backend (recommended for local dev)
bun dev:simulator

# Physical device with Expo Go + Convex backend
bun dev:expo-go

# iOS only
bun ios

# Android only
bun android
```

## Project Structure

```
├── app/                    # Screens (Expo Router file-based routing)
│   ├── _layout.tsx         # Root layout — provider stack
│   ├── index.tsx           # Entry point (redirects based on auth state)
│   ├── welcome.tsx         # Landing screen for unauthenticated users
│   ├── login.tsx           # Login/signup screen
│   ├── onboarding.tsx      # Multi-step onboarding flow
│   ├── paywall.tsx         # Subscription paywall
│   └── (app)/              # Protected screens (requires auth + onboarding)
│       └── home.tsx
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and configuration
│   ├── storage.ts          # Shared MMKV instance
│   └── config/posthog.ts   # PostHog client
├── convex/                 # Backend (Convex functions and schema)
│   ├── schema.ts           # Database schema
│   ├── rls.ts              # Row-level security rules
│   ├── users/              # User management
│   ├── onboardingResponses/# Onboarding data
│   ├── pushNotifications/  # Push notification logic
│   └── revenuecat/         # Subscription webhook + queries
└── assets/                 # App icons and splash screen
```

## App Flow

```
Launch → Auth check
  ├── Unauthenticated → Welcome → Login
  └── Authenticated
        ├── Onboarding incomplete → Onboarding
        ├── No active subscription → Paywall
        └── All checks pass → Home
```

> [!NOTE]
> The paywall gate in `app/(app)/_layout.tsx` is optional. Remove it if your app does not require a subscription to access core features.

## Customizing Onboarding

Edit `lib/onboarding/config.ts` to define your onboarding steps. Each step maps to a component in `components/onboarding/`. The onboarding system supports both authenticated users (responses saved to Convex) and anonymous users (saved to MMKV, then linked to the account on sign-up).

## Rate Limiting

Backend mutations are protected by `@convex-dev/rate-limiter`:

| Endpoint | Limit |
|---|---|
| Onboarding responses | 30 / min (burst 60) |
| Push token registration | 10 / hour |
| Send push notification | 10 / min (burst 3) |

Adjust limits in `convex/rateLimiter.ts`.

## Security

- Row-level security enforced in `convex/rls.ts` — users can only access their own data
- All Convex mutations require authentication (or anonymous ID for onboarding)
- RevenueCat and Clerk webhooks are authenticated via secret tokens

## Other Commands

```bash
bun lint         # Lint with ESLint
bun format       # Format with Prettier
bun prebuild     # Regenerate iOS/Android native projects
```
