CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX idx_bookings_created_at ON bookings (created_at);
CREATE INDEX idx_bookings_check_in_date ON bookings (check_in_date);
CREATE INDEX idx_bookings_check_out_date ON bookings (check_out_date);
CREATE INDEX idx_bookings_total_price ON bookings (total_price);
CREATE INDEX idx_bookings_user_id ON bookings (user_id);
CREATE INDEX idx_bookings_property_id ON bookings (property_id);

ALTER TABLE bookings
ADD CONSTRAINT check_dates CHECK (check_in_date < check_out_date);
ALTER TABLE bookings
ADD CONSTRAINT unique_booking UNIQUE (user_id, property_id, check_in_date, check_out_date);