/**
 * Secure Credentials Management System
 * Handles storage and management of critical business credentials and references
 */

export interface CredentialCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface BusinessCredential {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  value: string;
  isEncrypted?: boolean;
  isSensitive: boolean;
  lastUpdated: Date;
  createdBy: string;
  tags: string[];
  notes?: string;
}

export interface CredentialAuditLog {
  id: string;
  credentialId: string;
  action: 'created' | 'updated' | 'viewed' | 'deleted' | 'exported';
  timestamp: Date;
  user: string;
  details?: string;
}

/**
 * Secure Credentials Manager
 */
export class SecureCredentialsManager {
  private credentials: BusinessCredential[] = [];
  private auditLog: CredentialAuditLog[] = [];
  private masterKey: string = 'DS24_SECURE_CREDS'; // Enhanced security key

  // Credential Categories
  private categories: CredentialCategory[] = [
    {
      id: 'shopify',
      name: 'Shopify Integration',
      description: 'Shopify store credentials and API keys',
      icon: '🛍️',
      color: 'green'
    },
    {
      id: 'amazon',
      name: 'Amazon FBA',
      description: 'Amazon seller credentials and ASINs',
      icon: '📦',
      color: 'orange'
    },
    {
      id: 'payment',
      name: 'Payment Processing',
      description: 'Payment gateway credentials and merchant IDs',
      icon: '💳',
      color: 'blue'
    },
    {
      id: 'hosting',
      name: 'Hosting & DNS',
      description: 'Domain, hosting, and DNS management credentials',
      icon: '🌐',
      color: 'purple'
    },
    {
      id: 'email',
      name: 'Email Services',
      description: 'Email marketing and transactional service credentials',
      icon: '📧',
      color: 'red'
    },
    {
      id: 'analytics',
      name: 'Analytics & Tracking',
      description: 'Google Analytics, Facebook Pixel, and tracking codes',
      icon: '📊',
      color: 'indigo'
    },
    {
      id: 'social',
      name: 'Social Media',
      description: 'Social media platform credentials and API keys',
      icon: '📱',
      color: 'pink'
    },
    {
      id: 'legal',
      name: 'Legal & Compliance',
      description: 'Business licenses, tax IDs, and legal references',
      icon: '⚖️',
      color: 'gray'
    },
    {
      id: 'banking',
      name: 'Banking & Financial',
      description: 'Bank account information and financial service credentials',
      icon: '🏦',
      color: 'yellow'
    },
    {
      id: 'other',
      name: 'Other Services',
      description: 'Miscellaneous service credentials and references',
      icon: '🔧',
      color: 'teal'
    }
  ];

  constructor() {
    this.loadCredentials();
  }

  /**
   * Get all credential categories
   */
  getCategories(): CredentialCategory[] {
    return this.categories;
  }

  /**
   * Get credentials by category
   */
  getCredentialsByCategory(categoryId: string): BusinessCredential[] {
    return this.credentials.filter(cred => cred.categoryId === categoryId);
  }

  /**
   * Get all credentials (for admin view)
   */
  getAllCredentials(): BusinessCredential[] {
    return this.credentials;
  }

