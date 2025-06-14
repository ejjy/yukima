-- Expand age range support and add premium features

-- Update user_profiles to support new age ranges
DO $$
BEGIN
  -- Add new age range if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'age_range'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN age_range text;
  END IF;
END $$;

-- Add premium tier support to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'age_group'
  ) THEN
    ALTER TABLE products ADD COLUMN age_group text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'premium_tier'
  ) THEN
    ALTER TABLE products ADD COLUMN premium_tier boolean DEFAULT false;
  END IF;
END $$;

-- Insert premium products for 35+ age group
INSERT INTO products (id, name, step, skin_type, concern_tags, price, budget_tier, regional_relevance, brand, category, description, age_group, premium_tier) VALUES
-- Premium Anti-Aging Serums
('sk2-facial-treatment-essence', 'Facial Treatment Essence', 'Serum', ARRAY['Mature', 'All'], ARRAY['Fine Lines', 'Aging', 'Dullness'], 8500, 1499, 'Low', 'SK-II', 'Serum', 'Iconic pitera essence for skin renewal', ARRAY['36-40', '41-45', 'Mature'], true),
('lamer-concentrate', 'The Concentrate', 'Serum', ARRAY['Mature', 'Dry'], ARRAY['Fine Lines', 'Aging', 'Firmness'], 15000, 1499, 'Low', 'La Mer', 'Serum', 'Intensive renewal serum with Miracle Broth', ARRAY['41-45', 'Mature'], true),
('estee-lauder-anr', 'Advanced Night Repair Serum', 'Serum', ARRAY['Mature', 'All'], ARRAY['Fine Lines', 'Aging'], 4500, 1499, 'Medium', 'Estee Lauder', 'Serum', 'Proven anti-aging night serum', ARRAY['31-35', '36-40', '41-45'], true),

-- Premium Moisturizers
('lamer-moisturizing-cream', 'Moisturizing Cream', 'Moisturizer', ARRAY['Mature', 'Dry'], ARRAY['Fine Lines', 'Aging', 'Dryness'], 18000, 1499, 'Low', 'La Mer', 'Moisturizer', 'Legendary moisturizer with Miracle Broth', ARRAY['41-45', 'Mature'], true),
('shiseido-benefiance', 'Benefiance Wrinkle Smoothing Cream', 'Moisturizer', ARRAY['Mature', 'All'], ARRAY['Fine Lines', 'Aging'], 6500, 1499, 'Medium', 'Shiseido', 'Moisturizer', 'Advanced anti-aging moisturizer', ARRAY['36-40', '41-45'], true),
('clinique-dramatically-different', 'Dramatically Different Moisturizing Lotion+', 'Moisturizer', ARRAY['Normal', 'Combo'], ARRAY['Hydration'], 2800, 999, 'Medium', 'Clinique', 'Moisturizer', 'Dermatologist-developed moisturizer', ARRAY['25-30', '31-35'], false),

-- Premium Cleansers
('sk2-facial-cleanser', 'Facial Treatment Cleanser', 'Cleanser', ARRAY['Mature', 'All'], ARRAY['Dullness'], 3500, 1499, 'Low', 'SK-II', 'Cleanser', 'Gentle cleanser with pitera', ARRAY['36-40', '41-45'], true),
('lamer-cleansing-foam', 'The Cleansing Foam', 'Cleanser', ARRAY['Mature', 'All'], ARRAY['Aging'], 4200, 1499, 'Low', 'La Mer', 'Cleanser', 'Luxurious cleansing foam', ARRAY['41-45', 'Mature'], true),

-- Premium Eye Care
('lamer-eye-concentrate', 'The Eye Concentrate', 'Eye Care', ARRAY['Mature', 'All'], ARRAY['Fine Lines', 'Dark Circles'], 12000, 1499, 'Low', 'La Mer', 'Eye Care', 'Intensive eye treatment', ARRAY['36-40', '41-45'], true),
('estee-lauder-eye-creme', 'Advanced Night Repair Eye Creme', 'Eye Care', ARRAY['Mature', 'All'], ARRAY['Fine Lines', 'Dark Circles'], 3800, 1499, 'Medium', 'Estee Lauder', 'Eye Care', 'Anti-aging eye treatment', ARRAY['31-35', '36-40', '41-45'], true),

-- Mid-range options for younger demographics
('olay-regenerist-micro', 'Regenerist Micro-Sculpting Serum', 'Serum', ARRAY['Normal', 'Mature'], ARRAY['Fine Lines', 'Aging'], 899, 999, 'High', 'Olay', 'Serum', 'Affordable anti-aging serum', ARRAY['25-30', '31-35'], false),
('loreal-revitalift', 'Revitalift Laser X3 Serum', 'Serum', ARRAY['Normal', 'Mature'], ARRAY['Fine Lines', 'Aging'], 1299, 999, 'High', 'L\'Oreal', 'Serum', 'Advanced anti-aging technology', ARRAY['31-35', '36-40'], false),

