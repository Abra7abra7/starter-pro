import { createClerkSupabaseClientSsr } from '@/utils/supabase/server';
import { stripe } from '@/utils/stripe/config';
import type Stripe from 'stripe';

export async function createOrUpdateCustomer(session: Stripe.Checkout.Session) {
  const supabase = await createClerkSupabaseClientSsr();
  const customerData = {
    email: session.customer_details?.email,
    id: session.customer as string,
  };

  // Insert or update customer
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert(customerData)
    .select()
    .single();

  if (customerError) throw customerError;

  // Create or update customer profile
  const profileData = {
    customer_id: customer.id,
    first_name: session.customer_details?.name?.split(' ')[0] || null,
    last_name: session.customer_details?.name?.split(' ').slice(1).join(' ') || null,
    email: session.customer_details?.email || null,
    phone: session.customer_details?.phone || null,
  };

  const { error: profileError } = await supabase
    .from('customer_profiles')
    .upsert(profileData);

  if (profileError) throw profileError;

  // Create customer address if provided
  if (session.shipping_details?.address) {
    const addressData = {
      customer_id: customer.id,
      address_type: 'shipping',
      is_default: true,
      street_address: session.shipping_details.address.line1 || '',
      apartment: session.shipping_details.address.line2 || null,
      city: session.shipping_details.address.city || '',
      state: session.shipping_details.address.state || null,
      postal_code: session.shipping_details.address.postal_code || '',
      country: session.shipping_details.address.country || '',
    };

    const { error: addressError } = await supabase
      .from('customer_addresses')
      .upsert(addressData);

    if (addressError) throw addressError;
  }

  return customer;
}

export async function createOrder(session: Stripe.Checkout.Session) {
  const supabase = await createClerkSupabaseClientSsr();
  
  // Get line items from Stripe
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  
  // Calculate totals
  const subtotal = session.amount_subtotal ? session.amount_subtotal / 100 : 0;
  const shipping = session.shipping_cost ? session.shipping_cost.amount_total / 100 : 0;
  const total = session.amount_total ? session.amount_total / 100 : 0;
  const tax = total - subtotal - shipping;

  // Get customer address
  const { data: addresses } = await supabase
    .from('customer_addresses')
    .select('id')
    .eq('customer_id', session.customer)
    .eq('is_default', true)
    .single();

  // Create order
  const orderData = {
    customer_id: session.customer,
    order_status: 'processing',
    shipping_address_id: addresses?.id,
    billing_address_id: addresses?.id,
    subtotal,
    shipping_cost: shipping,
    tax,
    total,
    source: 'online',
    notes: `Stripe Session ID: ${session.id}`,
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItems = lineItems.data.map(item => ({
    order_id: order.id,
    product_id: item.price?.product as string,
    quantity: item.quantity || 1,
    unit_price: (item.price?.unit_amount || 0) / 100,
    total_price: (item.amount_total || 0) / 100,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  // Create payment record
  const paymentData = {
    order_id: order.id,
    payment_method: session.payment_method_types?.[0] || 'card',
    payment_status: 'completed',
    amount: total,
    currency: session.currency?.toUpperCase() || 'EUR',
    transaction_id: session.payment_intent as string,
    payment_date: new Date().toISOString(),
  };

  const { error: paymentError } = await supabase
    .from('payments')
    .insert(paymentData);

  if (paymentError) throw paymentError;

  return order;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClerkSupabaseClientSsr();
  
  const { error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('id', orderId);

  if (error) throw error;
}
