/**
 * Data Management Layer with Supabase Integration
 *
 * This module provides business logic for all data operations using Supabase.
 * Uses sequential IDs for better readability (e.g., PRD-00001, SAL-00001)
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { getTimestampSL, formatDateSL } from './date-utils';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  created_at: string;
  is_active: boolean;
  is_quick_access: boolean;
}

export interface ProductPriceHistory {
  id: string;
  product_id: string;
  old_price: number;
  new_price: number;
  changed_at: string;
}

export interface ExpenseType {
  id: string;
  name: string;
  created_at: string;
  is_active: boolean;
  is_quick_access: boolean;
  default_amount: number;
}

export interface Sale {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  date: string;
  time: string;
  datetime: string;
  payment_method: 'cash' | 'card';
  created_at: string;
}

export interface Expense {
  id: string;
  expense_type_id: string;
  expense_type_name: string;
  amount: number;
  description: string;
  date: string;
  payment_method: 'cash' | 'card' | 'credit';
  created_at: string;
}

export interface CreditPayment {
  id: string;
  expense_id: string;
  original_amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: 'pending' | 'partial' | 'paid';
  created_at: string;
  updated_at: string;
  expense?: Expense;
}

export interface CreditPaymentTransaction {
  id: string;
  credit_payment_id: string;
  amount: number;
  payment_method: 'cash' | 'card';
  date: string;
  notes: string;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  percentage: number;
  created_at: string;
  is_active: boolean;
}

export interface PartnerSplit {
  id: string;
  profit_split_id: string;
  partner_id: string;
  partner_name: string;
  percentage: number;
  amount: number;
  created_at: string;
}

export interface ProfitSplit {
  id: string;
  month: number;
  year: number;
  total_income: number;
  total_expenses: number;
  net_profit: number;
  split_date: string;
  created_at: string;
  partner_splits?: PartnerSplit[];
}

export interface DashboardData {
  totalSales: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  salesByProduct: { name: string; value: number }[];
  expensesByType: { name: string; value: number }[];
  monthlySales: { date: string; amount: number }[];
  monthlyIncome: { date: string; amount: number }[];
  monthlyExpenses: { date: string; amount: number }[];
  monthlyProfit: { date: string; amount: number }[];
  cashSales: number;
  cardSales: number;
  cashExpenses: number;
  cardExpenses: number;
  creditExpenses: number;
  pendingCredits: number;
}

// ID prefix mapping
const ID_PREFIXES = {
  PRODUCT: 'PRD',
  SALE: 'SAL',
  EXPENSE: 'EXP',
  EXPENSE_TYPE: 'EXT',
  PROFIT_SPLIT: 'PFS',
  PRICE_HISTORY: 'PHS',
  PARTNER: 'PTR',
  CREDIT_PAYMENT: 'CRD',
  CREDIT_TRANSACTION: 'CPT',
} as const;

// Generate sequential ID using database function
async function generateId(type: keyof typeof ID_PREFIXES): Promise<string> {
  const prefix = ID_PREFIXES[type];

  const { data, error } = await supabase.rpc('generate_sequential_id', { prefix });

  if (error) {
    console.error('Error generating ID:', error);
    // Fallback to timestamp-based ID
    return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
  }

  return data;
}

// Get timestamp in Sri Lankan time
function getTimestamp(): string {
  return getTimestampSL();
}

// Format date in Sri Lankan timezone
function formatDateISO(date?: Date): string {
  return formatDateSL(date);
}

// Check if Supabase is configured
export function isUsingSupabase(): boolean {
  return isSupabaseConfigured();
}

// ==================== PRODUCTS ====================

/**
 * Returns all active products
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

/**
 * Returns all products (including inactive)
 */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }

  return data || [];
}

/**
 * Returns quick access products
 */
export async function getQuickAccessProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_quick_access', true)
    .order('name');

  if (error) {
    console.error('Error fetching quick access products:', error);
    return [];
  }

  return data || [];
}

/**
 * Adds a new product
 */
