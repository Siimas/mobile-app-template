import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Onboarding: allow rapid answering (up to 60 in a burst) but cap at 30/min long-term
  saveOnboardingAnswer: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 60 },

  // Completing onboarding should only happen a handful of times
  completeOnboarding: { kind: "fixed window", rate: 5, period: HOUR },

  // Linking anonymous → authenticated session, rare operation
  linkAnonymousOnboarding: { kind: "fixed window", rate: 5, period: HOUR },

  // Push token registration — prevents token flooding
  registerPushToken: { kind: "fixed window", rate: 10, period: HOUR },

  // Sending push notifications — strictest limit, allows small burst
  sendNotification: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 3 },
});
