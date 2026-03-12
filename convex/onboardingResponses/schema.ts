import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const onboardingResponsesSchema = {
  onboardingResponses: defineTable({
    ownerKey: v.string(),
    clerkId: v.optional(v.string()),
    onboardingVersion: v.number(),
    answers: v.array(
      v.object({
        question: v.string(),
        answer: v.string(),
        answeredAt: v.number(),
      })
    ),
    completedAt: v.optional(v.number()),
    startedAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner_key_version', ['ownerKey', 'onboardingVersion'])
    .index('by_clerk_id_version', ['clerkId', 'onboardingVersion'])
    .index('by_clerk_id', ['clerkId']),
};
