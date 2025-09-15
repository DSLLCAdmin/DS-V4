"use client";

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useScrollMemory } from '@/hooks/use-scroll-memory';

export function BackToShopButton() {
  const { saveScrollPosition } = useScrollMemory();

  const handleBackClick = () => {
    // Save current scroll position before navigating
    if (typeof window !== 'undefined') {
      saveScrollPosition('/shop', window.scrollY);
    }
  };

  return (
    <Link href="/shop" onClick={handleBackClick}>
      <Button variant="outline" className="border-swatch103/30 text-swatch103 hover:bg-swatch103/10">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to StreetStore
      </Button>
    </Link>
  );
}
