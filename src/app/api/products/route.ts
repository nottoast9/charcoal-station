import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/data';

// GET - List all products
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Add new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price } = body;

    if (!name || typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid product data. Name and valid price are required.' },
        { status: 400 }
      );
    }

    const product = await addProduct(name.trim(), price);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add product' },
      { status: 500 }
    );
  }
}
