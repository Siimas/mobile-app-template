import { httpRouter } from 'convex/server';
import { httpAction } from '../_generated/server';
import { internal, components } from '../_generated/api';

type HttpRouter = ReturnType<typeof httpRouter>;

function extractAuthToken(header: string): string {
  return header.startsWith('Bearer ') ? header.slice('Bearer '.length) : header;
}

// Mirrors convex-revenuecat's internal transformPayload:
// - Strips null values (v.optional expects absence, not null)
// - Encodes $ keys (Convex rejects field names starting with $)
function transformPayload(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(transformPayload);
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) continue;
    const safeKey = key.startsWith('$') ? `__dollar__${key.slice(1)}` : key;
    result[safeKey] = transformPayload(value);
  }
  return result;
}

export function registerRevenueCatHttpRoutes(http: HttpRouter) {
  http.route({
    path: '/webhooks/revenuecat',
    method: 'POST',
    handler: httpAction(async (ctx, request) => {
      // Auth validation (mirrors convex-revenuecat's internal logic)
      const expectedAuth = process.env.REVENUECAT_WEBHOOK_AUTH;
      if (expectedAuth) {
        const provided = extractAuthToken(request.headers.get('Authorization') ?? '');
        const expected = extractAuthToken(expectedAuth);
        if (provided !== expected) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      let body: any;
      try {
        body = await request.json();
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const event = body?.event;
      if (!event || typeof event.id !== 'string' || typeof event.type !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid webhook payload' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Send push notification for billing issues before processing
      if (event.type === 'BILLING_ISSUE') {
        const appUserId = event.app_user_id as string | undefined;
        if (appUserId) {
          await ctx.runMutation(internal.pushNotifications.mutations.sendNotificationToUserInternal, {
            userId: appUserId,
            title: 'Payment issue detected',
            body: 'Please update your payment method to keep your subscription active.',
          });
        }
      }

      // Delegate to the RevenueCat component for standard event processing
      try {
        const result = await ctx.runMutation(components.revenuecat.webhooks.process, {
          event: {
            id: event.id,
            type: event.type,
            app_id: event.app_id,
            app_user_id: event.app_user_id,
            environment: event.environment ?? 'PRODUCTION',
            store: event.store,
          },
          payload: transformPayload(event),
        });
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('RevenueCat webhook processing error:', err);
        return new Response(JSON.stringify({ error: 'Processing failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }),
  });
}
