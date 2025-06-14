/*
# Create Products Table

1. New Tables
   - `products`
     - `id` (text, primary key)
     - `name` (text)
     - `step` (text)
     - `skin_type` (text array)
     - `concern_tags` (text array)
     - `price` (integer)
     - `budget_tier` (integer)
     - `regional_relevance` (text)
     - `brand` (text)
     - `category` (text)
     - `description` (text)
     - `created_at` (timestamp)
     - `updated_at` (timestamp)

2. Security
   - Enable RLS on `products` table
   - Add policy for public read access
   - Add policy for service role write access

3. Indexes
   - Index on skin_type for filtering
   - Index on concern_tags for filtering
   - Index on budget_tier for price filtering
   - Index on brand for brand filtering
*/

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  step text NOT NULL,
  skin_type text[] NOT NULL DEFAULT '{}',
  concern_tags text[] NOT NULL DEFAULT '{}',
  price integer NOT NULL,
  budget_tier integer NOT NULL,
  regional_relevance text NOT NULL CHECK (regional_relevance IN ('High', 'Medium', 'Low')),
  brand text NOT NULL,
  category text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Products are publicly readable"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Allow service role to manage products
CREATE POLICY "Service role can manage products"
  ON products
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_skin_type ON products USING GIN (skin_type);
CREATE INDEX IF NOT EXISTS idx_products_concern_tags ON products USING GIN (concern_tags);
CREATE INDEX IF NOT EXISTS idx_products_budget_tier ON products (budget_tier);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_step ON products (step);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();