import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    hasCompletedOnboarding: v.optional(v.boolean()),
  }).index("by_clerk_id", ["clerkId"]),

  onboardingResponses: defineTable({
    ownerKey: v.string(),
    clerkId: v.optional(v.string()),
    onboardingVersion: v.number(),
    answers: v.array(v.object({
      question: v.string(),
      answer: v.string(),
      answeredAt: v.number(),
    })),
    completedAt: v.optional(v.number()),
    startedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner_key_version", ["ownerKey", "onboardingVersion"])
    .index("by_clerk_id_version", ["clerkId", "onboardingVersion"])
    .index("by_clerk_id", ["clerkId"]),
});
