export default function TestPage() {
  return (
    <div className="min-h-screen bg-orange-500 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">SPACING TEST SANDBOX</h1>
      
      {/* TEST 1: Tailwind Classes */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4">TEST 1: Tailwind Classes</h2>
        <div className="bg-yellow-300 text-black p-4 rounded mb-8">
          Header with mb-8
        </div>
        <div className="bg-white p-4 rounded">
          Product Card
        </div>
      </div>

      {/* TEST 2: Inline Styles */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4">TEST 2: Inline Styles</h2>
        <div className="bg-yellow-300 text-black p-4 rounded" style={{ marginBottom: '32px' }}>
          Header with style marginBottom: 32px
        </div>
        <div className="bg-white p-4 rounded">
          Product Card
        </div>
      </div>

      {/* TEST 3: Physical Spacing Div */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4">TEST 3: Physical Spacing Div</h2>
        <div className="bg-yellow-300 text-black p-4 rounded">
          Header
        </div>
        <div style={{ height: '32px' }}></div>
        <div className="bg-white p-4 rounded">
          Product Card
        </div>
      </div>

      {/* TEST 4: Padding Approach */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4">TEST 4: Padding Approach</h2>
        <div className="bg-yellow-300 text-black p-4 rounded" style={{ paddingBottom: '32px' }}>
          Header with paddingBottom: 32px
        </div>
        <div className="bg-white p-4 rounded">
          Product Card
        </div>
      </div>

      {/* TEST 5: Z-Index Approach */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-white mb-4">TEST 5: Z-Index Approach</h2>
        <div className="bg-yellow-300 text-black p-4 rounded relative z-10" style={{ marginBottom: '32px' }}>
          Header with z-10
        </div>
        <div className="bg-white p-4 rounded relative z-0">
          Product Card with z-0
        </div>
      </div>
    </div>
  );
}
