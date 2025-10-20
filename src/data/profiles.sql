CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TRIGGER: Automatically create a profile when a user is added
CREATE OR REPLACE FUNCTION create_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS create_profile_trigger ON users;

CREATE TRIGGER create_profile_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_profile();