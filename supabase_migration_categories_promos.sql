-- ============================================
-- MIGRATION: Categories & Promos System
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create promos table
CREATE TABLE IF NOT EXISTS public.promos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    scope TEXT NOT NULL CHECK (scope IN ('global', 'category', 'product')),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    product_ids UUID[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    show_popup BOOLEAN DEFAULT false,
    popup_title TEXT,
    popup_message TEXT,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Add category_id to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 4. Enable RLS on new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for categories
CREATE POLICY "Users can view their own categories" ON public.categories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON public.categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON public.categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON public.categories
    FOR DELETE USING (auth.uid() = user_id);

-- Public can view categories for store display
CREATE POLICY "Public can view categories" ON public.categories
    FOR SELECT USING (true);

-- 6. RLS Policies for promos
CREATE POLICY "Users can view their own promos" ON public.promos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own promos" ON public.promos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own promos" ON public.promos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own promos" ON public.promos
    FOR DELETE USING (auth.uid() = user_id);

-- Public can view active promos for store display
CREATE POLICY "Public can view active promos" ON public.promos
    FOR SELECT USING (is_active = true);

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_promos_user_id ON public.promos(user_id);
CREATE INDEX IF NOT EXISTS idx_promos_is_active ON public.promos(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
