<!-- Updated: 2025-08-30T20:54:01.811Z -->
"use client";
import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Plus, Minus, Move, Info, Navigation, Layers, Users, Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation as Nav } from '@/components/navigation';
import { FloatingElement, ScrollReveal } from '@/components/floating-elements';

// Mock map data - in production this would connect to a real mapping service
const mockPins = [
  {
    id: 1,
    lat: 40.7128,
    lng: -74.0060,
    title: "NYC Literary Café",
    description: "Amazing coffee and book discussions every Thursday",
    user: "BookLover23",
    date: "2025-01-15",
    category: "café"
  },
  {
    id: 2,
    lat: 34.0522,
    lng: -118.2437,
    title: "LA Book Exchange",
    description: "Free book swap location - bring one, take one!",
    user: "ReadingNomad",
    date: "2025-01-12",
    category: "exchange"
  },
  {
    id: 3,
    lat: 41.8781,
    lng: -87.6298,
    title: "Chicago Streeting Circle",
    description: "Weekly outdoor streeting sessions in Millennium Park",
    user: "ChiReader",
    date: "2025-01-10",
    category: "meetup"
  },
  {
    id: 4,
    lat: 37.7749,
    lng: -122.4194,
    title: "SF Poetry Corner",
    description: "Cozy spot for poetry readings and book clubs",
    user: "PoetryLover",
    date: "2025-01-08",
    category: "café"
  },
  {
    id: 5,
    lat: 42.3601,
    lng: -71.0589,
  title: "Boston StreetHaven",
    description: "Historic library with amazing reading rooms",
    user: "HistoryBuff",
    date: "2025-01-05",
    category: "library"
  }
];

const lastAddedPin = mockPins[0]; // NYC as the most recent

