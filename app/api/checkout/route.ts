import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { getURL } from '@/utils/helpers';
import { CartItem } from '@/hooks/use-cart';

export async function POST(req: NextRequest) {
  try {
    const { cartItems } = await req.json();
    
    if (!cartItems || !cartItems.length) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Create line items from cart items
    const lineItems = cartItems.map((item: CartItem) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.name,
          description: `${item.product.year} - ${item.product.description.substring(0, 100)}`,
          images: [getURL(item.product.image)]
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${getURL()}/eshop/objednavka/uspech?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getURL()}/eshop/kosik`,
      shipping_address_collection: {
        allowed_countries: ['SK', 'CZ'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500, // 5 EUR in cents
              currency: 'eur',
            },
            display_name: 'Štandardné doručenie',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0, // Free
              currency: 'eur',
            },
            display_name: 'Osobný odber',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 1,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
