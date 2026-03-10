import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const upsertSubscription = internalMutation({
  args: {
    clerkId: v.string(),
    status: v.string(),
    entitlements: v.array(v.string()),
    expiresAt: v.optional(v.number()),
    revenueCatCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    const data = {
      clerkId: args.clerkId,
      status: args.status,
      entitlements: args.entitlements,
      expiresAt: args.expiresAt,
      revenueCatCustomerId: args.revenueCatCustomerId,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("subscriptions", data);
    }
  },
});

export const getSubscription = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});
