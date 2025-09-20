/**
 * GTIN Assignment System for Amazon Compliance
 * Handles bulk assignment of UPC/EAN/ISBN codes for Amazon FBA products
 */

import { UnifiedProduct } from './unified-product-data';

export interface GTINAssignment {
  productId: string;
  productTitle: string;
  category: string;
  currentGTIN?: string;
  assignedGTIN?: string;
  gtinType: 'UPC' | 'EAN' | 'ISBN' | 'GTIN-14';
  status: 'pending' | 'assigned' | 'validated' | 'error';
  error?: string;
}

export interface GTINBatch {
  id: string;
  name: string;
  description: string;
  assignments: GTINAssignment[];
  createdAt: Date;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  totalProducts: number;
  successfulAssignments: number;
  failedAssignments: number;
}

/**
 * GTIN Generator for different product types
 */
export class GTINGenerator {
  /**
   * Generate ISBN for books (13-digit)
   */
  static generateISBN(): string {
    // Generate a valid ISBN-13
    const prefix = '978'; // Bookland prefix
    const registrationGroup = '0'; // English language
    const registrant = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const publication = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Calculate check digit
    const isbn12 = prefix + registrationGroup + registrant + publication;
    const checkDigit = this.calculateISBNCheckDigit(isbn12);
    
    return isbn12 + checkDigit;
  }

  /**
   * Generate UPC for general products (12-digit)
   */
  static generateUPC(): string {
    // Generate a valid UPC-A
    const companyPrefix = '123456'; // DS LLC company prefix
    const itemNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    // Calculate check digit
    const upc11 = companyPrefix + itemNumber;
    const checkDigit = this.calculateUPCCheckDigit(upc11);
    
    return upc11 + checkDigit;
  }

  /**
   * Generate EAN for international products (13-digit)
   */
  static generateEAN(): string {
    // Generate a valid EAN-13
    const countryCode = '00'; // Generic country code
    const companyPrefix = '12345'; // DS LLC company prefix
    const itemNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    // Calculate check digit
    const ean12 = countryCode + companyPrefix + itemNumber;
    const checkDigit = this.calculateEANCheckDigit(ean12);
    
    return ean12 + checkDigit;
  }

  /**
   * Generate GTIN-14 for case/pallet products (14-digit)
   */
  static generateGTIN14(): string {
    // Generate a valid GTIN-14
    const indicator = '1'; // Case indicator
    const companyPrefix = '123456'; // DS LLC company prefix
    const itemNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    // Calculate check digit
    const gtin13 = indicator + companyPrefix + itemNumber;
    const checkDigit = this.calculateGTIN14CheckDigit(gtin13);
    
    return gtin13 + checkDigit;
  }

  /**
   * Calculate ISBN-13 check digit
   */
  private static calculateISBNCheckDigit(isbn12: string): string {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(isbn12[i]);
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const remainder = sum % 10;
    return remainder === 0 ? '0' : (10 - remainder).toString();
  }

  /**
   * Calculate UPC check digit
   */
  private static calculateUPCCheckDigit(upc11: string): string {
    let sum = 0;
    for (let i = 0; i < 11; i++) {
      const digit = parseInt(upc11[i]);
      sum += (i % 2 === 0) ? digit * 3 : digit;
    }
    const remainder = sum % 10;
    return remainder === 0 ? '0' : (10 - remainder).toString();
  }

  /**
   * Calculate EAN check digit
   */
  private static calculateEANCheckDigit(ean12: string): string {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(ean12[i]);
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const remainder = sum % 10;
    return remainder === 0 ? '0' : (10 - remainder).toString();
  }

  /**
   * Calculate GTIN-14 check digit
   */
  private static calculateGTIN14CheckDigit(gtin13: string): string {
    let sum = 0;
    for (let i = 0; i < 13; i++) {
      const digit = parseInt(gtin13[i]);
      sum += (i % 2 === 0) ? digit * 3 : digit;
    }
    const remainder = sum % 10;
    return remainder === 0 ? '0' : (10 - remainder).toString();
  }
}

/**
 * GTIN Assignment Manager
 */
export class GTINAssignmentManager {
  private batches: GTINBatch[] = [];

