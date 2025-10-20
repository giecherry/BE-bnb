CREATE TABLE properties (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  availability BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_properties_name ON properties (name);
CREATE INDEX idx_properties_location ON properties (location);
CREATE INDEX idx_properties_price ON properties (price_per_night);