import { v } from 'convex/values';
import { mutation } from '../functions';
import { rateLimiter } from '../rateLimiter';

export const saveAnswer = mutation({
  args: {
    anonymousId: v.optional(v.string()),
    question: v.string(),
    answer: v.string(),
    onboardingVersion: v.number(),
  },
  handler: async (ctx, { anonymousId, question, answer, onboardingVersion }) => {
    const identity = await ctx.auth.getUserIdentity();
    const key = identity?.subject ?? anonymousId;
    if (!key) throw new Error('Either authentication or anonymousId is required');

    await rateLimiter.limit(ctx, 'saveOnboardingAnswer', { key, throws: true });

    let existing;
    if (identity) {
      existing = await ctx.db
        .query('onboardingResponses')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .first();
    } else if (anonymousId) {
      existing = await ctx.db
        .query('onboardingResponses')
        .withIndex('by_anonymous_id', (q) => q.eq('anonymousId', anonymousId))
        .unique();
    }

    if (!existing) {
      await ctx.db.insert('onboardingResponses', {
        ...(identity ? { clerkId: identity.subject } : { anonymousId }),
        onboardingVersion,
        answers: [{ question, answer, answeredAt: Date.now() }],
        updatedAt: Date.now(),
      });
      return;
    }

    const filteredAnswers = existing.answers.filter((a) => a.question !== question);
    await ctx.db.patch(existing._id, {
      answers: [...filteredAnswers, { question, answer, answeredAt: Date.now() }],
      updatedAt: Date.now(),
    });
  },
});

export const completeOnboarding = mutation({
  args: { anonymousId: v.optional(v.string()) },
  handler: async (ctx, { anonymousId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const key = identity?.subject ?? anonymousId;
    if (!key) throw new Error('Either authentication or anonymousId is required');

    await rateLimiter.limit(ctx, 'completeOnboarding', { key, throws: true });

    let existing;
    if (identity) {
      existing = await ctx.db
        .query('onboardingResponses')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .first();
    } else if (anonymousId) {
      existing = await ctx.db
        .query('onboardingResponses')
        .withIndex('by_anonymous_id', (q) => q.eq('anonymousId', anonymousId))
        .unique();
    }

    if (existing) {
      await ctx.db.patch(existing._id, { completedAt: Date.now(), updatedAt: Date.now() });
      return;
    }

    await ctx.db.insert('onboardingResponses', {
      ...(identity ? { clerkId: identity.subject } : { anonymousId }),
      onboardingVersion: 0,
      answers: [],
      completedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const linkAnonymousOnboarding = mutation({
  args: { anonymousId: v.string() },
  handler: async (ctx, { anonymousId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    await rateLimiter.limit(ctx, 'linkAnonymousOnboarding', { key: identity.subject, throws: true });

    const doc = await ctx.db
      .query('onboardingResponses')
      .withIndex('by_anonymous_id', (q) => q.eq('anonymousId', anonymousId))
      .unique();

    if (!doc) return;

    await ctx.db.patch(doc._id, { clerkId: identity.subject, updatedAt: Date.now() });
  },
});
