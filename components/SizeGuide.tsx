'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Ruler, X } from 'lucide-react';

interface SizeGuideProps {
  sizeGuide?: {
    imperial: { [key: string]: { length: string; width: string } };
    metric: { [key: string]: { length: string; width: string } };
  };
  sizeGuideImages?: {
    imperial: string;
    metric: string;
    selector: string;
  };
}

export const SizeGuide: React.FC<SizeGuideProps> = ({ sizeGuide, sizeGuideImages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');

  if (!sizeGuide && !sizeGuideImages) {
    return null;
  }

  return (
    <>
      {/* Size Guide Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors text-sm"
      >
        <Ruler className="w-4 h-4" />
        <span>Size Guide</span>
      </button>

      {/* Size Guide Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="p-6 border-b">
              <div className="flex space-x-4">
                <button
                  onClick={() => setUnit('imperial')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    unit === 'imperial'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Imperial (inches)
                </button>
                <button
                  onClick={() => setUnit('metric')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    unit === 'metric'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Metric (cm)
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Size Guide Images */}
              {sizeGuideImages && (
                <div className="mb-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Size Guide Chart */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Size Chart ({unit === 'imperial' ? 'Inches' : 'Centimeters'})
                      </h3>
                      <div className="relative">
                        <Image
                          src={unit === 'imperial' ? sizeGuideImages.imperial : sizeGuideImages.metric}
                          alt={`Size guide in ${unit}`}
                          width={400}
                          height={300}
                          className="rounded-lg border"
                        />
                      </div>
                    </div>

                    {/* Size Selector */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Size Selector</h3>
                      <div className="relative">
                        <Image
                          src={sizeGuideImages.selector}
                          alt="Size selector interface"
                          width={400}
                          height={200}
                          className="rounded-lg border"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Size Guide Table */}
              {sizeGuide && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Measurements ({unit === 'imperial' ? 'Inches' : 'Centimeters'})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 rounded-lg">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                            Size
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                            Body Length ({unit === 'imperial' ? 'inches' : 'cm'})
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                            Body Width ({unit === 'imperial' ? 'inches' : 'cm'})
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(sizeGuide[unit]).map(([size, measurements]) => (
                          <tr key={size} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                              {size}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-700">
                              {measurements.length}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-700">
                              {measurements.width}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* How to Measure */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Measure</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Body Length</h4>
                    <p className="text-gray-700 text-sm">
                      Measure from the highest point of the shoulder to the bottom hem of the garment.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Body Width</h4>
                    <p className="text-gray-700 text-sm">
                      Measure across the chest from armpit to armpit, then double the measurement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
