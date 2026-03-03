-- ============================================
-- Charcoal Station Business Manager
-- Supabase Database Schema - Version 2
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This adds payment methods, credit tracking, and quick access
-- ============================================

-- ============================================
-- ADD PAYMENT METHOD TO SALES TABLE
-- ============================================
ALTER TABLE sales ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card'));

-- Create index for payment method queries
CREATE INDEX IF NOT EXISTS idx_sales_payment_method ON sales(payment_method);

-- ============================================
-- ADD PAYMENT METHOD TO EXPENSES TABLE
-- ============================================
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'credit'));

-- Create index for payment method queries
CREATE INDEX IF NOT EXISTS idx_expenses_payment_method ON expenses(payment_method);

-- ============================================
-- CREDIT PAYMENTS TABLE
-- For tracking credit expenses that need to be paid later
-- ============================================
CREATE TABLE IF NOT EXISTS credit_payments (
    id TEXT PRIMARY KEY,
    expense_id TEXT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    original_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    remaining_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for credit payments
CREATE INDEX IF NOT EXISTS idx_credit_payments_expense ON credit_payments(expense_id);
CREATE INDEX IF NOT EXISTS idx_credit_payments_status ON credit_payments(status);

-- ============================================
-- CREDIT PAYMENT TRANSACTIONS TABLE
-- For tracking individual payments made towards credit
-- ============================================
CREATE TABLE IF NOT EXISTS credit_payment_transactions (
    id TEXT PRIMARY KEY,
    credit_payment_id TEXT NOT NULL REFERENCES credit_payments(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card')),
    date DATE NOT NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for credit payment transactions
CREATE INDEX IF NOT EXISTS idx_credit_payment_transactions_credit ON credit_payment_transactions(credit_payment_id);

-- ============================================
-- ADD QUICK ACCESS TO PRODUCTS TABLE
-- ============================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_quick_access BOOLEAN DEFAULT false;

-- Create index for quick access products
CREATE INDEX IF NOT EXISTS idx_products_quick_access ON products(is_quick_access) WHERE is_quick_access = true;

-- ============================================
-- ADD QUICK ACCESS TO EXPENSE TYPES TABLE
-- ============================================
ALTER TABLE expense_types ADD COLUMN IF NOT EXISTS is_quick_access BOOLEAN DEFAULT false;
ALTER TABLE expense_types ADD COLUMN IF NOT EXISTS default_amount DECIMAL(10, 2) DEFAULT 0;

-- Create index for quick access expense types
CREATE INDEX IF NOT EXISTS idx_expense_types_quick_access ON expense_types(is_quick_access) WHERE is_quick_access = true;

-- ============================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE credit_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_payment_transactions ENABLE ROW LEVEL SECURITY;

-- Credit payments policies
CREATE POLICY "Allow public read on credit_payments" ON credit_payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on credit_payments" ON credit_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on credit_payments" ON credit_payments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on credit_payments" ON credit_payments FOR DELETE USING (true);

-- Credit payment transactions policies
CREATE POLICY "Allow public read on credit_payment_transactions" ON credit_payment_transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on credit_payment_transactions" ON credit_payment_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on credit_payment_transactions" ON credit_payment_transactions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on credit_payment_transactions" ON credit_payment_transactions FOR DELETE USING (true);

-- ============================================
-- ADD CREDIT PREFIX TO ID SEQUENCES
-- ============================================
INSERT INTO id_sequences (id_prefix, last_number) VALUES
    ('CRD', 0),
    ('CPT', 0)
ON CONFLICT (id_prefix) DO NOTHING;

-- ============================================
-- COMPLETE! Your database is updated.
-- ============================================
