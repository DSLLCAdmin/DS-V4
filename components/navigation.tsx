<!-- Updated: 2025-08-30T20:54:02.960Z -->
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, ShoppingCart, Home, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/use-scroll';
import Image from 'next/image';

interface NavigationProps {
  variant?: 'header' | 'footer';
}

export function Navigation({ variant = 'header' }: NavigationProps) {
  const pathname = usePathname();
  const { scrollY, scrollDirection } = useScrollPosition();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'StreetStore', icon: ShoppingCart },
    { href: '/book-club', label: 'Book Club', icon: Users },
    { href: '/ds-map', label: 'DS Map', icon: MapPin },
  ];

  if (variant === 'footer') {
    return (
      <footer className="bg-swatch205/90 backdrop-blur-md border-t border-swatch101/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src="/DS-Logo.png"
                alt="DarkStreets Logo"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-swatch103 to-swatch104 bg-clip-text text-transparent">
                DarkStreets
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-swatch103/20 text-swatch103"
                      : "text-swatch101/80 hover:text-swatch103 hover:bg-swatch101/10"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <nav 
      className={cn(
        "bg-swatch205/90 backdrop-blur-md border-b border-swatch101/20 sticky top-0 z-50 transition-all duration-300",
        scrollY > 100 && scrollDirection === 'down' && "transform -translate-y-full",
        scrollY > 100 && scrollDirection === 'up' && "shadow-lg"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/DS-Logo.png"
              alt="DarkStreets Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-200"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-swatch103 to-swatch104 bg-clip-text text-transparent">
              DarkStreets
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105",
                  pathname === item.href
                    ? "bg-swatch103/20 text-swatch103"
                    : "text-swatch101 hover:text-swatch103 hover:bg-swatch101/10"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-swatch101 hover:text-swatch103 hover:bg-swatch101/10">
              <Image
                src="/DS-Logo.png"
                alt="DarkStreets Logo"
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function BackButton() {
  return (
    <Link href="/">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-6 text-swatch203 hover:text-swatch103 hover:bg-swatch103/10 transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>
    </Link>
  );
}