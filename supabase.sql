-- ==========================================
-- THE QUEEN OF LINGERIA — Database Schema
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- ========================
-- ORDERS TABLE
-- ========================
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- Order Reference
    order_number TEXT UNIQUE NOT NULL,  -- e.g. QOL-2026-XXXXX
    
    -- Customer Info
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    country TEXT NOT NULL DEFAULT 'SA',
    city TEXT NOT NULL,
    district TEXT,
    address TEXT,
    postal_code TEXT,
    social_handle TEXT,  -- Instagram/Snapchat Handle for marketing/tracking
    
    -- Order Details
    items JSONB NOT NULL,  -- [{id, name, price, qty, size, color, image}]
    
    -- Pricing
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'SAR',
    
    -- Status Flow
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    
    -- Tracking
    tracking_number TEXT,
    courier TEXT,           -- Aramex, DHL, SMSA
    estimated_delivery DATE,
    
    -- Meta
    notes TEXT,
    source TEXT DEFAULT 'website',  -- website, instagram, whatsapp
    ip_address TEXT,
    user_agent TEXT
);

-- ========================
-- CUSTOMERS TABLE (Optional for V2, useful for loyalty)
-- ========================
CREATE TABLE public.customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    phone_number TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    total_orders INT DEFAULT 0,
    total_spent NUMERIC(12, 2) DEFAULT 0,
    last_order_at TIMESTAMPTZ,
    notes TEXT
);

-- ========================
-- ORDER STATUS HISTORY (Audit Log)
-- ========================
CREATE TABLE public.order_status_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT,
    changed_by TEXT,     -- 'admin' or 'system'
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================
-- INDICES for Performance
-- ========================
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_phone ON public.orders(phone_number);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_country ON public.orders(country);

-- ========================
-- ROW LEVEL SECURITY (RLS)
-- ========================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- 1. Public can INSERT new orders (e.g. from Checkout page) but CANNOT read them.
CREATE POLICY "allow_public_insert" ON public.orders
  FOR INSERT TO anon WITH CHECK (true);

-- 2. Service Role (Server / Admin) has FULL ACCESS to all tables.
CREATE POLICY "allow_service_full_orders" ON public.orders
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "allow_service_full_customers" ON public.customers
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "allow_service_full_history" ON public.order_status_history
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ========================
-- AUTO-INCREMENT ORDER NUMBER TRIGGER
-- ========================
CREATE SEQUENCE order_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'QOL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();
