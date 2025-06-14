/*
# Update Ingredient Analysis Cache Table

1. Changes
   - Add columns for ingredient alerts data
   - Update existing columns to support new data structure
   - Add indexes for better performance

2. Security
   - Update policies for public read access
   - Maintain service role write access

3. New Columns
   - `risk` (text) - risk description
   - `avoid_for` (text array) - skin types to avoid
   - `description` (text) - detailed description
   - `alternatives` (text array) - alternative ingredients
*/

-- Add new columns for ingredient alerts data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ingredient_analysis_cache' AND column_name = 'risk'
  ) THEN
    ALTER TABLE ingredient_analysis_cache ADD COLUMN risk text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ingredient_analysis_cache' AND column_name = 'avoid_for'
  ) THEN
    ALTER TABLE ingredient_analysis_cache ADD COLUMN avoid_for text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ingredient_analysis_cache' AND column_name = 'description'
  ) THEN
    ALTER TABLE ingredient_analysis_cache ADD COLUMN description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ingredient_analysis_cache' AND column_name = 'alternatives'
  ) THEN
    ALTER TABLE ingredient_analysis_cache ADD COLUMN alternatives text[] DEFAULT '{}';
  END IF;
END $$;

-- Update RLS policies for public read access
DROP POLICY IF EXISTS "Anyone can read ingredient cache" ON ingredient_analysis_cache;

CREATE POLICY "Ingredient cache is publicly readable"
  ON ingredient_analysis_cache
  FOR SELECT
  TO public
  USING (true);

-- Create additional indexes
CREATE INDEX IF NOT EXISTS idx_ingredient_cache_avoid_for ON ingredient_analysis_cache USING GIN (avoid_for);
CREATE INDEX IF NOT EXISTS idx_ingredient_cache_alternatives ON ingredient_analysis_cache USING GIN (alternatives);