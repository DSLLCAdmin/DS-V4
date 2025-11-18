'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ContentSnippetType, Platform } from '@/lib/social-hub-data';

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

interface ContentSnippetFormProps {
  initialData?: {
    type?: ContentSnippetType;
    platform?: Platform;
    text?: string;
    tags?: string;
  };
  onSubmit: (data: {
    type: ContentSnippetType;
    platform: Platform;
    text: string;
    tags: string[];
  }) => Promise<void>;
  onCancel?: () => void;
}

export function ContentSnippetForm({ initialData, onSubmit, onCancel }: ContentSnippetFormProps) {
  const [formData, setFormData] = useState({
    type: (initialData?.type || '') as ContentSnippetType | '',
    platform: (initialData?.platform || '') as Platform | '',
    text: initialData?.text || '',
    tags: initialData?.tags || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.platform || !formData.text) {
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      await onSubmit({
        type: formData.type as ContentSnippetType,
        platform: formData.platform as Platform,
        text: formData.text,
        tags
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Type *</label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as ContentSnippetType })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Platform *</label>
        <Select
          value={formData.platform}
          onValueChange={(value) => setFormData({ ...formData, platform: value as Platform })}
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
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          required
          rows={6}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Tags (comma-separated)</label>
        <Input
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="tag1, tag2, tag3"
        />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Snippet'}
        </Button>
      </div>
    </form>
  );
}