-- Budget-friendly options for younger users
('simple-micellar-water', 'Kind to Skin Micellar Cleansing Water', 'Cleanser', ARRAY['Normal', 'Sensitive'], ARRAY['Sensitivity'], 399, 499, 'Medium', 'Simple', 'Cleanser', 'Gentle micellar water for all skin types', ARRAY['18-24', '25-30'], false),
('neutrogena-hydro-boost', 'Hydro Boost Water Gel', 'Moisturizer', ARRAY['Normal', 'Oily'], ARRAY['Hydration'], 699, 999, 'Medium', 'Neutrogena', 'Moisturizer', 'Lightweight hydrating gel', ARRAY['18-24', '25-30', '31-35'], false);

-- Update existing products with age group information
UPDATE products 
SET age_group = ARRAY['18-24', '25-30']
WHERE price <= 500 AND concern_tags @> ARRAY['Acne'];

UPDATE products 
SET age_group = ARRAY['25-30', '31-35']
WHERE price BETWEEN 500 AND 1000 AND concern_tags @> ARRAY['Fine Lines'];

UPDATE products 
SET age_group = ARRAY['31-35', '36-40', '41-45'], premium_tier = true
WHERE price > 1000;

UPDATE products 
SET age_group = ARRAY['36-40', '41-45'], premium_tier = true
WHERE brand IN ('SK-II', 'La Mer', 'Estee Lauder', 'Shiseido');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_age_group ON products USING GIN (age_group);
CREATE INDEX IF NOT EXISTS idx_products_premium_tier ON products (premium_tier);

-- Update dupes table with premium alternatives
INSERT INTO dupes (id, original_product, dupe_name, original_price, dupe_price, savings, reason, brand, category) VALUES
('premium-serum-dupe-1', 'SK-II Facial Treatment Essence', 'Olay Regenerist Micro-Sculpting Serum', 8500, 899, 7601, 'Similar peptide technology at fraction of cost', 'Olay', 'Serum'),
('premium-moisturizer-dupe-1', 'La Mer Moisturizing Cream', 'Olay Regenerist Night Recovery Cream', 18000, 899, 17101, 'Advanced anti-aging ingredients without luxury markup', 'Olay', 'Moisturizer'),
('premium-cleanser-dupe-1', 'SK-II Facial Treatment Cleanser', 'Cetaphil Gentle Skin Cleanser', 3500, 299, 3201, 'Gentle cleansing without premium price', 'Cetaphil', 'Cleanser'),
('anti-aging-serum-dupe-1', 'Estee Lauder Advanced Night Repair', 'The Ordinary Granactive Retinoid 2% Emulsion', 4500, 590, 3910, 'Similar retinoid benefits at budget price', 'The Ordinary', 'Serum'),
('luxury-eye-cream-dupe-1', 'La Mer The Eye Concentrate', 'Olay Eyes Ultimate Eye Cream', 12000, 1299, 10701, 'Peptides and hydration for eye area', 'Olay', 'Eye Care');

-- Add ingredient alerts for mature skin concerns
INSERT INTO ingredient_analysis_cache (ingredient_name, risk, avoid_for, description, alternatives, safety_data, skin_type_compatibility, concern_compatibility) VALUES
('hydroquinone', 'Skin Lightening & Potential Toxicity', ARRAY['Pregnancy', 'Long-term use'], 'Banned in many countries due to potential side effects', ARRAY['Kojic Acid', 'Arbutin', 'Vitamin C'], '{"risk": "High", "description": "Potential carcinogen"}', '{"Mature": "caution"}', '{"Pigmentation": "effective"}'),
('tretinoin', 'Prescription Strength Irritation', ARRAY['Sensitive', 'Pregnancy'], 'Prescription retinoid requiring medical supervision', ARRAY['Retinol', 'Bakuchiol', 'Peptides'], '{"risk": "Medium", "description": "Prescription only"}', '{"Mature": "excellent"}', '{"Fine Lines": "excellent"}'),
('glycolic acid', 'High Concentration Irritation', ARRAY['Sensitive', 'First-time users'], 'Strong AHA requiring gradual introduction', ARRAY['Lactic Acid', 'Mandelic Acid'], '{"risk": "Medium", "description": "Can cause irritation"}', '{"Mature": "good", "Sensitive": "avoid"}', '{"Fine Lines": "good", "Pigmentation": "good"}');

-- Create a view for age-appropriate product recommendations
CREATE OR REPLACE VIEW age_appropriate_products AS
SELECT 
  p.*,
  CASE 
    WHEN '18-24' = ANY(p.age_group) THEN 'Young Adult'
    WHEN '25-30' = ANY(p.age_group) THEN 'Early Career'
    WHEN '31-35' = ANY(p.age_group) THEN 'Established Adult'
    WHEN '36-40' = ANY(p.age_group) THEN 'Mature Adult'
    WHEN '41-45' = ANY(p.age_group) THEN 'Experienced Adult'
    ELSE 'All Ages'
  END as age_category,
  CASE 
    WHEN p.premium_tier = true THEN 'Premium'
    WHEN p.price > 800 THEN 'High-End'
    WHEN p.price > 400 THEN 'Mid-Range'
    ELSE 'Budget-Friendly'
  END as price_category
FROM products p
ORDER BY p.age_group, p.price;

-- Grant access to the view
GRANT SELECT ON age_appropriate_products TO authenticated;
GRANT SELECT ON age_appropriate_products TO service_role;