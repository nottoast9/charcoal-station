import { NextRequest, NextResponse } from 'next/server';
import { getExpenses, addExpense } from '@/lib/data';

// GET - List expenses with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const expenseTypeId = searchParams.get('expenseTypeId') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const paymentMethod = searchParams.get('paymentMethod') as 'cash' | 'card' | 'credit' | undefined;

    const expenses = await getExpenses({
      expenseTypeId,
      startDate,
      endDate,
      month,
      year,
      paymentMethod,
    });

    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

// POST - Add new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expenseTypeId, amount, description, date, paymentMethod } = body;

    if (!expenseTypeId || typeof amount !== 'number' || amount <= 0 || !date) {
      return NextResponse.json(
        { success: false, error: 'Invalid expense data. Expense type ID, amount, and date are required.' },
        { status: 400 }
      );
    }

    const validPaymentMethod = (paymentMethod === 'card' || paymentMethod === 'credit') ? paymentMethod : 'cash';
    const expense = await addExpense(expenseTypeId, amount, description || '', date, validPaymentMethod);
    if (expense) {
      return NextResponse.json({ success: true, data: expense });
    }
    return NextResponse.json(
      { success: false, error: 'Expense type not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add expense' },
      { status: 500 }
    );
  }
}
