import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { markUserOnboardingCompleteByClerkId } from '../users/lib';
import { mergeOnboardingAnswers, resolveOnboardingResponse } from './lib';

export const saveAnswer = mutation({
  args: {
    ownerKey: v.string(),
    onboardingVersion: v.number(),
    question: v.string(),
    answer: v.string(),
  },
  returns: v.id('onboardingResponses'),
  handler: async (ctx, args) => {
    const clerkId = (await ctx.auth.getUserIdentity())?.subject;
    const existing = await resolveOnboardingResponse(
      ctx.db,
      args.ownerKey,
      clerkId,
      args.onboardingVersion
    );
    const now = Date.now();
    const newAnswer = {
      question: args.question,
      answer: args.answer,
      answeredAt: now,
    };

    if (!existing) {
      return await ctx.db.insert('onboardingResponses', {
        ownerKey: args.ownerKey,
        clerkId,
        onboardingVersion: args.onboardingVersion,
        answers: [newAnswer],
        startedAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch(existing._id, {
      answers: mergeOnboardingAnswers(existing.answers, newAnswer),
      clerkId: clerkId ?? existing.clerkId,
      updatedAt: now,
    });
    return existing._id;
  },
});

export const completeOnboarding = mutation({
  args: { ownerKey: v.string(), onboardingVersion: v.number() },
  returns: v.union(v.id('onboardingResponses'), v.null()),
  handler: async (ctx, args) => {
    const clerkId = (await ctx.auth.getUserIdentity())?.subject;
    const existing = await resolveOnboardingResponse(
      ctx.db,
      args.ownerKey,
      clerkId,
      args.onboardingVersion
    );
    if (!existing || existing.completedAt != null) {
      return existing?._id ?? null;
    }

    const now = Date.now();
    await ctx.db.patch(existing._id, { completedAt: now, updatedAt: now });
    await markUserOnboardingCompleteByClerkId(ctx.db, clerkId);
    return existing._id;
  },
});

export const linkAnonymousOnboarding = mutation({
  args: { anonymousOwnerKey: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError('Authentication required');
    }

    const clerkId = identity.subject;
    const anonRecords = await ctx.db
      .query('onboardingResponses')
      .withIndex('by_owner_key_version', (q) => q.eq('ownerKey', args.anonymousOwnerKey))
      .collect();

    for (const anon of anonRecords) {
      const authed = await ctx.db
        .query('onboardingResponses')
        .withIndex('by_clerk_id_version', (q) =>
          q.eq('clerkId', clerkId).eq('onboardingVersion', anon.onboardingVersion)
        )
        .unique();

      if (!authed) {
        await ctx.db.patch(anon._id, { clerkId, updatedAt: Date.now() });
      } else if (authed._id !== anon._id) {
        await ctx.db.patch(authed._id, {
          answers: anon.answers.reduce(mergeOnboardingAnswers, authed.answers),
          completedAt: authed.completedAt ?? anon.completedAt,
          updatedAt: Date.now(),
        });
        await ctx.db.delete(anon._id);
      }
    }

    if (anonRecords.some((record) => record.completedAt != null)) {
      await markUserOnboardingCompleteByClerkId(ctx.db, clerkId);
    }

    return null;
  },
});
