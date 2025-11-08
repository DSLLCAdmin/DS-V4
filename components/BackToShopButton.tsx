"use client";

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useScrollMemory } from '@/hooks/use-scroll-memory';
import { useEffect } from 'react';

export function BackToShopButton() {
  const router = useRouter();
  const { saveScrollPosition } = useScrollMemory();

  // Save scroll position when component mounts (user is viewing product page)
  useEffect(() => {
    // Get scroll position from shop page before navigating away
    const shopScroll = localStorage.getItem('scroll-positions');
    if (shopScroll) {
      try {
        const positions = JSON.parse(shopScroll);
        if (positions['/shop']) {
          console.log(`💾 Shop scroll position preserved: ${positions['/shop'].scrollY}px`);
        }
      } catch (error) {
        console.error('Failed to read shop scroll position:', error);
      }
    }
  }, []);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // The scroll position should already be saved from the shop page
    // Just navigate back - Next.js will handle scroll restoration
    // Use scroll: false to prevent automatic scroll, we'll handle it manually
    router.push('/shop', { scroll: false });
  };

  return (
    <Button 
      onClick={handleBackClick}
      variant="outline" 
      className="border-swatch103/30 text-swatch103 hover:bg-swatch103/10"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to StreetStore
    </Button>
  );
}
