import { useState, useEffect } from 'react';

interface ScrollPosition {
  page: string;
  scrollY: number;
  timestamp: number;
}

export function useScrollMemory() {
  const [scrollPositions, setScrollPositions] = useState<Record<string, ScrollPosition>>({});

  // Save scroll position for a page
  const saveScrollPosition = (page: string, scrollY: number) => {
    const position: ScrollPosition = {
      page,
      scrollY,
      timestamp: Date.now()
    };

    setScrollPositions(prev => ({
      ...prev,
      [page]: position
    }));

    // Also save to localStorage for persistence across sessions
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('scroll-positions') || '{}');
        stored[page] = position;
        localStorage.setItem('scroll-positions', JSON.stringify(stored));
      } catch (error) {
        console.error('Failed to save scroll position:', error);
      }
    }
  };

  // Get saved scroll position for a page
  const getScrollPosition = (page: string): number => {
    // First check memory
    if (scrollPositions[page]) {
      return scrollPositions[page].scrollY;
    }

    // Then check localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('scroll-positions') || '{}');
        if (stored[page]) {
          // Check if position is recent (within 1 hour)
          const age = Date.now() - stored[page].timestamp;
          if (age < 60 * 60 * 1000) { // 1 hour
            return stored[page].scrollY;
          }
        }
      } catch (error) {
        console.error('Failed to get scroll position:', error);
      }
    }

    return 0;
  };

  // Clear scroll position for a page
  const clearScrollPosition = (page: string) => {
    setScrollPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[page];
      return newPositions;
    });

    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('scroll-positions') || '{}');
        delete stored[page];
        localStorage.setItem('scroll-positions', JSON.stringify(stored));
      } catch (error) {
        console.error('Failed to clear scroll position:', error);
      }
    }
  };

  // Restore scroll position for a page
  const restoreScrollPosition = (page: string, delay: number = 100) => {
    const savedPosition = getScrollPosition(page);
    
    if (savedPosition > 0 && typeof window !== 'undefined') {
      // Use multiple attempts to ensure restoration works
      const attemptRestore = (attempts: number = 0) => {
        if (attempts > 10) return; // Max 10 attempts
        
        setTimeout(() => {
          // Check if page has enough content to scroll to the saved position
          const documentHeight = document.documentElement.scrollHeight;
          const windowHeight = window.innerHeight;
          
          if (documentHeight > windowHeight && savedPosition < documentHeight) {
            window.scrollTo({
              top: savedPosition,
              behavior: 'smooth'
            });
            console.log(`Scroll restored to ${savedPosition}px (attempt ${attempts + 1})`);
          } else if (attempts < 10) {
            // Try again if content isn't ready yet
            attemptRestore(attempts + 1);
          }
        }, delay + (attempts * 100)); // Increase delay with each attempt
      };
      
      attemptRestore();
    }
  };

  // Auto-save scroll position on scroll
  const useAutoSave = (page: string, threshold: number = 100) => {
    useEffect(() => {
      if (typeof window === 'undefined') return;

      let timeoutId: NodeJS.Timeout;

      const handleScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const scrollY = window.scrollY;
          if (scrollY > threshold) {
            saveScrollPosition(page, scrollY);
          }
        }, 150); // Debounce scroll events
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
      };
    }, [page, threshold]);
  };

  // Load scroll positions from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('scroll-positions') || '{}');
        setScrollPositions(stored);
      } catch (error) {
        console.error('Failed to load scroll positions:', error);
      }
    }
  }, []);

  return {
    saveScrollPosition,
    getScrollPosition,
    clearScrollPosition,
    restoreScrollPosition,
    useAutoSave,
    scrollPositions
  };
}
