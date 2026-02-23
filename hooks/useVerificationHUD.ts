
import { useState } from 'react';
import { refreshAuthUser, sendVerificationShard } from '../services/firebaseService';

export const useVerificationHUD = (onVerified: () => void) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const checkStatus = async () => {
    setIsRefreshing(true);
    try {
      const user = await refreshAuthUser();
      if (user?.emailVerified) {
        onVerified();
      } else {
        setStatusMessage("REGISTRY_PENDING: Email signature not yet detected on-chain.");
      }
    } catch (e) {
      setStatusMessage("SYNC_ERROR: Could not reach auth quorum.");
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setTimeout(() => setStatusMessage(null), 3000);
      }, 1000);
    }
  };

  const resendShard = async () => {
    setIsResending(true);
    try {
      await sendVerificationShard();
      setStatusMessage("SHARD_TRANSMITTED: Check your inbox for the ZK-Identity link.");
    } catch (e) {
      setStatusMessage("TRANSMISSION_FAILED: Rate limit hit. Try again in 60s.");
    } finally {
      setTimeout(() => {
        setIsResending(false);
        setTimeout(() => setStatusMessage(null), 3000);
      }, 1500);
    }
  };

  return {
    isRefreshing,
    isResending,
    statusMessage,
    checkStatus,
    resendShard,
  };
};
