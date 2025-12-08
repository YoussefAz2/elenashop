-- Migration: Add images array and image_position to products table
-- Run this in Supabase SQL Editor

-- Add images column as JSONB array (default empty array)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Add image_position for controlling image cropping
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN (images);

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name IN ('images', 'image_position');
