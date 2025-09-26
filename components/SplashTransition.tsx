"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SplashTransitionProps {
  targetUrl: string;
  children: React.ReactNode;
  className?: string;
}

export function SplashTransition({ targetUrl, children, className = "" }: SplashTransitionProps) {
  const [showSplash, setShowSplash] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSplash(true);
    
    // Show splash for 800ms then navigate
    setTimeout(() => {
      router.push(targetUrl);
    }, 800);
  };

  return (
    <>
      <div onClick={handleClick} className={`cursor-pointer ${className}`}>
        {children}
      </div>
      
      {/* Splash Overlay */}
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative">
            {/* Animated DS Logo */}
            <div className="animate-pulse">
              <Image
                src="/DS-Logo.png"
                alt="DarkStreet Logo"
                width={120}
                height={120}
                className="mx-auto mb-4"
              />
            </div>
            
            {/* Loading Text */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Entering <span className="text-yellow-400">DarkStreet</span>
              </h2>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
