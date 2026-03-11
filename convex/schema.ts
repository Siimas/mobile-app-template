import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  onboardingProgress: defineTable({
    ownerKey: v.string(),
    clerkId: v.optional(v.string()),
    useCase: v.optional(v.string()),
    experienceLevel: v.optional(
      v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    ),
    goal: v.optional(v.string()),
    lastAnsweredStep: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_owner_key", ["ownerKey"])
    .index("by_clerk_id", ["clerkId"]),
});
