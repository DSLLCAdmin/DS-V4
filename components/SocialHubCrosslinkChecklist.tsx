'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { SocialSettings, CrosslinkStatus } from '@/lib/social-hub-data';

const CROSSLINK_ITEMS = [
  {
    id: 'igBio',
    label: 'IG bio links to TikTok + Reddit + DS site',
    statusKey: 'igBioStatus' as keyof SocialSettings
  },
  {
    id: 'tiktokBio',
    label: 'TikTok bio links to IG + DS site',
    statusKey: 'tiktokBioStatus' as keyof SocialSettings
  },
  {
    id: 'redditProfile',
    label: 'Reddit profile links to IG + TikTok + DS site',
    statusKey: 'redditProfileStatus' as keyof SocialSettings
  },
  {
    id: 'websiteEmbed',
    label: 'Website embeds TikTok/IG where possible',
    statusKey: 'websiteEmbedStatus' as keyof SocialSettings
  },
  {
    id: 'qrAssets',
    label: 'QR assets up-to-date',
    statusKey: 'qrAssetsStatus' as keyof SocialSettings
  }
];

export function SocialHubCrosslinkChecklist() {
  const [settings, setSettings] = useState<SocialSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/social-hub/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (statusKey: keyof SocialSettings, newStatus: CrosslinkStatus) => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch('/api/social-hub/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [statusKey]: newStatus
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNotesChange = async (notes: string) => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch('/api/social-hub/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crosslinkNotes: notes
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: CrosslinkStatus) => {
    if (status === 'OK') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    return <AlertCircle className="w-5 h-5 text-amber-600" />;
  };

  const getStatusBadge = (status: CrosslinkStatus) => {
    if (status === 'OK') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          OK
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        Needs Attention
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!settings) {
    return <div className="text-center py-8">Failed to load settings</div>;
  }

  const completedCount = CROSSLINK_ITEMS.filter(
    item => (settings[item.statusKey] as CrosslinkStatus) === 'OK'
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crosslink Checklist</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Verify all cross-platform links are working and up-to-date
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {CROSSLINK_ITEMS.map((item) => {
            const status = settings[item.statusKey] as CrosslinkStatus;
            return (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(status)}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(status)}
                    <Select
                      value={status}
                      onValueChange={(value) => handleStatusChange(item.statusKey, value as CrosslinkStatus)}
                      disabled={saving}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OK">OK</SelectItem>
                        <SelectItem value="NEEDS_ATTENTION">Needs Attention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Crosslink Notes */}
        <div className="mt-6">
          <label className="text-sm font-medium mb-2 block">Crosslink Notes</label>
          <Textarea
            value={settings.crosslinkNotes || ''}
            onChange={(e) => handleNotesChange(e.target.value)}
            onBlur={(e) => handleNotesChange(e.target.value)}
            placeholder="Add notes about crosslinking status, issues, or updates..."
            rows={4}
            className="text-sm"
          />
        </div>

        {/* Status Summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Checklist Status</h3>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">
                {completedCount} / {CROSSLINK_ITEMS.length}
              </span>
              {' '}items OK
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(completedCount / CROSSLINK_ITEMS.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
