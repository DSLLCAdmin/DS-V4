'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { CrosslinkChecklistItem } from '@/lib/social-hub-data';

const CHECKLIST_ITEMS = [
  {
    id: 'checklist_0',
    label: 'IG bio links to TikTok + Reddit + DS site',
    defaultChecked: false
  },
  {
    id: 'checklist_1',
    label: 'TikTok bio links to IG + DS site',
    defaultChecked: false
  },
  {
    id: 'checklist_2',
    label: 'Reddit profile links to IG + TikTok + DS site',
    defaultChecked: false
  },
  {
    id: 'checklist_3',
    label: 'Website embeds TikTok/IG where possible',
    defaultChecked: false
  },
  {
    id: 'checklist_4',
    label: 'QR assets up-to-date',
    defaultChecked: false
  }
];

export function SocialHubCrosslinkChecklist() {
  const [checklist, setChecklist] = useState<CrosslinkChecklistItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecklist();
  }, []);

  const fetchChecklist = async () => {
    try {
      const response = await fetch('/api/social-hub/crosslink-checklist');
      if (response.ok) {
        const data = await response.json();
        setChecklist(data.checklist);
        
        // Load notes from localStorage
        const savedNotes = localStorage.getItem('socialHub_crosslinkNotes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      }
    } catch (error) {
      console.error('Error fetching checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (itemId: string, checked: boolean) => {
    try {
      const response = await fetch('/api/social-hub/crosslink-checklist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, checked })
      });

      if (response.ok) {
        fetchChecklist();
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };

  const handleNotesChange = (itemId: string, value: string) => {
    const newNotes = { ...notes, [itemId]: value };
    setNotes(newNotes);
    localStorage.setItem('socialHub_crosslinkNotes', JSON.stringify(newNotes));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crosslink Checklist</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Verify all cross-platform links are working and up-to-date
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {checklist.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={(checked) => handleToggleItem(item.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{item.label}</span>
                    {item.checked ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="mt-2">
                    <label className="text-sm font-medium mb-1 block">Notes</label>
                    <Textarea
                      value={notes[item.id] || item.notes || ''}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      placeholder="Add notes about this item..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Checklist Status</h3>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">
                {checklist.filter(item => item.checked).length} / {checklist.length}
              </span>
              {' '}items completed
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(checklist.filter(item => item.checked).length / checklist.length) * 100}%`
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

