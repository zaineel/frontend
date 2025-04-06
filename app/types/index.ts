export interface Subscription {
  userId: string;
  isOnFreeTrial: boolean;
  freeTrialStartDate: string; // ISO string
  subscriptionStatus: "inactive" | "trial" | "active";
  subscriptionTier: "free" | "premium";
  subscriptionExpiry: string; // ISO string
}
