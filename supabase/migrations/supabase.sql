-- Supabase Migration Script for Vino Putec E-shop (v5 - Correct EXCEPTION syntax)

-- ========= ENUMS ============
DO $$ BEGIN CREATE TYPE public.wine_type AS ENUM ('Red', 'White', 'Rosé', 'Sparkling', 'Orange', 'Dessert'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.wine_sugar_content AS ENUM ('Dry', 'Semi-Dry', 'Semi-Sweet', 'Sweet'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.order_status AS ENUM ('Pending', 'Processing', 'Payment Failed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.payment_status_type AS ENUM ('pending', 'requires_action', 'processing', 'succeeded', 'failed', 'canceled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.invoice_status_type AS ENUM ('draft', 'open', 'paid', 'void', 'uncollectible'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ========= TABLES & ALTERATIONS ============

-- --- PRODUCTS ---
CREATE TABLE IF NOT EXISTS public.products ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL, active boolean DEFAULT true NOT NULL, name text NOT NULL, description text, image text, sku text UNIQUE, vintage integer CHECK (vintage >= 1900 AND vintage < 2100), wine_type public.wine_type, grape_variety text, alcohol_content numeric(4, 2) CHECK (alcohol_content >= 0 AND alcohol_content < 100), volume_ml integer CHECK (volume_ml > 0), region text, sugar_content public.wine_sugar_content, price numeric(10, 2) NOT NULL CHECK (price >= 0), currency character varying(3) NOT NULL DEFAULT 'EUR', stock_quantity integer DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0), metadata jsonb );

-- --- CUSTOMERS ---
CREATE TABLE IF NOT EXISTS public.customers ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), clerk_user_id text UNIQUE, email text UNIQUE NOT NULL, first_name text, last_name text, phone text, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL );

-- --- STRIPE CUSTOMERS MAPPING ---
CREATE TABLE IF NOT EXISTS public.stripe_customers ( customer_id uuid PRIMARY KEY NOT NULL, stripe_customer_id text UNIQUE NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL );
-- Add Foreign Key Constraint idempotently (CORRECTED EXCEPTION SYNTAX)
DO $$ BEGIN
  ALTER TABLE public.stripe_customers
    ADD CONSTRAINT stripe_customers_customer_id_fkey
    FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object OR SQLSTATE '42P07' THEN -- Correct: Use OR
    RAISE NOTICE 'Constraint stripe_customers_customer_id_fkey already exists, skipping.';
END $$;

-- --- ADDRESSES ---
CREATE TABLE IF NOT EXISTS public.addresses ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), customer_id uuid NOT NULL, address_line1 text NOT NULL, address_line2 text, city text NOT NULL, postal_code text NOT NULL, country character varying(2) NOT NULL, company_name text, is_default_shipping boolean DEFAULT false NOT NULL, is_default_billing boolean DEFAULT false NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL );
-- Add Foreign Key Constraint idempotently (CORRECTED EXCEPTION SYNTAX)
DO $$ BEGIN
  ALTER TABLE public.addresses
    ADD CONSTRAINT addresses_customer_id_fkey
    FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object OR SQLSTATE '42P07' THEN -- Correct: Use OR
    RAISE NOTICE 'Constraint addresses_customer_id_fkey already exists, skipping.';
END $$;

