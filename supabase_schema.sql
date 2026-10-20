-- 1. PROFILES Table (Extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. PRODUCTS Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. ORDERS Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  customer_email TEXT,
  customer_name TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ORDER_ITEMS Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL
);

-- 5. INITIAL PRODUCT DATA
INSERT INTO products (id, name, description, price, image_url, stock_quantity)
VALUES ('elenor-noir-repair', 'ELENOR Noir Repair Collection', 'Sophisticated blend of advanced keratin complex and natural botanicals.', 4999.00, '/elenor-product.jpg', 100);

-- 6. ADMINS Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. CONTACTS Table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  brand TEXT, -- Tag / Label
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed Default Admin: username "admin", password "elenor-admin"
-- Password hash generated using PBKDF2 with SHA-256 (standard Node crypto format: pbkdf2:10000:salt:hash)
-- Salt: a56e2978d38cb389
-- Hash: f4f3fca7c5e8fefc9e679e3a16a06948da2419310f6d6686309790f17d44da2b
INSERT INTO admins (username, password_hash)
VALUES ('admin', 'pbkdf2:10000:a56e2978d38cb389:f4f3fca7c5e8fefc9e679e3a16a06948da2419310f6d6686309790f17d44da2b')
ON CONFLICT (username) DO NOTHING;