export async function addProduct(name: string, price: number): Promise<Product> {
  const id = await generateId('PRODUCT');
  const timestamp = getTimestamp();

  const { data, error } = await supabase
    .from('products')
    .insert({
      id,
      name,
      price,
      created_at: timestamp,
      is_active: true,
      is_quick_access: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }

  return data;
}

/**
 * Updates product price and records history
 */
export async function updateProductPrice(id: string, newPrice: number): Promise<boolean> {
  // Get current product
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (fetchError || !product) {
    return false;
  }

  const oldPrice = product.price;

  // Record price history
  const historyId = await generateId('PRICE_HISTORY');
  const { error: historyError } = await supabase
    .from('product_price_history')
    .insert({
      id: historyId,
      product_id: id,
      old_price: oldPrice,
      new_price: newPrice,
      changed_at: getTimestamp(),
    });

  if (historyError) {
    console.error('Error recording price history:', historyError);
  }

  // Update product price
  const { error: updateError } = await supabase
    .from('products')
    .update({ price: newPrice })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating product price:', updateError);
    return false;
  }

  return true;
}

/**
 * Updates product quick access status
 */
export async function updateProductQuickAccess(id: string, isQuickAccess: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update({ is_quick_access: isQuickAccess })
    .eq('id', id);

  if (error) {
    console.error('Error updating product quick access:', error);
    return false;
  }

  return true;
}

/**
 * Deactivates a product
 */
export async function deactivateProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deactivating product:', error);
    return false;
  }

  return true;
}

/**
 * Gets product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Gets price history for a product
 */
export async function getProductPriceHistory(productId: string): Promise<ProductPriceHistory[]> {
  const { data, error } = await supabase
    .from('product_price_history')
    .select('*')
    .eq('product_id', productId)
    .order('changed_at', { ascending: false });

  if (error) {
    console.error('Error fetching price history:', error);
    return [];
  }

  return data || [];
}

// ==================== EXPENSE TYPES ====================

/**
 * Returns all active expense types
 */
export async function getExpenseTypes(): Promise<ExpenseType[]> {
  const { data, error } = await supabase
    .from('expense_types')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching expense types:', error);
    return [];
  }

  return data || [];
}

/**
 * Returns all expense types (including inactive)
 */
export async function getAllExpenseTypes(): Promise<ExpenseType[]> {
  const { data, error } = await supabase
    .from('expense_types')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all expense types:', error);
    return [];
  }

  return data || [];
}

/**
 * Returns quick access expense types
 */
export async function getQuickAccessExpenseTypes(): Promise<ExpenseType[]> {
  const { data, error } = await supabase
    .from('expense_types')
    .select('*')
    .eq('is_active', true)
    .eq('is_quick_access', true)
    .order('name');

  if (error) {
    console.error('Error fetching quick access expense types:', error);
    return [];
  }

  return data || [];
}

/**
 * Adds a new expense type
 */
export async function addExpenseType(name: string, defaultAmount?: number): Promise<ExpenseType> {
  const id = await generateId('EXPENSE_TYPE');
  const timestamp = getTimestamp();

  const { data, error } = await supabase
    .from('expense_types')
    .insert({
      id,
      name,
      created_at: timestamp,
      is_active: true,
      is_quick_access: false,
      default_amount: defaultAmount || 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding expense type:', error);
    throw error;
  }

  return data;
}

/**
 * Updates an expense type
 */
export async function updateExpenseType(id: string, name: string, defaultAmount?: number): Promise<boolean> {
  const updateData: { name: string; default_amount?: number } = { name };
  if (defaultAmount !== undefined) {
    updateData.default_amount = defaultAmount;
  }

  const { error } = await supabase
    .from('expense_types')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating expense type:', error);
    return false;
  }

  return true;
}

/**
 * Updates expense type quick access status
 */
export async function updateExpenseTypeQuickAccess(id: string, isQuickAccess: boolean, defaultAmount?: number): Promise<boolean> {
  const updateData: { is_quick_access: boolean; default_amount?: number } = { is_quick_access: isQuickAccess };
  if (defaultAmount !== undefined) {
    updateData.default_amount = defaultAmount;
  }

  const { error } = await supabase
    .from('expense_types')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating expense type quick access:', error);
    return false;
  }

  return true;
}

/**
 * Deactivates an expense type
 */
