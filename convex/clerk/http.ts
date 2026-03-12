import { httpRouter } from 'convex/server';
import { httpAction } from '../_generated/server';
import { internal } from '../_generated/api';

type HttpRouter = ReturnType<typeof httpRouter>;

export function registerClerkHttpRoutes(http: HttpRouter) {
  http.route({
    path: '/webhooks/clerk',
    method: 'POST',
    handler: httpAction(async (ctx, request) => {
      const svixId = request.headers.get('svix-id');
      const svixTimestamp = request.headers.get('svix-timestamp');
      const svixSignature = request.headers.get('svix-signature');

      if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response('Missing svix headers', { status: 400 });
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
        console.error('Clerk webhook error:', error);
        return new Response('Webhook verification failed', { status: 400 });
      }
    }),
  });
}
