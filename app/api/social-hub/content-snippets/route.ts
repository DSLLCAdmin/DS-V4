import { NextRequest, NextResponse } from 'next/server';
import { socialHubStorage } from '@/lib/social-hub-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const platform = searchParams.get('platform');

    let snippets = socialHubStorage.getAllContentSnippets();

    // Apply filters
    if (type) {
      snippets = snippets.filter(s => s.type === type);
    }
    if (platform) {
      snippets = snippets.filter(s => s.platform === platform);
    }

    return NextResponse.json({ snippets });
  } catch (error) {
    console.error('Error fetching content snippets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content snippets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, platform, text, tags } = body;

    if (!type || !platform || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: type, platform, text' },
        { status: 400 }
      );
    }

    const snippet = socialHubStorage.createContentSnippet({
      type,
      platform,
      text,
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : [])
    });

    return NextResponse.json({ snippet }, { status: 201 });
  } catch (error) {
    console.error('Error creating content snippet:', error);
    return NextResponse.json(
      { error: 'Failed to create content snippet' },
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

    const updatedSnippet = socialHubStorage.updateContentSnippet(id, updates);
    
    if (!updatedSnippet) {
      return NextResponse.json(
        { error: 'Content snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ snippet: updatedSnippet });
  } catch (error) {
    console.error('Error updating content snippet:', error);
    return NextResponse.json(
      { error: 'Failed to update content snippet' },
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

    const deleted = socialHubStorage.deleteContentSnippet(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Content snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content snippet:', error);
    return NextResponse.json(
      { error: 'Failed to delete content snippet' },
      { status: 500 }
    );
  }
}

