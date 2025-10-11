/**
 * Manual Tax Calculation Utility
 * Fallback system for calculating taxes when Shopify tax calculation fails
 */

// US State Tax Rates (as of 2024)
const US_STATE_TAX_RATES: Record<string, number> = {
  // No sales tax states
  'AK': 0, // Alaska
  'DE': 0, // Delaware
  'MT': 0, // Montana
  'NH': 0, // New Hampshire
  'OR': 0, // Oregon
  
  // Low tax states
  'CO': 0.029, // Colorado - 2.9%
  'WY': 0.04,  // Wyoming - 4% (you mentioned 6%, but standard is 4%)
  'HI': 0.04,  // Hawaii - 4%
  'ID': 0.06,  // Idaho - 6%
  'UT': 0.061, // Utah - 6.1%
  
  // Medium tax states
  'AZ': 0.056, // Arizona - 5.6%
  'NM': 0.051, // New Mexico - 5.1%
  'TX': 0.0625, // Texas - 6.25%
  'NV': 0.0685, // Nevada - 6.85%
  'WA': 0.065, // Washington - 6.5%
  
  // Higher tax states
  'CA': 0.0725, // California - 7.25% (your current rate is 8.5%)
  'NY': 0.08,   // New York - 8%
  'IL': 0.0625, // Illinois - 6.25%
  'FL': 0.06,   // Florida - 6%
  'PA': 0.06,   // Pennsylvania - 6%
  
  // High tax states
  'TN': 0.07,   // Tennessee - 7%
  'AR': 0.065,  // Arkansas - 6.5%
  'KS': 0.065,  // Kansas - 6.5%
  'MO': 0.0425, // Missouri - 4.225%
  'OK': 0.045,  // Oklahoma - 4.5%
  
  // Default fallback
  'DEFAULT': 0.06 // 6% default rate
};

// Product tax categories
export interface ProductTaxCategory {
  id: string;
  name: string;
  taxable: boolean;
  taxRate?: number; // Override rate if needed
}

export const PRODUCT_TAX_CATEGORIES: Record<string, ProductTaxCategory> = {
  'books': {
    id: 'books',
    name: 'Books',
    taxable: true
  },
  'digital_products': {
    id: 'digital_products',
    name: 'Digital Products',
    taxable: true
  },
  'apparel': {
    id: 'apparel',
    name: 'Apparel',
    taxable: true
  },
  'non_taxable': {
    id: 'non_taxable',
    name: 'Non-Taxable',
    taxable: false
  }
};

// Tax calculation result
export interface TaxCalculationResult {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  taxRate: number;
  state: string;
  taxable: boolean;
}

/**
 * Calculate tax for an order
 */
export function calculateTax(
  subtotal: number,
  shipping: number,
  state: string,
  productCategory: string = 'general_merchandise'
): TaxCalculationResult {
  // Get product tax category
  const category = PRODUCT_TAX_CATEGORIES[productCategory] || PRODUCT_TAX_CATEGORIES['apparel'];
  
  // If product is not taxable, return zero tax
  if (!category.taxable) {
    return {
      subtotal,
      shipping,
      tax: 0,
      total: subtotal + shipping,
      taxRate: 0,
      state,
      taxable: false
    };
  }
  
  // Get tax rate for state
  const stateCode = state.toUpperCase();
  const taxRate = US_STATE_TAX_RATES[stateCode] || US_STATE_TAX_RATES['DEFAULT'];
  
  // Calculate tax on subtotal + shipping
  const taxableAmount = subtotal + shipping;
  const tax = Math.round(taxableAmount * taxRate * 100) / 100;
  
  return {
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    taxRate,
    state: stateCode,
    taxable: true
  };
}

/**
 * Get tax rate for a specific state
 */
export function getTaxRate(state: string): number {
  const stateCode = state.toUpperCase();
  return US_STATE_TAX_RATES[stateCode] || US_STATE_TAX_RATES['DEFAULT'];
}

/**
 * Format tax calculation result for display
 */
export function formatTaxResult(result: TaxCalculationResult): string {
  if (!result.taxable) {
    return 'No tax applicable';
  }
  
  return `${(result.taxRate * 100).toFixed(1)}% (${result.state})`;
}

/**
 * Validate tax calculation
 */
export function validateTaxCalculation(
  expectedTotal: number,
  actualTotal: number,
  tolerance: number = 0.01
): boolean {
  return Math.abs(expectedTotal - actualTotal) <= tolerance;
}

// Example usage:
/*
const taxResult = calculateTax(19.98, 4.90, 'WY', 'books');
console.log('Tax Calculation:', taxResult);
console.log('Tax Rate:', formatTaxResult(taxResult));
console.log('Total:', `$${taxResult.total.toFixed(2)}`);
*/
