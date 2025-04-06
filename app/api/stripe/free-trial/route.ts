import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email } = body;

    // Check if user already exists in Stripe
    let customer;
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Create a new customer in Stripe
      customer = await stripe.customers.create({
        email,
        metadata: {
          userId,
        },
      });
    }

    // Get the Premium price ID
    const priceId =
      process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID ||
      process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      throw new Error("Premium price ID not configured");
    }

    console.log("Creating free trial with price ID:", priceId);

    // Create a subscription with a trial period
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
        },
      ],
      trial_period_days: 7, // 7-day free trial
      metadata: {
        userId,
      },
    });

    // Set a cookie to indicate the user has a subscription
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `has_subscription=true; path=/; max-age=${60 * 60 * 24 * 30}`
    );

    return NextResponse.json(
      {
        success: true,
        customerId: customer.id,
        subscriptionId: subscription.id,
        trialEnd: subscription.trial_end,
      },
      { headers }
    );
  } catch (error) {
    console.error("Free trial activation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
