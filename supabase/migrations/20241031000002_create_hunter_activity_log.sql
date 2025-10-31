-- Create hunter activity log table to track hunter actions

-- Create activity type enum
CREATE TYPE activity_type AS ENUM (
  'recruited',
  'portal_started',
  'portal_completed',
  'portal_failed',
  'died',
  'respawned',
  'level_up',
  'rank_up',
  'rank_up_attempted',
  'rank_up_failed',
  'skill_learned',
  'equipment_equipped',
  'boss_defeated'
);

-- Create activity log table
CREATE TABLE hunter_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hunter_id UUID NOT NULL REFERENCES hunters(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries by hunter
CREATE INDEX idx_hunter_activity_log_hunter_id ON hunter_activity_log(hunter_id);

-- Create index for queries by activity type
CREATE INDEX idx_hunter_activity_log_activity_type ON hunter_activity_log(activity_type);

-- Create index for sorting by created_at
CREATE INDEX idx_hunter_activity_log_created_at ON hunter_activity_log(created_at DESC);

-- Add RLS policies
ALTER TABLE hunter_activity_log ENABLE ROW LEVEL SECURITY;

-- Users can view activity logs for hunters in their guilds
CREATE POLICY "Users can view activity logs for their hunters"
  ON hunter_activity_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hunters h
      JOIN guilds g ON h.guild_id = g.id
      WHERE h.id = hunter_activity_log.hunter_id
      AND g.user_id = auth.uid()
    )
  );

-- Users can insert activity logs for their hunters
CREATE POLICY "Users can insert activity logs for their hunters"
  ON hunter_activity_log
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hunters h
      JOIN guilds g ON h.guild_id = g.id
      WHERE h.id = hunter_activity_log.hunter_id
      AND g.user_id = auth.uid()
    )
  );

-- Add comments for documentation
COMMENT ON TABLE hunter_activity_log IS 'Tracks all significant activities and events for hunters';
COMMENT ON COLUMN hunter_activity_log.activity_type IS 'Type of activity performed';
COMMENT ON COLUMN hunter_activity_log.description IS 'Human-readable description of the activity';
COMMENT ON COLUMN hunter_activity_log.metadata IS 'Additional data about the activity (JSON)';
