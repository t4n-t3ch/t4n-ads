import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Initialize Stripe with secret key from environment variable
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// If Stripe is not configured, return a simple handler that always returns 200
if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe webhook will return mock responses.');
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request: NextRequest) {
  // If Stripe is not configured, return a success response
  if (!stripe || !webhookSecret) {
    console.log('Stripe not configured, returning mock success response');
    return NextResponse.json(
      { message: 'Stripe not configured' },
      { status: 200 }
    );
  }

  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract metadata from the session
        const userId = session.metadata?.userId;
        const creditsAmount = session.metadata?.creditsAmount;
        const amountPaid = session.amount_total; // in cents
        
        if (!userId || !creditsAmount) {
          console.error('Missing userId or creditsAmount in session metadata:', session.metadata);
          return NextResponse.json(
            { error: 'Missing required metadata in session' },
            { status: 400 }
          );
        }

        // Find the user by their Supabase ID
        const user = await prisma.user.findUnique({
          where: { supabaseId: userId }
        });

        if (!user) {
          console.error('User not found with supabaseId:', userId);
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        const creditsToAdd = parseInt(creditsAmount, 10);
        
        if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
          console.error('Invalid credits amount:', creditsAmount);
          return NextResponse.json(
            { error: 'Invalid credits amount' },
            { status: 400 }
          );
        }

        // Update user's credit balance
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: {
              increment: creditsToAdd
            }
          }
        });

        // Create a transaction record
        await prisma.transaction.create({
          data: {
            userId: user.id,
            type: 'PURCHASE',
            amount: creditsToAdd,
            description: `Purchased ${creditsToAdd} credits via Stripe`,
            metadata: {
              stripeSessionId: session.id,
              stripeCustomerId: session.customer as string || null,
              amountPaid: amountPaid ? amountPaid / 100 : 0, // Convert cents to dollars/pounds
              currency: session.currency || 'usd'
            }
          }
        });

        console.log(`Added ${creditsToAdd} credits to user ${userId}. New balance: ${updatedUser.credits}`);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find customer in Stripe to get email
        const customer = await stripe.customers.retrieve(customerId);
        
        if (customer.deleted) {
          console.error('Customer has been deleted:', customerId);
          break;
        }
        
        const customerEmail = (customer as Stripe.Customer).email;
        
        if (!customerEmail) {
          console.error('Customer email not found:', customerId);
          break;
        }
        
        // Find user by email
        const user = await prisma.user.findFirst({
          where: { email: customerEmail }
        });
        
        if (!user) {
          console.error('User not found with email:', customerEmail);
          break;
        }
        
        // Update user's subscription status
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: subscription.status,
            subscriptionId: subscription.id,
            subscriptionTier: subscription.items.data[0]?.price.metadata?.tier || 'pro',
            subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        });
        
        console.log(`Updated subscription for user ${user.email}: ${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by subscription ID
        const user = await prisma.user.findFirst({
          where: { subscriptionId: subscription.id }
        });
        
        if (user) {
          // Reset subscription fields
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'canceled',
              subscriptionTier: null,
              subscriptionCurrentPeriodEnd: null
            }
          });
          
          console.log(`Canceled subscription for user ${user.email}`);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent was successful:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('PaymentIntent failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: `Webhook handler failed: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  // GET method for webhook verification (Stripe sometimes uses GET for setup)
  return NextResponse.json(
    { message: 'Stripe webhook endpoint is active. Use POST for webhook events.' },
    { status: 200 }
  );
}