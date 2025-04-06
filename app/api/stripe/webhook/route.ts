import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    // Verify the event came from Stripe
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(checkoutSession);
        break;
      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(updatedSubscription);
        break;
      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSubscription);
        break;
      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(failedInvoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handler functions for different event types
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  // Get the customer and subscription details
  if (session.client_reference_id) {
    // This is where you would update your database
    console.log(`User ${session.client_reference_id} completed checkout`);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (userId) {
    // Update your database to record the subscription
    console.log(`New subscription created for user ${userId}`);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (userId) {
    // Update subscription status in your database
    if (subscription.status === "active") {
      console.log(`Subscription for user ${userId} is now active`);
    } else if (subscription.status === "past_due") {
      console.log(`Subscription for user ${userId} is past due`);
    } else if (subscription.status === "unpaid") {
      console.log(`Subscription for user ${userId} is unpaid`);
    } else if (subscription.status === "canceled") {
      console.log(`Subscription for user ${userId} was canceled`);
    } else if (subscription.status === "trialing") {
      console.log(`Subscription for user ${userId} is in trial`);
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (userId) {
    // Update your database to mark the subscription as cancelled
    console.log(`Subscription for user ${userId} was deleted`);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.customer && typeof invoice.customer === "string") {
    const customer = await stripe.customers.retrieve(invoice.customer);
    if ("metadata" in customer && customer.metadata?.userId) {
      // Update user's subscription status in your database
      console.log(`Payment succeeded for user ${customer.metadata.userId}`);
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.customer && typeof invoice.customer === "string") {
    const customer = await stripe.customers.retrieve(invoice.customer);
    if ("metadata" in customer && customer.metadata?.userId) {
      // Update user's subscription status in your database
      console.log(`Payment failed for user ${customer.metadata.userId}`);
    }
  }
}