  /**
   * Create a new GTIN assignment batch
   */
  createBatch(name: string, description: string, products: UnifiedProduct[]): GTINBatch {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const assignments: GTINAssignment[] = products.map(product => ({
      productId: product.id,
      productTitle: product.title,
      category: product.category,
      currentGTIN: product.gtin,
      gtinType: this.determineGTINType(product.category),
      status: 'pending'
    }));

    const batch: GTINBatch = {
      id: batchId,
      name,
      description,
      assignments,
      createdAt: new Date(),
      status: 'draft',
      totalProducts: products.length,
      successfulAssignments: 0,
      failedAssignments: 0
    };

    this.batches.push(batch);
    return batch;
  }

  /**
   * Process GTIN assignments for a batch
   */
  async processBatch(batchId: string): Promise<GTINBatch> {
    const batch = this.batches.find(b => b.id === batchId);
    if (!batch) {
      throw new Error(`Batch ${batchId} not found`);
    }

    batch.status = 'processing';
    batch.successfulAssignments = 0;
    batch.failedAssignments = 0;

    for (const assignment of batch.assignments) {
      try {
        // Generate appropriate GTIN based on product category
        assignment.assignedGTIN = this.generateGTINForProduct(assignment.category);
        assignment.status = 'assigned';
        batch.successfulAssignments++;
        
        console.log(`✅ Assigned ${assignment.gtinType}: ${assignment.assignedGTIN} to ${assignment.productTitle}`);
      } catch (error) {
        assignment.status = 'error';
        assignment.error = error instanceof Error ? error.message : 'Unknown error';
        batch.failedAssignments++;
        
        console.error(`❌ Failed to assign GTIN to ${assignment.productTitle}:`, error);
      }
    }

    batch.status = batch.failedAssignments === 0 ? 'completed' : 'failed';
    return batch;
  }

  /**
   * Determine appropriate GTIN type for product category
   */
  private determineGTINType(category: string): 'UPC' | 'EAN' | 'ISBN' | 'GTIN-14' {
    switch (category) {
      case 'Serials/Books':
        return 'ISBN';
      case 'Apparel & Intimate Wear':
        return 'UPC';
      case 'Culinary & Novelty':
        return 'UPC';
      case 'Media & Experiences':
        return 'EAN';
      case 'Digital & Curated Services':
        return 'EAN';
      default:
        return 'UPC';
    }
  }

  /**
   * Generate GTIN for specific product category
   */
  private generateGTINForProduct(category: string): string {
    switch (category) {
      case 'Serials/Books':
        return GTINGenerator.generateISBN();
      case 'Apparel & Intimate Wear':
      case 'Culinary & Novelty':
        return GTINGenerator.generateUPC();
      case 'Media & Experiences':
      case 'Digital & Curated Services':
        return GTINGenerator.generateEAN();
      default:
        return GTINGenerator.generateUPC();
    }
  }

  /**
   * Get all batches
   */
  getBatches(): GTINBatch[] {
    return this.batches;
  }

  /**
   * Get batch by ID
   */
  getBatch(batchId: string): GTINBatch | undefined {
    return this.batches.find(b => b.id === batchId);
  }

  /**
   * Export batch assignments to CSV
   */
  exportBatchToCSV(batchId: string): string {
    const batch = this.getBatch(batchId);
    if (!batch) {
      throw new Error(`Batch ${batchId} not found`);
    }

    const headers = [
      'Product ID',
      'Product Title',
      'Category',
      'GTIN Type',
      'Current GTIN',
      'Assigned GTIN',
      'Status',
      'Error'
    ];

    const rows = batch.assignments.map(assignment => [
      assignment.productId,
      assignment.productTitle,
      assignment.category,
      assignment.gtinType,
      assignment.currentGTIN || '',
      assignment.assignedGTIN || '',
      assignment.status,
      assignment.error || ''
    ]);

    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }

  /**
   * Validate GTIN format
   */
  static validateGTIN(gtin: string, type: 'UPC' | 'EAN' | 'ISBN' | 'GTIN-14'): boolean {
    switch (type) {
      case 'UPC':
        return /^\d{12}$/.test(gtin);
      case 'EAN':
        return /^\d{13}$/.test(gtin);
      case 'ISBN':
        return /^\d{13}$/.test(gtin);
      case 'GTIN-14':
        return /^\d{14}$/.test(gtin);
      default:
        return false;
    }
  }
}

// Export singleton instance
export const gtinManager = new GTINAssignmentManager();
