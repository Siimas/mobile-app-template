import { useQuery } from 'convex/react';
import { useAuth } from '@clerk/expo';
import { api } from '../convex/_generated/api';
import { useRevenueCat } from '../components/RevenueCatProvider';

const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID?.trim();

export function useSubscription() {
  const { isSignedIn } = useAuth();
  const { isSynced, isActiveFromSDK } = useRevenueCat();
  const entitlements = useQuery(
    api.revenuecat.getMyActiveEntitlements,
    isSignedIn ? {} : 'skip'
  );

  const isLoading = isSignedIn ? (!isSynced || entitlements === undefined) : false;

  const isActiveFromConvex = ENTITLEMENT_ID
    ? entitlements?.some((e) => e.identifier === ENTITLEMENT_ID) ?? false
    : (entitlements?.length ?? 0) > 0;

  const isActive = isActiveFromSDK || isActiveFromConvex;

  return { isActive, isLoading };
}
