import { v } from 'convex/values';
import { query } from '../_generated/server';

export const getMyOnboarding = query({
  args: { anonymousId: v.string() },
  handler: async (ctx, { anonymousId }) => {
    return await ctx.db
      .query('onboardingResponses')
      .withIndex('by_anonymous_id', (q) => q.eq('anonymousId', anonymousId))
      .unique();
  },
});

export const getMyOnboardingByAuth = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query('onboardingResponses')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();
  },
});
