<!-- Updated: 2025-08-30T20:54:01.808Z -->
'use client';

import { BackButton } from '@/components/navigation';
import { Book, Users, MapPin, ShoppingBag, Star } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{
      background: 'linear-gradient(to bottom, #9370DB, #FFB6C1)',
      backgroundImage: 'linear-gradient(to bottom, #9370DB, #FFB6C1)'
    }}>
      {/* Metallic overlay for consistency */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <BackButton />
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            About DarkStreets
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            More than a story—it's a lifestyle, a community, and a way of seeing the world.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Origin Story */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
            <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Our Origin</h2>
            <p className="text-lg text-white/90 leading-relaxed mb-6">
              DarkStreets emerged from the neon-lit streets of Los Angeles, where Aries Tiger and the Dancer 
              first crossed paths. What began as chance encounters in the urban landscape evolved into a 
              movement that celebrates the raw beauty of street culture.
            </p>
            <p className="text-lg text-white/90 leading-relaxed">
              Through their eyes, we explore themes of freedom, connection, and the unscripted moments 
              that make city life truly alive.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
            <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Our Mission</h2>
            <p className="text-lg text-white/90 leading-relaxed mb-6">
              We're building more than a brand—we're cultivating a community of street culture enthusiasts, 
              urban explorers, and creative souls who find beauty in the unexpected corners of city life.
            </p>
            <p className="text-lg text-white/90 leading-relaxed">
              From our books to our apparel to our immersive experiences, every element is designed to 
              transport you into the world of DarkStreets.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-16 border border-white/30">
          <h2 className="text-3xl font-bold mb-8 text-center text-white drop-shadow-lg">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white drop-shadow-lg">Authenticity</h3>
              <p className="text-white/90">
                Every story, every design, every experience comes from real moments in real streets.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white drop-shadow-lg">Community</h3>
              <p className="text-white/90">
                We're building connections between street culture enthusiasts worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white drop-shadow-lg">Innovation</h3>
              <p className="text-white/90">
                Pushing boundaries in storytelling, design, and immersive experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
            <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Join the DarkStreets Movement</h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Whether you're discovering our books, wearing our apparel, or experiencing our immersive content, 
              you're part of something bigger than just a brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/shop" className="bg-white/30 hover:bg-white/40 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 border border-white/50">
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                Explore Collection
              </a>
              <a href="/book-club" className="bg-white/30 hover:bg-white/40 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 border border-white/50">
                <Users className="w-5 h-5 inline mr-2" />
                Join Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
