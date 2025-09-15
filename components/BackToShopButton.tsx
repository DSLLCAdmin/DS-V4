"use client";

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useScrollMemory } from '@/hooks/use-scroll-memory';

export function BackToShopButton() {
  const router = useRouter();
  const { saveScrollPosition } = useScrollMemory();

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Save current scroll position before navigating
    if (typeof window !== 'undefined') {
      saveScrollPosition('/shop', window.scrollY);
      console.log(`Saved scroll position: ${window.scrollY}px`);
    }
    
    // Use router.push for client-side navigation
    router.push('/shop');
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
