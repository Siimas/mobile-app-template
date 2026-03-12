import { defineApp } from "convex/server";
import revenuecat from "convex-revenuecat/convex.config";
import pushNotifications from "@convex-dev/expo-push-notifications/convex.config";

const app = defineApp();
app.use(revenuecat);
app.use(pushNotifications);

export default app;