-- --- ORDERS ---
CREATE TABLE IF NOT EXISTS public.orders ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), order_number text UNIQUE, customer_id uuid NOT NULL, order_date timestamp with time zone DEFAULT now() NOT NULL, status public.order_status DEFAULT 'Pending' NOT NULL, total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0), currency character varying(3) NOT NULL, shipping_address_id uuid, billing_address_id uuid, notes text, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL );
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text UNIQUE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_charge_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status public.payment_status_type DEFAULT 'pending' NOT NULL;
-- Add Foreign Key Constraints for orders idempotently (CORRECTED EXCEPTION SYNTAX)
DO $$ BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;
EXCEPTION WHEN duplicate_object OR SQLSTATE '42P07' THEN RAISE NOTICE 'Constraint orders_customer_id_fkey already exists, skipping.'; END $$; -- Correct: Use OR
DO $$ BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT orders_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.addresses(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object OR SQLSTATE '42P07' THEN RAISE NOTICE 'Constraint orders_shipping_address_id_fkey already exists, skipping.'; END $$; -- Correct: Use OR
DO $$ BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT orders_billing_address_id_fkey FOREIGN KEY (billing_address_id) REFERENCES public.addresses(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object OR SQLSTATE '42P07' THEN RAISE NOTICE 'Constraint orders_billing_address_id_fkey already exists, skipping.'; END $$; -- Correct: Use OR

-- --- ORDER ITEMS ---
CREATE TABLE IF NOT EXISTS public.order_items ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), order_id uuid NOT NULL, product_id uuid NOT NULL, quantity integer NOT NULL CHECK (quantity > 0), price_per_item numeric(10, 2) NOT NULL CHECK (price_per_item >= 0), currency character varying(3) NOT NULL );
-- Add Foreign Key Constraints for order_items idempotently (CORRECTED EXCEPTION SYNTAX)
DO $$ BEGIN
  ALTER TABLE public.order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object OR SQLSTATE '42P07' THEN RAISE NOTICE 'Constraint order_items_order_id_fkey already exists, skipping.'; END $$; -- Correct: Use OR
DO $$ BEGIN
  ALTER TABLE public.order_items ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;
EXCEPTION WHEN duplicate_object OR SQLSTATE '42P07' THEN RAISE NOTICE 'Constraint order_items_product_id_fkey already exists, skipping.'; END $$; -- Correct: Use OR

-- Add unique constraint for order_items idempotently (CORRECTED EXCEPTION SYNTAX)
DO $$ BEGIN
  ALTER TABLE public.order_items ADD CONSTRAINT order_items_order_product_unique UNIQUE (order_id, product_id);
EXCEPTION
  WHEN duplicate_object OR SQLSTATE '42P07' THEN -- Correct: Use OR
    RAISE NOTICE 'Constraint order_items_order_product_unique already exists, skipping.';
END $$;

-- --- INVOICES ---
CREATE TABLE IF NOT EXISTS public.invoices ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), order_id uuid UNIQUE NOT NULL, customer_id uuid NOT NULL, invoice_number text UNIQUE NOT NULL, status public.invoice_status_type DEFAULT 'draft' NOT NULL, stripe_invoice_id text UNIQUE, stripe_invoice_url text, stripe_invoice_pdf_url text, amount_due numeric(10, 2) NOT NULL CHECK (amount_due >= 0), amount_paid numeric(10, 2) DEFAULT 0 NOT NULL CHECK (amount_paid >= 0), currency character varying(3) NOT NULL, issue_date timestamp with time zone DEFAULT now() NOT NULL, due_date timestamp with time zone, paid_at timestamp with time zone, pdf_url text, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL );
-- Add Foreign Key Constraints for invoices idempotently (CORRECTED EXCEPTION SYNTAX)
DO $$ BEGIN
  ALTER TABLE public.invoices ADD CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object OR SQLSTATE '42P07' THEN RAISE NOTICE 'Constraint invoices_order_id_fkey already exists, skipping.'; END $$; -- Correct: Use OR
DO $$ BEGIN
  ALTER TABLE public.invoices ADD CONSTRAINT invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;
EXCEPTION WHEN duplicate_object OR SQLSTATE '42P07' THEN RAISE NOTICE 'Constraint invoices_customer_id_fkey already exists, skipping.'; END $$; -- Correct: Use OR

-- ========= INDEXES ============
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_clerk_user_id ON public.customers(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_customer_id ON public.stripe_customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON public.addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON public.orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON public.orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON public.invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON public.invoices(stripe_invoice_id);

-- ========= ROW LEVEL SECURITY (RLS) ============
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products FORCE ROW LEVEL SECURITY;
ALTER TABLE public.customers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_customers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.addresses FORCE ROW LEVEL SECURITY;
ALTER TABLE public.orders FORCE ROW LEVEL SECURITY;
ALTER TABLE public.order_items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.invoices FORCE ROW LEVEL SECURITY;

-- ========= TRIGGERS ============
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DO $$ BEGIN CREATE TRIGGER set_products_timestamp BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER set_customers_timestamp BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER set_addresses_timestamp BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER set_orders_timestamp BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER set_stripe_customers_timestamp BEFORE UPDATE ON public.stripe_customers FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp(); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TRIGGER set_invoices_timestamp BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp(); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ========= END OF SCRIPT ============