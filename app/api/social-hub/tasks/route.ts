import { NextRequest, NextResponse } from 'next/server';
import { socialHubStorage } from '@/lib/social-hub-data';
import type { Task } from '@/lib/social-hub-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const agent = searchParams.get('agent');
    const frequency = searchParams.get('frequency');
    const status = searchParams.get('status');

    let tasks = socialHubStorage.getAllTasks();

    // Apply filters
    if (agent) {
      tasks = tasks.filter(t => t.agent === agent);
    }
    if (frequency) {
      tasks = tasks.filter(t => t.frequency === frequency);
    }
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, agent, frequency, status, dueDate } = body;

    if (!title || !agent || !frequency) {
      return NextResponse.json(
        { error: 'Missing required fields: title, agent, frequency' },
        { status: 400 }
      );
    }

    const task = socialHubStorage.createTask({
      title,
      description: description || '',
      agent,
      frequency,
      status: status || 'TODO',
      dueDate
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
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

    const updatedTask = socialHubStorage.updateTask(id, updates);
    
    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
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

    const deleted = socialHubStorage.deleteTask(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

