import { NextRequest, NextResponse } from 'next/server';
import { socialHubStorage } from '@/lib/social-hub-data';

export async function POST(request: NextRequest) {
  try {
    socialHubStorage.resetDailyTasks();
    return NextResponse.json({ success: true, message: 'Daily tasks reset successfully' });
  } catch (error) {
    console.error('Error resetting daily tasks:', error);
    return NextResponse.json(
      { error: 'Failed to reset daily tasks' },
      { status: 500 }
    );
  }
}

