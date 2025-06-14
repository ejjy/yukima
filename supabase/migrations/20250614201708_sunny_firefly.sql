/*
  # Routine History and Daily Nudges Implementation

  1. Database Schema Updates
    - Add `nudges_enabled` column to `user_profiles` table
    - Create `user_notifications` table for daily nudges
    - Create `routine_history` view for better routine tracking

  2. Security
    - Enable RLS on new table
    - Add policies for user data access
    - Service role policies for automated nudges

  3. Indexes
    - Optimize queries for notifications and routine history
*/

-- Add nudges_enabled column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'nudges_enabled'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN nudges_enabled boolean DEFAULT false;
  END IF;
END $$;

-- Create user_notifications table for daily nudges
CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'routine_nudge',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- Enable RLS on user_notifications
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON user_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON user_notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can insert notifications for nudges
CREATE POLICY "Service role can insert notifications"
  ON user_notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role can manage all notifications (for cleanup)
CREATE POLICY "Service role can manage notifications"
  ON user_notifications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type ON user_notifications (type);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON user_notifications (read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_expires_at ON user_notifications (expires_at);

-- Add index for nudges_enabled on user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_nudges_enabled ON user_profiles (nudges_enabled) WHERE nudges_enabled = true;

-- Create a function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM user_notifications 
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for routine history with better formatting
CREATE OR REPLACE VIEW routine_history AS
SELECT 
  ur.id,
  ur.user_id,
  ur.morning_routine,
  ur.evening_routine,
  ur.total_cost,
  ur.ai_generated,
  ur.confidence_score,
  ur.created_at,
  ur.updated_at,
  -- Calculate routine stats
  (
    SELECT COUNT(*) 
    FROM jsonb_array_elements(ur.morning_routine) 
  ) + (
    SELECT COUNT(*) 
    FROM jsonb_array_elements(ur.evening_routine)
  ) as total_steps,
  -- Extract skin type from routine context if available
  COALESCE(
    ur.morning_routine->0->'product'->>'skinType',
    'Unknown'
  ) as detected_skin_type
FROM user_routines ur
ORDER BY ur.created_at DESC;

-- Grant access to the view
GRANT SELECT ON routine_history TO authenticated;
GRANT SELECT ON routine_history TO service_role;