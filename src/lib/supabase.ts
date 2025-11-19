import { createClient } from '@supabase/supabase-js';

// These should be replaced with actual Supabase credentials
// For production, these should come from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database schema initialization (should be run in Supabase)
export const DATABASE_SCHEMA = `
-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  weight DECIMAL NOT NULL,
  purity DECIMAL NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('gold', 'silver', 'platinum', 'palladium')),
  type TEXT NOT NULL CHECK (type IN ('coin', 'bar', 'round')),
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dealers table
CREATE TABLE IF NOT EXISTS dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  website TEXT NOT NULL,
  logo TEXT,
  rating DECIMAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  shipping_policy TEXT,
  payment_methods TEXT[] DEFAULT '{}',
  contact_email TEXT,
  contact_phone TEXT,
  trust_score DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prices table
CREATE TABLE IF NOT EXISTS prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  price DECIMAL NOT NULL,
  premium_percent DECIMAL NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  quantity_available INTEGER DEFAULT 0,
  shipping_cost DECIMAL DEFAULT 0,
  total_cost DECIMAL GENERATED ALWAYS AS (price + shipping_cost) STORED,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, dealer_id)
);

-- Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  target_price DECIMAL,
  notify_on_drop BOOLEAN DEFAULT true,
  notify_on_availability BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('price_drop', 'back_in_stock', 'exceptional_deal')),
  threshold_price DECIMAL,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  price DECIMAL NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prices_product ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_dealer ON prices(dealer_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(product_id);
`;
