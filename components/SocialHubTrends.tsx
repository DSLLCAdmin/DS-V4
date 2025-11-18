'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Sparkles } from 'lucide-react';
import type { TrendSignal, TrendSource, Platform } from '@/lib/social-hub-data';

const SOURCE_LABELS: Record<TrendSource, string> = {
  TIKTOK: 'TikTok',
  INSTAGRAM: 'Instagram',
  REDDIT: 'Reddit',
  OTHER: 'Other'
};

const PLATFORM_LABELS: Record<Platform, string> = {
  TIKTOK: 'TikTok',
  INSTAGRAM: 'Instagram',
  REDDIT: 'Reddit',
  MULTI: 'Multi-Platform'
};

export function SocialHubTrends() {
  const [signals, setSignals] = useState<TrendSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<TrendSignal | null>(null);

  const [newSignal, setNewSignal] = useState({
    source: '' as TrendSource | '',
    description: '',
    whyItFitsDS: '',
    suggestedPlatform: '' as Platform | ''
  });

  const [promoteSnippet, setPromoteSnippet] = useState({
    type: 'CAPTION' as 'CAPTION' | 'CONFESSION_LINE' | 'DANCER_QUOTE' | 'ARIES_QUOTE' | 'QUESTION',
    platform: '' as Platform | '',
    text: '',
    tags: ''
  });

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      const response = await fetch('/api/social-hub/trends');
      if (response.ok) {
        const data = await response.json();
        setSignals(data.signals);
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/social-hub/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSignal)
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setNewSignal({
          source: '' as TrendSource | '',
          description: '',
          whyItFitsDS: '',
          suggestedPlatform: '' as Platform | ''
        });
        fetchSignals();
      }
    } catch (error) {
      console.error('Error creating trend signal:', error);
    }
  };

  const handlePromoteToSnippet = (trend: TrendSignal) => {
    setSelectedTrend(trend);
    setPromoteSnippet({
      type: 'CAPTION',
      platform: trend.suggestedPlatform,
      text: trend.description,
      tags: ''
    });
    setPromoteDialogOpen(true);
  };

  const handleCreateSnippetFromTrend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTrend) return;

    try {
      const tags = promoteSnippet.tags.split(',').map(t => t.trim()).filter(t => t);
      
      const response = await fetch('/api/social-hub/content-snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...promoteSnippet,
          tags
        })
      });

      if (response.ok) {
        setPromoteDialogOpen(false);
        setSelectedTrend(null);
        // Optionally update the trend signal with the snippet reference
        if (selectedTrend) {
          const snippetData = await response.json();
          await fetch(`/api/social-hub/trends`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: selectedTrend.id,
              suggestedCaptionRef: snippetData.snippet.id
            })
          });
        }
      }
    } catch (error) {
      console.error('Error creating snippet from trend:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trend Signals</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Trend Signal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Trend Signal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSignal} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Source *</label>
                  <Select
                    value={newSignal.source}
                    onValueChange={(value) => setNewSignal({ ...newSignal, source: value as TrendSource })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    value={newSignal.description}
                    onChange={(e) => setNewSignal({ ...newSignal, description: e.target.value })}
                    required
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Why It Fits DS *</label>
                  <Textarea
                    value={newSignal.whyItFitsDS}
                    onChange={(e) => setNewSignal({ ...newSignal, whyItFitsDS: e.target.value })}
                    required
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Suggested Platform *</label>
                  <Select
                    value={newSignal.suggestedPlatform}
                    onValueChange={(value) => setNewSignal({ ...newSignal, suggestedPlatform: value as Platform })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Signal</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Why It Fits DS</TableHead>
              <TableHead>Suggested Platform</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {signals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No trend signals yet. Start tracking trends to see them here.
                </TableCell>
              </TableRow>
            ) : (
              signals.map((signal) => (
                <TableRow key={signal.id}>
                  <TableCell>
                    <Badge variant="outline">{SOURCE_LABELS[signal.source]}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-sm">{signal.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-sm text-muted-foreground">{signal.whyItFitsDS}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{PLATFORM_LABELS[signal.suggestedPlatform]}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(signal.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromoteToSnippet(signal)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Promote to Snippet
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Dialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Promote Trend to Content Snippet</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSnippetFromTrend} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Type *</label>
                <Select
                  value={promoteSnippet.type}
                  onValueChange={(value) => setPromoteSnippet({ ...promoteSnippet, type: value as any })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAPTION">Caption</SelectItem>
                    <SelectItem value="CONFESSION_LINE">Confession Line</SelectItem>
                    <SelectItem value="DANCER_QUOTE">Dancer Quote</SelectItem>
                    <SelectItem value="ARIES_QUOTE">Aries Quote</SelectItem>
                    <SelectItem value="QUESTION">Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Platform *</label>
                <Select
                  value={promoteSnippet.platform}
                  onValueChange={(value) => setPromoteSnippet({ ...promoteSnippet, platform: value as Platform })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Text *</label>
                <Textarea
                  value={promoteSnippet.text}
                  onChange={(e) => setPromoteSnippet({ ...promoteSnippet, text: e.target.value })}
                  required
                  rows={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={promoteSnippet.tags}
                  onChange={(e) => setPromoteSnippet({ ...promoteSnippet, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setPromoteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Snippet</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

