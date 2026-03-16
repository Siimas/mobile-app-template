import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const usersSchema = {
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  }).index('by_clerk_id', ['clerkId']),
};
