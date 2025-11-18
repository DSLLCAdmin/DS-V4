import { NextRequest, NextResponse } from 'next/server';
import { socialHubStorage } from '@/lib/social-hub-data';

export async function GET(request: NextRequest) {
  try {
    const checklist = socialHubStorage.getCrosslinkChecklist();
    return NextResponse.json({ checklist });
  } catch (error) {
    console.error('Error fetching crosslink checklist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crosslink checklist' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const updatedItem = socialHubStorage.updateCrosslinkItem(id, updates);
    
    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Checklist item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error('Error updating crosslink checklist:', error);
    return NextResponse.json(
      { error: 'Failed to update crosslink checklist' },
      { status: 500 }
    );
  }
}

