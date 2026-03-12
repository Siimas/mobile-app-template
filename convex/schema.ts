import { defineSchema } from 'convex/server';
import { onboardingResponsesSchema } from './onboardingResponses/schema';
import { usersSchema } from './users/schema';

export default defineSchema({
  ...usersSchema,
  ...onboardingResponsesSchema,
});
