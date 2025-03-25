-- Winery Management System Database Schema
-- This migration extends the initial database with tables for:
-- 1. Wine products and inventory management
-- 2. Tastings and events
-- 3. Customer management
-- 4. Order processing and shipment tracking
-- 5. Physical store integration
-- 6. Warehouse and inventory management

-- ======== WINE PRODUCTS ========

-- Wine categories (red, white, rosé, sparkling, etc.)
CREATE TABLE "public"."wine_categories" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "description" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."wine_categories" ENABLE ROW LEVEL SECURITY;

-- Wine varieties (Cabernet Sauvignon, Chardonnay, etc.)
CREATE TABLE "public"."wine_varieties" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "description" text,
    "category_id" uuid REFERENCES "public"."wine_categories"(id),
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."wine_varieties" ENABLE ROW LEVEL SECURITY;

-- Vineyards
CREATE TABLE "public"."vineyards" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "location" text,
    "region" text,
    "description" text,
    "image_url" text,
    "established_year" integer,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."vineyards" ENABLE ROW LEVEL SECURITY;

-- Wine products (extends the existing products table with wine-specific details)
CREATE TABLE "public"."wines" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "product_id" text REFERENCES "public"."products"(id),
    "variety_id" uuid REFERENCES "public"."wine_varieties"(id),
    "vineyard_id" uuid REFERENCES "public"."vineyards"(id),
    "vintage" integer,
    "alcohol_content" decimal(4,2),
    "volume_ml" integer,
    "sweetness_level" text,
    "acidity_level" text,
    "body_level" text,
    "tasting_notes" text,
    "food_pairing" text,
    "awards" text[],
    "production_method" text,
    "aging_process" text,
    "aging_duration" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."wines" ENABLE ROW LEVEL SECURITY;

-- ======== INVENTORY MANAGEMENT ========

-- Warehouses
CREATE TABLE "public"."warehouses" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "address" text,
    "contact_person" text,
    "contact_email" text,
    "contact_phone" text,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."warehouses" ENABLE ROW LEVEL SECURITY;

-- Inventory
CREATE TABLE "public"."inventory" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "product_id" text REFERENCES "public"."products"(id),
    "warehouse_id" uuid REFERENCES "public"."warehouses"(id),
    "quantity" integer NOT NULL DEFAULT 0,
    "min_stock_level" integer DEFAULT 5,
    "max_stock_level" integer DEFAULT 100,
    "batch_number" text,
    "expiration_date" date,
    "last_stock_check" timestamp with time zone,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id),
    UNIQUE (product_id, warehouse_id, batch_number)
);

ALTER TABLE "public"."inventory" ENABLE ROW LEVEL SECURITY;

-- Inventory transactions
CREATE TABLE "public"."inventory_transactions" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "inventory_id" uuid REFERENCES "public"."inventory"(id),
    "transaction_type" text NOT NULL, -- 'received', 'shipped', 'adjusted', 'transferred'
    "quantity" integer NOT NULL,
    "reference_id" text, -- Order ID, transfer ID, etc.
    "notes" text,
    "performed_by" text, -- User ID
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."inventory_transactions" ENABLE ROW LEVEL SECURITY;

-- ======== CUSTOMER MANAGEMENT ========

-- Extend customers table with additional information
CREATE TABLE "public"."customer_profiles" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" text REFERENCES "public"."customers"(id),
    "first_name" text,
    "last_name" text,
    "email" text,
    "phone" text,
    "birth_date" date,
    "preferences" jsonb, -- Wine preferences, etc.
    "notes" text,
    "marketing_consent" boolean DEFAULT false,
    "loyalty_points" integer DEFAULT 0,
    "membership_level" text, -- 'standard', 'premium', 'vip'
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id),
    UNIQUE (customer_id)
);

ALTER TABLE "public"."customer_profiles" ENABLE ROW LEVEL SECURITY;

-- Customer addresses
CREATE TABLE "public"."customer_addresses" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" text REFERENCES "public"."customers"(id),
    "address_type" text NOT NULL, -- 'billing', 'shipping', 'both'
    "is_default" boolean DEFAULT false,
    "street_address" text NOT NULL,
    "apartment" text,
    "city" text NOT NULL,
    "state" text,
    "postal_code" text NOT NULL,
    "country" text NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."customer_addresses" ENABLE ROW LEVEL SECURITY;

