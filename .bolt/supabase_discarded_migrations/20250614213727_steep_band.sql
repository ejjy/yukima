/*
  # Apply Age Range Expansion Migration
  
  1. Database Schema Updates
    - Expand age range support (18-45)
    - Add new skin types (Normal, Acne-prone, Mature)
    - Add premium product support
    - Update existing data
  
  2. Data Migration
    - Update existing products with new skin types
    - Add premium products for 35+ demographics
    - Enhance product recommendations
  
  3. Performance Optimization
    - Add indexes for new columns
    - Create views for better queries
*/

-- First, ensure all required columns exist
DO $$
BEGIN
  -- Add age_group column to products if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'age_group'
  ) THEN
    ALTER TABLE products ADD COLUMN age_group text[] DEFAULT '{}';
  END IF;

  -- Add premium_tier column to products if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'premium_tier'
  ) THEN
    ALTER TABLE products ADD COLUMN premium_tier boolean DEFAULT false;
  END IF;
END $$;

-- Update existing products to include new skin types
UPDATE products 
SET skin_type = CASE 
  WHEN 'Oily' = ANY(skin_type) AND 'Acne' = ANY(concern_tags) THEN 
    array_append(skin_type, 'Acne-prone')
  WHEN 'Dry' = ANY(skin_type) AND ('Fine Lines' = ANY(concern_tags) OR 'Sensitivity' = ANY(concern_tags)) THEN 
    array_append(skin_type, 'Mature')
  WHEN 'Combo' = ANY(skin_type) THEN 
    array_append(skin_type, 'Normal')
  ELSE skin_type
END
WHERE id IN (
  SELECT id FROM products 
  WHERE NOT ('Normal' = ANY(skin_type) OR 'Acne-prone' = ANY(skin_type) OR 'Mature' = ANY(skin_type))
);

-- Add age group information to existing products
UPDATE products 
SET age_group = CASE 
  WHEN price <= 300 THEN ARRAY['18-24', '25-30']
  WHEN price <= 600 THEN ARRAY['25-30', '31-35']
  WHEN price <= 1000 THEN ARRAY['31-35', '36-40']
  ELSE ARRAY['36-40', '41-45']
END
WHERE age_group = '{}' OR age_group IS NULL;

-- Mark premium products
UPDATE products 
SET premium_tier = true
WHERE price > 800 OR brand IN ('SK-II', 'La Mer', 'Estee Lauder', 'Shiseido', 'Clinique');

-- Insert premium products for mature demographics
INSERT INTO products (id, name, step, skin_type, concern_tags, price, budget_tier, regional_relevance, brand, category, description, age_group, premium_tier) VALUES
-- Premium Anti-Aging Products
('olay-regenerist-premium', 'Regenerist Micro-Sculpting Serum', 'Serum', ARRAY['Mature', 'Normal'], ARRAY['Fine Lines', 'Aging'], 899, 999, 'High', 'Olay', 'Serum', 'Advanced anti-aging serum with amino-peptides', ARRAY['31-35', '36-40', '41-45'], false),
('loreal-revitalift-premium', 'Revitalift Laser X3 Anti-Aging Serum', 'Serum', ARRAY['Mature', 'Normal'], ARRAY['Fine Lines', 'Aging'], 1299, 1499, 'High', 'L\'Oreal', 'Serum', 'Professional anti-aging technology', ARRAY['36-40', '41-45'], true),
('clinique-dramatically-different', 'Dramatically Different Moisturizing Lotion+', 'Moisturizer', ARRAY['Normal', 'Combo'], ARRAY['Hydration'], 2800, 1499, 'Medium', 'Clinique', 'Moisturizer', 'Dermatologist-developed daily moisturizer', ARRAY['25-30', '31-35', '36-40'], true),

-- Budget-friendly options for younger demographics
('simple-micellar-cleanser', 'Kind to Skin Micellar Cleansing Water', 'Cleanser', ARRAY['Normal', 'Sensitive'], ARRAY['Sensitivity'], 399, 499, 'Medium', 'Simple', 'Cleanser', 'Gentle micellar water for daily cleansing', ARRAY['18-24', '25-30'], false),
('neutrogena-hydro-boost-gel', 'Hydro Boost Water Gel', 'Moisturizer', ARRAY['Normal', 'Oily'], ARRAY['Hydration'], 699, 999, 'Medium', 'Neutrogena', 'Moisturizer', 'Lightweight hydrating gel for young skin', ARRAY['18-24', '25-30', '31-35'], false),

-- Mature skin specialized products
('olay-total-effects', 'Total Effects 7-in-1 Anti-Aging Moisturizer', 'Moisturizer', ARRAY['Mature', 'Normal'], ARRAY['Fine Lines', 'Aging', 'Dullness'], 599, 999, 'High', 'Olay', 'Moisturizer', 'Multi-benefit anti-aging moisturizer', ARRAY['36-40', '41-45'], false),
('loreal-age-perfect', 'Age Perfect Golden Age Rosy Re-Fortifying Cream', 'Moisturizer', ARRAY['Mature', 'Dry'], ARRAY['Fine Lines', 'Aging', 'Firmness'], 899, 999, 'High', 'L\'Oreal', 'Moisturizer', 'Specialized cream for mature skin 40+', ARRAY['41-45'], false)

ON CONFLICT (id) DO NOTHING;

