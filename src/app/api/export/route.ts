import { NextResponse } from 'next/server';
import { getAllDataForExport } from '@/lib/data';

// GET - Export all data as separate CSV files (zipped)
export async function GET() {
  try {
    const data = await getAllDataForExport();

    // Create individual CSV content for each file
    const csvFiles: { name: string; content: string }[] = [];

    // Partners CSV
    let partnersCSV = 'id,name,percentage,created_at,is_active\n';
    data.partners.forEach((p: { id: string; name: string; percentage: number; created_at: string; is_active: boolean | string }) => {
      const isActive = typeof p.is_active === 'boolean' ? p.is_active : p.is_active === 'true';
      partnersCSV += `${p.id},${p.name},${p.percentage},${p.created_at},${isActive}\n`;
    });
    csvFiles.push({ name: 'partners.csv', content: partnersCSV });

    // Products CSV
    let productsCSV = 'id,name,price,created_at,is_active\n';
    data.products.forEach((p: { id: string; name: string; price: number; created_at: string; is_active: boolean | string }) => {
      const isActive = typeof p.is_active === 'boolean' ? p.is_active : p.is_active === 'true';
      productsCSV += `${p.id},${p.name},${p.price},${p.created_at},${isActive}\n`;
    });
    csvFiles.push({ name: 'products.csv', content: productsCSV });

    // Product Price History CSV
    let priceHistoryCSV = 'id,product_id,old_price,new_price,changed_at\n';
    data.productPriceHistory.forEach((h: { id: string; product_id: string; old_price: number | string; new_price: number | string; changed_at: string }) => {
      priceHistoryCSV += `${h.id},${h.product_id},${h.old_price},${h.new_price},${h.changed_at}\n`;
    });
    csvFiles.push({ name: 'product_price_history.csv', content: priceHistoryCSV });

    // Expense Types CSV
    let expenseTypesCSV = 'id,name,created_at,is_active\n';
    data.expenseTypes.forEach((e: { id: string; name: string; created_at: string; is_active: boolean | string }) => {
      const isActive = typeof e.is_active === 'boolean' ? e.is_active : e.is_active === 'true';
      expenseTypesCSV += `${e.id},${e.name},${e.created_at},${isActive}\n`;
    });
    csvFiles.push({ name: 'expense_types.csv', content: expenseTypesCSV });

    // Sales CSV (with time columns)
    let salesCSV = 'id,product_id,product_name,quantity,unit_price,total_amount,date,time,datetime,created_at\n';
    data.sales.forEach((s: { id: string; product_id: string; product_name: string; quantity: number; unit_price: number; total_amount: number; date: string; time?: string; datetime?: string; created_at: string }) => {
      const time = s.time || '';
      const datetime = s.datetime || '';
      salesCSV += `${s.id},${s.product_id},${s.product_name},${s.quantity},${s.unit_price},${s.total_amount},${s.date},${time},${datetime},${s.created_at}\n`;
    });
    csvFiles.push({ name: 'sales.csv', content: salesCSV });

    // Expenses CSV
    let expensesCSV = 'id,expense_type_id,expense_type_name,amount,description,date,created_at\n';
    data.expenses.forEach((e: { id: string; expense_type_id: string; expense_type_name: string; amount: number; description: string; date: string; created_at: string }) => {
      expensesCSV += `${e.id},${e.expense_type_id},${e.expense_type_name},${e.amount},"${e.description}",${e.date},${e.created_at}\n`;
    });
    csvFiles.push({ name: 'expenses.csv', content: expensesCSV });

    // Profit Splits CSV
    let profitSplitsCSV = 'id,month,year,total_income,total_expenses,net_profit,split_date,created_at\n';
    data.profitSplits.forEach((p: { id: string; month: number; year: number; total_income: number; total_expenses: number; net_profit: number; split_date: string; created_at: string }) => {
      profitSplitsCSV += `${p.id},${p.month},${p.year},${p.total_income},${p.total_expenses},${p.net_profit},${p.split_date},${p.created_at}\n`;
    });
    csvFiles.push({ name: 'profit_splits.csv', content: profitSplitsCSV });

    // Partner Splits CSV
    let partnerSplitsCSV = 'id,profit_split_id,partner_id,partner_name,percentage,amount,created_at\n';
    data.profitSplits.forEach((p: { partner_splits?: { id: string; profit_split_id: string; partner_id: string; partner_name: string; percentage: number; amount: number; created_at: string }[] }) => {
      if (p.partner_splits) {
        p.partner_splits.forEach((ps) => {
          partnerSplitsCSV += `${ps.id},${ps.profit_split_id},${ps.partner_id},${ps.partner_name},${ps.percentage},${ps.amount},${ps.created_at}\n`;
        });
      }
    });
    csvFiles.push({ name: 'partner_splits.csv', content: partnerSplitsCSV });

    // Return as JSON with all files - client will create the zip
    const exportData = {
      exportedAt: new Date().toISOString(),
      files: csvFiles
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
