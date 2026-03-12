import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';
import type { ClerkWebhookEvent } from '../clerk/types';
import { deleteUserByClerkId, upsertUserByClerkId } from './lib';
import type { UserProfilePatch } from './types';

function getUserProfilePatch(event: ClerkWebhookEvent): UserProfilePatch {
  const email = event.data.email_addresses?.[0]?.email_address;
  const name = [event.data.first_name, event.data.last_name].filter(Boolean).join(' ') || undefined;

  return { email, name };
}

export const handleClerkWebhook = internalMutation({
  args: { event: v.any() },
  handler: async (ctx, { event }) => {
    const clerkEvent = event as ClerkWebhookEvent;
    const clerkId = clerkEvent.data.id;

    if (clerkEvent.type === 'user.created' || clerkEvent.type === 'user.updated') {
      await upsertUserByClerkId(ctx.db, clerkId, getUserProfilePatch(clerkEvent));
      return;
    }

    if (clerkEvent.type === 'user.deleted') {
      await deleteUserByClerkId(ctx.db, clerkId);
    }
  },
});
