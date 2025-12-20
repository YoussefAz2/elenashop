-- =============================================
-- DIAGNOSTIC: Audit store ownership
-- Execute each section one by one in Supabase SQL Editor
-- =============================================

-- 1. List all users and their emails
SELECT id, email, created_at FROM auth.users ORDER BY created_at;

-- 2. List all stores
SELECT id, slug, name, created_at FROM stores ORDER BY created_at;

-- 3. List all store_members with user emails
SELECT 
    sm.id,
    sm.user_id,
    u.email as user_email,
    sm.store_id,
    s.name as store_name,
    s.slug as store_slug,
    sm.role,
    sm.created_at
FROM store_members sm
LEFT JOIN auth.users u ON sm.user_id = u.id
LEFT JOIN stores s ON sm.store_id = s.id
ORDER BY sm.created_at;

-- 4. Find stores WITHOUT any owner
SELECT s.id, s.slug, s.name 
FROM stores s
LEFT JOIN store_members sm ON s.id = sm.store_id
WHERE sm.id IS NULL;

-- =============================================
-- FIX: Add missing store_members entries
-- ONLY RUN AFTER CHECKING THE ABOVE RESULTS
-- =============================================

-- Option A: Add ALL stores to a SPECIFIC user (replace with your user_id)
-- INSERT INTO store_members (user_id, store_id, role)
-- SELECT 
--     'YOUR_USER_ID_HERE'::uuid,
--     s.id,
--     'owner'
-- FROM stores s
-- LEFT JOIN store_members sm ON s.id = sm.store_id AND sm.user_id = 'YOUR_USER_ID_HERE'::uuid
-- WHERE sm.id IS NULL;

-- Option B: Fix a SPECIFIC store for a SPECIFIC user
-- INSERT INTO store_members (user_id, store_id, role)
-- VALUES ('YOUR_USER_ID', 'YOUR_STORE_ID', 'owner')
-- ON CONFLICT DO NOTHING;
