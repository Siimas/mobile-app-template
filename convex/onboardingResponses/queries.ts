import { v } from 'convex/values';
import { query } from '../_generated/server';

export const getMyOnboarding = query({
  args: { anonymousId: v.optional(v.string()) },
  handler: async (ctx, { anonymousId }) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log(identity);
    
    if (identity) {
      return ctx.db
        .query('onboardingResponses')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .first();
    }
    if (anonymousId) {
      return ctx.db
        .query('onboardingResponses')
        .withIndex('by_anonymous_id', (q) => q.eq('anonymousId', anonymousId))
        .first();
    }
    
    return null;
  },
});
