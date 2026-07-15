import React, { createContext, useState, useEffect } from "react";
import { PLANS } from "../data/plans";

export const SubscriptionContext = createContext();

const INITIAL_USAGE = {
  listingsCreated: 0,
  aiDescriptionsUsedThisMonth: 0,
  chatbotMsgsToday: 0,
  lastChatbotResetDate: new Date().toDateString(),
  lastDescriptionResetMonth: new Date().getMonth(), // 0-11
};

const DEFAULT_STATE = {
  currentPlan: "free",
  billingCycle: "monthly",
  usage: INITIAL_USAGE,
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(() => {
    try {
      const stored = localStorage.getItem("subscription_state");
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Safety checks for malformed data
        if (!parsed.currentPlan || !parsed.usage) {
          return DEFAULT_STATE;
        }
        
        return parsed;
      }
    } catch (e) {
      console.error("Failed to rehydrate subscription state:", e);
    }
    return DEFAULT_STATE;
  });

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Sync state to localStorage on modification
  useEffect(() => {
    localStorage.setItem("subscription_state", JSON.stringify(subscription));
  }, [subscription]);

  // Periodic Reset Checks (Daily & Monthly resets)
  useEffect(() => {
    const todayStr = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    
    let needsUpdate = false;
    let updatedUsage = { ...subscription.usage };

    // 1. Daily Reset Check (for Chatbot messages)
    if (updatedUsage.lastChatbotResetDate !== todayStr) {
      updatedUsage.chatbotMsgsToday = 0;
      updatedUsage.lastChatbotResetDate = todayStr;
      needsUpdate = true;
    }

    // 2. Monthly Reset Check (for AI Description Generation)
    if (updatedUsage.lastDescriptionResetMonth !== currentMonth) {
      updatedUsage.aiDescriptionsUsedThisMonth = 0;
      updatedUsage.lastDescriptionResetMonth = currentMonth;
      needsUpdate = true;
    }

    if (needsUpdate) {
      setSubscription((prev) => ({
        ...prev,
        usage: updatedUsage,
      }));
    }
  }, [subscription.usage]);

  const activePlanDetails = PLANS.find((p) => p.id === subscription.currentPlan) || PLANS[0];

  // Upgrades a plan with simulated checkout flow (1.5 seconds)
  const upgradePlan = async (planId, billingCycle = "monthly") => {
    const planExists = PLANS.some((p) => p.id === planId);
    if (!planExists) return { success: false, error: "Plan not found" };

    setIsProcessingPayment(true);
    
    // Simulate payment processor latency (easypaisa/jazzcash/stripe mockup)
    // TODO: replace with real payment gateway + backend call when available
    return new Promise((resolve) => {
      setTimeout(() => {
        setSubscription((prev) => ({
          ...prev,
          currentPlan: planId,
          billingCycle: billingCycle,
        }));
        setIsProcessingPayment(false);
        setIsUpgradeModalOpen(false);
        resolve({ success: true });
      }, 1500);
    });
  };

  const downgradePlan = () => {
    setSubscription((prev) => ({
      ...prev,
      currentPlan: "free",
      billingCycle: "monthly",
    }));
  };

  // Verifies if a user has access to a specific feature flag or quota
  const canAccess = (featureKey) => {
    const flagVal = activePlanDetails.features[featureKey];
    
    // If feature is blocked entirely (e.g. Price Estimation on Free)
    if (flagVal === false) return false;
    
    // If feature is active (either boolean true or unlimited)
    if (flagVal === true) {
      // Check feature-specific usage thresholds
      if (featureKey === "aiDescriptionGenerator") {
        const limit = activePlanDetails.limits.aiDescriptionsPerMonth;
        if (limit === Infinity) return true;
        return subscription.usage.aiDescriptionsUsedThisMonth < limit;
      }
      
      if (featureKey === "aiChatbotAssistant") {
        const limit = activePlanDetails.limits.chatbotMsgsPerDay;
        if (limit === Infinity) return true;
        return subscription.usage.chatbotMsgsToday < limit;
      }
      
      return true;
    }
    
    return false;
  };

  // Fetch remaining items inside plan quotas
  const getRemainingQuota = (featureKey) => {
    if (featureKey === "aiDescriptionGenerator") {
      const limit = activePlanDetails.limits.aiDescriptionsPerMonth;
      if (limit === Infinity) return Infinity;
      return Math.max(0, limit - subscription.usage.aiDescriptionsUsedThisMonth);
    }

    if (featureKey === "aiChatbotAssistant") {
      const limit = activePlanDetails.limits.chatbotMsgsPerDay;
      if (limit === Infinity) return Infinity;
      return Math.max(0, limit - subscription.usage.chatbotMsgsToday);
    }

    if (featureKey === "unlimitedListings") {
      const limit = activePlanDetails.limits.listingsMax;
      if (limit === Infinity) return Infinity;
      return Math.max(0, limit - subscription.usage.listingsCreated);
    }

    return 0;
  };

  // Increment usage counters
  const incrementUsage = (featureKey) => {
    setSubscription((prev) => {
      const updated = { ...prev.usage };
      if (featureKey === "aiDescriptionGenerator") {
        updated.aiDescriptionsUsedThisMonth += 1;
      } else if (featureKey === "aiChatbotAssistant") {
        updated.chatbotMsgsToday += 1;
      } else if (featureKey === "unlimitedListings") {
        updated.listingsCreated += 1;
      }
      return { ...prev, usage: updated };
    });
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plan: activePlanDetails,
        currentPlan: subscription.currentPlan,
        billingCycle: subscription.billingCycle,
        usage: subscription.usage,
        isProcessingPayment,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        upgradePlan,
        downgradePlan,
        canAccess,
        getRemainingQuota,
        incrementUsage,
        isPremium: subscription.currentPlan !== "free",
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
