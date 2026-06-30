import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // If Stripe is not configured, return success to avoid webhook failures
  if (!stripeSecretKey || !webhookSecret) {
    console.log('Stripe not configured - returning mock success');
    return NextResponse.json(
      { message: 'Stripe not configured' },
      { status: 200 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-11-20.acacia',
  });

  try {
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
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Get the metadata from the session
      const userId = session.metadata?.userId;
      const credits = session.metadata?.credits ? parseInt(session.metadata.credits) : 0;
      const amount = session.amount_total ? session.amount_total / 100 : 0; // Convert from cents

      if (!userId || !credits) {
        console.error('Missing userId or credits in session metadata:', session.metadata);
        return NextResponse.json(
          { error: 'Missing userId or credits in session metadata' },
          { status: 400 }
        );
      }

      try {
        // Find the user by their Stripe customer ID or email
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { id: userId },
              { email: session.customer_email || undefined },
              { stripeCustomerId: session.customer as string || undefined }
            ]
          }
        });

        // If user not found by ID, try to find by email
        if (!user && session.customer_email) {
          user = await prisma.user.findUnique({
            where: { email: session.customer_email }
          });
        }

        if (!user) {
          console.error('User not found for Stripe webhook:', { userId, email: session.customer_email });
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Update user's credits
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: {
              increment: credits
            },
            stripeCustomerId: session.customer as string || user.stripeCustomerId
          }
        });

        // Create a transaction record
        await prisma.transaction.create({
          data: {
            userId: user.id,
            type: 'CREDIT_PURCHASE',
            amount: amount,
            credits: credits,
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string || null,
            status: 'COMPLETED',
            metadata: {
              sessionMetadata: session.metadata,
              customerEmail: session.customer_email,
              customerId: session.customer,
              currency: session.currency,
              paymentStatus: session.payment_status
            }
          }
        });

        console.log(`Successfully added ${credits} credits to user ${user.email} (${user.id})`);

        return NextResponse.json(
          { success: true, message: `Added ${credits} credits to user ${user.email}` },
          { status: 200 }
        );

      } catch (error: any) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
          { error: `Error processing webhook: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // Handle other Stripe events if needed
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('PaymentIntent was successful!');
        break;
      case 'payment_intent.payment_failed':
        console.log('PaymentIntent failed!');
        break;
      case 'customer.subscription.created':
        console.log('Subscription created!');
        break;
      case 'customer.subscription.updated':
        console.log('Subscription updated!');
        break;
      case 'customer.subscription.deleted':
        console.log('Subscription deleted!');
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: `Webhook handler error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Stripe webhook endpoint is active. Use POST for webhook events.' },
    { status: 200 }
  );
}