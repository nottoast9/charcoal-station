import { NextRequest, NextResponse } from 'next/server';
import { updateProductPrice, deactivateProduct, getProductPriceHistory, updateProductQuickAccess } from '@/lib/data';

// PUT - Update product price or quick access
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { price, action, is_quick_access } = body;

    if (action === 'deactivate') {
      const success = await deactivateProduct(id);
      if (success) {
        return NextResponse.json({ success: true, message: 'Product deactivated' });
      }
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (action === 'quick_access') {
      const success = await updateProductQuickAccess(id, is_quick_access);
      if (success) {
        return NextResponse.json({ success: true, message: 'Quick access updated' });
      }
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid price' },
        { status: 400 }
      );
    }

    const success = await updateProductPrice(id, price);
    if (success) {
      return NextResponse.json({ success: true, message: 'Price updated' });
    }
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// GET - Get product price history
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const history = await getProductPriceHistory(id);
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching price history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price history' },
      { status: 500 }
    );
  }
}
