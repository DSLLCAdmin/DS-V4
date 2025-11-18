'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Plus } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import type { MetricSnapshot } from '@/lib/social-hub-data';

export function SocialHubMetrics() {
  const [snapshots, setSnapshots] = useState<MetricSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newSnapshot, setNewSnapshot] = useState({
    date: new Date().toISOString().split('T')[0],
    tiktokViews: 0,
    instagramInteractions: 0,
    redditKarma: 0,
    followersInstagram: 0,
    followersTikTok: 0,
    bestTag: '',
    bestPostNote: '',
    notes: ''
  });

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const fetchSnapshots = async () => {
    try {
      const response = await fetch('/api/social-hub/metrics');
      if (response.ok) {
        const data = await response.json();
        setSnapshots(data.snapshots);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/social-hub/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSnapshot)
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setNewSnapshot({
          date: new Date().toISOString().split('T')[0],
          tiktokViews: 0,
          instagramInteractions: 0,
          redditKarma: 0,
          followersInstagram: 0,
          followersTikTok: 0,
          bestTag: '',
          bestPostNote: '',
          notes: ''
        });
        fetchSnapshots();
      }
    } catch (error) {
      console.error('Error creating snapshot:', error);
    }
  };

  // Prepare chart data
  const chartData = snapshots
    .slice()
    .reverse()
    .map(snapshot => ({
      date: new Date(snapshot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tiktokViews: snapshot.tiktokViews,
      instagramInteractions: snapshot.instagramInteractions,
      redditKarma: snapshot.redditKarma
    }));

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Metrics</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Weekly Snapshot
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Weekly Metric Snapshot</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSnapshot} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Week Ending Date *</label>
                    <Input
                      type="date"
                      value={newSnapshot.date}
                      onChange={(e) => setNewSnapshot({ ...newSnapshot, date: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">TikTok Views</label>
                      <Input
                        type="number"
                        value={newSnapshot.tiktokViews}
                        onChange={(e) => setNewSnapshot({ ...newSnapshot, tiktokViews: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Instagram Interactions</label>
                      <Input
                        type="number"
                        value={newSnapshot.instagramInteractions}
                        onChange={(e) => setNewSnapshot({ ...newSnapshot, instagramInteractions: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reddit Karma</label>
                      <Input
                        type="number"
                        value={newSnapshot.redditKarma}
                        onChange={(e) => setNewSnapshot({ ...newSnapshot, redditKarma: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Instagram Followers</label>
                      <Input
                        type="number"
                        value={newSnapshot.followersInstagram}
                        onChange={(e) => setNewSnapshot({ ...newSnapshot, followersInstagram: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">TikTok Followers</label>
                      <Input
                        type="number"
                        value={newSnapshot.followersTikTok}
                        onChange={(e) => setNewSnapshot({ ...newSnapshot, followersTikTok: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Best Tag</label>
                    <Input
                      value={newSnapshot.bestTag}
                      onChange={(e) => setNewSnapshot({ ...newSnapshot, bestTag: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Best Post Note</label>
                    <Textarea
                      value={newSnapshot.bestPostNote}
                      onChange={(e) => setNewSnapshot({ ...newSnapshot, bestPostNote: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={newSnapshot.notes}
                      onChange={(e) => setNewSnapshot({ ...newSnapshot, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Snapshot</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="tiktokViews" stroke="#8884d8" name="TikTok Views" />
                    <Line type="monotone" dataKey="instagramInteractions" stroke="#82ca9d" name="IG Interactions" />
                    <Line type="monotone" dataKey="redditKarma" stroke="#ffc658" name="Reddit Karma" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week Ending</TableHead>
                <TableHead>TikTok Views</TableHead>
                <TableHead>IG Interactions</TableHead>
                <TableHead>Reddit Karma</TableHead>
                <TableHead>IG Followers</TableHead>
                <TableHead>TikTok Followers</TableHead>
                <TableHead>Best Tag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No metric snapshots yet. Add your first weekly snapshot to get started.
                  </TableCell>
                </TableRow>
              ) : (
                snapshots.map((snapshot) => (
                  <TableRow key={snapshot.id}>
                    <TableCell>{new Date(snapshot.date).toLocaleDateString()}</TableCell>
                    <TableCell>{snapshot.tiktokViews.toLocaleString()}</TableCell>
                    <TableCell>{snapshot.instagramInteractions.toLocaleString()}</TableCell>
                    <TableCell>{snapshot.redditKarma.toLocaleString()}</TableCell>
                    <TableCell>{snapshot.followersInstagram.toLocaleString()}</TableCell>
                    <TableCell>{snapshot.followersTikTok.toLocaleString()}</TableCell>
                    <TableCell>
                      {snapshot.bestTag && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {snapshot.bestTag}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

