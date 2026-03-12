import { httpRouter } from 'convex/server';
import { registerClerkHttpRoutes } from './clerk/http';
import { registerRevenueCatHttpRoutes } from './revenuecat/http';

const http = httpRouter();

registerClerkHttpRoutes(http);
registerRevenueCatHttpRoutes(http);

export default http;
