"use client";

import React, { useState, useEffect } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, AlertCircle, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function SubscriptionStatus() {
  const { subscription, isLoading } = useSubscription();
  const { user } = useUser();
  const [isManaging, setIsManaging] = useState(false);
  const [successfulPayment, setSuccessfulPayment] = useState(false);

  // Check for successful payment redirect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const isSuccessfulPayment =
        urlParams.get("success") === "true" && urlParams.has("session_id");

      if (isSuccessfulPayment) {
        setSuccessfulPayment(true);
      }
    }
  }, []);

  // Function to open Stripe Checkout for subscription
  const handleManageSubscription = async () => {
    if (!subscription) return;

    try {
      setIsManaging(true);

      // Get user email from Clerk if available
      const userEmail =
        user?.primaryEmailAddress?.emailAddress || "test@example.com";

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId:
            process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID ||
            "price_1PhEao2M9YgZ81xNP08x0j0u",
          email: userEmail,
          mode: "subscription", // Use subscription mode for recurring billing
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast("Error processing subscription. Please try again later.", {
        description: "Please contact support if the issue persists.",
      });
    } finally {
      setIsManaging(false);
    }
  };

  if (isLoading) {
    return (
      <Card className='p-4 dark:bg-gray-800 dark:border-gray-700 animate-pulse'>
        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 w-3/4'></div>
        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 w-1/2'></div>
        <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3'></div>
      </Card>
    );
  }

  // Show a special component for successful payments
  if (successfulPayment) {
    return (
      <Card className='p-6 dark:bg-gray-800 dark:border-gray-700 border-green-300 dark:border-green-800'>
        <div className='flex items-center text-green-600 dark:text-green-400 mb-4'>
          <Check className='h-6 w-6 mr-2' />
          <h3 className='text-lg font-medium'>Subscription Activated!</h3>
        </div>
        <p className='text-gray-600 dark:text-gray-300 mb-4'>
          Your subscription has been successfully activated. You now have full
          access to all premium features.
        </p>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className='p-6 dark:bg-gray-800 dark:border-gray-700 border-red-300 dark:border-red-800'>
        <div className='flex items-center text-red-600 dark:text-red-400 mb-4'>
          <AlertCircle className='h-6 w-6 mr-2' />
          <h3 className='text-lg font-medium'>No Subscription Found</h3>
        </div>
        <p className='text-gray-600 dark:text-gray-300 mb-4'>
          You don't have an active subscription. Please subscribe to continue
          using BudgetBuddy.
        </p>
        <Link href='/subscribe'>
          <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
            View Plans
          </Button>
        </Link>
      </Card>
    );
  }

  if (subscription.subscriptionStatus === "trial") {
    // Calculate remaining days in trial
    const trialEndDate = new Date(subscription.subscriptionExpiry);
    const today = new Date();
    const remainingDays = Math.ceil(
      (trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <Card className='p-6 dark:bg-gray-800 dark:border-gray-700 border-blue-300 dark:border-blue-800'>
        <div className='flex items-center text-blue-600 dark:text-blue-400 mb-4'>
          <Clock className='h-6 w-6 mr-2' />
          <h3 className='text-lg font-medium'>Free Trial</h3>
        </div>
        <p className='text-gray-600 dark:text-gray-300 mb-4'>
          {remainingDays > 0
            ? `You have ${remainingDays} day${
                remainingDays !== 1 ? "s" : ""
              } remaining in your free trial.`
            : "Your free trial ends today."}
        </p>
        <Button
          className='bg-blue-600 hover:bg-blue-700 text-white flex items-center'
          onClick={handleManageSubscription}
          disabled={isManaging}>
          {isManaging ? (
            <>
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              Processing...
            </>
          ) : (
            "Upgrade to Premium"
          )}
        </Button>
      </Card>
    );
  }

  if (subscription.subscriptionStatus === "active") {
    // Format next billing date
    const nextBillingDate = new Date(subscription.subscriptionExpiry);
    const formattedDate = nextBillingDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <Card className='p-6 dark:bg-gray-800 dark:border-gray-700 border-green-300 dark:border-green-800'>
        <div className='flex items-center text-green-600 dark:text-green-400 mb-4'>
          <ShieldCheck className='h-6 w-6 mr-2' />
          <h3 className='text-lg font-medium'>Premium Plan</h3>
        </div>
        <p className='text-gray-600 dark:text-gray-300 mb-4'>
          You're subscribed to the Premium plan. Next billing date:{" "}
          {formattedDate}
        </p>
        <div className='flex space-x-4'>
          <Button
            className='bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center'
            onClick={handleManageSubscription}
            disabled={isManaging}>
            {isManaging ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Loading...
              </>
            ) : (
              "Update Subscription"
            )}
          </Button>
        </div>
      </Card>
    );
  }

  // Default case - expired or other status
  return (
    <Card className='p-6 dark:bg-gray-800 dark:border-gray-700 border-red-300 dark:border-red-800'>
      <div className='flex items-center text-red-600 dark:text-red-400 mb-4'>
        <AlertCircle className='h-6 w-6 mr-2' />
        <h3 className='text-lg font-medium'>Subscription Expired</h3>
      </div>
      <p className='text-gray-600 dark:text-gray-300 mb-4'>
        Your subscription has expired. Please renew to continue using premium
        features.
      </p>
      <Button
        className='bg-blue-600 hover:bg-blue-700 text-white flex items-center'
        onClick={handleManageSubscription}
        disabled={isManaging}>
        {isManaging ? (
          <>
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            Processing...
          </>
        ) : (
          "Renew Subscription"
        )}
      </Button>
    </Card>
  );
}