export default function DSMap() {
  const [pins, setPins] = useState(mockPins);
  const [selectedPin, setSelectedPin] = useState<typeof mockPins[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mapMode, setMapMode] = useState<'view' | 'add' | 'edit'>('view');
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of US
  const [searchResults, setSearchResults] = useState<typeof mockPins>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = pins.filter(pin => 
        pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pin.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pin.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm, pins]);

  const filteredPins = searchTerm ? searchResults : pins;

  const addPin = (lat: number, lng: number) => {
    const newPin = {
      id: Date.now(),
      lat,
      lng,
      title: "New Reading Spot",
      description: "A great place for reading - click to edit description",
      user: "CurrentUser",
      date: new Date().toISOString().split('T')[0],
      category: "custom"
    };
    setPins([...pins, newPin]);
    setSelectedPin(newPin);
    setMapMode('view');
  };

  const removePin = (id: number) => {
    setPins(pins.filter(pin => pin.id !== id));
    setSelectedPin(null);
  };

  const focusOnPin = (pin: typeof mockPins[0]) => {
    setCenter({ lat: pin.lat, lng: pin.lng });
    setSelectedPin(pin);
    setShowSearchResults(false);
    setSearchTerm("");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'café': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'exchange': return 'bg-green-100 text-green-800 border-green-300';
      case 'meetup': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'library': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'custom': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'café': return '☕';
      case 'exchange': return '📚';
      case 'meetup': return '👥';
      case 'library': return '🏛️';
      case 'custom': return '📍';
      default: return '📍';
    }
  };

  // Convert lat/lng to screen coordinates
  const getScreenPosition = (lat: number, lng: number) => {
    const mapWidth = 100; // percentage
    const mapHeight = 100; // percentage
    
    // Simple projection (not geographically accurate, but works for demo)
    const x = ((lng + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    		<div className="min-h-screen bg-gradient-to-b from-[#654321] via-[#8B4513] to-[#F4A460] overflow-hidden relative">
			{/* Subtle metallic overlay */}
			<div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-black/10 pointer-events-none"></div>
      <Nav />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingElement speed={0.2} className="absolute top-32 left-16 opacity-5">
          <MapPin className="h-40 w-40 text-emerald-600" />
        </FloatingElement>
        <FloatingElement speed={0.15} direction="down" className="absolute top-64 right-24 opacity-5">
          <Navigation className="h-32 w-32 text-teal-600" />
        </FloatingElement>
      </div>
      
      {/* Hero Section */}
      		<div className="relative overflow-hidden text-white">
        		<div className="absolute inset-0 bg-black opacity-10"></div>
        <FloatingElement speed={0.1}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <ScrollReveal>
                  <MapPin className="h-16 w-16 mb-6 text-emerald-300" />
                </ScrollReveal>
                <ScrollReveal delay={200}>
                  					<h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
						DS Map
					</h1>
                </ScrollReveal>
                <ScrollReveal delay={400}>
                  <p className="text-xl md:text-2xl mb-8 text-emerald-100 max-w-2xl">
                    Discover and share amazing reading spots around the world. Connect with fellow book lovers in your area.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={600}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                      onClick={() => setMapMode('add')}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Location
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-emerald-300 text-emerald-100 hover:bg-emerald-800 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
                      onClick={() => setMapMode('view')}
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Explore Map
                    </Button>
                  </div>
                </ScrollReveal>
              </div>
              
              {/* Mini Map Preview */}
              <div className="relative">
                <ScrollReveal delay={800}>
                  <FloatingElement speed={0.05}>
                    <Card className="overflow-hidden rounded-2xl shadow-2xl border-emerald-200 bg-white/90 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center text-emerald-800">
                          <Target className="h-5 w-5 mr-2" />
                          Latest Pin: {lastAddedPin.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        		<div className="relative h-64">
                          {/* Simplified world map background */}
                          <div className="absolute inset-4 bg-white/50 rounded-xl border-2 border-emerald-300 overflow-hidden">
                            {/* Continents outline (simplified) */}
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute top-4 left-8 w-16 h-12 bg-emerald-400 rounded-lg"></div>
                              <div className="absolute top-8 left-20 w-20 h-16 bg-emerald-400 rounded-lg"></div>
                              <div className="absolute bottom-8 right-12 w-12 h-8 bg-emerald-400 rounded-lg"></div>
                            </div>
                            
                            {/* NYC pin location */}
                            <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                              <div className="relative">
                                <MapPin className="h-8 w-8 text-emerald-600 animate-bounce" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                          <Badge className="absolute bottom-4 left-4 bg-emerald-600 text-white">
                            {lastAddedPin.user} • {lastAddedPin.date}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </FloatingElement>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </FloatingElement>
      </div>

      {/* Map Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScrollReveal>
          <FloatingElement speed={0.03}>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-emerald-200">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search locations, users, or categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => {
                          setSearchTerm("");
                          setShowSearchResults(false);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-emerald-200 z-50 max-h-64 overflow-y-auto">
                        {searchResults.map((pin) => (
                          <div
                            key={pin.id}
                            className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => focusOnPin(pin)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 flex items-center">
                                  <span className="mr-2">{getCategoryIcon(pin.category)}</span>
                                  {pin.title}
                                </h4>
                                <p className="text-sm text-gray-600">{pin.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={getCategoryColor(pin.category)} variant="secondary">
                                    {pin.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500">by {pin.user}</span>
                                </div>
                              </div>
                              <MapPin className="h-5 w-5 text-emerald-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {showSearchResults && searchResults.length === 0 && searchTerm && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-emerald-200 z-50 p-4 text-center">
                        <p className="text-gray-500">No locations found for "{searchTerm}"</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={mapMode === 'view' ? 'default' : 'outline'}
                      onClick={() => setMapMode('view')}
                      className={mapMode === 'view' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant={mapMode === 'add' ? 'default' : 'outline'}
                      onClick={() => setMapMode('add')}
                      className={mapMode === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Pin
                    </Button>
                    <Button
                      variant={mapMode === 'edit' ? 'default' : 'outline'}
                      onClick={() => setMapMode('edit')}
                      className={mapMode === 'edit' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}
                    >
                      <Move className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(1, zoom - 1))}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-center">
                    {zoom}x
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(20, zoom + 1))}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </FloatingElement>
        </ScrollReveal>

        {/* Full Width Interactive Map */}
        <ScrollReveal>
          <FloatingElement speed={0.02}>
            <Card className="overflow-hidden rounded-2xl shadow-2xl border-emerald-200 bg-white/90 backdrop-blur-sm mb-12">
              <CardContent className="p-0">
                <div 
                  ref={mapRef}
                  className={`relative h-96 lg:h-[500px] bg-white/20 backdrop-blur-sm ${mapMode === 'add' ? 'cursor-crosshair' : 'cursor-grab'}`}
                  onClick={(e) => {
                    if (mapMode === 'add') {
                      const rect = mapRef.current?.getBoundingClientRect();
                      if (rect) {
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        
                        // Convert screen coordinates to lat/lng
                        const lng = (x / 100) * 360 - 180;
                        const lat = 90 - (y / 100) * 180;
                        
                        addPin(lat, lng);
                      }
                    }
                  }}
                >
                  {/* World Map Background */}
                  <div className="absolute inset-0">
                    {/* Simplified continent shapes */}
                    <div className="absolute inset-0 opacity-30">
                      {/* North America */}
                      <div className="absolute top-[20%] left-[15%] w-[25%] h-[35%] bg-green-400 rounded-lg transform rotate-12"></div>
                      {/* South America */}
                      <div className="absolute top-[45%] left-[22%] w-[12%] h-[30%] bg-green-400 rounded-lg transform rotate-12"></div>
                      {/* Europe */}
                      <div className="absolute top-[25%] left-[45%] w-[15%] h-[20%] bg-green-400 rounded-lg"></div>
                      {/* Africa */}
                      <div className="absolute top-[35%] left-[48%] w-[12%] h-[25%] bg-green-400 rounded-lg"></div>
                      {/* Asia */}
                      <div className="absolute top-[20%] left-[60%] w-[25%] h-[30%] bg-green-400 rounded-lg transform -rotate-6"></div>
                      {/* Australia */}
                      <div className="absolute top-[65%] left-[75%] w-[12%] h-[12%] bg-green-400 rounded-lg"></div>
                    </div>
                    
                    {/* Ocean effect */}
                    				<div className="absolute inset-0 bg-white/10"></div>
                  </div>

                  {/* Grid lines for reference */}
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 13 }).map((_, i) => (
                      <div key={`lat-${i}`} className="absolute border-gray-600" style={{
                        top: `${i * (100/12)}%`,
                        left: 0,
                        right: 0,
                        borderTopWidth: '1px'
                      }} />
                    ))}
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={`lng-${i}`} className="absolute border-gray-600" style={{
                        left: `${i * (100/24)}%`,
                        top: 0,
                        bottom: 0,
                        borderLeftWidth: '1px'
                      }} />
                    ))}
                  </div>

                  {/* Pins */}
                  {filteredPins.map((pin) => {
                    const position = getScreenPosition(pin.lat, pin.lng);
                    return (
                      <div
                        key={pin.id}
                        className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group z-10"
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y}%`
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPin(pin);
                        }}
                      >
                        <div className="relative">
                          <div className="flex flex-col items-center">
                            <div className="bg-white rounded-full p-1 shadow-lg border-2 border-emerald-500 group-hover:border-emerald-700 transition-colors duration-200">
                              <div className="text-lg">{getCategoryIcon(pin.category)}</div>
                            </div>
                            <MapPin className="h-6 w-6 text-emerald-600 group-hover:text-emerald-800 transition-colors duration-200 drop-shadow-lg group-hover:scale-110 transform transition-transform -mt-1" />
                          </div>
                          
                          {/* Pulse animation */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-500 rounded-full opacity-30 animate-ping"></div>
                        </div>
                        
                        {/* Pin tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                          <div className="bg-white rounded-lg shadow-xl p-3 min-w-[200px] border border-emerald-200">
                            <h4 className="font-semibold text-gray-900 mb-1 flex items-center">
                              <span className="mr-2">{getCategoryIcon(pin.category)}</span>
                              {pin.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">{pin.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge className={getCategoryColor(pin.category)} variant="secondary">
                                {pin.category}
                              </Badge>
                              <span className="text-xs text-gray-500">{pin.user}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {pin.lat.toFixed(2)}°, {pin.lng.toFixed(2)}°
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Map mode indicator */}
                  <div className="absolute top-4 left-4 z-30">
                    <Badge className="bg-white/90 text-emerald-800 border border-emerald-300 shadow-lg">
                      {mapMode === 'add' ? '🎯 Click anywhere to add a pin' : 
                       mapMode === 'edit' ? '✏️ Click pin to edit' : 
                       '👁️ View mode - Click pins for details'}
                    </Badge>
                  </div>

                  {/* Zoom indicator */}
                  <div className="absolute top-4 right-4 z-30">
                    <Badge className="bg-white/90 text-emerald-800 border border-emerald-300 shadow-lg">
                      🔍 Zoom: {zoom}x
                    </Badge>
                  </div>

                  {/* Pin count */}
                  <div className="absolute bottom-4 left-4 z-30">
                    <Badge className="bg-white/90 text-emerald-800 border border-emerald-300 shadow-lg">
                      📍 {filteredPins.length} location{filteredPins.length !== 1 ? 's' : ''} shown
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
        </ScrollReveal>

        {/* Pin Details Sidebar */}
        {selectedPin && (
          <ScrollReveal>
            <FloatingElement speed={0.025}>
              <Card className="rounded-2xl shadow-lg border-emerald-200 bg-white/90 backdrop-blur-sm mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-emerald-800 flex items-center">
                      <span className="mr-2 text-2xl">{getCategoryIcon(selectedPin.category)}</span>
                      {selectedPin.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPin(null)}
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {selectedPin.user === 'CurrentUser' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePin(selectedPin.id)}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{selectedPin.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Added by:</span>
                      <p className="text-gray-900">{selectedPin.user}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Date:</span>
                      <p className="text-gray-900">{selectedPin.date}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Category:</span>
                      <Badge className={getCategoryColor(selectedPin.category)} variant="secondary">
                        {selectedPin.category}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Coordinates:</span>
                      <p className="text-gray-900 text-xs">{selectedPin.lat.toFixed(4)}°, {selectedPin.lng.toFixed(4)}°</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FloatingElement>
          </ScrollReveal>
        )}

        {/* Stats */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Total Locations", value: pins.length.toString(), icon: MapPin, color: "emerald" },
              { label: "Active 'Streeters", value: "47", icon: Users, color: "teal" },
              { label: "Countries", value: "12", icon: Layers, color: "cyan" }
            ].map((stat, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <FloatingElement speed={0.03 + index * 0.01}>
                  <Card className="text-center p-6 rounded-2xl shadow-lg border-emerald-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                    <stat.icon className={`mx-auto h-8 w-8 mb-3 text-${stat.color}-500`} />
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </Card>
                </FloatingElement>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <Nav variant="footer" />
    </div>
  );
}