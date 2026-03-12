import { mutation } from "./_generated/server";
import { ConvexError, v } from 'convex/values';
import { components } from "./_generated/api";
import { PushNotifications } from "@convex-dev/expo-push-notifications";

const notifications = new PushNotifications<string>(components.pushNotifications);

// Register push token for the authenticated user
export const registerPushToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    await notifications.recordToken(ctx, {
      userId: identity.subject,
      pushToken: token,
    });
  },
});

// Remove push token for the authenticated user
export const removePushToken = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    await notifications.removeToken(ctx, { userId: identity.subject });
  },
});

// Send a notification to a specific user
export const sendNotification = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, { title, body, data }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Not authenticated');

    await notifications.sendPushNotification(ctx, {
      userId: identity.subject,
      notification: { title, body, data },
      allowUnregisteredTokens: true,
    });
  },
});
