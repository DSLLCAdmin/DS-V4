import { NextRequest, NextResponse } from 'next/server';
import { socialHubStorage } from '@/lib/social-hub-data';

export async function GET(request: NextRequest) {
  try {
    const signals = socialHubStorage.getAllTrendSignals();
    return NextResponse.json({ signals });
  } catch (error) {
    console.error('Error fetching trend signals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trend signals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, description, whyItFitsDS, suggestedPlatform, suggestedCaptionRef } = body;

    if (!source || !description || !whyItFitsDS || !suggestedPlatform) {
      return NextResponse.json(
        { error: 'Missing required fields: source, description, whyItFitsDS, suggestedPlatform' },
        { status: 400 }
      );
    }

    const signal = socialHubStorage.createTrendSignal({
      source,
      description,
      whyItFitsDS,
      suggestedPlatform,
      suggestedCaptionRef
    });

    return NextResponse.json({ signal }, { status: 201 });
  } catch (error) {
    console.error('Error creating trend signal:', error);
    return NextResponse.json(
      { error: 'Failed to create trend signal' },
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

    const updatedSignal = socialHubStorage.updateTrendSignal(id, updates);
    
    if (!updatedSignal) {
      return NextResponse.json(
        { error: 'Trend signal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ signal: updatedSignal });
  } catch (error) {
    console.error('Error updating trend signal:', error);
    return NextResponse.json(
      { error: 'Failed to update trend signal' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    const deleted = socialHubStorage.deleteTrendSignal(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Trend signal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trend signal:', error);
    return NextResponse.json(
      { error: 'Failed to delete trend signal' },
      { status: 500 }
    );
  }
}

