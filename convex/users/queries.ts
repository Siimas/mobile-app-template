import { query } from '../functions';
import { getUserByClerkId } from './lib';

export const getSelf = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await getUserByClerkId(ctx.db, identity.subject);
  },
});
