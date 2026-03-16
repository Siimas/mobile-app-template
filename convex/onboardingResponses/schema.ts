import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const onboardingResponsesSchema = {
  onboardingResponses: defineTable({
    clerkId: v.optional(v.string()),
    anonymousId: v.optional(v.string()),
    onboardingVersion: v.number(),
    answers: v.array(
      v.object({
        question: v.string(),
        answer: v.string(),
        answeredAt: v.number(),
      })
    ),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_anonymous_id', ['anonymousId']),
};
