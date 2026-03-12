---
name: convex-dev-expo-push-notifications
description: Convex component for Expo push notifications with built-in retry logic, batching, and delivery tracking to eliminate notification failures. Use when working with integrations features, Expo Push Notifications.
---

# Expo Push Notifications

## Instructions

Expo Push Notifications is a Convex component that provides convex component for expo push notifications with built-in retry logic, batching, and delivery tracking to eliminate notification failures.

### Installation

```bash
npm install @convex-dev/expo-push-notifications
```

### Capabilities

- Eliminate notification delivery failures with automatic retry logic and exponential backoff
- Reduce API calls and costs with intelligent batching of up to 100 notifications per request
- Track delivery status and handle expired tokens automatically with built-in error handling
- Integrate push notifications in minutes with pre-configured Convex functions

## Examples

### how to send push notifications in Expo app with retry logic

The Expo Push Notifications component provides automatic retry logic with exponential backoff for failed notifications. It handles network errors, rate limiting, and service unavailability by queuing failed notifications and retrying them intelligently.

### batch Expo push notifications to reduce API calls

This component automatically batches up to 100 push notifications into single API requests to Expo's servers. It optimizes delivery by grouping notifications and handling partial failures within batches, reducing your API usage and improving performance.

### handle expired push tokens in Expo notifications

The component automatically detects and handles expired or invalid Expo push tokens by parsing error responses. It provides hooks to remove invalid tokens from your database and prevent future delivery attempts to dead endpoints.

### track Expo push notification delivery status

Built-in delivery tracking captures receipts from Expo's service to monitor notification success rates. The component stores delivery status and error details, enabling you to debug failed notifications and maintain notification analytics.

## Troubleshooting

**Does this component handle Expo push notification rate limits?**

Yes, the Expo Push Notifications component automatically handles rate limiting from Expo's servers. It implements exponential backoff and queues notifications when rate limits are hit, ensuring all notifications are eventually delivered without losing messages.

**Can I customize the retry logic for failed notifications?**

The Expo Push Notifications component provides configurable retry parameters including maximum retry attempts, backoff intervals, and error handling strategies. You can customize these settings when initializing the component to match your application's requirements.

**How does batching work with different notification content?**

The component intelligently groups notifications with similar content and delivery parameters into batches of up to 100. Each notification can have unique recipients and custom data while still benefiting from batched delivery to reduce API calls to Expo's servers.

**What happens if Expo's push service is temporarily unavailable?**

The Expo Push Notifications component queues notifications in your Convex database when Expo's service is unavailable. It automatically retries delivery once the service recovers, ensuring no notifications are lost during outages or maintenance windows.

## Resources

- [npm package](https://www.npmjs.com/package/%40convex-dev%2Fexpo-push-notifications)
- [GitHub repository](https://github.com/get-convex/expo-push-notifications)
- [Convex Components Directory](https://www.convex.dev/components/push-notifications)
- [Convex documentation](https://docs.convex.dev)
