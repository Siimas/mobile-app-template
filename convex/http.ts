import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhooks",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const body = await request.text();

    try {
      await ctx.runAction(internal.clerk.verifyAndProcess, {
        body,
        svixId,
        svixTimestamp,
        svixSignature,
      });
      return new Response(null, { status: 200 });
    } catch (error) {
      console.error("Clerk webhook error:", error);
      return new Response("Webhook verification failed", { status: 400 });
    }
  }),
});

http.route({
  path: "/webhooks/revenuecat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authToken = request.headers.get("Authorization");
    const expectedToken = process.env.REVENUECAT_WEBHOOK_AUTH_TOKEN;

    if (!expectedToken || authToken !== expectedToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    let event: {
      type: string;
      app_user_id: string;
      subscriber?: {
        entitlements?: Record<string, { expires_date?: string | null }>;
      };
      expiration_at_ms?: number;
    };

    try {
      event = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const clerkId = event.app_user_id;
    if (!clerkId) {
      return new Response("Missing app_user_id", { status: 400 });
    }

    const activeEntitlements = Object.keys(event.subscriber?.entitlements ?? {});
    const isActive = activeEntitlements.length > 0;

    let status = "expired";
    if (event.type === "INITIAL_PURCHASE" || event.type === "RENEWAL") {
      status = "active";
    } else if (event.type === "CANCELLATION") {
      status = "cancelled";
    } else if (event.type === "EXPIRATION") {
      status = "expired";
    } else if (isActive) {
      status = "active";
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ctx.runMutation((internal as any).subscriptions.upsertSubscription, {
      clerkId,
      status,
      entitlements: activeEntitlements,
      expiresAt: event.expiration_at_ms ?? undefined,
    });

    return new Response(null, { status: 200 });
  }),
});

export default http;