-- Add premium dupes for cost-conscious users
INSERT INTO dupes (id, original_product, dupe_name, original_price, dupe_price, savings, reason, brand, category) VALUES
('premium-anti-aging-dupe-1', 'Clinique Dramatically Different Moisturizing Lotion+', 'Olay Total Effects 7-in-1', 2800, 599, 2201, 'Multi-benefit anti-aging at fraction of cost', 'Olay', 'Moisturizer'),
('luxury-serum-dupe-1', 'L\'Oreal Revitalift Laser X3', 'Olay Regenerist Micro-Sculpting Serum', 1299, 899, 400, 'Similar peptide technology, proven results', 'Olay', 'Serum'),
('gentle-cleanser-dupe-1', 'Simple Micellar Water', 'Garnier Micellar Cleansing Water', 399, 199, 200, 'Same gentle cleansing technology', 'Garnier', 'Cleanser')

ON CONFLICT (id) DO NOTHING;

-- Add ingredient alerts for mature skin
INSERT INTO ingredient_analysis_cache (ingredient_name, risk, avoid_for, description, alternatives, safety_data, skin_type_compatibility, concern_compatibility) VALUES
('retinol', 'Initial Irritation & Sun Sensitivity', ARRAY['Sensitive', 'Pregnancy'], 'Powerful anti-aging ingredient requiring gradual introduction', ARRAY['Bakuchiol', 'Peptides', 'Vitamin C'], '{"risk": "Medium", "description": "Start slowly"}', '{"Mature": "excellent", "Sensitive": "caution"}', '{"Fine Lines": "excellent", "Aging": "excellent"}'),
('peptides', 'Generally Safe', ARRAY[], 'Skin-firming ingredients suitable for all skin types', ARRAY['Retinol', 'Vitamin C'], '{"risk": "Low", "description": "Well-tolerated"}', '{"Mature": "excellent", "All": "good"}', '{"Fine Lines": "good", "Firmness": "excellent"}'),
('ceramides', 'Very Safe', ARRAY[], 'Skin barrier strengthening ingredients', ARRAY['Hyaluronic Acid', 'Glycerin'], '{"risk": "Very Low", "description": "Naturally occurring"}', '{"Mature": "excellent", "Dry": "excellent", "Sensitive": "excellent"}', '{"Dryness": "excellent", "Aging": "good"}')

ON CONFLICT (ingredient_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_age_group ON products USING GIN (age_group);
CREATE INDEX IF NOT EXISTS idx_products_premium_tier ON products (premium_tier);
CREATE INDEX IF NOT EXISTS idx_products_price_range ON products (price);

-- Create a function to get age-appropriate products
CREATE OR REPLACE FUNCTION get_age_appropriate_products(user_age_range text)
RETURNS TABLE (
  id text,
  name text,
  brand text,
  price integer,
  skin_type text[],
  concern_tags text[],
  age_match_score integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.brand,
    p.price,
    p.skin_type,
    p.concern_tags,
    CASE 
      WHEN user_age_range = ANY(p.age_group) THEN 100
      WHEN user_age_range IN ('36-40', '41-45') AND 'Mature' = ANY(p.skin_type) THEN 90
      WHEN user_age_range IN ('18-24', '25-30') AND p.price <= 600 THEN 80
      ELSE 50
    END as age_match_score
  FROM products p
  WHERE user_age_range = ANY(p.age_group) 
     OR (user_age_range IN ('36-40', '41-45') AND 'Mature' = ANY(p.skin_type))
     OR (user_age_range IN ('18-24', '25-30') AND p.price <= 600)
  ORDER BY age_match_score DESC, p.regional_relevance DESC, p.price ASC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_age_appropriate_products(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_age_appropriate_products(text) TO service_role;

-- Update user_profiles table to support new age ranges
DO $$
BEGIN
  -- Check if we need to update any existing profiles
  UPDATE user_profiles 
  SET age_range = CASE 
    WHEN age_range IS NULL THEN '25-30'  -- Default for existing users
    ELSE age_range
  END
  WHERE age_range IS NULL OR age_range = '';
END $$;

-- Create a view for enhanced product recommendations
CREATE OR REPLACE VIEW enhanced_product_recommendations AS
SELECT 
  p.*,
  CASE 
    WHEN p.premium_tier = true THEN 'Premium'
    WHEN p.price > 800 THEN 'High-End'
    WHEN p.price > 400 THEN 'Mid-Range'
    ELSE 'Budget-Friendly'
  END as price_tier,
  CASE 
    WHEN '18-24' = ANY(p.age_group) THEN 'Prevention Focus'
    WHEN '25-30' = ANY(p.age_group) THEN 'Early Anti-Aging'
    WHEN '31-35' = ANY(p.age_group) THEN 'Advanced Care'
    WHEN '36-40' = ANY(p.age_group) THEN 'Intensive Treatment'
    WHEN '41-45' = ANY(p.age_group) THEN 'Premium Experience'
    ELSE 'All Ages'
  END as age_focus,
  array_length(p.age_group, 1) as age_versatility
FROM products p
ORDER BY p.regional_relevance DESC, p.price ASC;

-- Grant access to the view
GRANT SELECT ON enhanced_product_recommendations TO authenticated;
GRANT SELECT ON enhanced_product_recommendations TO service_role;