/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as clerk from "../clerk.js";
import type * as clerk_actions from "../clerk/actions.js";
import type * as clerk_http from "../clerk/http.js";
import type * as clerk_types from "../clerk/types.js";
import type * as http from "../http.js";
import type * as onboardingResponses from "../onboardingResponses.js";
import type * as onboardingResponses_mutations from "../onboardingResponses/mutations.js";
import type * as onboardingResponses_queries from "../onboardingResponses/queries.js";
import type * as onboardingResponses_types from "../onboardingResponses/types.js";
import type * as pushNotifications from "../pushNotifications.js";
import type * as pushNotifications_mutations from "../pushNotifications/mutations.js";
import type * as revenuecat from "../revenuecat.js";
import type * as revenuecat_http from "../revenuecat/http.js";
import type * as revenuecat_queries from "../revenuecat/queries.js";
import type * as users from "../users.js";
import type * as users_lib from "../users/lib.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as users_types from "../users/types.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  clerk: typeof clerk;
  "clerk/actions": typeof clerk_actions;
  "clerk/http": typeof clerk_http;
  "clerk/types": typeof clerk_types;
  http: typeof http;
  onboardingResponses: typeof onboardingResponses;
  "onboardingResponses/mutations": typeof onboardingResponses_mutations;
  "onboardingResponses/queries": typeof onboardingResponses_queries;
  "onboardingResponses/types": typeof onboardingResponses_types;
  pushNotifications: typeof pushNotifications;
  "pushNotifications/mutations": typeof pushNotifications_mutations;
  revenuecat: typeof revenuecat;
  "revenuecat/http": typeof revenuecat_http;
  "revenuecat/queries": typeof revenuecat_queries;
  users: typeof users;
  "users/lib": typeof users_lib;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  "users/types": typeof users_types;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  revenuecat: {
    customers: {
      get: FunctionReference<
        "query",
        "internal",
        { appUserId: string },
        null | {
          _creationTime: number;
          _id: string;
          aliases: Array<string>;
          appUserId: string;
          attributes?: Record<string, { updated_at_ms: number; value: string }>;
          firstSeenAt: number;
          lastSeenAt?: number;
          originalAppUserId: string;
          updatedAt: number;
        }
      >;
      getByOriginalId: FunctionReference<
        "query",
        "internal",
        { originalAppUserId: string },
        null | {
          _creationTime: number;
          _id: string;
          aliases: Array<string>;
          appUserId: string;
          attributes?: Record<string, { updated_at_ms: number; value: string }>;
          firstSeenAt: number;
          lastSeenAt?: number;
          originalAppUserId: string;
          updatedAt: number;
        }
      >;
    };
    entitlements: {
      check: FunctionReference<
        "query",
        "internal",
        { appUserId: string; entitlementId: string },
        boolean
      >;
      getActive: FunctionReference<
        "query",
        "internal",
        { appUserId: string },
        Array<{
          _creationTime: number;
          _id: string;
          appUserId: string;
          billingIssueDetectedAt?: number;
          entitlementId: string;
          expiresAtMs?: number;
          isActive: boolean;
          isSandbox: boolean;
          productId?: string;
          purchasedAtMs?: number;
          store?:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
          unsubscribeDetectedAt?: number;
          updatedAt: number;
        }>
      >;
      list: FunctionReference<
        "query",
        "internal",
        { appUserId: string },
        Array<{
          _creationTime: number;
          _id: string;
          appUserId: string;
          billingIssueDetectedAt?: number;
          entitlementId: string;
          expiresAtMs?: number;
          isActive: boolean;
          isSandbox: boolean;
          productId?: string;
          purchasedAtMs?: number;
          store?:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
          unsubscribeDetectedAt?: number;
          updatedAt: number;
        }>
      >;
    };
    experiments: {
      get: FunctionReference<
        "query",
        "internal",
        { appUserId: string; experimentId: string },
        null | {
          _creationTime: number;
          _id: string;
          appUserId: string;
          enrolledAtMs: number;
          experimentId: string;
          offeringId?: string;
          updatedAt: number;
          variant: string;
        }
      >;
      list: FunctionReference<
        "query",
        "internal",
        { appUserId: string },
        Array<{
          _creationTime: number;
          _id: string;
          appUserId: string;
          enrolledAtMs: number;
          experimentId: string;
          offeringId?: string;
          updatedAt: number;
          variant: string;
        }>
      >;
      listByExperiment: FunctionReference<
        "query",
        "internal",
        { experimentId: string },
        Array<{
          _creationTime: number;
          _id: string;
          appUserId: string;
          enrolledAtMs: number;
          experimentId: string;
          offeringId?: string;
          updatedAt: number;
          variant: string;
        }>
      >;
    };
    invoices: {
      get: FunctionReference<
        "query",
        "internal",
        { invoiceId: string },
        {
          _creationTime: number;
          _id: string;
          appUserId: string;
          currency?: string;
          environment: "SANDBOX" | "PRODUCTION";
          invoiceId: string;
          issuedAt: number;
          priceInPurchasedCurrency?: number;
          priceUsd?: number;
          productId?: string;
          store?:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
        } | null
      >;
      listByUser: FunctionReference<
        "query",
        "internal",
        { appUserId: string },
        Array<{
          _creationTime: number;
          _id: string;
          appUserId: string;
          currency?: string;
          environment: "SANDBOX" | "PRODUCTION";
          invoiceId: string;
          issuedAt: number;
          priceInPurchasedCurrency?: number;
          priceUsd?: number;
          productId?: string;
          store?:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
        }>
      >;
    };
    subscriptions: {
      getActive: FunctionReference<
        "query",
        "internal",
        { appUserId: string },
        Array<{
          _creationTime: number;
          _id: string;
          appUserId: string;
          autoRenewStatus?: boolean;
          autoResumeAtMs?: number;
          billingIssueDetectedAt?: number;
          cancelReason?: string;
          commissionPercentage?: number;
          countryCode?: string;
          currency?: string;
          entitlementIds?: Array<string>;
          environment: "SANDBOX" | "PRODUCTION";
          expirationAtMs?: number;
          expirationReason?: string;
          gracePeriodExpirationAtMs?: number;
          isFamilyShare: boolean;
          isTrialConversion?: boolean;
          newProductId?: string;
          offerCode?: string;
          originalTransactionId: string;
          ownershipType?: "PURCHASED" | "FAMILY_SHARED";
          periodType: "TRIAL" | "INTRO" | "NORMAL" | "PROMOTIONAL" | "PREPAID";
          presentedOfferingId?: string;
          priceInPurchasedCurrency?: number;
          priceUsd?: number;
          productId: string;
          purchasedAtMs: number;
          renewalNumber?: number;
          store:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
          taxPercentage?: number;
          transactionId: string;
          updatedAt: number;
        }>
      >;
      getByOriginalTransaction: FunctionReference<
        "query",
        "internal",
        { originalTransactionId: string },
        null | {
          _creationTime: number;
          _id: string;
          appUserId: string;
          autoRenewStatus?: boolean;
          autoResumeAtMs?: number;
          billingIssueDetectedAt?: number;
          cancelReason?: string;
          commissionPercentage?: number;
          countryCode?: string;
          currency?: string;
          entitlementIds?: Array<string>;
          environment: "SANDBOX" | "PRODUCTION";
          expirationAtMs?: number;
          expirationReason?: string;
          gracePeriodExpirationAtMs?: number;
          isFamilyShare: boolean;
          isTrialConversion?: boolean;
          newProductId?: string;
          offerCode?: string;
          originalTransactionId: string;
          ownershipType?: "PURCHASED" | "FAMILY_SHARED";
          periodType: "TRIAL" | "INTRO" | "NORMAL" | "PROMOTIONAL" | "PREPAID";
          presentedOfferingId?: string;
          priceInPurchasedCurrency?: number;
          priceUsd?: number;
          productId: string;
          purchasedAtMs: number;
          renewalNumber?: number;
          store:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
          taxPercentage?: number;
          transactionId: string;
          updatedAt: number;
        }
      >;
      getByUser: FunctionReference<
        "query",
        "internal",
        { appUserId: string },
        Array<{
          _creationTime: number;
          _id: string;
          appUserId: string;
          autoRenewStatus?: boolean;
          autoResumeAtMs?: number;
          billingIssueDetectedAt?: number;
          cancelReason?: string;
          commissionPercentage?: number;
          countryCode?: string;
          currency?: string;
          entitlementIds?: Array<string>;
          environment: "SANDBOX" | "PRODUCTION";
          expirationAtMs?: number;
          expirationReason?: string;
          gracePeriodExpirationAtMs?: number;
          isFamilyShare: boolean;
          isTrialConversion?: boolean;
          newProductId?: string;
          offerCode?: string;
          originalTransactionId: string;
          ownershipType?: "PURCHASED" | "FAMILY_SHARED";
          periodType: "TRIAL" | "INTRO" | "NORMAL" | "PROMOTIONAL" | "PREPAID";
          presentedOfferingId?: string;
          priceInPurchasedCurrency?: number;
          priceUsd?: number;
          productId: string;
          purchasedAtMs: number;
          renewalNumber?: number;
          store:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
          taxPercentage?: number;
          transactionId: string;
          updatedAt: number;
        }>
      >;
      getInGracePeriod: FunctionReference<
        "query",
        "internal",
        { appUserId: string },
        Array<{
          _creationTime: number;
          _id: string;
          appUserId: string;
          autoRenewStatus?: boolean;
          autoResumeAtMs?: number;
          billingIssueDetectedAt?: number;
          cancelReason?: string;
          commissionPercentage?: number;
          countryCode?: string;
          currency?: string;
          entitlementIds?: Array<string>;
          environment: "SANDBOX" | "PRODUCTION";
          expirationAtMs?: number;
          expirationReason?: string;
          gracePeriodExpirationAtMs?: number;
          isFamilyShare: boolean;
          isTrialConversion?: boolean;
          newProductId?: string;
          offerCode?: string;
          originalTransactionId: string;
          ownershipType?: "PURCHASED" | "FAMILY_SHARED";
          periodType: "TRIAL" | "INTRO" | "NORMAL" | "PROMOTIONAL" | "PREPAID";
          presentedOfferingId?: string;
          priceInPurchasedCurrency?: number;
          priceUsd?: number;
          productId: string;
          purchasedAtMs: number;
          renewalNumber?: number;
          store:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
          taxPercentage?: number;
          transactionId: string;
          updatedAt: number;
        }>
      >;
      isInGracePeriod: FunctionReference<
        "query",
        "internal",
        { originalTransactionId: string },
        {
          billingIssueDetectedAt?: number;
          gracePeriodExpiresAt?: number;
          inGracePeriod: boolean;
        }
      >;
    };
    transfers: {
      getByEventId: FunctionReference<
        "query",
        "internal",
        { eventId: string },
        {
          _creationTime: number;
          _id: string;
          entitlementIds?: Array<string>;
          eventId: string;
          timestamp: number;
          transferredFrom: Array<string>;
          transferredTo: Array<string>;
        } | null
      >;
      list: FunctionReference<
        "query",
        "internal",
        { limit?: number },
        Array<{
          _creationTime: number;
          _id: string;
          entitlementIds?: Array<string>;
          eventId: string;
          timestamp: number;
          transferredFrom: Array<string>;
          transferredTo: Array<string>;
        }>
      >;
    };
    virtualCurrency: {
      getBalance: FunctionReference<
        "query",
        "internal",
        { appUserId: string; currencyCode: string },
        {
          _creationTime: number;
          _id: string;
          appUserId: string;
          balance: number;
          currencyCode: string;
          currencyName: string;
          updatedAt: number;
        } | null
      >;
      listBalances: FunctionReference<
        "query",
        "internal",
        { appUserId: string },
        Array<{
          _creationTime: number;
          _id: string;
          appUserId: string;
          balance: number;
          currencyCode: string;
          currencyName: string;
          updatedAt: number;
        }>
      >;
      listTransactions: FunctionReference<
        "query",
        "internal",
        { appUserId: string; currencyCode?: string },
        Array<{
          _creationTime: number;
          _id: string;
          amount: number;
          appUserId: string;
          currencyCode: string;
          environment: "SANDBOX" | "PRODUCTION";
          productId?: string;
          source?: string;
          timestamp: number;
          transactionId: string;
        }>
      >;
    };
    webhookEvents: {
      getByEventId: FunctionReference<
        "query",
        "internal",
        { eventId: string },
        null | {
          _creationTime: number;
          _id: string;
          appId?: string;
          appUserId?: string;
          environment: "SANDBOX" | "PRODUCTION";
          error?: string;
          eventId: string;
          eventType: string;
          payload: any;
          processedAt: number;
          status: "processed" | "failed" | "ignored";
          store?:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
        }
      >;
      listByType: FunctionReference<
        "query",
        "internal",
        { eventType: string; limit?: number },
        Array<{
          _creationTime: number;
          _id: string;
          appId?: string;
          appUserId?: string;
          environment: "SANDBOX" | "PRODUCTION";
          error?: string;
          eventId: string;
          eventType: string;
          payload: any;
          processedAt: number;
          status: "processed" | "failed" | "ignored";
          store?:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
        }>
      >;
      listByUser: FunctionReference<
        "query",
        "internal",
        { appUserId: string; limit?: number },
        Array<{
          _creationTime: number;
          _id: string;
          appId?: string;
          appUserId?: string;
          environment: "SANDBOX" | "PRODUCTION";
          error?: string;
          eventId: string;
          eventType: string;
          payload: any;
          processedAt: number;
          status: "processed" | "failed" | "ignored";
          store?:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
        }>
      >;
      listFailed: FunctionReference<
        "query",
        "internal",
        { limit?: number },
        Array<{
          _creationTime: number;
          _id: string;
          appId?: string;
          appUserId?: string;
          environment: "SANDBOX" | "PRODUCTION";
          error?: string;
          eventId: string;
          eventType: string;
          payload: any;
          processedAt: number;
          status: "processed" | "failed" | "ignored";
          store?:
            | "AMAZON"
            | "APP_STORE"
            | "MAC_APP_STORE"
            | "PADDLE"
            | "PLAY_STORE"
            | "PROMOTIONAL"
            | "RC_BILLING"
            | "ROKU"
            | "STRIPE"
            | "TEST_STORE";
        }>
      >;
    };
    webhooks: {
      process: FunctionReference<
        "mutation",
        "internal",
        {
          event: {
            app_id?: string;
            app_user_id?: string;
            environment: "SANDBOX" | "PRODUCTION";
            id: string;
            store?:
              | "AMAZON"
              | "APP_STORE"
              | "MAC_APP_STORE"
              | "PADDLE"
              | "PLAY_STORE"
              | "PROMOTIONAL"
              | "RC_BILLING"
              | "ROKU"
              | "STRIPE"
              | "TEST_STORE";
            type: string;
          };
          payload: any;
        },
        { eventId: string; processed: boolean; rateLimited?: boolean }
      >;
    };
  };
  pushNotifications: {
    public: {
      deleteNotificationsForUser: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
        null
      >;
      getNotification: FunctionReference<
        "query",
        "internal",
        { id: string; logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" },
        null | {
          _contentAvailable?: boolean;
          _creationTime: number;
          badge?: number;
          body?: string;
          categoryId?: string;
          channelId?: string;
          data?: any;
          expiration?: number;
          interruptionLevel?:
            | "active"
            | "critical"
            | "passive"
            | "time-sensitive";
          mutableContent?: boolean;
          numPreviousFailures: number;
          priority?: "default" | "normal" | "high";
          sound?: string | null;
          state:
            | "awaiting_delivery"
            | "in_progress"
            | "delivered"
            | "needs_retry"
            | "failed"
            | "maybe_delivered"
            | "unable_to_deliver";
          subtitle?: string;
          title?: string;
          ttl?: number;
        }
      >;
      getNotificationsForUser: FunctionReference<
        "query",
        "internal",
        {
          limit?: number;
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          userId: string;
        },
        Array<{
          _contentAvailable?: boolean;
          _creationTime: number;
          badge?: number;
          body?: string;
          categoryId?: string;
          channelId?: string;
          data?: any;
          expiration?: number;
          id: string;
          interruptionLevel?:
            | "active"
            | "critical"
            | "passive"
            | "time-sensitive";
          mutableContent?: boolean;
          numPreviousFailures: number;
          priority?: "default" | "normal" | "high";
          sound?: string | null;
          state:
            | "awaiting_delivery"
            | "in_progress"
            | "delivered"
            | "needs_retry"
            | "failed"
            | "maybe_delivered"
            | "unable_to_deliver";
          subtitle?: string;
          title?: string;
          ttl?: number;
        }>
      >;
      getStatusForUser: FunctionReference<
        "query",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
        { hasToken: boolean; paused: boolean }
      >;
      pauseNotificationsForUser: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
        null
      >;
      recordPushNotificationToken: FunctionReference<
        "mutation",
        "internal",
        {
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          pushToken: string;
          userId: string;
        },
        null
      >;
      removePushNotificationToken: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
        null
      >;
      restart: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" },
        boolean
      >;
      sendPushNotification: FunctionReference<
        "mutation",
        "internal",
        {
          allowUnregisteredTokens?: boolean;
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          notification: {
            _contentAvailable?: boolean;
            badge?: number;
            body?: string;
            categoryId?: string;
            channelId?: string;
            data?: any;
            expiration?: number;
            interruptionLevel?:
              | "active"
              | "critical"
              | "passive"
              | "time-sensitive";
            mutableContent?: boolean;
            priority?: "default" | "normal" | "high";
            sound?: string | null;
            subtitle?: string;
            title?: string;
            ttl?: number;
          };
          userId: string;
        },
        string | null
      >;
      sendPushNotificationBatch: FunctionReference<
        "mutation",
        "internal",
        {
          allowUnregisteredTokens?: boolean;
          logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
          notifications: Array<{
            notification: {
              _contentAvailable?: boolean;
              badge?: number;
              body?: string;
              categoryId?: string;
              channelId?: string;
              data?: any;
              expiration?: number;
              interruptionLevel?:
                | "active"
                | "critical"
                | "passive"
                | "time-sensitive";
              mutableContent?: boolean;
              priority?: "default" | "normal" | "high";
              sound?: string | null;
              subtitle?: string;
              title?: string;
              ttl?: number;
            };
            userId: string;
          }>;
        },
        Array<string | null>
      >;
      shutdown: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" },
        { data?: any; message: string }
      >;
      unpauseNotificationsForUser: FunctionReference<
        "mutation",
        "internal",
        { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
        null
      >;
    };
  };
};