export async function deactivateExpenseType(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('expense_types')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deactivating expense type:', error);
    return false;
  }

  return true;
}

/**
 * Gets expense type by ID
 */
export async function getExpenseTypeById(id: string): Promise<ExpenseType | null> {
  const { data, error } = await supabase
    .from('expense_types')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    return null;
  }

  return data;
}

// ==================== SALES ====================

/**
 * Returns sales with optional filters
 */
export async function getSales(filters?: {
  productId?: string;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  paymentMethod?: 'cash' | 'card';
}): Promise<Sale[]> {
  let query = supabase
    .from('sales')
    .select('*');

  if (filters) {
    if (filters.productId) {
      query = query.eq('product_id', filters.productId);
    }

    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }

    if (filters.month !== undefined && filters.year !== undefined) {
      const startDate = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`;
      const endDate = new Date(filters.year, filters.month, 0);
      const endDateStr = `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
      query = query.gte('date', startDate).lte('date', endDateStr);
    }

    if (filters.paymentMethod) {
      query = query.eq('payment_method', filters.paymentMethod);
    }
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    console.error('Error fetching sales:', error);
    return [];
  }

  return data || [];
}

/**
 * Adds a new sale with time and payment method support
 */
export async function addSale(
  productId: string,
  quantity: number,
  date: string,
  time?: string,
  paymentMethod: 'cash' | 'card' = 'cash'
): Promise<Sale | null> {
  const product = await getProductById(productId);

  if (!product) {
    return null;
  }

  const id = await generateId('SALE');
  const totalAmount = product.price * quantity;
  const timestamp = getTimestamp();

  // Use provided time or current Sri Lankan time
  const saleTime = time || timestamp.split(' ')[1]?.substring(0, 5) || '00:00';
  const datetime = `${date} ${saleTime}:00`;

  const { data, error } = await supabase
    .from('sales')
    .insert({
      id,
      product_id: productId,
      product_name: product.name,
      quantity,
      unit_price: product.price,
      total_amount: totalAmount,
      date,
      time: saleTime,
      datetime,
      payment_method: paymentMethod,
      created_at: timestamp,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding sale:', error);
    return null;
  }

  return data;
}

// ==================== EXPENSES ====================

/**
 * Returns expenses with optional filters
 */
export async function getExpenses(filters?: {
  expenseTypeId?: string;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  paymentMethod?: 'cash' | 'card' | 'credit';
}): Promise<Expense[]> {
  let query = supabase
    .from('expenses')
    .select('*');

  if (filters) {
    if (filters.expenseTypeId) {
      query = query.eq('expense_type_id', filters.expenseTypeId);
    }

    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }

    if (filters.month !== undefined && filters.year !== undefined) {
      const startDate = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`;
      const endDate = new Date(filters.year, filters.month, 0);
      const endDateStr = `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
      query = query.gte('date', startDate).lte('date', endDateStr);
    }

    if (filters.paymentMethod) {
      query = query.eq('payment_method', filters.paymentMethod);
    }
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }

  return data || [];
}

/**
 * Adds a new expense with payment method support
 */
export async function addExpense(
  expenseTypeId: string,
  amount: number,
  description: string,
  date: string,
  paymentMethod: 'cash' | 'card' | 'credit' = 'cash'
): Promise<Expense | null> {
  const expenseType = await getExpenseTypeById(expenseTypeId);

  if (!expenseType) {
    return null;
  }

  const id = await generateId('EXPENSE');
  const timestamp = getTimestamp();

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      id,
      expense_type_id: expenseTypeId,
      expense_type_name: expenseType.name,
      amount,
      description,
      date,
      payment_method: paymentMethod,
      created_at: timestamp,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding expense:', error);
    return null;
  }

  // If credit payment, create a credit payment record
  if (paymentMethod === 'credit') {
    await createCreditPayment(id, amount);
  }

  return data;
}

// ==================== CREDIT PAYMENTS ====================

/**
 * Creates a new credit payment record
 */
