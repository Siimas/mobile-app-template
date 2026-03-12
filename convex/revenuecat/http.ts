import { RevenueCat } from 'convex-revenuecat';
import { httpRouter } from 'convex/server';
import { components } from '../_generated/api';

const revenuecat = new RevenueCat(components.revenuecat, {
  REVENUECAT_WEBHOOK_AUTH: process.env.REVENUECAT_WEBHOOK_AUTH,
});

type HttpRouter = ReturnType<typeof httpRouter>;

export function registerRevenueCatHttpRoutes(http: HttpRouter) {
  http.route({
    path: '/webhooks/revenuecat',
    method: 'POST',
    handler: revenuecat.httpHandler(),
  });
}
