import { NextRequest, NextResponse } from 'next/server';
import { trendTrackerStorage } from '@/lib/trend-tracker-data';

export async function GET(request: NextRequest) {
  try {
    const state = trendTrackerStorage.getState();
    return NextResponse.json({ state });
  } catch (error) {
    console.error('Error fetching TrendTracker state:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TrendTracker state' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'create_project':
        const project = trendTrackerStorage.createProject(data);
        return NextResponse.json({ project }, { status: 201 });

      case 'create_task':
        const task = trendTrackerStorage.createTask(data);
        return NextResponse.json({ task }, { status: 201 });

      case 'add_event':
        const event = trendTrackerStorage.addEvent(data);
        return NextResponse.json({ event }, { status: 201 });

      default:
        return NextResponse.json(
          { error: 'Unknown action type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing TrendTracker action:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, updates } = body;

    switch (type) {
      case 'update_project':
        const project = trendTrackerStorage.updateProject(id, updates);
        if (!project) {
          return NextResponse.json(
            { error: 'Project not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ project });

      case 'update_task':
        const task = trendTrackerStorage.updateTask(id, updates);
        if (!task) {
          return NextResponse.json(
            { error: 'Task not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ task });

      case 'update_weights':
        trendTrackerStorage.updateWeights(updates);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Unknown action type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating TrendTracker:', error);
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Missing type or id parameter' },
        { status: 400 }
      );
    }

    let deleted = false;
    if (type === 'project') {
      deleted = trendTrackerStorage.deleteProject(id);
    } else if (type === 'task') {
      deleted = trendTrackerStorage.deleteTask(id);
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }

    if (!deleted) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting from TrendTracker:', error);
    return NextResponse.json(
      { error: 'Failed to delete' },
      { status: 500 }
    );
  }
}

