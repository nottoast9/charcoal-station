import { NextRequest, NextResponse } from 'next/server';
import { getPartners, addPartner, updatePartner, deactivatePartner } from '@/lib/data';

// GET - List all partners
export async function GET() {
  try {
    const partners = await getPartners();
    return NextResponse.json({ success: true, data: partners });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

// POST - Add new partner or update/deactivate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, percentage, action, id } = body;

    if (action === 'update' && id) {
      if (!name || typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
        return NextResponse.json(
          { success: false, error: 'Invalid data. Name and percentage (0-100) are required.' },
          { status: 400 }
        );
      }
      const success = await updatePartner(id, name.trim(), percentage);
      if (success) {
        return NextResponse.json({ success: true, message: 'Partner updated' });
      }
      return NextResponse.json(
        { success: false, error: 'Partner not found or percentage would exceed 100%' },
        { status: 400 }
      );
    }

    if (action === 'deactivate' && id) {
      const success = await deactivatePartner(id);
      if (success) {
        return NextResponse.json({ success: true, message: 'Partner deactivated' });
      }
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Add new partner
    if (!name || typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid data. Name and percentage (0-100) are required.' },
        { status: 400 }
      );
    }

    const partner = await addPartner(name.trim(), percentage);
    if (partner) {
      return NextResponse.json({ success: true, data: partner });
    }
    return NextResponse.json(
      { success: false, error: 'Total percentage would exceed 100%' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error with partner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process partner' },
      { status: 500 }
    );
  }
}
