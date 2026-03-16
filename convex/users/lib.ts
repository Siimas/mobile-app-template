import type { Doc } from '../_generated/dataModel';
import type { DatabaseReader, DatabaseWriter } from '../_generated/server';
import type { UserProfilePatch } from './types';

export async function getUserByClerkId(
  db: DatabaseReader,
  clerkId: string
): Promise<Doc<'users'> | null> {
  return await db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
    .unique();
}

export async function upsertUserByClerkId(
  db: DatabaseWriter,
  clerkId: string,
  profile: UserProfilePatch
) {
  const existing = await getUserByClerkId(db, clerkId);

  if (existing) {
    await db.patch(existing._id, profile);
    return existing._id;
  }

  return await db.insert('users', {
    clerkId,
    ...profile,
  });
}

export async function deleteUserByClerkId(db: DatabaseWriter, clerkId: string) {
  const existing = await getUserByClerkId(db, clerkId);
  if (existing) {
    await db.delete(existing._id);
  }
}