export async function createCreditPayment(expenseId: string, amount: number): Promise<CreditPayment | null> {
  const id = await generateId('CREDIT_PAYMENT');
  const timestamp = getTimestamp();

  const { data, error } = await supabase
    .from('credit_payments')
    .insert({
      id,
      expense_id: expenseId,
      original_amount: amount,
      paid_amount: 0,
      remaining_amount: amount,
      status: 'pending',
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating credit payment:', error);
    return null;
  }

  return data;
}

/**
 * Returns all credit payments with optional filters
 */
export async function getCreditPayments(filters?: {
  status?: 'pending' | 'partial' | 'paid';
}): Promise<CreditPayment[]> {
  let query = supabase
    .from('credit_payments')
    .select(`
      *,
      expense:expenses(*)
    `);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching credit payments:', error);
    return [];
  }

  return data || [];
}

/**
 * Returns pending credit payments (unpaid or partially paid)
 */
export async function getPendingCreditPayments(): Promise<CreditPayment[]> {
  return getCreditPayments({ status: 'pending' });
}

/**
 * Records a payment towards a credit expense
 */
export async function payCreditPayment(
  creditPaymentId: string,
  amount: number,
  paymentMethod: 'cash' | 'card' = 'cash',
  date?: string,
  notes?: string
): Promise<CreditPaymentTransaction | null> {
  // Get current credit payment
  const { data: creditPayment, error: fetchError } = await supabase
    .from('credit_payments')
    .select('*')
    .eq('id', creditPaymentId)
    .single();

  if (fetchError || !creditPayment) {
    return null;
  }

  // Create transaction record
  const transactionId = await generateId('CREDIT_TRANSACTION');
  const timestamp = getTimestamp();
  const paymentDate = date || formatDateISO();

  const { data: transaction, error: transactionError } = await supabase
    .from('credit_payment_transactions')
    .insert({
      id: transactionId,
      credit_payment_id: creditPaymentId,
      amount,
      payment_method: paymentMethod,
      date: paymentDate,
      notes: notes || '',
      created_at: timestamp,
    })
    .select()
    .single();

  if (transactionError) {
    console.error('Error creating credit payment transaction:', transactionError);
    return null;
  }

  // Update credit payment
  const newPaidAmount = creditPayment.paid_amount + amount;
  const newRemainingAmount = creditPayment.original_amount - newPaidAmount;
  let newStatus: 'pending' | 'partial' | 'paid' = 'pending';

  if (newRemainingAmount <= 0) {
    newStatus = 'paid';
  } else if (newPaidAmount > 0) {
    newStatus = 'partial';
  }

  const { error: updateError } = await supabase
    .from('credit_payments')
    .update({
      paid_amount: newPaidAmount,
      remaining_amount: Math.max(0, newRemainingAmount),
      status: newStatus,
      updated_at: timestamp,
    })
    .eq('id', creditPaymentId);

  if (updateError) {
    console.error('Error updating credit payment:', updateError);
    return null;
  }

  return transaction;
}

/**
 * Gets all transactions for a credit payment
 */
export async function getCreditPaymentTransactions(creditPaymentId: string): Promise<CreditPaymentTransaction[]> {
  const { data, error } = await supabase
    .from('credit_payment_transactions')
    .select('*')
    .eq('credit_payment_id', creditPaymentId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching credit payment transactions:', error);
    return [];
  }

  return data || [];
}

// ==================== PARTNERS ====================

/**
 * Returns all active partners
 */
export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching partners:', error);
    return [];
  }

  return data || [];
}

/**
 * Returns all partners (including inactive)
 */
export async function getAllPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all partners:', error);
    return [];
  }

  return data || [];
}

/**
 * Adds a new partner
 */
