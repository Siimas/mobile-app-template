# PostHog Integration Report

## Summary

PostHog analytics has been integrated into the React Native Expo app using the `posthog-react-native` SDK. The integration covers user authentication, onboarding, and paywall conversion tracking.

### Packages installed

- `posthog-react-native`
- `expo-file-system`
- `expo-application`
- `expo-device`
- `expo-localization`

### Environment variables

Added to `.env.local`:

```
EXPO_PUBLIC_POSTHOG_API_KEY=phc_your_api_key_here
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Files changed

| File | Change |
|------|--------|
| `app.config.js` | Created (converted from `app.json`); adds `extra.posthogApiKey` and `extra.posthogHost` |
| `src/config/posthog.ts` | Created; PostHog singleton client reading config from `Constants.expoConfig.extra` |
| `app/_layout.tsx` | Added `PostHogProvider` wrapper and manual screen tracking via `usePathname` |
| `app/login.tsx` | Added `posthog.identify()` and `user_signed_in` event after Clerk SSO sign-in |
| `app/onboarding.tsx` | Added `onboarding_step_completed` and `onboarding_completed` events |
| `app/paywall.tsx` | Added `paywall_viewed`, `subscription_purchased`, `subscription_restored`, `paywall_dismissed` events |
| `app/welcome.tsx` | Added `get_started_clicked` and `user_signed_out` events; `posthog.reset()` on sign-out |

---

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | Fired after successful Clerk SSO sign-in (Google or Apple). Includes `provider`. Also calls `posthog.identify()` with user ID, email, name, and `first_sign_in_date`. | `app/login.tsx` |
| `user_signed_out` | Fired when the user taps "Log out" on the welcome screen. Followed by `posthog.reset()`. | `app/welcome.tsx` |
| `get_started_clicked` | Fired when an unauthenticated user taps the "Get Started" CTA on the welcome screen. | `app/welcome.tsx` |
| `onboarding_step_completed` | Fired on each onboarding step submission. Includes `step_number`, `total_steps`, `question`, and `answer`. | `app/onboarding.tsx` |
| `onboarding_completed` | Fired when the final onboarding step is submitted. Includes `total_steps`. | `app/onboarding.tsx` |
| `paywall_viewed` | Fired on paywall screen mount. | `app/paywall.tsx` |
| `subscription_purchased` | Fired when a RevenueCat purchase completes successfully. | `app/paywall.tsx` |
| `subscription_restored` | Fired when a RevenueCat restore completes successfully. | `app/paywall.tsx` |
| `paywall_dismissed` | Fired when the user dismisses the paywall without purchasing. | `app/paywall.tsx` |

---

## Dashboard

**Analytics basics** — https://us.posthog.com/project/339487/dashboard/1352902

### Insights

| Insight | Description | URL |
|---------|-------------|-----|
| User Acquisition Funnel | Funnel: get_started_clicked → user_signed_in → onboarding_completed → subscription_purchased | https://us.posthog.com/project/339487/insights/mPRoAwfl |
| Daily Sign-ins vs Sign-outs | Trends: daily unique users signing in vs signing out | https://us.posthog.com/project/339487/insights/Sc3n2LAe |
| Paywall Conversion & Churn | Trends: paywall_viewed, subscription_purchased, subscription_restored, paywall_dismissed | https://us.posthog.com/project/339487/insights/wl4sAY6q |
| Onboarding Progress | Trends: onboarding_step_completed and onboarding_completed over time | https://us.posthog.com/project/339487/insights/29ep9B2G |
