"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SplashTransitionProps {
  targetUrl: string;
  children: React.ReactNode;
  className?: string;
  carType?: 'books' | 'apparel' | 'immersion';
}

export function SplashTransition({ targetUrl, children, className = "", carType = 'books' }: SplashTransitionProps) {
  const [showSplash, setShowSplash] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'appear' | 'zoom' | 'drift' | 'complete'>('appear');
  const router = useRouter();

  // Get car image based on type
  const getCarImage = () => {
    switch (carType) {
      case 'books':
        return '/2714749_fastcar_formula_super_roadster_sportcar_sportscar_car_supercar.svg';
      case 'apparel':
        return '/2714754_auto_vehicle_automobile_holiday_transport_car_hatchback_transportation_travel.svg';
      case 'immersion':
        return '/2714756_delivery_vehicle_transport_cab_cargo_transportation_auto_car.svg';
      default:
        return '/2714749_fastcar_formula_super_roadster_sportcar_sportscar_car_supercar.svg';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSplash(true);
    setAnimationPhase('appear');
    
    // Animation sequence
    setTimeout(() => setAnimationPhase('zoom'), 200);
    setTimeout(() => setAnimationPhase('drift'), 800);
    setTimeout(() => setAnimationPhase('complete'), 1500);
    
    // Navigate after animation completes
    setTimeout(() => {
      router.push(targetUrl);
    }, 2000);
  };

  const getCarAnimationClass = () => {
    switch (animationPhase) {
      case 'appear':
        return 'animate-pulse scale-150 opacity-100';
      case 'zoom':
        return 'scale-100 transition-all duration-600 ease-out';
      case 'drift':
        return 'animate-bounce transition-all duration-700 ease-in-out';
      case 'complete':
        return 'opacity-0 scale-50 transition-all duration-300';
      default:
        return '';
    }
  };

  const getCarPosition = () => {
    if (animationPhase === 'drift') {
      // Random drift directions
      const directions = [
        'translate-x-20 -translate-y-10 rotate-12',
        '-translate-x-16 translate-y-8 -rotate-8',
        'translate-x-12 translate-y-12 rotate-6',
        '-translate-x-20 -translate-y-6 -rotate-12'
      ];
      return directions[Math.floor(Math.random() * directions.length)];
    }
    return '';
  };

  return (
    <>
      <div onClick={handleClick} className={`cursor-pointer ${className}`}>
        {children}
      </div>
      
      {/* Splash Overlay */}
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Animated Car */}
            <div className={`relative transition-all duration-500 ${getCarPosition()}`}>
              <Image
                src={getCarImage()}
                alt="DarkStreet Vehicle"
                width={200}
                height={200}
                className={`${getCarAnimationClass()} filter drop-shadow-2xl`}
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(239, 217, 7, 0.8))'
                }}
              />
            </div>
            
            {/* Loading Text - appears after car animation */}
            {animationPhase === 'drift' && (
              <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-center">
                <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">
                  Entering <span className="text-yellow-400">DarkStreet</span>
                </h2>
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
