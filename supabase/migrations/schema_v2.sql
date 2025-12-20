-- =============================================
-- ELENASHOP DATABASE SCHEMA v2.0
-- For EXISTING database - adds missing columns/indexes
-- Execute in Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. ADD MISSING COLUMNS TO STORES
-- =============================================
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores(slug);

-- =============================================
-- 2. ADD MISSING COLUMNS TO STORE_MEMBERS
-- =============================================
ALTER TABLE public.store_members ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';
ALTER TABLE public.store_members ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id);

-- Add role constraint if not exists
DO $$ 
BEGIN
    ALTER TABLE public.store_members 
    ADD CONSTRAINT store_members_role_check 
    CHECK (role IN ('owner', 'admin', 'member'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_store_members_user ON public.store_members(user_id);
CREATE INDEX IF NOT EXISTS idx_store_members_store ON public.store_members(store_id);
CREATE INDEX IF NOT EXISTS idx_store_members_role ON public.store_members(role);

-- =============================================
-- 3. ADD MISSING COLUMNS TO PRODUCTS
-- =============================================
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_products_store ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);

-- =============================================
-- 4. CATEGORIES INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_categories_store ON public.categories(store_id);

-- =============================================
-- 5. ORDERS IMPROVEMENTS
-- =============================================
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS promo_code TEXT;

-- Status constraint
DO $$ 
BEGIN
    ALTER TABLE public.orders 
    ADD CONSTRAINT orders_status_check 
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_orders_store ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- =============================================
-- 6. LEADS IMPROVEMENTS
-- =============================================
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS cart_items JSONB DEFAULT '[]';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS cart_total DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_store ON public.leads(store_id);

-- =============================================
-- 7. PROMOS IMPROVEMENTS (add columns BEFORE index)
-- =============================================
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'percentage';
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS value DECIMAL(10,2);
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS min_order DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS max_uses INTEGER;
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS uses_count INTEGER DEFAULT 0;
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS applies_to TEXT DEFAULT 'all';
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS applies_to_ids JSONB DEFAULT '[]';
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ;
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_promos_store ON public.promos(store_id);
CREATE INDEX IF NOT EXISTS idx_promos_code ON public.promos(code);

-- =============================================
-- 8. PAGES INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_pages_store ON public.pages(store_id);

-- =============================================
-- 9. PROFILES - Auto-create trigger
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 10. ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- DONE! Schema updated successfully
-- =============================================
SELECT 'Schema v2.0 applied successfully!' as status;