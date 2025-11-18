import { NextRequest, NextResponse } from 'next/server';
import { socialHubStorage } from '@/lib/social-hub-data';

export async function GET(request: NextRequest) {
  try {
    const settings = socialHubStorage.getSocialSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ...updates } = body;

    const updatedSettings = socialHubStorage.updateSocialSettings(updates);
    return NextResponse.json({ settings: updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

