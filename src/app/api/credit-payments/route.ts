import { NextRequest, NextResponse } from 'next/server';
import { getCreditPayments, payCreditPayment } from '@/lib/data';

// GET - List credit payments with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'pending' | 'partial' | 'paid' | undefined;

    const creditPayments = await getCreditPayments({ status });

    return NextResponse.json({ success: true, data: creditPayments });
  } catch (error) {
    console.error('Error fetching credit payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch credit payments' },
      { status: 500 }
    );
  }
}

// POST - Record a payment towards a credit expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { creditPaymentId, amount, paymentMethod, date, notes } = body;

    if (!creditPaymentId || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment data. Credit payment ID and amount are required.' },
        { status: 400 }
      );
    }

    const validPaymentMethod = paymentMethod === 'card' ? 'card' : 'cash';
    const transaction = await payCreditPayment(creditPaymentId, amount, validPaymentMethod, date, notes);
    
    if (transaction) {
      return NextResponse.json({ success: true, data: transaction });
    }
    return NextResponse.json(
      { success: false, error: 'Credit payment not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error recording credit payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record credit payment' },
      { status: 500 }
    );
  }
}
