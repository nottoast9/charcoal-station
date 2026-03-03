import { NextRequest, NextResponse } from 'next/server';
import { getSales, addSale } from '@/lib/data';

// GET - List sales with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const paymentMethod = searchParams.get('paymentMethod') as 'cash' | 'card' | undefined;

    const sales = await getSales({
      productId,
      startDate,
      endDate,
      month,
      year,
      paymentMethod,
    });

    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

// POST - Add new sale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity, date, time, paymentMethod } = body;

    if (!productId || typeof quantity !== 'number' || quantity <= 0 || !date) {
      return NextResponse.json(
        { success: false, error: 'Invalid sale data. Product ID, quantity, and date are required.' },
        { status: 400 }
      );
    }

    const validPaymentMethod = paymentMethod === 'card' ? 'card' : 'cash';
    const sale = await addSale(productId, quantity, date, time, validPaymentMethod);
    if (sale) {
      return NextResponse.json({ success: true, data: sale });
    }
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error adding sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add sale' },
      { status: 500 }
    );
  }
}
