-- =============================================
-- MIGRATION: Multi-Store Architecture
-- Execute this in Supabase SQL Editor
-- =============================================

-- 1. CREATE STORES TABLE
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    theme_config JSONB DEFAULT '{}',
    subscription_status TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE STORE_MEMBERS TABLE (junction table)
CREATE TABLE IF NOT EXISTS public.store_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'owner', -- owner | admin | editor (only owner has full access for now)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, store_id)
);

-- 3. ADD store_id TO EXISTING TABLES
-- Products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);

-- Orders  
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);

-- Leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);

-- Categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);

-- Promos
ALTER TABLE public.promos ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);

-- Pages
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);

-- =============================================
-- 4. MIGRATE EXISTING DATA
-- =============================================

-- Create stores from existing profiles that have store_name
INSERT INTO public.stores (id, slug, name, theme_config, subscription_status, created_at)
SELECT 
    gen_random_uuid(),
    p.store_name,
    p.store_name,
    COALESCE(p.theme_config, '{}'),
    COALESCE(p.subscription_status, 'free'),
    p.created_at
FROM public.profiles p
WHERE p.store_name IS NOT NULL AND p.store_name != ''
ON CONFLICT (slug) DO NOTHING;

-- Create store_members for existing users (as owners)
INSERT INTO public.store_members (user_id, store_id, role)
SELECT 
    p.id,
    s.id,
    'owner'
FROM public.profiles p
JOIN public.stores s ON s.slug = p.store_name
WHERE p.store_name IS NOT NULL AND p.store_name != ''
ON CONFLICT (user_id, store_id) DO NOTHING;

-- Update products with store_id
UPDATE public.products p
SET store_id = s.id
FROM public.profiles pr
JOIN public.stores s ON s.slug = pr.store_name
WHERE p.user_id = pr.id AND p.store_id IS NULL;

-- Update orders with store_id
UPDATE public.orders o
SET store_id = s.id
FROM public.profiles pr
JOIN public.stores s ON s.slug = pr.store_name
WHERE o.user_id = pr.id AND o.store_id IS NULL;

-- Update leads with store_id
UPDATE public.leads l
SET store_id = s.id
FROM public.profiles pr
JOIN public.stores s ON s.slug = pr.store_name
WHERE l.user_id = pr.id AND l.store_id IS NULL;

-- Update categories with store_id
UPDATE public.categories c
SET store_id = s.id
FROM public.profiles pr
JOIN public.stores s ON s.slug = pr.store_name
WHERE c.user_id = pr.id AND c.store_id IS NULL;

-- Update promos with store_id
UPDATE public.promos pm
SET store_id = s.id
FROM public.profiles pr
JOIN public.stores s ON s.slug = pr.store_name
WHERE pm.user_id = pr.id AND pm.store_id IS NULL;

-- Update pages with store_id
UPDATE public.pages pg
SET store_id = s.id
FROM public.profiles pr
JOIN public.stores s ON s.slug = pr.store_name
WHERE pg.user_id = pr.id AND pg.store_id IS NULL;

-- =============================================
-- 5. RLS POLICIES
-- =============================================

-- Enable RLS on stores
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Enable RLS on store_members
ALTER TABLE public.store_members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view stores they are members of
CREATE POLICY "Users can view their stores"
ON public.stores FOR SELECT
USING (
    id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- Policy: Only owners can update stores
CREATE POLICY "Owners can update stores"
ON public.stores FOR UPDATE
USING (
    id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid() AND role = 'owner')
);

-- Policy: Authenticated users can create stores
CREATE POLICY "Authenticated users can create stores"
ON public.stores FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can view store_members of their stores
CREATE POLICY "Users can view store members"
ON public.store_members FOR SELECT
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- Policy: Owners can manage store_members
CREATE POLICY "Owners can manage members"
ON public.store_members FOR ALL
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid() AND role = 'owner')
);

-- Policy: Users can insert themselves as owners (for new stores)
CREATE POLICY "Users can add themselves as owner"
ON public.store_members FOR INSERT
WITH CHECK (user_id = auth.uid());

-- =============================================
-- 6. PUBLIC ACCESS FOR STORES (for public storefronts)
-- =============================================

-- Allow anyone to view stores by slug (for public pages)
CREATE POLICY "Public can view stores by slug"
ON public.stores FOR SELECT
USING (true);

-- =============================================
-- 7. CREATE INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores(slug);
CREATE INDEX IF NOT EXISTS idx_store_members_user_id ON public.store_members(user_id);
CREATE INDEX IF NOT EXISTS idx_store_members_store_id ON public.store_members(store_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);

-- =============================================
-- MIGRATION COMPLETE!
-- =============================================
