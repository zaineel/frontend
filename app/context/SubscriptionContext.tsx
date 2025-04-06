"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { Subscription } from "../types";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type SubscriptionContextType = {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  startFreeTrial: () => Promise<void>;
  activatePremium: () => Promise<void>;
  isSubscriptionValid: boolean;
  checkoutLoading: boolean;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();

  // Computed property to check if the subscription is valid
  const isSubscriptionValid =
    !!subscription &&
    (subscription.subscriptionStatus === "active" ||
      (subscription.subscriptionStatus === "trial" &&
        new Date(subscription.subscriptionExpiry) > new Date()));

  // Fetch subscription data when user is loaded
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!userLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Check if this is a successful payment redirect
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const isSuccessfulPayment =
            urlParams.get("success") === "true" && urlParams.has("session_id");

          if (isSuccessfulPayment) {
            // Create an active subscription state
            const now = new Date();
            const expiryDate = new Date();
            expiryDate.setMonth(now.getMonth() + 1); // 1 month subscription

            const newSubscription: Subscription = {
              userId: user.id,
              isOnFreeTrial: false,
              freeTrialStartDate: "",
              subscriptionStatus: "active",
              subscriptionTier: "premium",
              subscriptionExpiry: expiryDate.toISOString(),
            };

            // Save to localStorage as a backup
            localStorage.setItem(
              `subscription_${user.id}`,
              JSON.stringify(newSubscription)
            );

            // Set cookie to indicate subscription
            document.cookie = `has_subscription=true; path=/; max-age=${
              60 * 60 * 24 * 30
            }`;

            setSubscription(newSubscription);
            setIsLoading(false);
            return;
          }
        }

        // Otherwise, check localStorage for existing subscription
        const storedSubscription = localStorage.getItem(
          `subscription_${user.id}`
        );

        if (storedSubscription) {
          setSubscription(JSON.parse(storedSubscription));
        } else {
          // Default to inactive subscription for new users
          const newSubscription: Subscription = {
            userId: user.id,
            isOnFreeTrial: false,
            freeTrialStartDate: "",
            subscriptionStatus: "inactive",
            subscriptionTier: "free",
            subscriptionExpiry: "",
          };

          localStorage.setItem(
            `subscription_${user.id}`,
            JSON.stringify(newSubscription)
          );
          setSubscription(newSubscription);
        }
      } catch (err) {
        setError("Failed to fetch subscription data");
        console.error("Error fetching subscription:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user, userLoaded]);

  // Start free trial via Stripe
  const startFreeTrial = async () => {
    if (!user) return;

    try {
      setCheckoutLoading(true);

      // Call the free trial API endpoint
      const response = await fetch("/api/stripe/free-trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to start free trial");
      }

      const data = await response.json();

      // Update subscription in local state
      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(now.getDate() + 7); // 7-day trial

      const updatedSubscription: Subscription = {
        userId: user.id,
        isOnFreeTrial: true,
        freeTrialStartDate: now.toISOString(),
        subscriptionStatus: "trial",
        subscriptionTier: "premium", // During trial, they get premium features
        subscriptionExpiry: expiryDate.toISOString(),
      };

      // Save to localStorage as a fallback
      localStorage.setItem(
        `subscription_${user.id}`,
        JSON.stringify(updatedSubscription)
      );
      setSubscription(updatedSubscription);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to start free trial");
      console.error("Error starting free trial:", err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Activate premium subscription via Stripe Checkout
  const activatePremium = async () => {
    if (!user) return;

    try {
      setCheckoutLoading(true);

      // Call the checkout API endpoint
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId:
            process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID ||
            "price_1PhEao2M9YgZ81xNP08x0j0u",
          email: user.primaryEmailAddress?.emailAddress,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      setError("Failed to activate premium subscription");
      console.error("Error activating premium:", err);
      setCheckoutLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        startFreeTrial,
        activatePremium,
        isSubscriptionValid,
        checkoutLoading,
      }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