export async function addPartner(name: string, percentage: number): Promise<Partner | null> {
  // Validate total percentage doesn't exceed 100%
  const partners = await getPartners();
  const totalPercentage = partners.reduce((sum, p) => sum + p.percentage, 0);

  if (totalPercentage + percentage > 100) {
    return null; // Would exceed 100%
  }

  const id = await generateId('PARTNER');
  const timestamp = getTimestamp();

  const { data, error } = await supabase
    .from('partners')
    .insert({
      id,
      name,
      percentage,
      created_at: timestamp,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding partner:', error);
    return null;
  }

  return data;
}

/**
 * Updates a partner
 */
export async function updatePartner(id: string, name: string, percentage: number): Promise<boolean> {
  // Validate total percentage doesn't exceed 100%
  const partners = await getPartners();
  const otherPartnersTotal = partners
    .filter(p => p.id !== id)
    .reduce((sum, p) => sum + p.percentage, 0);

  if (otherPartnersTotal + percentage > 100) {
    return false; // Would exceed 100%
  }

  const { error } = await supabase
    .from('partners')
    .update({ name, percentage })
    .eq('id', id);

  if (error) {
    console.error('Error updating partner:', error);
    return false;
  }

  return true;
}

/**
 * Deactivates a partner
 */
export async function deactivatePartner(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('partners')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deactivating partner:', error);
    return false;
  }

  return true;
}

/**
 * Gets partner by ID
 */
export async function getPartnerById(id: string): Promise<Partner | null> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    return null;
  }

  return data;
}

// ==================== PROFIT SPLITS ====================

/**
 * Returns all profit splits with partner splits
 */
export async function getProfitSplits(): Promise<ProfitSplit[]> {
  const { data: splits, error: splitsError } = await supabase
    .from('profit_splits')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (splitsError) {
    console.error('Error fetching profit splits:', splitsError);
    return [];
  }

  if (!splits || splits.length === 0) {
    return [];
  }

  // Get all partner splits for these profit splits
  const splitIds = splits.map(s => s.id);
  const { data: partnerSplits, error: partnerSplitsError } = await supabase
    .from('partner_splits')
    .select('*')
    .in('profit_split_id', splitIds);

  if (partnerSplitsError) {
    console.error('Error fetching partner splits:', partnerSplitsError);
  }

  // Attach partner splits to each profit split
  return splits.map(split => ({
    ...split,
    partner_splits: (partnerSplits || []).filter(ps => ps.profit_split_id === split.id),
  }));
}

/**
 * Calculates and records profit split for a month with partner distribution
 */
