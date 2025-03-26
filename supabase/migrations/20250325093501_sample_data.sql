-- Insert sample products (wines)
INSERT INTO "public"."products" (name, description, price, sku, image_url) VALUES
('Château Margaux 2018', 'Premium Bordeaux red wine with rich flavors of black fruits and tobacco', 299.99, 'WIN001', 'https://example.com/margaux.jpg'),
('Dom Pérignon 2010', 'Prestigious vintage champagne with complex citrus and brioche notes', 249.99, 'WIN002', 'https://example.com/domperignon.jpg'),
('Opus One 2019', 'Napa Valley Bordeaux blend with exceptional depth and complexity', 399.99, 'WIN003', 'https://example.com/opusone.jpg');

-- Insert sample customers
INSERT INTO "public"."customers" (email) VALUES
('john.smith@example.com'),
('emma.wilson@example.com'),
('michael.brown@example.com');

-- Insert wine categories
INSERT INTO "public"."wine_categories" (name, description) VALUES
('Red Wine', 'Full-bodied wines made from red grape varieties'),
('White Wine', 'Crisp and refreshing wines made from white grape varieties'),
('Sparkling Wine', 'Effervescent wines with bubbles, including champagne');

-- Insert wine varieties
INSERT INTO "public"."wine_varieties" (name, description, category_id) VALUES
('Cabernet Sauvignon', 'Full-bodied red wine with dark fruit flavors', (SELECT id FROM wine_categories WHERE name = 'Red Wine')),
('Chardonnay', 'Versatile white wine with apple and vanilla notes', (SELECT id FROM wine_categories WHERE name = 'White Wine')),
('Champagne', 'Sparkling wine from the Champagne region of France', (SELECT id FROM wine_categories WHERE name = 'Sparkling Wine'));

-- Insert vineyards
INSERT INTO "public"."vineyards" (name, location, region, description, established_year) VALUES
('Château Margaux', 'Margaux, France', 'Bordeaux', 'Historic First Growth Bordeaux estate', 1784),
('Moët & Chandon', 'Épernay, France', 'Champagne', 'Prestigious champagne house', 1743),
('Opus One Winery', 'Oakville, USA', 'Napa Valley', 'Franco-American fine wine venture', 1979);

-- Insert wines linking to products
INSERT INTO "public"."wines" (product_id, variety_id, vineyard_id, vintage, alcohol_content, volume_ml)
SELECT 
    p.id,
    v.id,
    vy.id,
    2018,
    14.5,
    750
FROM "public"."products" p
CROSS JOIN "public"."wine_varieties" v
CROSS JOIN "public"."vineyards" vy
WHERE p.name LIKE 'Château%'
LIMIT 1;

INSERT INTO "public"."wines" (product_id, variety_id, vineyard_id, vintage, alcohol_content, volume_ml)
SELECT 
    p.id,
    v.id,
    vy.id,
    2010,
    12.5,
    750
FROM "public"."products" p
CROSS JOIN "public"."wine_varieties" v
CROSS JOIN "public"."vineyards" vy
WHERE p.name LIKE 'Dom%'
AND v.name = 'Champagne'
LIMIT 1;

INSERT INTO "public"."wines" (product_id, variety_id, vineyard_id, vintage, alcohol_content, volume_ml)
SELECT 
    p.id,
    v.id,
    vy.id,
    2019,
    14.8,
    750
FROM "public"."products" p
CROSS JOIN "public"."wine_varieties" v
CROSS JOIN "public"."vineyards" vy
WHERE p.name LIKE 'Opus%'
AND v.name = 'Cabernet Sauvignon'
LIMIT 1;

-- Insert warehouses
INSERT INTO "public"."warehouses" (name, address, contact_person, contact_email, contact_phone) VALUES
('Main Storage', '123 Wine St, Napa, CA 94558', 'John Manager', 'john@winery.com', '+1-555-0123'),
('Cellar One', '456 Vineyard Ave, Napa, CA 94559', 'Emma Keeper', 'emma@winery.com', '+1-555-0124'),
('Reserve Vault', '789 Barrel Rd, Napa, CA 94558', 'Michael Store', 'michael@winery.com', '+1-555-0125');

-- Insert inventory for each product in each warehouse
INSERT INTO "public"."inventory" (product_id, warehouse_id, quantity, batch_number)
SELECT 
    p.id,
    w.id,
    FLOOR(RANDOM() * 50 + 10)::integer,
    'BATCH-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || FLOOR(RANDOM() * 1000)::integer
FROM "public"."products" p
CROSS JOIN "public"."warehouses" w;

-- Insert customer profiles
INSERT INTO "public"."customer_profiles" (customer_id, first_name, last_name, phone, membership_level)
SELECT 
    id,
    CASE 
        WHEN email LIKE 'john%' THEN 'John'
        WHEN email LIKE 'emma%' THEN 'Emma'
        ELSE 'Michael'
    END,
    CASE 
        WHEN email LIKE 'john%' THEN 'Smith'
        WHEN email LIKE 'emma%' THEN 'Wilson'
        ELSE 'Brown'
    END,
    '+1-555-' || FLOOR(RANDOM() * 9000 + 1000)::integer,
    CASE floor(random() * 3)
        WHEN 0 THEN 'standard'
        WHEN 1 THEN 'premium'
        ELSE 'vip'
    END
FROM "public"."customers";

-- Insert customer addresses
INSERT INTO "public"."customer_addresses" (customer_id, address_type, street_address, city, state, postal_code, country, is_default)
SELECT 
    c.id,
    'both',
    CASE 
        WHEN c.email LIKE 'john%' THEN '123 Main St'
        WHEN c.email LIKE 'emma%' THEN '456 Oak Ave'
        ELSE '789 Pine Rd'
    END,
    'Napa',
    'CA',
    '94558',
    'USA',
    true
FROM "public"."customers" c;
