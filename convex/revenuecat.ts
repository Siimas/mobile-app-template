import { query } from "./_generated/server";
import { v } from "convex/values";
import { RevenueCat } from "convex-revenuecat";
import { components } from "./_generated/api";

const revenuecat = new RevenueCat(components.revenuecat);

export const getMyActiveEntitlements = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await revenuecat.getActiveEntitlements(ctx, { appUserId: identity.subject });
  },
});

export const hasMyEntitlement = query({
  args: { entitlementId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;
    return await revenuecat.hasEntitlement(ctx, {
      appUserId: identity.subject,
      entitlementId: args.entitlementId,
    });
  },
});
