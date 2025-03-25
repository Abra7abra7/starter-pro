import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items']
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Extract the relevant information
    const metadata = session.metadata || {};
    const lineItems = session.line_items?.data || [];
    const productName = lineItems.length > 0 ? lineItems[0].description : '';

    // Format the date
    const date = metadata.date ? new Date(metadata.date) : null;
    const formattedDate = date ? date.toLocaleDateString('sk-SK', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }) : '';

    // Return the session details
    return NextResponse.json({
      tastingId: metadata.tastingId,
      tastingName: productName,
      formattedDate,
      time: metadata.time,
      personCount: metadata.personCount,
      customerName: metadata.customerName,
      customerEmail: metadata.customerEmail,
      customerPhone: metadata.customerPhone,
      amount: session.amount_total,
      paymentStatus: session.payment_status
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