-- ======== ORDERS AND PAYMENTS ========

-- Orders
CREATE TABLE "public"."orders" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "order_number" text NOT NULL UNIQUE,
    "customer_id" text REFERENCES "public"."customers"(id),
    "order_status" text NOT NULL, -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    "order_date" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "shipping_address_id" uuid REFERENCES "public"."customer_addresses"(id),
    "billing_address_id" uuid REFERENCES "public"."customer_addresses"(id),
    "subtotal" decimal(10,2) NOT NULL,
    "shipping_cost" decimal(10,2) NOT NULL DEFAULT 0,
    "tax" decimal(10,2) NOT NULL DEFAULT 0,
    "discount" decimal(10,2) NOT NULL DEFAULT 0,
    "total" decimal(10,2) NOT NULL,
    "notes" text,
    "source" text, -- 'online', 'in_store', 'phone'
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;

-- Order items
CREATE TABLE "public"."order_items" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "order_id" uuid REFERENCES "public"."orders"(id),
    "product_id" text REFERENCES "public"."products"(id),
    "quantity" integer NOT NULL,
    "unit_price" decimal(10,2) NOT NULL,
    "total_price" decimal(10,2) NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;

-- Payments
CREATE TABLE "public"."payments" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "order_id" uuid REFERENCES "public"."orders"(id),
    "payment_method" text NOT NULL, -- 'credit_card', 'bank_transfer', 'cash', etc.
    "payment_status" text NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
    "amount" decimal(10,2) NOT NULL,
    "currency" text NOT NULL DEFAULT 'EUR',
    "transaction_id" text, -- External payment processor ID
    "payment_date" timestamp with time zone,
    "notes" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;

-- ======== SHIPPING AND DELIVERY ========

-- Shipping methods
CREATE TABLE "public"."shipping_methods" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "description" text,
    "base_cost" decimal(10,2) NOT NULL,
    "estimated_days" integer,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."shipping_methods" ENABLE ROW LEVEL SECURITY;

-- Shipments
CREATE TABLE "public"."shipments" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "order_id" uuid REFERENCES "public"."orders"(id),
    "shipping_method_id" uuid REFERENCES "public"."shipping_methods"(id),
    "tracking_number" text,
    "carrier" text,
    "status" text NOT NULL, -- 'processing', 'shipped', 'in_transit', 'delivered'
    "shipped_date" timestamp with time zone,
    "estimated_delivery" timestamp with time zone,
    "actual_delivery" timestamp with time zone,
    "notes" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."shipments" ENABLE ROW LEVEL SECURITY;

-- Shipment tracking events
CREATE TABLE "public"."shipment_tracking" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "shipment_id" uuid REFERENCES "public"."shipments"(id),
    "status" text NOT NULL,
    "location" text,
    "description" text,
    "event_time" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."shipment_tracking" ENABLE ROW LEVEL SECURITY;

-- ======== TASTINGS AND EVENTS ========

-- Event types
CREATE TABLE "public"."event_types" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "description" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."event_types" ENABLE ROW LEVEL SECURITY;

-- Events and tastings
CREATE TABLE "public"."events" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "event_type_id" uuid REFERENCES "public"."event_types"(id),
    "title" text NOT NULL,
    "description" text,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "location" text,
    "max_attendees" integer,
    "price" decimal(10,2),
    "is_private" boolean DEFAULT false,
    "image_url" text,
    "status" text NOT NULL, -- 'scheduled', 'cancelled', 'completed'
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;

-- Event wines
CREATE TABLE "public"."event_wines" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "event_id" uuid REFERENCES "public"."events"(id),
    "wine_id" uuid REFERENCES "public"."wines"(id),
    "tasting_order" integer,
    "notes" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."event_wines" ENABLE ROW LEVEL SECURITY;

-- Event registrations
CREATE TABLE "public"."event_registrations" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "event_id" uuid REFERENCES "public"."events"(id),
    "customer_id" text REFERENCES "public"."customers"(id),
    "registration_date" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "status" text NOT NULL, -- 'registered', 'cancelled', 'attended'
    "number_of_guests" integer DEFAULT 1,
    "payment_id" uuid REFERENCES "public"."payments"(id),
    "notes" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."event_registrations" ENABLE ROW LEVEL SECURITY;

-- ======== PHYSICAL STORE ========