export async function addProfitSplit(month: number, year: number): Promise<ProfitSplit | null> {
  // Check if split already exists for this month/year
  const { data: existing, error: checkError } = await supabase
    .from('profit_splits')
    .select('*')
    .eq('month', month)
    .eq('year', year)
    .single();

  if (existing) {
    return null; // Already split for this month
  }

  // Get partners
  const partners = await getPartners();

  if (partners.length === 0) {
    return null; // No partners configured
  }

  // Calculate totals for the month
  const sales = await getSales({ month, year });
  const expenses = await getExpenses({ month, year });

  const totalIncome = sales.reduce((sum, s) => sum + s.total_amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const id = await generateId('PROFIT_SPLIT');
  const splitDate = formatDateISO(new Date());
  const timestamp = getTimestamp();

  // Record main profit split
  const { error: splitError } = await supabase
    .from('profit_splits')
    .insert({
      id,
      month,
      year,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      net_profit: netProfit,
      split_date: splitDate,
      created_at: timestamp,
    });

  if (splitError) {
    console.error('Error creating profit split:', splitError);
    return null;
  }

  // Record partner splits
  const partnerSplits: PartnerSplit[] = [];

  for (const partner of partners) {
    const partnerAmount = (netProfit * partner.percentage) / 100;
    const partnerSplitId = `${id}-${partner.id}`;

    const { error: psError } = await supabase
      .from('partner_splits')
      .insert({
        id: partnerSplitId,
        profit_split_id: id,
        partner_id: partner.id,
        partner_name: partner.name,
        percentage: partner.percentage,
        amount: partnerAmount,
        created_at: timestamp,
      });

    if (psError) {
      console.error('Error creating partner split:', psError);
    } else {
      partnerSplits.push({
        id: partnerSplitId,
        profit_split_id: id,
        partner_id: partner.id,
        partner_name: partner.name,
        percentage: partner.percentage,
        amount: partnerAmount,
        created_at: timestamp,
      });
    }
  }

  return {
    id,
    month,
    year,
    total_income: totalIncome,
    total_expenses: totalExpenses,
    net_profit: netProfit,
    split_date: splitDate,
    created_at: timestamp,
    partner_splits: partnerSplits,
  };
}

// ==================== DASHBOARD ====================

/**
 * Returns aggregated data for dashboard
 */
export async function getDashboardData(month?: number, year?: number): Promise<DashboardData> {
  const now = new Date();
  const targetMonth = month ?? (now.getMonth() + 1);
  const targetYear = year ?? now.getFullYear();

  const sales = await getSales({ month: targetMonth, year: targetYear });
  const expenses = await getExpenses({ month: targetMonth, year: targetYear });

  const totalIncome = sales.reduce((sum, s) => sum + s.total_amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Payment method breakdown
  const cashSales = sales.filter(s => s.payment_method === 'cash').reduce((sum, s) => sum + s.total_amount, 0);
  const cardSales = sales.filter(s => s.payment_method === 'card').reduce((sum, s) => sum + s.total_amount, 0);
  const cashExpenses = expenses.filter(e => e.payment_method === 'cash').reduce((sum, e) => sum + e.amount, 0);
  const cardExpenses = expenses.filter(e => e.payment_method === 'card').reduce((sum, e) => sum + e.amount, 0);
  const creditExpenses = expenses.filter(e => e.payment_method === 'credit').reduce((sum, e) => sum + e.amount, 0);

  // Pending credits
  const pendingCredits = await getCreditPayments({ status: 'pending' });
  const pendingCreditsTotal = pendingCredits.reduce((sum, c) => sum + c.remaining_amount, 0);

  // Sales by product
  const productSales: { [key: string]: number } = {};
  sales.forEach(s => {
    productSales[s.product_name] = (productSales[s.product_name] || 0) + s.total_amount;
  });
  const salesByProduct = Object.entries(productSales).map(([name, value]) => ({ name, value }));

  // Expenses by type
  const typeExpenses: { [key: string]: number } = {};
  expenses.forEach(e => {
    typeExpenses[e.expense_type_name] = (typeExpenses[e.expense_type_name] || 0) + e.amount;
  });
  const expensesByType = Object.entries(typeExpenses).map(([name, value]) => ({ name, value }));

  // Monthly data for charts (last 6 months)
  const monthlySales: { date: string; amount: number }[] = [];
  const monthlyIncome: { date: string; amount: number }[] = [];
  const monthlyExpenses: { date: string; amount: number }[] = [];
  const monthlyProfit: { date: string; amount: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(targetYear, targetMonth - 1, 1);
    d.setMonth(d.getMonth() - i);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();

    const monthSales = await getSales({ month: m, year: y });
    const monthExpenses = await getExpenses({ month: m, year: y });

    const income = monthSales.reduce((sum, s) => sum + s.total_amount, 0);
    const exp = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = income - exp;

    const dateLabel = `${y}-${String(m).padStart(2, '0')}`;

    monthlySales.push({ date: dateLabel, amount: monthSales.length });
    monthlyIncome.push({ date: dateLabel, amount: income });
    monthlyExpenses.push({ date: dateLabel, amount: exp });
    monthlyProfit.push({ date: dateLabel, amount: profit });
  }

  return {
    totalSales: sales.length,
    totalIncome,
    totalExpenses,
    netProfit,
    salesByProduct,
    expensesByType,
    monthlySales,
    monthlyIncome,
    monthlyExpenses,
    monthlyProfit,
    cashSales,
    cardSales,
    cashExpenses,
    cardExpenses,
    creditExpenses,
    pendingCredits: pendingCreditsTotal,
  };
}

// ==================== EXPORT ====================

/**
 * Returns all data for export
 */
export async function getAllDataForExport() {
  return {
    products: await getAllProducts(),
    productPriceHistory: await getAllProductPriceHistory(),
    expenseTypes: await getAllExpenseTypes(),
    partners: await getAllPartners(),
    sales: await getSales(),
    expenses: await getExpenses(),
    profitSplits: await getProfitSplits(),
    creditPayments: await getCreditPayments(),
  };
}

/**
 * Get all price history
 */
async function getAllProductPriceHistory(): Promise<ProductPriceHistory[]> {
  const { data, error } = await supabase
    .from('product_price_history')
    .select('*')
    .order('changed_at', { ascending: false });

  if (error) {
    console.error('Error fetching all price history:', error);
    return [];
  }

  return data || [];
}
