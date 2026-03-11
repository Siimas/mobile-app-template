import { ConvexError, v } from "convex/values";
import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";

async function resolveRecord(
  ctx: QueryCtx | MutationCtx,
  ownerKey: string,
  clerkId: string | undefined,
  version: number,
) {
  if (clerkId) {
    const byClerk = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_clerk_id_version", (q) =>
        q.eq("clerkId", clerkId).eq("onboardingVersion", version)
      )
      .unique();
    if (byClerk) return byClerk;
  }
  return await ctx.db
    .query("onboardingResponses")
    .withIndex("by_owner_key_version", (q) =>
      q.eq("ownerKey", ownerKey).eq("onboardingVersion", version)
    )
    .unique();
}

export const saveAnswer = mutation({
  args: {
    ownerKey: v.string(),
    onboardingVersion: v.number(),
    question: v.string(),
    answer: v.string(),
  },
  returns: v.id("onboardingResponses"),
  handler: async (ctx, args) => {
    const clerkId = (await ctx.auth.getUserIdentity())?.subject;
    const existing = await resolveRecord(ctx, args.ownerKey, clerkId, args.onboardingVersion);
    const now = Date.now();
    const newAnswer = { question: args.question, answer: args.answer, answeredAt: now };

    if (!existing) {
      return await ctx.db.insert("onboardingResponses", {
        ownerKey: args.ownerKey,
        clerkId,
        onboardingVersion: args.onboardingVersion,
        answers: [newAnswer],
        startedAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch(existing._id, {
      answers: [...existing.answers.filter((a) => a.question !== args.question), newAnswer],
      clerkId: clerkId ?? existing.clerkId,
      updatedAt: now,
    });
    return existing._id;
  },
});

export const completeOnboarding = mutation({
  args: { ownerKey: v.string(), onboardingVersion: v.number() },
  returns: v.union(v.id("onboardingResponses"), v.null()),
  handler: async (ctx, args) => {
    const clerkId = (await ctx.auth.getUserIdentity())?.subject;
    const existing = await resolveRecord(ctx, args.ownerKey, clerkId, args.onboardingVersion);
    if (!existing || existing.completedAt != null) return existing?._id ?? null;
    const now = Date.now();
    await ctx.db.patch(existing._id, { completedAt: now, updatedAt: now });
    return existing._id;
  },
});

export const getMyOnboarding = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("onboardingResponses")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .order("desc")
      .first();
  },
});

export const linkAnonymousOnboarding = mutation({
  args: { anonymousOwnerKey: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Authentication required");
    const clerkId = identity.subject;

    const anonRecords = await ctx.db
      .query("onboardingResponses")
      .withIndex("by_owner_key_version", (q) => q.eq("ownerKey", args.anonymousOwnerKey))
      .collect();

    for (const anon of anonRecords) {
      const authed = await ctx.db
        .query("onboardingResponses")
        .withIndex("by_clerk_id_version", (q) =>
          q.eq("clerkId", clerkId).eq("onboardingVersion", anon.onboardingVersion)
        )
        .unique();

      if (!authed) {
        await ctx.db.patch(anon._id, { clerkId, updatedAt: Date.now() });
      } else if (authed._id !== anon._id) {
        const map = new Map(authed.answers.map((a) => [a.question, a]));
        for (const a of anon.answers) if (!map.has(a.question)) map.set(a.question, a);
        await ctx.db.patch(authed._id, {
          answers: Array.from(map.values()),
          completedAt: authed.completedAt ?? anon.completedAt,
          updatedAt: Date.now(),
        });
        await ctx.db.delete(anon._id);
      }
    }
    return null;
  },
});
