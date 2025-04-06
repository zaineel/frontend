import { loadStripe } from "@stripe/stripe-js";

// Load the Stripe publishable key from environment variables
// Make sure to add your Stripe publishable key to .env.local
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Price IDs for different subscription tiers
export const SUBSCRIPTION_PRICES = {
  PREMIUM_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
  FREE_TRIAL: "price_free_trial", // This would be handled differently
};
