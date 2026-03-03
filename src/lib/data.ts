/**
 * Data Layer - Supabase Only
 *
 * This module provides all data operations using Supabase.
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.
 */

import * as supabaseData from './data-supabase';

// Re-export types
export type {
  Product,
  ProductPriceHistory,
  ExpenseType,
  Sale,
  Expense,
  CreditPayment,
  CreditPaymentTransaction,
  Partner,
  PartnerSplit,
  ProfitSplit,
  DashboardData,
} from './data-supabase';

// ==================== PRODUCTS ====================

export const getProducts = supabaseData.getProducts;
export const getAllProducts = supabaseData.getAllProducts;
export const getQuickAccessProducts = supabaseData.getQuickAccessProducts;
export const addProduct = supabaseData.addProduct;
export const updateProductPrice = supabaseData.updateProductPrice;
export const updateProductQuickAccess = supabaseData.updateProductQuickAccess;
export const deactivateProduct = supabaseData.deactivateProduct;
export const getProductById = supabaseData.getProductById;
export const getProductPriceHistory = supabaseData.getProductPriceHistory;

// ==================== EXPENSE TYPES ====================

export const getExpenseTypes = supabaseData.getExpenseTypes;
export const getAllExpenseTypes = supabaseData.getAllExpenseTypes;
export const getQuickAccessExpenseTypes = supabaseData.getQuickAccessExpenseTypes;
export const addExpenseType = supabaseData.addExpenseType;
export const updateExpenseType = supabaseData.updateExpenseType;
export const updateExpenseTypeQuickAccess = supabaseData.updateExpenseTypeQuickAccess;
export const deactivateExpenseType = supabaseData.deactivateExpenseType;
export const getExpenseTypeById = supabaseData.getExpenseTypeById;

// ==================== SALES ====================

export const getSales = supabaseData.getSales;
export const addSale = supabaseData.addSale;

// ==================== EXPENSES ====================

export const getExpenses = supabaseData.getExpenses;
export const addExpense = supabaseData.addExpense;

// ==================== CREDIT PAYMENTS ====================

export const getCreditPayments = supabaseData.getCreditPayments;
export const payCreditPayment = supabaseData.payCreditPayment;
export const getCreditPaymentTransactions = supabaseData.getCreditPaymentTransactions;

// ==================== PARTNERS ====================

export const getPartners = supabaseData.getPartners;
export const getAllPartners = supabaseData.getAllPartners;
export const addPartner = supabaseData.addPartner;
export const updatePartner = supabaseData.updatePartner;
export const deactivatePartner = supabaseData.deactivatePartner;
export const getPartnerById = supabaseData.getPartnerById;

// ==================== PROFIT SPLITS ====================

export const getProfitSplits = supabaseData.getProfitSplits;
export const addProfitSplit = supabaseData.addProfitSplit;

// ==================== DASHBOARD ====================

export const getDashboardData = supabaseData.getDashboardData;

// ==================== EXPORT ====================

export const getAllDataForExport = supabaseData.getAllDataForExport;

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return supabaseData.isUsingSupabase();
}
