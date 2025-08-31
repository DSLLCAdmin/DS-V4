"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import Image from "next/image";
import { Book, Users, MapPin, ShoppingBag, Star, ArrowRight } from "lucide-react";

export default function Home() {


  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600">
      {/* Hero Section with Original DSLLC Banner */}
      <div className="w-full relative overflow-hidden" style={{ height: '40vh', minHeight: '250px', maxHeight: '400px' }}>
        {/* Original DSLLC Banner Image */}
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* DarkStreets Banner Placeholder */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 400\'%3E%3Cdefs%3E%3ClinearGradient id=\'bg\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' style=\'stop-color:%23B7011F;stop-opacity:1\' /%3E%3Cstop offset=\'50%25\' style=\'stop-color:%23EFD907;stop-opacity:0.8\' /%3E%3Cstop offset=\'100%25\' style=\'stop-color:%23B7011F;stop-opacity:1\' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\'1200\' height=\'400\' fill=\'url(%23bg)\'/%3E%3Ctext x=\'600\' y=\'180\' font-family=\'Arial, sans-serif\' font-size=\'48\' font-weight=\'bold\' text-anchor=\'middle\' fill=\'white\'%3EDARK STREETS%3C/text%3E%3Ctext x=\'600\' y=\'220\' font-family=\'Arial, sans-serif\' font-size=\'24\' text-anchor=\'middle\' fill=\'%23cccccc\'%3EProwler claws LA streets while Aries and Dance drive the night%3C/text%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9
          }}></div>
        </div>
        
        {/* Overlay text on top of banner */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              DARK STREETS
            </h1>
            <p className="text-xl text-gray-300">
              Prowler claws LA streets while Aries and Dance drive the night
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
        {/* Hero Text - Removed duplicate content */}
        <div className="text-center mb-12 sm:mb-16 mt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-swatch103 via-swatch104 to-swatch105 bg-clip-text text-transparent">
            Welcome to DarkStreets
          </h1>
        </div>

        {/* Main Navigation Grid - 4 columns for 4 main sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-12 sm:mb-16">
          {/* StreetStore */}
          <Link href="/shop" className="group">
            <div className="button-streetstore nav-button">
                              <div className="button-content">
                  <div className="button-icon">
                    <Image 
                      src="/2714756_delivery_vehicle_transport_cab_cargo_transportation_auto_car.svg" 
                      alt="Delivery Van" 
                      width={160} 
                      height={60}
                      className="streetstore-vehicle"
                    />
                  </div>
                  <h3 className="button-title underline decoration-white decoration-2 underline-offset-4">StreetStore</h3>
                  <p className="button-subtitle">Streeter Collection</p>
                  <div className="button-description">
                    <span>Books, Apparel,</span>
                    <span>Accessories & More</span>
                    <ArrowRight className="w-4 h-4 button-arrow" />
                  </div>
                </div>
            </div>
          </Link>

          {/* StreetCircle */}
          <Link href="/book-club" className="group">
            <div className="button-streetcircle nav-button">
                              <div className="button-content">
                  <div className="button-icon">
                    <Image 
                      src="/2714749_fastcar_formula_super_roadster_sportcar_sportscar_car_supercar.svg" 
                      alt="Sports Car" 
                      width={140} 
                      height={50}
                      className="streetcircle-vehicle"
                    />
                  </div>
                  <h3 className="button-title underline decoration-white decoration-2 underline-offset-4">StreetCircle</h3>
                  <p className="button-subtitle">Join Our Community</p>
                  <div className="button-description">
                    <span>Connect with</span>
                    <span>Fellow Streeters</span>
                    <ArrowRight className="w-4 h-4 button-arrow" />
                  </div>
                </div>
            </div>
          </Link>

          {/* DS Map */}
          <Link href="/ds-map" className="group">
            <div className="button-dsmap nav-button">
                              <div className="button-content">
                  <div className="button-icon">
                    <Image 
                      src="/2714754_auto_vehicle_automobile_holiday_transport_car_hatchback_transportation_travel.svg" 
                      alt="Travel Car" 
                      width={140} 
                      height={50}
                      className="dsmap-vehicle"
                    />
                  </div>
                  <h3 className="button-title underline decoration-white decoration-2 underline-offset-4">DS Map</h3>
                  <p className="button-subtitle">Global Streeters</p>
                  <div className="button-description">
                    <span>Discover DarkStreets</span>
                    <span>For You</span>
                    <ArrowRight className="w-4 h-4 button-arrow" />
                  </div>
                </div>
            </div>
          </Link>

          {/* About DarkStreets */}
          <Link href="/about" className="group">
            <div className="button-about nav-button">
              <div className="button-content">
                                  <div className="button-icon">
                    <Image 
                      src="/2714750_truck_delivery_vehicle_auto_transportation_car_transport_pickup_automobile.svg" 
                      alt="Pickup Truck" 
                      width={140} 
                      height={50}
                      className="about-vehicle filter grayscale brightness-75 contrast-125 saturate-30"
                    />
                  </div>
                <h3 className="button-title underline decoration-white decoration-2 underline-offset-4">About</h3>
                <p className="button-subtitle">DarkStreets</p>
                <div className="button-description">
                  <span>Hear Our DarkStreets</span>
                  <span>Backstory</span>
                  <ArrowRight className="w-4 h-4 button-arrow" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Featured Products Section */}
        <div className="bg-gradient-to-b from-[#EFD907] to-[#B8A005] rounded-2xl shadow-xl p-8 mb-16 border border-swatch201/30">
          <h2 className="text-3xl font-bold text-center mb-8 text-swatch205">
            Featured DarkStreets Collection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Books */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-swatch103 to-swatch104 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Image 
                  src="/AncientGrimoire.svg" 
                  alt="Ancient Grimoire" 
                  width={80} 
                  height={80}
                  className="custom-icon"
                />
              </div>
              <h3 className="font-bold text-xl mb-3 text-swatch205">DarkStreets Series</h3>
              <p className="text-swatch205 leading-relaxed">
                Follow Aries Tiger and the Dancer through the neon-lit streets of LA. 
                From "First & Light" to "Mercury & Memory," experience the complete journey.
              </p>
            </div>

            {/* Apparel */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-swatch101 to-swatch102 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Image 
                  src="/Graffiti_Dancer_4.svg" 
                  alt="Graffiti Dancer" 
                  width={80} 
                  height={80}
                  className="custom-icon"
                />
              </div>
              <h3 className="font-bold text-xl mb-3 text-swatch205">Street Culture Apparel</h3>
              <p className="text-swatch205 leading-relaxed">
                Dark Streeter tees, mesh bodysuits, denim jackets, and accessories that embody 
                the essence of the streets. Each piece tells a story.
              </p>
            </div>

            {/* Experiences */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-swatch201 to-swatch202 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Image 
                  src="/ImmersiveExp.svg" 
                  alt="Immersive Experience" 
                  width={80} 
                  height={80}
                  className="custom-icon immersiveexp-vehicle"
                />
              </div>
              <h3 className="font-bold text-xl mb-3 text-swatch205">Immersive Experiences</h3>
              <p className="text-swatch205 leading-relaxed">
                From scent diffusers to soundscape machines, create your own DarkStreets atmosphere. 
                Includes exclusive playlists and guided experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Story Section */}
        <div className="bg-gradient-to-b from-[#8B4513] to-swatch105 rounded-2xl p-8 mb-16 text-center">
          <h2 className="text-3xl font-bold mb-6 text-swatch101">
            The DarkStreets Story
          </h2>
          <p className="text-lg text-swatch101/90 max-w-4xl mx-auto leading-relaxed">
            DarkStreets is more than a story—it's a lifestyle, a community, and a way of seeing the world. 
            Through the eyes of Aries Tiger and the Dancer, we explore themes of freedom, connection, 
            and the raw beauty of urban existence. Join us in the streets where every corner holds a story, 
            every light casts a shadow, and every moment is an opportunity to feel truly alive.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <Link href="/shop">
            <Button className="bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white text-xl font-bold py-6 px-12 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-0">
              <ShoppingBag className="w-6 h-6 mr-3" />
              Start Your DarkStreets Journey
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-swatch205 text-swatch101 mt-16">
        <div className="max-w-7xl mx-auto p-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image
              src="/DS-Logo.png"
              alt="DarkStreets Logo"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-swatch103 to-swatch104 bg-clip-text text-transparent">
              DarkStreets LLC
            </span>
          </div>
          <p className="text-swatch101/80 mb-2">
            Your central portal for all DarkStreets products and experiences
          </p>
          
          {/* QR Code Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white rounded-lg p-3 shadow-lg mb-3">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgZmlsbD0iIzAwMDAwMCIvPgogIDxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHJlY3QgeD0iMzIiIHk9IjMyIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz4KICA8cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0iI2ZmZmZmZiIvPgogIDxyZWN0IHg9IjQ4IiB5PSI0OCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMDAwMDAwIi8+CiAgPHJlY3QgeD0iNTYiIHk9IjU2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSI3MiIgeT0iNTYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iIzAwMDAwMCIvPgogIDxyZWN0IHg9IjQ4IiB5PSI3MiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDAwMDAwIi8+CiAgPHJlY3QgeD0iNDAiIHk9Ijg4IiB3aWR0aD0iNDgiIGhlaWdodD0iMTYiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSIzMiIgeT0iOTYiIHdpZHRoPSI2NCIgaGVpZ2h0PSIxNiIgZmlsbD0iIzAwMDAwMCIvPgogIDxyZWN0IHg9IjI0IiB5PSIxMDQiIHdpZHRoPSI4MCIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZmZmZiIvPgogIDxyZWN0IHg9IjE2IiB5PSIxMTIiIHdpZHRoPSI5NiIgaGVpZ2h0PSIxNiIgZmlsbD0iIzAwMDAwMCIvPgogIDx0ZXh0IHg9IjY0IiB5PSIxMjQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSIjMDAwMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EUzwvdGV4dD4KPC9zdmc+"
                alt="DarkStreets QR Code"
                width={128}
                height={128}
                className="rounded-lg"
                style={{
                  border: '2px solid #10b981',
                  display: 'block'
                }}
                onLoad={() => {
                  console.log('✅ QR code loaded successfully (data URI)');
                }}
                onError={(e) => {
                  console.error('❌ QR code failed to load:', e);
                }}
              />
            </div>
            <p className="text-sm text-swatch101/70 mb-2">
              Scan to explore on mobile
            </p>
          </div>
          
          <p className="text-sm text-swatch101/60 mb-4">
            &copy; 2025 DarkStreets LLC. All rights reserved.
          </p>
          
          {/* Font Credit */}
          <div className="border-t border-swatch101/20 pt-4">
            <p className="text-xs text-swatch101/50">
              Typography: <span className="font-medium">Directors Gothic</span> from{' '}
              <a 
                href="http://www.onlinewebfonts.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-swatch103 hover:text-swatch101 transition-colors duration-200 underline decoration-swatch103/50 hover:decoration-swatch101"
              >
                Web Fonts
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}