import { Rules, RLSConfig } from 'convex-helpers/server/rowLevelSecurity';
import { DataModel } from './_generated/dataModel';
import { QueryCtx } from './_generated/server';

export async function rlsRules(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  return {
    users: {
      read: async (_, user) => {
        return !!identity && user.clerkId === identity.subject;
      },
      insert: async () => {
        return false;
      },
      modify: async (_, user) => {
        if (!identity) throw new Error('Must be authenticated to modify a user');
        return user.clerkId === identity.subject;
      },
    },
    onboardingResponses: {
      read: async (_, doc) => {
        if (doc.clerkId) {
          return !!identity && identity.subject === doc.clerkId;
        }
        // Anonymous row — handler enforces anonymousId
        return true;
      },
      insert: async (_, doc) => {
        if (doc.clerkId) {
          return !!identity && identity.subject === doc.clerkId;
        }
        return true;
      },
      modify: async (_, doc) => {
        if (doc.clerkId) {
          return !!identity && identity.subject === doc.clerkId;
        }
        // Anonymous row — allow (covers linkAnonymousOnboarding patching it)
        return true;
      },
    },
  } satisfies Rules<QueryCtx, DataModel>;
}

// By default, tables with no rule have `defaultPolicy` set to "allow".
export const config: RLSConfig = { defaultPolicy: 'deny' };
