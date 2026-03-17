import { useState, useEffect } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';

export function useCustomerInfo() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | undefined>(undefined);

  useEffect(() => {
    Purchases.getCustomerInfo().then(setCustomerInfo).catch(() => setCustomerInfo(null as any));
    const listener = Purchases.addCustomerInfoUpdateListener(setCustomerInfo);
    return listener;
  }, []);

  return customerInfo;
}
