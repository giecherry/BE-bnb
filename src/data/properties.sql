CREATE TABLE properties (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  availability BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  images TEXT[] DEFAULT '{}'
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

-- SEED DATA 
INSERT INTO properties (id, name, description, location, price_per_night, user_id, images)
VALUES
  (gen_random_uuid(), 'Blush Haven', 'A cozy pink-themed apartment perfect for a weekend getaway.', 'New York', 120.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg',
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg'
  ]),
  (gen_random_uuid(), 'Rosy Retreat', 'A charming apartment with soft pink decor and modern amenities.', 'Los Angeles', 150.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg'
  ]),
  (gen_random_uuid(), 'Pink Paradise', 'A luxurious pink-themed apartment with stunning city views.', 'Chicago', 200.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg',
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg'
  ]),
  (gen_random_uuid(), 'Blush & Bloom', 'A delightful pink apartment with floral accents and cozy vibes.', 'San Francisco', 180.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg',
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg'
  ]),
  (gen_random_uuid(), 'Rosé Retreat', 'A serene pink apartment with a touch of elegance.', 'Miami', 140.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg',
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg'
  ]),
  (gen_random_uuid(), 'Pink Serenity', 'A peaceful pink-themed apartment with modern touches.', 'Seattle', 130.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg'
  ]),
  (gen_random_uuid(), 'Blush Escape', 'A dreamy pink apartment with a cozy atmosphere.', 'Austin', 125.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg',
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg'
  ]),
  (gen_random_uuid(), 'Pink Horizon', 'A chic pink apartment with stunning sunset views.', 'Denver', 160.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg'
  ]),
  (gen_random_uuid(), 'Rosy Glow', 'A bright and cheerful pink apartment with modern decor.', 'Portland', 135.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg',
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg'
  ]),
  (gen_random_uuid(), 'Pink Oasis', 'A tranquil pink apartment with a relaxing vibe.', 'San Diego', 145.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg',
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg'
  ]),
  (gen_random_uuid(), 'Blush Loft', 'A stylish pink loft with an open floor plan.', 'Boston', 170.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg',
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg'
  ]),
  (gen_random_uuid(), 'Pink Escape', 'A cozy pink apartment with a touch of luxury.', 'Atlanta', 155.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg'
  ]),
  (gen_random_uuid(), 'Blush Charm', 'A charming pink apartment with vintage decor.', 'Nashville', 140.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg',
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg'
  ]),
  (gen_random_uuid(), 'Pink Bliss', 'A blissful pink apartment with a cozy ambiance.', 'Orlando', 125.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg',
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg'
  ]),
  (gen_random_uuid(), 'Blush Elegance', 'An elegant pink apartment with luxurious touches.', 'Dallas', 175.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg',
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/736x/29/f0/33/29f033b5d751b531203eff4a066dde3b.jpg',
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg'
  ]),
  (gen_random_uuid(), 'Pink Haven', 'A peaceful pink apartment with a modern design.', 'Phoenix', 145.00, '589d85ef-af2c-4588-99f2-79b6cd2fb30c', ARRAY[
    'https://i.pinimg.com/736x/17/08/2b/17082b254262236707dfad4f692d211d.jpg',
    'https://cdn.apartmenttherapy.info/image/upload/v1655238747/at/house%20tours/2022-06/Briana%20G/Apartment_Therapy_-_Briana_-_June_20225154.jpg',
    'https://i.pinimg.com/736x/d9/b1/9f/d9b19f974ab5ef7ce8f36a52ed681b52.jpg',
    'https://i.pinimg.com/1200x/c5/b0/3b/c5b03b2babeade557ea6fbe8af1c2c9c.jpg'
  ]);

