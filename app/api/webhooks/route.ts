import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord
} from '@/utils/supabase/admin';
import { createOrder, createOrUpdateCustomer } from '@/utils/supabase/orders';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed'
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.log(`❌ Error message: ${errorMessage}`);
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case 'price.deleted':
          await deletePriceRecord(event.data.object as Stripe.Price);
          break;
        case 'product.deleted':
          await deleteProductRecord(event.data.object as Stripe.Product);
          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'payment') {
            // Create or update customer record
            await createOrUpdateCustomer(checkoutSession);
            // Create order record
            await createOrder(checkoutSession);
          }
          break;
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
          break;
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
          console.error(`PaymentIntent ${failedPaymentIntent.id} failed`);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        return new Response(
          `Webhook handler failed with error: ${error.message}`,
          {
            status: 500
          }
        );
      } else {
        return new Response(
          'Webhook handler failed with unknown error.',
          {
            status: 500
          }
        );
      }
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, { status: 400 });
  }
  return new Response(JSON.stringify({ received: true }));
}
