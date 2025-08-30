'use client';

import { useEffect, useState } from 'react';
import { useScrollPosition } from '@/hooks/use-scroll';

interface FloatingElementProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function FloatingElement({ 
  children, 
  speed = 0.5, 
  direction = 'up',
  className = '' 
}: FloatingElementProps) {
  const { scrollY } = useScrollPosition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={className}>{children}</div>;

  const getTransform = () => {
    const offset = scrollY * speed;
    switch (direction) {
      case 'up':
        return `translateY(-${offset}px)`;
      case 'down':
        return `translateY(${offset}px)`;
      case 'left':
        return `translateX(-${offset}px)`;
      case 'right':
        return `translateX(${offset}px)`;
      default:
        return `translateY(-${offset}px)`;
    }
  };

  return (
    <div 
      className={`transition-transform duration-75 ease-out ${className}`}
      style={{ transform: getTransform() }}
    >
      {children}
    </div>
  );
}

export function ScrollReveal({ 
  children, 
  delay = 0,
  className = '' 
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, delay]);

  return (
    <div
      ref={setElement}
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}