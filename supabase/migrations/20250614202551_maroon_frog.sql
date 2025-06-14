-- Update products table to include new skin types
-- Add new skin type values to existing products

-- Update existing products to include new skin types where appropriate
UPDATE products 
SET skin_type = ARRAY['Oily', 'Combo', 'Acne-prone']
WHERE skin_type @> ARRAY['Oily'] 
AND concern_tags @> ARRAY['Acne'];

UPDATE products 
SET skin_type = ARRAY['Dry', 'Sensitive', 'Mature']
WHERE skin_type @> ARRAY['Dry'] 
AND (concern_tags @> ARRAY['Fine Lines'] OR concern_tags @> ARRAY['Sensitivity']);

UPDATE products 
SET skin_type = ARRAY['Normal', 'Combo']
WHERE skin_type @> ARRAY['Combo'];

-- Add some sample products with new skin types
INSERT INTO products (id, name, step, skin_type, concern_tags, price, budget_tier, regional_relevance, brand, category, description) VALUES
('normal-cleanser-1', 'Simple Kind to Skin Refreshing Facial Wash', 'Cleanser', ARRAY['Normal', 'Sensitive'], ARRAY['Sensitivity'], 299, 299, 'Medium', 'Simple', 'Cleanser', 'Gentle cleanser for normal to sensitive skin'),
('acne-prone-serum-1', 'Paula''s Choice 2% BHA Liquid Exfoliant', 'Serum', ARRAY['Acne-prone', 'Oily'], ARRAY['Acne', 'Large Pores'], 2200, 999, 'Low', 'Paula''s Choice', 'Serum', 'Salicylic acid treatment for acne-prone skin'),
('mature-moisturizer-1', 'Olay Regenerist Night Recovery Cream', 'Moisturizer', ARRAY['Mature', 'Dry'], ARRAY['Fine Lines', 'Aging'], 899, 999, 'Medium', 'Olay', 'Moisturizer', 'Anti-aging night cream for mature skin'),
('normal-toner-1', 'Thayers Rose Petal Witch Hazel Toner', 'Toner', ARRAY['Normal', 'All'], ARRAY['Balance'], 650, 999, 'Low', 'Thayers', 'Toner', 'Alcohol-free toner for normal skin'),
('acne-prone-cleanser-1', 'Neutrogena Oil-Free Acne Wash', 'Cleanser', ARRAY['Acne-prone', 'Oily'], ARRAY['Acne'], 399, 499, 'Medium', 'Neutrogena', 'Cleanser', 'Salicylic acid cleanser for acne-prone skin');

-- Update concern tags to include new concerns
UPDATE products 
SET concern_tags = array_append(concern_tags, 'Uneven Texture')
WHERE concern_tags @> ARRAY['Dullness'];

UPDATE products 
SET concern_tags = array_append(concern_tags, 'Sensitivity')
WHERE skin_type @> ARRAY['Sensitive'];

-- Add index for better performance with new skin types
CREATE INDEX IF NOT EXISTS idx_products_skin_type_gin ON products USING GIN (skin_type);

-- Update the check constraint for regional relevance if it exists
-- (This is just to ensure consistency)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'products' 
    AND constraint_name = 'products_regional_relevance_check'
  ) THEN
    -- Constraint already exists, no need to recreate
    NULL;
  ELSE
    ALTER TABLE products 
    ADD CONSTRAINT products_regional_relevance_check 
    CHECK (regional_relevance IN ('High', 'Medium', 'Low'));
  END IF;
END $$;