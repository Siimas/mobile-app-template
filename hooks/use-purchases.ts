import { useState, useEffect, useCallback } from 'react';
import Purchases, { CustomerInfo, CustomerInfoUpdateListener } from 'react-native-purchases';

interface SubscriptionState {
  isActive: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  refresh: () => Promise<void>;
}

export function useSubscription(): SubscriptionState {
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const fetchCustomerInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.error('[RevenueCat] Failed to get customer info:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerInfo();

    const listener: CustomerInfoUpdateListener = (info) => {
      setCustomerInfo(info);
      setIsLoading(false);
    };

    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [fetchCustomerInfo]);

  const isActive = customerInfo?.entitlements.active['premium'] !== undefined;

  return { isActive, isLoading, customerInfo, refresh: fetchCustomerInfo };
}
