'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, ShoppingCart, Home, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/use-scroll';
import Image from 'next/image';
import { DarkStreetsTextLogo } from './DarkStreetsTextLogo';
import { StreetStoreTextLogo } from './StreetStoreTextLogo';
import { StreetCircleTextLogo } from './StreetCircleTextLogo';
import { HomeTextLogo } from './HomeTextLogo';
import { CartTextLogo } from './CartTextLogo';
import { StreetersMapTextLogo } from './StreetersMapTextLogo';
import { useCart } from '@/hooks/use-cart';

interface NavigationProps {
  variant?: 'header' | 'footer';
}

export function Navigation({ variant = 'header' }: NavigationProps) {
  const pathname = usePathname();
  const { scrollY, scrollDirection } = useScrollPosition();
  const { itemCount } = useCart();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'StreetStore', icon: ShoppingCart },
    { href: '/book-club', label: 'StreetCircle', icon: Users },
    { href: '/ds-map', label: 'StreetersMap', icon: MapPin },
  ];

  if (variant === 'footer') {
    return (
      <footer className="bg-swatch205/90 backdrop-blur-md border-t border-swatch101/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 mb-4 md:mb-0">
              <Image
                src="/DS-Logo.png"
                alt="DarkStreets Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <DarkStreetsTextLogo 
                className="text-xl font-bold"
              />
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
          <Link href="/" className="flex items-center space-x-1 group">
            <Image
              src="/DS-Logo.png"
              alt="DarkStreets Logo"
              width={64}
              height={64}
              className="h-16 w-16 object-contain group-hover:scale-110 transition-transform duration-200"
            />
            <DarkStreetsTextLogo 
              className="text-2xl font-bold"
            />
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
                {item.label === 'Home' ? (
                  <HomeTextLogo />
                ) : item.label === 'StreetStore' ? (
                  <StreetStoreTextLogo />
                ) : item.label === 'StreetCircle' ? (
                  <StreetCircleTextLogo />
                ) : item.label === 'StreetersMap' ? (
                  <StreetersMapTextLogo />
                ) : (
                  <span>{item.label}</span>
                )}
              </Link>
            ))}
            
            {/* Cart Icon with Item Count */}
            <Link
              href="/cart"
              className="relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-swatch101 hover:text-swatch103 hover:bg-swatch101/10"
            >
              <ShoppingCart className="h-4 w-4" />
              <CartTextLogo />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-swatch103 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-swatch101 hover:text-swatch103 hover:bg-swatch101/10">
              <Image
                src="/DS-Logo.png"
                alt="DarkStreets Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
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