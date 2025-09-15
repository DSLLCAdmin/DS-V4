"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScrollMemory } from '@/hooks/use-scroll-memory';

export function ScrollMemoryTest() {
  const { saveScrollPosition, getScrollPosition, clearScrollPosition, scrollPositions } = useScrollMemory();
  const [testPosition, setTestPosition] = useState(0);

  const handleSavePosition = () => {
    const currentScroll = window.scrollY;
    saveScrollPosition('/shop', currentScroll);
    setTestPosition(currentScroll);
  };

  const handleGetPosition = () => {
    const savedPosition = getScrollPosition('/shop');
    alert(`Saved position for /shop: ${savedPosition}px`);
  };

  const handleClearPosition = () => {
    clearScrollPosition('/shop');
    setTestPosition(0);
  };

  return (
    <Card className="bg-gradient-to-br from-swatch101/95 to-swatch101/85 backdrop-blur-sm border border-swatch103/30 m-4">
      <CardHeader>
        <CardTitle className="text-white">Scroll Memory Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-white">
          <p>Current scroll position: {window.scrollY}px</p>
          <p>Last saved position: {testPosition}px</p>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleSavePosition} variant="outline">
            Save Current Position
          </Button>
          <Button onClick={handleGetPosition} variant="outline">
            Get Saved Position
          </Button>
          <Button onClick={handleClearPosition} variant="outline">
            Clear Position
          </Button>
        </div>

        <div className="text-white text-sm">
          <p>All saved positions:</p>
          <pre className="bg-black/20 p-2 rounded text-xs overflow-auto max-h-32">
            {JSON.stringify(scrollPositions, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