-- Store locations
CREATE TABLE "public"."store_locations" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "address" text NOT NULL,
    "city" text NOT NULL,
    "state" text,
    "postal_code" text NOT NULL,
    "country" text NOT NULL,
    "phone" text,
    "email" text,
    "opening_hours" jsonb,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."store_locations" ENABLE ROW LEVEL SECURITY;

-- Store inventory (links physical store to inventory)
CREATE TABLE "public"."store_inventory" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "store_id" uuid REFERENCES "public"."store_locations"(id),
    "product_id" text REFERENCES "public"."products"(id),
    "quantity" integer NOT NULL DEFAULT 0,
    "min_stock_level" integer DEFAULT 3,
    "shelf_location" text,
    "is_displayed" boolean DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id),
    UNIQUE (store_id, product_id)
);

ALTER TABLE "public"."store_inventory" ENABLE ROW LEVEL SECURITY;

-- In-store sales
CREATE TABLE "public"."store_sales" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "store_id" uuid REFERENCES "public"."store_locations"(id),
    "order_id" uuid REFERENCES "public"."orders"(id),
    "employee_id" text, -- Reference to user/employee
    "sale_date" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "payment_method" text NOT NULL,
    "notes" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."store_sales" ENABLE ROW LEVEL SECURITY;

-- ======== MARKETING AND PROMOTIONS ========

-- Discount codes
CREATE TABLE "public"."discount_codes" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "code" text NOT NULL UNIQUE,
    "description" text,
    "discount_type" text NOT NULL, -- 'percentage', 'fixed_amount'
    "discount_value" decimal(10,2) NOT NULL,
    "min_purchase_amount" decimal(10,2) DEFAULT 0,
    "max_discount_amount" decimal(10,2),
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "max_uses" integer,
    "current_uses" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."discount_codes" ENABLE ROW LEVEL SECURITY;

-- ======== REVIEWS AND RATINGS ========

-- Product reviews
CREATE TABLE "public"."product_reviews" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "product_id" text REFERENCES "public"."products"(id),
    "customer_id" text REFERENCES "public"."customers"(id),
    "rating" integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "review_text" text,
    "is_verified_purchase" boolean DEFAULT false,
    "is_published" boolean DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE "public"."product_reviews" ENABLE ROW LEVEL SECURITY;

-- ======== SECURITY POLICIES ========

-- Example RLS policies (add more as needed)
CREATE POLICY "Enable read access for all users" ON "public"."products"
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."wines"
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."wine_categories"
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."wine_varieties"
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."vineyards"
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."events"
    FOR SELECT USING (true);

-- Add more policies as needed for different user roles and operations

-- ======== FUNCTIONS AND TRIGGERS ========

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at column
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'ORD-' || to_char(NOW(), 'YYYYMMDD') || '-' || 
                        LPAD(CAST(nextval('order_number_seq') AS TEXT), 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Create trigger for order numbers
CREATE TRIGGER set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- Function to update inventory after order
CREATE OR REPLACE FUNCTION update_inventory_after_order()
RETURNS TRIGGER AS $$
BEGIN
    -- For each order item, reduce inventory
    INSERT INTO public.inventory_transactions (
        inventory_id,
        transaction_type,
        quantity,
        reference_id,
        notes
    )
    SELECT 
        i.id,
        'shipped',
        -oi.quantity,
        NEW.id,
        'Order shipment'
    FROM 
        public.order_items oi
    JOIN 
        public.inventory i ON i.product_id = oi.product_id
    WHERE 
        oi.order_id = NEW.id
    AND 
        i.warehouse_id = (SELECT id FROM public.warehouses LIMIT 1);
    
    -- Update inventory quantities
    UPDATE public.inventory i
    SET 
        quantity = i.quantity - oi.quantity,
        updated_at = NOW()
    FROM 
        public.order_items oi
    WHERE 
        i.product_id = oi.product_id
    AND 
        oi.order_id = NEW.id
    AND 
        i.warehouse_id = (SELECT id FROM public.warehouses LIMIT 1);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory update
CREATE TRIGGER update_inventory
AFTER UPDATE OF order_status ON public.orders
FOR EACH ROW
WHEN (NEW.order_status = 'shipped' AND OLD.order_status != 'shipped')
EXECUTE FUNCTION update_inventory_after_order();
