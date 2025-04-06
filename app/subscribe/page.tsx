"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

// Loading component to show while suspense is resolving
function LoadingState() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
      <div className='animate-spin h-8 w-8 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent'></div>
    </div>
  );
}

// The main subscribe page content component
function SubscribePageContent() {
  const { user, isLoaded: userLoaded } = useUser();
  const {
    subscription,
    startFreeTrial,
    activatePremium,
    isLoading,
    isSubscriptionValid,
    checkoutLoading,
  } = useSubscription();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query parameters
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const sessionId = searchParams.get("session_id");

  // Handle success or failure redirects from Stripe
  useEffect(() => {
    if (success === "true" && sessionId) {
      console.log("Detected successful payment with session ID:", sessionId);
      setShowSuccess(true);

      // Set cookie to indicate the user has a subscription
      document.cookie = `has_subscription=true; path=/; max-age=${
        60 * 60 * 24 * 30
      }`;

      // Redirect to dashboard after a short delay
      const redirectTimer = setTimeout(() => {
        console.log("Redirecting to dashboard after successful payment");
        router.push("/dashboard");
      }, 1500);

      return () => {
        clearTimeout(redirectTimer);
      };
    } else if (canceled === "true") {
      setShowError(true);
      setErrorMessage(
        "Your subscription process was canceled. Please try again when you're ready."
      );

      // Clear error after 5 seconds
      const errorTimer = setTimeout(() => {
        setShowError(false);
      }, 5000);

      return () => {
        clearTimeout(errorTimer);
      };
    }
  }, [success, canceled, sessionId, router]);

  // Separate effect to check for valid subscription and redirect to dashboard
  useEffect(() => {
    if (userLoaded && isSubscriptionValid) {
      console.log("User has valid subscription, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [userLoaded, isSubscriptionValid, router]);

  const handleFreeTrial = async () => {
    if (!user) return;

    try {
      await startFreeTrial();
    } catch (err: any) {
      console.error("Error starting free trial:", err);
      setShowError(true);
      setErrorMessage(
        err.message ||
          "There was an error starting your free trial. Please try again."
      );

      // Clear error after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const handlePremium = async () => {
    if (!user) return;

    try {
      await activatePremium();
    } catch (err: any) {
      console.error("Error activating premium subscription:", err);
      setShowError(true);
      setErrorMessage(
        err.message ||
          "There was an error processing your subscription. Please try again."
      );

      // Clear error after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  if (isLoading || !userLoaded) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='animate-spin h-8 w-8 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='text-3xl md:text-4xl font-bold mb-4 dark:text-white'>
              Choose Your Plan
            </h1>
            <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Get started with BudgetBuddy by selecting one of our plans below.
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className='mb-8 p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center'>
              <p className='text-green-700 dark:text-green-300 flex items-center justify-center'>
                <Check className='h-5 w-5 mr-2' />
                <span>
                  Plan activated successfully! Redirecting to dashboard...
                </span>
              </p>
            </div>
          )}

          {/* Error Message */}
          {showError && (
            <div className='mb-8 p-4 bg-red-100 dark:bg-red-900 rounded-lg text-center'>
              <p className='text-red-700 dark:text-red-300 flex items-center justify-center'>
                <X className='h-5 w-5 mr-2' />
                <span>{errorMessage}</span>
              </p>
            </div>
          )}

          {/* Plans */}
          <div className='grid md:grid-cols-2 gap-8'>
            {/* Free Trial Plan */}
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-blue-500'>
              <h3 className='text-xl font-bold mb-3 dark:text-white'>
                7-Day Free Trial
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                Try all premium features risk-free
              </p>
              <ul className='space-y-3 mb-6'>
                <li className='flex items-start'>
                  <Check className='h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                  <span className='text-gray-600 dark:text-gray-300'>
                    Full access to all features
                  </span>
                </li>
                <li className='flex items-start'>
                  <Check className='h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                  <span className='text-gray-600 dark:text-gray-300'>
                    No credit card required
                  </span>
                </li>
                <li className='flex items-start'>
                  <Check className='h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                  <span className='text-gray-600 dark:text-gray-300'>
                    Cancel anytime
                  </span>
                </li>
                <li className='flex items-start'>
                  <Check className='h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                  <span className='text-gray-600 dark:text-gray-300'>
                    Expires after 7 days
                  </span>
                </li>
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                  checkoutLoading
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                }`}
                onClick={handleFreeTrial}
                disabled={checkoutLoading}>
                {checkoutLoading ? (
                  <span className='flex items-center justify-center'>
                    <Loader2 className='h-5 w-5 mr-2 animate-spin' />
                    Processing...
                  </span>
                ) : (
                  "Start Free Trial"
                )}
              </button>
            </div>

            {/* Premium Plan */}
            <div className='bg-blue-600 rounded-xl p-6 shadow-lg text-white'>
              <h3 className='text-xl font-bold mb-3'>Premium Plan</h3>
              <div className='mb-4'>
                <span className='text-3xl font-bold'>$9.99</span>
                <span className='text-blue-100'>/month</span>
              </div>
              <ul className='space-y-3 mb-6'>
                <li className='flex items-start'>
                  <Check className='h-5 w-5 text-blue-200 mt-0.5 mr-2 flex-shrink-0' />
                  <span>Advanced analytics and insights</span>
                </li>
                <li className='flex items-start'>
                  <Check className='h-5 w-5 text-blue-200 mt-0.5 mr-2 flex-shrink-0' />
                  <span>Custom budget categories</span>
                </li>
                <li className='flex items-start'>
                  <Check className='h-5 w-5 text-blue-200 mt-0.5 mr-2 flex-shrink-0' />
                  <span>Priority customer support</span>
                </li>
                <li className='flex items-start'>
                  <Check className='h-5 w-5 text-blue-200 mt-0.5 mr-2 flex-shrink-0' />
                  <span>Export financial reports</span>
                </li>
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                  checkoutLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-blue-50 text-blue-600 hover:shadow-lg"
                }`}
                onClick={handlePremium}
                disabled={checkoutLoading}>
                {checkoutLoading ? (
                  <span className='flex items-center justify-center text-gray-600'>
                    <Loader2 className='h-5 w-5 mr-2 animate-spin' />
                    Processing...
                  </span>
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </div>
          </div>

          {/* Additional info */}
          <div className='mt-12 text-center'>
            <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Questions about our plans? Contact our{" "}
              <a
                href='#'
                className='text-blue-600 dark:text-blue-400 underline'>
                customer support
              </a>{" "}
              team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function SubscribePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SubscribePageContent />
    </Suspense>
  );
}
