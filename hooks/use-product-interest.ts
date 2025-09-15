import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface ProductInterest {
  productId: string;
  count: number;
  lastUpdated: string;
}

interface InterestData {
  [productId: string]: ProductInterest;
}

export function useProductInterest() {
  const [interestData, setInterestData] = useState<InterestData>({});

  // Load interest data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('product-interest');
    if (stored) {
      try {
        setInterestData(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse interest data:', error);
      }
    }
  }, []);

  // Track interest in a product
  const trackInterest = async (productId: string, productTitle?: string, productCategory?: string) => {
    const newData = { ...interestData };
    
    if (newData[productId]) {
      newData[productId].count += 1;
    } else {
      newData[productId] = {
        productId,
        count: 1,
        lastUpdated: new Date().toISOString()
      };
    }
    
    newData[productId].lastUpdated = new Date().toISOString();
    
    setInterestData(newData);
    localStorage.setItem('product-interest', JSON.stringify(newData));
    
    // Send to analytics system
    if (productTitle && productCategory) {
      await analytics.trackProductInterest(productId, productTitle, productCategory);
    }
    
    console.log(`Interest tracked for product ${productId}. Total interest: ${newData[productId].count}`);
  };

  // Get interest count for a product
  const getInterestCount = (productId: string): number => {
    return interestData[productId]?.count || 0;
  };

  // Get all interest data (for admin/analytics)
  const getAllInterestData = (): ProductInterest[] => {
    return Object.values(interestData);
  };

  return {
    trackInterest,
    getInterestCount,
    getAllInterestData,
    interestData
  };
}
