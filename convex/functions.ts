import { config, rlsRules } from './rls';
import { mutation as _mutation, query as _query } from './_generated/server';
import { customCtx, customMutation, customQuery } from 'convex-helpers/server/customFunctions';
import { wrapDatabaseReader, wrapDatabaseWriter } from 'convex-helpers/server/rowLevelSecurity';

export const query = customQuery(
  _query,
  customCtx(async (ctx) => ({
    db: wrapDatabaseReader(ctx, ctx.db, await rlsRules(ctx), config),
  }))
);

export const mutation = customMutation(
  _mutation,
  customCtx(async (ctx) => ({
    db: wrapDatabaseWriter(ctx, ctx.db, await rlsRules(ctx), config),
  }))
);
