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
import { Plus, Copy, Check } from 'lucide-react';
import { ContentSnippetForm } from '@/components/ContentSnippetForm';
import type { ContentSnippet, ContentSnippetType, Platform } from '@/lib/social-hub-data';

const TYPE_LABELS: Record<ContentSnippetType, string> = {
  CAPTION: 'Caption',
  CONFESSION_LINE: 'Confession Line',
  DANCER_QUOTE: 'Dancer Quote',
  ARIES_QUOTE: 'Aries Quote',
  QUESTION: 'Question'
};

const PLATFORM_LABELS: Record<Platform, string> = {
  TIKTOK: 'TikTok',
  INSTAGRAM: 'Instagram',
  REDDIT: 'Reddit',
  MULTI: 'Multi-Platform'
};

export function SocialHubContentLibrary() {
  const [snippets, setSnippets] = useState<ContentSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    platform: ''
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [newSnippet, setNewSnippet] = useState({
    type: '' as ContentSnippetType | '',
    platform: '' as Platform | '',
    text: '',
    tags: ''
  });

  useEffect(() => {
    fetchSnippets();
  }, [filters]);

  const fetchSnippets = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.platform) params.append('platform', filters.platform);

      const response = await fetch(`/api/social-hub/content-snippets?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSnippets(data.snippets);
      }
    } catch (error) {
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnippet = async (data: {
    type: ContentSnippetType;
    platform: Platform;
    text: string;
    tags: string[];
  }) => {
    try {
      const response = await fetch('/api/social-hub/content-snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setNewSnippet({
          type: '' as ContentSnippetType | '',
          platform: '' as Platform | '',
          text: '',
          tags: ''
        });
        fetchSnippets();
      }
    } catch (error) {
      console.error('Error creating snippet:', error);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Content Library</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Caption
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Content Snippet</DialogTitle>
              </DialogHeader>
              <ContentSnippetForm
                onSubmit={handleCreateSnippet}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Select value={filters.type || 'all'} onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? '' : value })}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.platform || 'all'} onValueChange={(value) => setFilters({ ...filters, platform: value === 'all' ? '' : value })}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Text</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {snippets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No content snippets found
                </TableCell>
              </TableRow>
            ) : (
              snippets.map((snippet) => (
                <TableRow key={snippet.id}>
                  <TableCell>
                    <Badge variant="outline">{TYPE_LABELS[snippet.type]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{PLATFORM_LABELS[snippet.platform]}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-sm line-clamp-3">{snippet.text}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {snippet.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(snippet.text, snippet.id)}
                    >
                      {copiedId === snippet.id ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

