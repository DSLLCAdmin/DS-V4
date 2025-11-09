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

interface ProductInterestEmailData {
  productId: string;
  productTitle: string;
  productCategory: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerMessage?: string;
  productsVisited?: string[];
  productsPurchased?: string[];
  referrer?: string;
  userAgent?: string;
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

  // Send product interest email to ProductInterest@zoho
  const sendProductInterestEmail = async (data: ProductInterestEmailData): Promise<boolean> => {
    try {
      const response = await fetch('/api/product-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to send product interest email:', error);
        return false;
      }

      const result = await response.json();
      console.log('Product interest email sent:', result);
      return true;
    } catch (error) {
      console.error('Error sending product interest email:', error);
      return false;
    }
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
    sendProductInterestEmail,
    interestData
  };
}
