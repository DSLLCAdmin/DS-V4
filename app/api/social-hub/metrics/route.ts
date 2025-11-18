import { NextRequest, NextResponse } from 'next/server';
import { socialHubStorage } from '@/lib/social-hub-data';

export async function GET(request: NextRequest) {
  try {
    const snapshots = socialHubStorage.getAllMetricSnapshots();
    return NextResponse.json({ snapshots });
  } catch (error) {
    console.error('Error fetching metric snapshots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metric snapshots' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      tiktokViews,
      instagramInteractions,
      redditKarma,
      followersInstagram,
      followersTikTok,
      bestTag,
      bestPostNote,
      notes
    } = body;

    if (!date) {
      return NextResponse.json(
        { error: 'Missing required field: date' },
        { status: 400 }
      );
    }

    const snapshot = socialHubStorage.createMetricSnapshot({
      date,
      tiktokViews: tiktokViews || 0,
      instagramInteractions: instagramInteractions || 0,
      redditKarma: redditKarma || 0,
      followersInstagram: followersInstagram || 0,
      followersTikTok: followersTikTok || 0,
      bestTag: bestTag || '',
      bestPostNote: bestPostNote || '',
      notes: notes || ''
    });

    return NextResponse.json({ snapshot }, { status: 201 });
  } catch (error) {
    console.error('Error creating metric snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to create metric snapshot' },
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

    const updatedSnapshot = socialHubStorage.updateMetricSnapshot(id, updates);
    
    if (!updatedSnapshot) {
      return NextResponse.json(
        { error: 'Metric snapshot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ snapshot: updatedSnapshot });
  } catch (error) {
    console.error('Error updating metric snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to update metric snapshot' },
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

    const deleted = socialHubStorage.deleteMetricSnapshot(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Metric snapshot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting metric snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to delete metric snapshot' },
      { status: 500 }
    );
  }
}

