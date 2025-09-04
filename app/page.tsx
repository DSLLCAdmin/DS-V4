"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import Image from "next/image";
import { Book, Users, MapPin, ShoppingBag, Star, ArrowRight } from "lucide-react";

export default function Home() {


  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600">
      {/* Hero Section with Restored DSLLC Banner */}
      <div className="w-full relative overflow-hidden" style={{ height: '40vh', minHeight: '250px', maxHeight: '400px' }}>
        <Image
          src="/DS-WebBanner-1.webp"
          alt="DarkStreets Banner"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
        {/* Hero Text - Removed duplicate content */}
        <div className="text-center mb-12 sm:mb-16 mt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-swatch103 via-swatch104 to-swatch105 bg-clip-text text-transparent">
            Streetin' Style
          </h1>
        </div>

        {/* Main Navigation Grid - 4 columns for 4 main sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-4 md:gap-6 mb-12 sm:mb-16">
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
            Featured DarkStreet Collections
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
            The DarkStreet Story
          </h2>
          <p className="text-lg text-swatch101/90 max-w-4xl mx-auto leading-relaxed">
            DarkStreets live more than our stories suggest. We are everyday people in a drifting collective rolling around a way of seeing the world. Look through the eyes of Aries Tiger and the Dancer, explore a freedom embedded in street life, connect with the restless rhythm of urban being. Join us on the DarkStreets where corners hold stories, shadows hide light, and every moment is truly alive.
          </p>
          
          {/* DarkStreet Story Button */}
          <div className="mt-8">
            <Button className="relative bg-gradient-to-r from-swatch103 to-swatch104 hover:from-swatch104 hover:to-swatch105 text-white text-xl font-bold py-6 px-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-0 overflow-hidden">
              {/* Left Image - Tiger's Eye */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Image
                  src="/Tigers-Eye_1.jpg"
                  alt="Tiger's Eye"
                  width={60}
                  height={60}
                  className="rounded-full object-cover border-2 border-white/30"
                />
              </div>
              
              {/* Center Text */}
              <div className="flex-1 text-center px-8">
                Explore The DarkStreet Story
              </div>
              
              {/* Right Image - Dancer */}
              <div className="absolute right-4 bottom-1/2 transform translate-y-1/2">
                <Image
                  src="/Dancer.jpg"
                  alt="Dancer"
                  width={60}
                  height={60}
                  className="rounded-full object-cover border-2 border-white/30"
                />
              </div>
            </Button>
          </div>
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
              <Image
                src="/DSLLC_QRC_1.png"
                alt="DarkStreets QR Code"
                width={128}
                height={128}
                className="rounded-lg"
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