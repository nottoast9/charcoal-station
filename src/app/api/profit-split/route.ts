import { NextRequest, NextResponse } from 'next/server';
import { getProfitSplits, addProfitSplit } from '@/lib/data';

// GET - List all profit splits
export async function GET() {
  try {
    const profitSplits = await getProfitSplits();
    return NextResponse.json({ success: true, data: profitSplits });
  } catch (error) {
    console.error('Error fetching profit splits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profit splits' },
      { status: 500 }
    );
  }
}

// POST - Calculate and save profit split
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { month, year } = body;

    if (!month || !year || month < 1 || month > 12) {
      return NextResponse.json(
        { success: false, error: 'Invalid month or year' },
        { status: 400 }
      );
    }

    const profitSplit = await addProfitSplit(month, year);
    if (profitSplit) {
      return NextResponse.json({ success: true, data: profitSplit });
    }
    return NextResponse.json(
      { success: false, error: 'Profit split already exists for this month' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error adding profit split:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add profit split' },
      { status: 500 }
    );
  }
}
