import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { getURL } from '@/utils/helpers';

export async function POST(req: NextRequest) {
  try {
    const { tastingId, tastingName, price, personCount, date, time, contactInfo } = await req.json();
    
    if (!tastingId || !price || !personCount || !date || !time || !contactInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format the date and time for display
    const formattedDate = new Date(date).toLocaleDateString('sk-SK', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${tastingName} - ${formattedDate} o ${time}`,
              description: `Rezervácia degustácie pre ${personCount} ${personCount === 1 ? 'osobu' : personCount <= 4 ? 'osoby' : 'osôb'}`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: personCount,
        }
      ],
      mode: 'payment',
      success_url: `${getURL()}/degustacia/uspech?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getURL()}/degustacia`,
      metadata: {
        tastingId,
        date,
        time,
        personCount: personCount.toString(),
        customerName: contactInfo.name,
        customerEmail: contactInfo.email,
        customerPhone: contactInfo.phone
      },
      customer_email: contactInfo.email,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating tasting checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
