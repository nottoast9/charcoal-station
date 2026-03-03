-- ============================================
-- Charcoal Station Business Manager
-- Supabase Database Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ID SEQUENCES TABLE
-- For generating readable sequential IDs
-- ============================================
CREATE TABLE IF NOT EXISTS id_sequences (
    id_prefix TEXT PRIMARY KEY,
    last_number INTEGER DEFAULT 0
);

-- Initialize ID sequences
INSERT INTO id_sequences (id_prefix, last_number) VALUES
    ('PRD', 0),
    ('SAL', 0),
    ('EXP', 0),
    ('EXT', 0),
    ('PFS', 0),
    ('PHS', 0),
    ('PTR', 0)
ON CONFLICT (id_prefix) DO NOTHING;

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create index for active products
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- ============================================
-- PRODUCT PRICE HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS product_price_history (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    old_price DECIMAL(10, 2) NOT NULL,
    new_price DECIMAL(10, 2) NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for product price history
CREATE INDEX IF NOT EXISTS idx_price_history_product ON product_price_history(product_id);

-- ============================================
-- EXPENSE TYPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS expense_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create index for active expense types
CREATE INDEX IF NOT EXISTS idx_expense_types_active ON expense_types(is_active);

-- ============================================
-- SALES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    time TEXT DEFAULT '00:00',
    datetime TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for sales queries
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_product ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_date_product ON sales(date, product_id);

-- ============================================
-- EXPENSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    expense_type_id TEXT NOT NULL REFERENCES expense_types(id) ON DELETE RESTRICT,
    expense_type_name TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT DEFAULT '',
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for expenses queries
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(expense_type_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date_type ON expenses(date, expense_type_id);

-- ============================================
-- PARTNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create index for active partners
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active);

-- ============================================
-- PROFIT SPLITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profit_splits (
    id TEXT PRIMARY KEY,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    total_income DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_expenses DECIMAL(12, 2) NOT NULL DEFAULT 0,
    net_profit DECIMAL(12, 2) NOT NULL DEFAULT 0,
    split_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(month, year)
);

-- Create index for profit splits by date
CREATE INDEX IF NOT EXISTS idx_profit_splits_date ON profit_splits(year DESC, month DESC);

-- ============================================
-- PARTNER SPLITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS partner_splits (
    id TEXT PRIMARY KEY,
    profit_split_id TEXT NOT NULL REFERENCES profit_splits(id) ON DELETE CASCADE,
    partner_id TEXT NOT NULL REFERENCES partners(id) ON DELETE RESTRICT,
    partner_name TEXT NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for partner splits by profit split
CREATE INDEX IF NOT EXISTS idx_partner_splits_profit ON partner_splits(profit_split_id);
CREATE INDEX IF NOT EXISTS idx_partner_splits_partner ON partner_splits(partner_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable these if you want to secure your data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE profit_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE id_sequences ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for anon key)
-- For production, you may want to restrict these based on user authentication

-- Products policies
CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on products" ON products FOR DELETE USING (true);

-- Product price history policies
CREATE POLICY "Allow public read on product_price_history" ON product_price_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert on product_price_history" ON product_price_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on product_price_history" ON product_price_history FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on product_price_history" ON product_price_history FOR DELETE USING (true);

-- Expense types policies
CREATE POLICY "Allow public read on expense_types" ON expense_types FOR SELECT USING (true);
CREATE POLICY "Allow public insert on expense_types" ON expense_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on expense_types" ON expense_types FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on expense_types" ON expense_types FOR DELETE USING (true);

-- Sales policies
CREATE POLICY "Allow public read on sales" ON sales FOR SELECT USING (true);
CREATE POLICY "Allow public insert on sales" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on sales" ON sales FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on sales" ON sales FOR DELETE USING (true);

-- Expenses policies
CREATE POLICY "Allow public read on expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow public insert on expenses" ON expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on expenses" ON expenses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on expenses" ON expenses FOR DELETE USING (true);

-- Partners policies
CREATE POLICY "Allow public read on partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Allow public insert on partners" ON partners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on partners" ON partners FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on partners" ON partners FOR DELETE USING (true);

-- Profit splits policies
CREATE POLICY "Allow public read on profit_splits" ON profit_splits FOR SELECT USING (true);
CREATE POLICY "Allow public insert on profit_splits" ON profit_splits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on profit_splits" ON profit_splits FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on profit_splits" ON profit_splits FOR DELETE USING (true);

-- Partner splits policies
CREATE POLICY "Allow public read on partner_splits" ON partner_splits FOR SELECT USING (true);
CREATE POLICY "Allow public insert on partner_splits" ON partner_splits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on partner_splits" ON partner_splits FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on partner_splits" ON partner_splits FOR DELETE USING (true);

-- ID sequences policies
CREATE POLICY "Allow public read on id_sequences" ON id_sequences FOR SELECT USING (true);
CREATE POLICY "Allow public insert on id_sequences" ON id_sequences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on id_sequences" ON id_sequences FOR UPDATE USING (true);

-- ============================================
-- HELPER FUNCTION FOR GENERATING IDs
-- ============================================
CREATE OR REPLACE FUNCTION generate_sequential_id(prefix TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_number INTEGER;
    new_id TEXT;
BEGIN
    -- Insert or update the sequence
    INSERT INTO id_sequences (id_prefix, last_number)
    VALUES (prefix, 1)
    ON CONFLICT (id_prefix)
    DO UPDATE SET last_number = id_sequences.last_number + 1
    RETURNING last_number INTO new_number;

    -- Format the ID with leading zeros (e.g., PRD-00001)
    new_id := prefix || '-' || LPAD(new_number::TEXT, 5, '0');

    RETURN new_id;
END;
$$;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample products
-- INSERT INTO products (id, name, price) VALUES
--     ('PRD-00001', 'Charcoal Bag (5kg)', 15.00),
--     ('PRD-00002', 'Charcoal Bag (10kg)', 28.00),
--     ('PRD-00003', 'Charcoal Bulk (50kg)', 120.00);

-- Sample expense types
-- INSERT INTO expense_types (id, name) VALUES
--     ('EXT-00001', 'Charcoal Purchase'),
--     ('EXT-00002', 'Transport'),
--     ('EXT-00003', 'Packaging'),
--     ('EXT-00004', 'Utilities');

-- Sample partners
-- INSERT INTO partners (id, name, percentage) VALUES
--     ('PTR-00001', 'Partner A', 60.00),
--     ('PTR-00002', 'Partner B', 40.00);

-- ============================================
-- COMPLETE! Your database is ready.
-- ============================================
