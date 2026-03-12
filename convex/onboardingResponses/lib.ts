import type { DatabaseReader } from '../_generated/server';
import type { OnboardingAnswer, OnboardingResponseDoc } from './types';

export async function resolveOnboardingResponse(
  db: DatabaseReader,
  ownerKey: string,
  clerkId: string | undefined,
  onboardingVersion: number
): Promise<OnboardingResponseDoc | null> {
  if (clerkId) {
    const byClerk = await db
      .query('onboardingResponses')
      .withIndex('by_clerk_id_version', (q) =>
        q.eq('clerkId', clerkId).eq('onboardingVersion', onboardingVersion)
      )
      .unique();
    if (byClerk) {
      return byClerk;
    }
  }

  return await db
    .query('onboardingResponses')
    .withIndex('by_owner_key_version', (q) =>
      q.eq('ownerKey', ownerKey).eq('onboardingVersion', onboardingVersion)
    )
    .unique();
}

export function mergeOnboardingAnswers(
  existingAnswers: OnboardingAnswer[],
  nextAnswer: OnboardingAnswer
) {
  return [
    ...existingAnswers.filter((answer) => answer.question !== nextAnswer.question),
    nextAnswer,
  ];
}
