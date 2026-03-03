import { NextRequest, NextResponse } from 'next/server';
import { getExpenseTypes, addExpenseType, updateExpenseType, deactivateExpenseType, updateExpenseTypeQuickAccess } from '@/lib/data';

// GET - List all expense types
export async function GET() {
  try {
    const expenseTypes = await getExpenseTypes();
    return NextResponse.json({ success: true, data: expenseTypes });
  } catch (error) {
    console.error('Error fetching expense types:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expense types' },
      { status: 500 }
    );
  }
}

// POST - Add new expense type or update existing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, action, id, default_amount, is_quick_access } = body;

    if (action === 'update' && id) {
      if (!name || !name.trim()) {
        return NextResponse.json(
          { success: false, error: 'Name is required' },
          { status: 400 }
        );
      }
      const success = await updateExpenseType(id, name.trim(), default_amount);
      if (success) {
        return NextResponse.json({ success: true, message: 'Expense type updated' });
      }
      return NextResponse.json(
        { success: false, error: 'Expense type not found' },
        { status: 404 }
      );
    }

    if (action === 'deactivate' && id) {
      const success = await deactivateExpenseType(id);
      if (success) {
        return NextResponse.json({ success: true, message: 'Expense type deactivated' });
      }
      return NextResponse.json(
        { success: false, error: 'Expense type not found' },
        { status: 404 }
      );
    }

    if (action === 'quick_access' && id) {
      const success = await updateExpenseTypeQuickAccess(id, is_quick_access, default_amount);
      if (success) {
        return NextResponse.json({ success: true, message: 'Quick access updated' });
      }
      return NextResponse.json(
        { success: false, error: 'Expense type not found' },
        { status: 404 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const expenseType = await addExpenseType(name.trim(), default_amount);
    return NextResponse.json({ success: true, data: expenseType });
  } catch (error) {
    console.error('Error with expense type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process expense type' },
      { status: 500 }
    );
  }
}
