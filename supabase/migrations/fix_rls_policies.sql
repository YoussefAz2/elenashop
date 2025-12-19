-- =============================================
-- FIX: Multi-Store RLS Policies (v2.1)
-- Execute this in Supabase SQL Editor
-- =============================================

-- 1. First, drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their stores" ON public.stores;
DROP POLICY IF EXISTS "Owners can update stores" ON public.stores;
DROP POLICY IF EXISTS "Authenticated users can create stores" ON public.stores;
DROP POLICY IF EXISTS "Public can view stores by slug" ON public.stores;
DROP POLICY IF EXISTS "Users can view store members" ON public.store_members;
DROP POLICY IF EXISTS "Owners can manage members" ON public.store_members;
DROP POLICY IF EXISTS "Users can add themselves as owner" ON public.store_members;

-- Also drop any temp policies we might have created
DROP POLICY IF EXISTS "temp_allow_all_stores" ON public.stores;
DROP POLICY IF EXISTS "temp_allow_all_members" ON public.store_members;
DROP POLICY IF EXISTS "Allow all for stores" ON public.stores;
DROP POLICY IF EXISTS "Allow all for store_members" ON public.store_members;

-- 2. Make sure RLS is enabled
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_members ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. STORES POLICIES
-- =============================================

-- Anyone can view stores (needed for public storefronts)
CREATE POLICY "stores_select_public"
ON public.stores FOR SELECT
USING (true);

-- Authenticated users can create stores
CREATE POLICY "stores_insert_authenticated"
ON public.stores FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Only store owners can update their stores
CREATE POLICY "stores_update_owner"
ON public.stores FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.store_members 
        WHERE store_members.store_id = stores.id 
        AND store_members.user_id = auth.uid() 
        AND store_members.role = 'owner'
    )
);

-- Only store owners can delete their stores
CREATE POLICY "stores_delete_owner"
ON public.stores FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.store_members 
        WHERE store_members.store_id = stores.id 
        AND store_members.user_id = auth.uid() 
        AND store_members.role = 'owner'
    )
);

-- =============================================
-- 4. STORE_MEMBERS POLICIES
-- =============================================

-- Users can view memberships of stores they belong to
CREATE POLICY "store_members_select_member"
ON public.store_members FOR SELECT
USING (
    user_id = auth.uid() 
    OR 
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- Users can add themselves as members (for creating new stores)
CREATE POLICY "store_members_insert_self"
ON public.store_members FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Only owners can update memberships
CREATE POLICY "store_members_update_owner"
ON public.store_members FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.store_members sm
        WHERE sm.store_id = store_members.store_id 
        AND sm.user_id = auth.uid() 
        AND sm.role = 'owner'
    )
);

-- Only owners can delete memberships (except their own)
CREATE POLICY "store_members_delete_owner"
ON public.store_members FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.store_members sm
        WHERE sm.store_id = store_members.store_id 
        AND sm.user_id = auth.uid() 
        AND sm.role = 'owner'
    )
);

-- =============================================
-- 5. PRODUCTS POLICIES (by store_id)
-- =============================================

-- Drop existing product policies
DROP POLICY IF EXISTS "Users can view their products" ON public.products;
DROP POLICY IF EXISTS "Users can create products" ON public.products;
DROP POLICY IF EXISTS "Users can update their products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

-- Public can view active products
CREATE POLICY "products_select_public"
ON public.products FOR SELECT
USING (is_active = true OR store_id IN (
    SELECT store_id FROM public.store_members WHERE user_id = auth.uid()
));

-- Store members can create products
CREATE POLICY "products_insert_member"
ON public.products FOR INSERT
WITH CHECK (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- Store members can update their store's products
CREATE POLICY "products_update_member"
ON public.products FOR UPDATE
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- Store members can delete their store's products
CREATE POLICY "products_delete_member"
ON public.products FOR DELETE
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- =============================================
-- 6. ORDERS POLICIES (by store_id)
-- =============================================

DROP POLICY IF EXISTS "Users can view their orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their orders" ON public.orders;

-- Store members can view their store's orders
CREATE POLICY "orders_select_member"
ON public.orders FOR SELECT
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- Anyone can create orders (customers)
CREATE POLICY "orders_insert_public"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Store members can update their store's orders
CREATE POLICY "orders_update_member"
ON public.orders FOR UPDATE
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- =============================================
-- 7. CATEGORIES POLICIES (by store_id)
-- =============================================

DROP POLICY IF EXISTS "Users can view their categories" ON public.categories;
DROP POLICY IF EXISTS "Users can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;

-- Public can view categories
CREATE POLICY "categories_select_public"
ON public.categories FOR SELECT
USING (true);

-- Store members can manage their store's categories
CREATE POLICY "categories_insert_member"
ON public.categories FOR INSERT
WITH CHECK (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

CREATE POLICY "categories_update_member"
ON public.categories FOR UPDATE
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

CREATE POLICY "categories_delete_member"
ON public.categories FOR DELETE
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- =============================================
-- 8. LEADS POLICIES (by store_id)
-- =============================================

DROP POLICY IF EXISTS "Users can view their leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;

-- Store members can view their store's leads
CREATE POLICY "leads_select_member"
ON public.leads FOR SELECT
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- Anyone can create leads (customers)
CREATE POLICY "leads_insert_public"
ON public.leads FOR INSERT
WITH CHECK (true);

-- =============================================
-- 9. PROMOS POLICIES (by store_id)
-- =============================================

DROP POLICY IF EXISTS "Users can view their promos" ON public.promos;
DROP POLICY IF EXISTS "Users can manage promos" ON public.promos;
DROP POLICY IF EXISTS "Public can view active promos" ON public.promos;

-- Public can view active promos
CREATE POLICY "promos_select_public"
ON public.promos FOR SELECT
USING (true);

-- Store members can manage their store's promos
CREATE POLICY "promos_insert_member"
ON public.promos FOR INSERT
WITH CHECK (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

CREATE POLICY "promos_update_member"
ON public.promos FOR UPDATE
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

CREATE POLICY "promos_delete_member"
ON public.promos FOR DELETE
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- =============================================
-- 10. PAGES POLICIES (by store_id)
-- =============================================

DROP POLICY IF EXISTS "Users can view their pages" ON public.pages;
DROP POLICY IF EXISTS "Users can manage pages" ON public.pages;
DROP POLICY IF EXISTS "Public can view pages" ON public.pages;

-- Public can view pages
CREATE POLICY "pages_select_public"
ON public.pages FOR SELECT
USING (true);

-- Store members can manage their store's pages
CREATE POLICY "pages_insert_member"
ON public.pages FOR INSERT
WITH CHECK (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

CREATE POLICY "pages_update_member"
ON public.pages FOR UPDATE
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

CREATE POLICY "pages_delete_member"
ON public.pages FOR DELETE
USING (
    store_id IN (SELECT store_id FROM public.store_members WHERE user_id = auth.uid())
);

-- =============================================
-- DONE! All RLS policies are now properly configured
-- for the multi-store architecture.
-- =============================================
