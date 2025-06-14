/*
# Create Dupes Table

1. New Tables
   - `dupes`
     - `id` (text, primary key)
     - `original_product` (text)
     - `dupe_name` (text)
     - `original_price` (integer)
     - `dupe_price` (integer)
     - `savings` (integer)
     - `reason` (text)
     - `brand` (text)
     - `category` (text)
     - `created_at` (timestamp)
     - `updated_at` (timestamp)

2. Security
   - Enable RLS on `dupes` table
   - Add policy for public read access
   - Add policy for service role write access

3. Indexes
   - Index on category for filtering
   - Index on brand for filtering
   - Index on savings for sorting
*/

CREATE TABLE IF NOT EXISTS dupes (
  id text PRIMARY KEY,
  original_product text NOT NULL,
  dupe_name text NOT NULL,
  original_price integer NOT NULL,
  dupe_price integer NOT NULL,
  savings integer NOT NULL,
  reason text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dupes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to dupes
CREATE POLICY "Dupes are publicly readable"
  ON dupes
  FOR SELECT
  TO public
  USING (true);

-- Allow service role to manage dupes
CREATE POLICY "Service role can manage dupes"
  ON dupes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dupes_category ON dupes (category);
CREATE INDEX IF NOT EXISTS idx_dupes_brand ON dupes (brand);
CREATE INDEX IF NOT EXISTS idx_dupes_savings ON dupes (savings DESC);
CREATE INDEX IF NOT EXISTS idx_dupes_original_product ON dupes (original_product);

-- Create trigger for updated_at
CREATE TRIGGER update_dupes_updated_at
  BEFORE UPDATE ON dupes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();