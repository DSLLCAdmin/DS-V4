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

    console.log(`💾 Saving scroll position for ${page}: ${scrollY}px`);

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
        console.log(`💾 Saved to localStorage for ${page}: ${scrollY}px`);
      } catch (error) {
        console.error('Failed to save scroll position:', error);
      }
    }
  };

  // Get saved scroll position for a page
  const getScrollPosition = (page: string): number => {
    // First check memory
    if (scrollPositions[page]) {
      const position = scrollPositions[page].scrollY;
      console.log(`📖 Retrieved scroll position from memory for ${page}: ${position}px`);
      return position;
    }

    // Then check localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('scroll-positions') || '{}');
        console.log(`📖 Checking localStorage for ${page}:`, stored);
        if (stored[page]) {
          // Check if position is recent (within 1 hour)
          const age = Date.now() - stored[page].timestamp;
          if (age < 60 * 60 * 1000) { // 1 hour
            console.log(`📖 Retrieved scroll position from localStorage for ${page}: ${stored[page].scrollY}px`);
            return stored[page].scrollY;
          } else {
            console.log(`📖 Scroll position for ${page} is too old (${age}ms), ignoring`);
          }
        }
      } catch (error) {
        console.error('Failed to get scroll position:', error);
      }
    }

    console.log(`📖 No scroll position found for ${page}`);
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
    console.log(`🔄 Starting scroll restoration for ${page}...`);
    const savedPosition = getScrollPosition(page);
    console.log(`🔄 Retrieved position: ${savedPosition}px for ${page}`);
    
    if (savedPosition > 0 && typeof window !== 'undefined') {
      console.log(`Attempting to restore scroll position: ${savedPosition}px for ${page}`);
      
      // Use multiple attempts to ensure restoration works
      const attemptRestore = (attempts: number = 0) => {
        if (attempts > 15) {
          console.log(`Max restoration attempts reached for ${page}`);
          return;
        }
        
        setTimeout(() => {
          // Check if page has enough content to scroll to the saved position
          const documentHeight = document.documentElement.scrollHeight;
          const windowHeight = window.innerHeight;
          const maxScrollableHeight = documentHeight - windowHeight;
          
          // Ensure we have enough content and the saved position is valid
          if (documentHeight > windowHeight && savedPosition <= maxScrollableHeight) {
            window.scrollTo({
              top: savedPosition,
              behavior: 'smooth'
            });
            console.log(`✅ Scroll restored to ${savedPosition}px (attempt ${attempts + 1})`);
          } else if (attempts < 15) {
            // Try again if content isn't ready yet
            console.log(`⏳ Content not ready, retrying... (attempt ${attempts + 1})`);
            attemptRestore(attempts + 1);
          } else {
            console.log(`❌ Failed to restore scroll position after ${attempts + 1} attempts`);
          }
        }, delay + (attempts * 150)); // Increase delay with each attempt
      };
      
      attemptRestore();
    } else {
      console.log(`❌ No saved scroll position found for ${page} (position: ${savedPosition}px)`);
    }
  };

  // Auto-save scroll position on scroll
  const useAutoSave = (page: string, threshold: number = 50) => {
    useEffect(() => {
      if (typeof window === 'undefined') return;

      let timeoutId: NodeJS.Timeout;
      let lastSavedPosition = 0;

      const handleScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const scrollY = window.scrollY;
          
          // Only save if we've scrolled significantly from last saved position
          if (scrollY > threshold && Math.abs(scrollY - lastSavedPosition) > 100) {
            saveScrollPosition(page, scrollY);
            lastSavedPosition = scrollY;
            console.log(`Auto-saved scroll position: ${scrollY}px for ${page}`);
          }
        }, 200); // Debounce scroll events
      };

      // Also save on page unload
      const handleBeforeUnload = () => {
        const scrollY = window.scrollY;
        if (scrollY > threshold) {
          saveScrollPosition(page, scrollY);
          console.log(`Saved scroll position on unload: ${scrollY}px for ${page}`);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('beforeunload', handleBeforeUnload);
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
