import { PushNotifications } from '@convex-dev/expo-push-notifications';
import { ConvexError, v } from 'convex/values';
import { components } from '../_generated/api';
import { internalMutation, mutation } from '../_generated/server';
import { rateLimiter } from '../rateLimiter';

const notifications = new PushNotifications<string>(components.pushNotifications);

export const registerPushToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    await rateLimiter.limit(ctx, 'registerPushToken', { key: identity.subject, throws: true });

    await notifications.recordToken(ctx, {
      userId: identity.subject,
      pushToken: token,
    });
  },
});

export const removePushToken = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    await notifications.removeToken(ctx, { userId: identity.subject });
  },
});

export const sendNotificationToUserInternal = internalMutation({
  args: { userId: v.string(), title: v.string(), body: v.string() },
  handler: async (ctx, { userId, title, body }) => {
    await notifications.sendPushNotification(ctx, {
      userId,
      notification: { title, body },
      allowUnregisteredTokens: true,
    });
  },
});

export const sendNotification = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, { title, body, data }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError('Not authenticated');
    }

    await rateLimiter.limit(ctx, 'sendNotification', { key: identity.subject, throws: true });

    await notifications.sendPushNotification(ctx, {
      userId: identity.subject,
      notification: { title, body, data },
      allowUnregisteredTokens: true,
    });
  },
});
