import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  subscriptions: defineTable({
    clerkId: v.string(),
    status: v.string(),
    entitlements: v.array(v.string()),
    expiresAt: v.optional(v.number()),
    revenueCatCustomerId: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),
});