  /**
   * Add new credential
   */
  addCredential(credential: Omit<BusinessCredential, 'id' | 'lastUpdated' | 'createdBy'>): string {
    const id = `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newCredential: BusinessCredential = {
      ...credential,
      id,
      lastUpdated: new Date(),
      createdBy: 'admin'
    };

    // Encrypt sensitive values
    if (newCredential.isSensitive) {
      newCredential.value = this.encrypt(newCredential.value);
      newCredential.isEncrypted = true;
    }

    this.credentials.push(newCredential);
    this.logAudit('created', id, 'admin', 'Credential created');
    this.saveCredentials();
    
    return id;
  }

  /**
   * Update existing credential
   */
  updateCredential(id: string, updates: Partial<BusinessCredential>): boolean {
    const index = this.credentials.findIndex(cred => cred.id === id);
    if (index === -1) return false;

    const oldCredential = { ...this.credentials[index] };
    
    // Handle encryption for sensitive updates
    if (updates.value && this.credentials[index].isSensitive) {
      updates.value = this.encrypt(updates.value);
      updates.isEncrypted = true;
    }

    this.credentials[index] = {
      ...this.credentials[index],
      ...updates,
      lastUpdated: new Date()
    };

    this.logAudit('updated', id, 'admin', 'Credential updated');
    this.saveCredentials();
    
    return true;
  }

  /**
   * Delete credential
   */
  deleteCredential(id: string): boolean {
    const index = this.credentials.findIndex(cred => cred.id === id);
    if (index === -1) return false;

    this.credentials.splice(index, 1);
    this.logAudit('deleted', id, 'admin', 'Credential deleted');
    this.saveCredentials();
    
    return true;
  }

  /**
   * Get credential value (decrypt if needed)
   */
  getCredentialValue(id: string): string | null {
    const credential = this.credentials.find(cred => cred.id === id);
    if (!credential) return null;

    this.logAudit('viewed', id, 'admin', 'Credential value accessed');

    if (credential.isEncrypted) {
      return this.decrypt(credential.value);
    }
    
    return credential.value;
  }

  /**
   * Search credentials
   */
  searchCredentials(query: string): BusinessCredential[] {
    const lowercaseQuery = query.toLowerCase();
    return this.credentials.filter(cred => 
      cred.name.toLowerCase().includes(lowercaseQuery) ||
      cred.description.toLowerCase().includes(lowercaseQuery) ||
      cred.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Export credentials to CSV (encrypted values shown as [ENCRYPTED])
   */
  exportCredentials(): string {
    const headers = [
      'ID',
      'Category',
      'Name',
      'Description',
      'Value',
      'Is Sensitive',
      'Last Updated',
      'Created By',
      'Tags',
      'Notes'
    ];

    const rows = this.credentials.map(cred => {
      const category = this.categories.find(cat => cat.id === cred.categoryId);
      return [
        cred.id,
        category?.name || 'Unknown',
        cred.name,
        cred.description,
        cred.isEncrypted ? '[ENCRYPTED]' : cred.value,
        cred.isSensitive ? 'Yes' : 'No',
        cred.lastUpdated.toISOString(),
        cred.createdBy,
        cred.tags.join(';'),
        cred.notes || ''
      ];
    });

    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }

  /**
   * Get audit log
   */
  getAuditLog(): CredentialAuditLog[] {
    return this.auditLog.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Simple encryption (in production, use proper encryption)
   */
  private encrypt(text: string): string {
    // Simple base64 encoding with key (in production, use proper encryption)
    const combined = this.masterKey + text;
    return btoa(combined);
  }

  /**
   * Simple decryption (in production, use proper decryption)
   */
  private decrypt(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText);
      return decoded.replace(this.masterKey, '');
    } catch {
      return '[DECRYPTION_ERROR]';
    }
  }

  /**
   * Log audit trail
   */
  private logAudit(action: string, credentialId: string, user: string, details?: string): void {
    const logEntry: CredentialAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      credentialId,
      action: action as any,
      timestamp: new Date(),
      user,
      details
    };
    
    this.auditLog.push(logEntry);
    
    // Keep only last 1000 audit entries
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000);
    }
  }

  /**
   * Save credentials to localStorage
   */
  private saveCredentials(): void {
    try {
      localStorage.setItem('ds_secure_credentials', JSON.stringify(this.credentials));
      localStorage.setItem('ds_audit_log', JSON.stringify(this.auditLog));
    } catch (error) {
      console.error('Failed to save credentials:', error);
    }
  }

  /**
   * Load credentials from localStorage
   */
  private loadCredentials(): void {
    try {
      const savedCredentials = localStorage.getItem('ds_secure_credentials');
      const savedAuditLog = localStorage.getItem('ds_audit_log');
      
      if (savedCredentials) {
        this.credentials = JSON.parse(savedCredentials).map((cred: any) => ({
          ...cred,
          lastUpdated: new Date(cred.lastUpdated)
        }));
      }
      
      if (savedAuditLog) {
        this.auditLog = JSON.parse(savedAuditLog).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load credentials:', error);
      this.credentials = [];
      this.auditLog = [];
    }
  }
}

// Export singleton instance
export const secureCredentialsManager = new SecureCredentialsManager();
