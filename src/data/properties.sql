CREATE TABLE properties (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  availability BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX idx_properties_name ON properties (name);
CREATE INDEX idx_properties_location ON properties (location);
CREATE INDEX idx_properties_price ON properties (price_per_night);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow owners to update their properties"
ON properties
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow owners to delete their properties"
ON properties
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Allow public access to view properties"
ON properties
FOR SELECT
USING (true);

-- Allow admins to manage all properties
CREATE POLICY "Allow admins to manage all properties"
ON properties
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);