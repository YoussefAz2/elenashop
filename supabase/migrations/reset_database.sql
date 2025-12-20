-- =============================================
-- FULL DATABASE RESET - ElenaShop
-- This will DELETE all test data and start fresh
-- Execute in Supabase SQL Editor
-- =============================================

-- ⚠️ IMPORTANT: This deletes EVERYTHING!
-- Only run if you want to start completely fresh

-- 1. Delete all data (order matters due to foreign keys)
DELETE FROM public.leads;
DELETE FROM public.orders;
DELETE FROM public.promos;
DELETE FROM public.products;
DELETE FROM public.categories;
DELETE FROM public.pages;
DELETE FROM public.store_members;
DELETE FROM public.stores;

-- 2. Optionally, delete profiles (keeps auth.users intact)
-- DELETE FROM public.profiles;

-- =============================================
-- VERIFICATION: Check all tables are empty
-- =============================================
SELECT 'stores' as table_name, COUNT(*) as count FROM stores
UNION ALL
SELECT 'store_members', COUNT(*) FROM store_members
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'promos', COUNT(*) FROM promos;

-- =============================================
-- HOW TO TEST AFTER RESET:
-- =============================================
-- 1. Go to http://localhost:3000/login
-- 2. Login with one of your existing accounts (youssefintn@gmail.com, etc.)
-- 3. You should be redirected to /onboarding to create a new store
-- 4. The onboarding will create the store AND the store_member entry correctly
