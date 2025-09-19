/**
 * Export Settings Management
 * Handles default export paths and file organization for DS LLC
 */

export interface ExportSettings {
  defaultPath: string;
  subdirectories: {
    orders: string;
    customers: string;
    analytics: string;
    reports: string;
  };
  filenameFormat: {
    orders: string;
    customers: string;
    analytics: string;
  };
}

export class ExportSettingsManager {
  private static instance: ExportSettingsManager;
  private settings: ExportSettings;

  private constructor() {
    // Default settings for DS LLC
    this.settings = {
      defaultPath: 'D:\\A-Knox\\DS LLC\\DS Website-Next_2\\DS_2\\exports',
      subdirectories: {
        orders: 'orders',
        customers: 'customers', 
        analytics: 'analytics',
        reports: 'reports'
      },
      filenameFormat: {
        orders: 'orders-export-{date}.csv',
        customers: 'customers-export-{date}.csv',
        analytics: 'analytics-report-{date}.csv'
      }
    };

    // Load saved settings from localStorage
    this.loadSettings();
  }

  public static getInstance(): ExportSettingsManager {
    if (!ExportSettingsManager.instance) {
      ExportSettingsManager.instance = new ExportSettingsManager();
    }
    return ExportSettingsManager.instance;
  }

  /**
   * Get current export settings
   */
  getSettings(): ExportSettings {
    return { ...this.settings };
  }

  /**
   * Update export settings
   */
  updateSettings(newSettings: Partial<ExportSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    console.log('📁 Export settings updated:', this.settings);
  }

  /**
   * Get full path for export type
   */
  getExportPath(type: 'orders' | 'customers' | 'analytics' | 'reports'): string {
    const subdir = this.settings.subdirectories[type];
    return `${this.settings.defaultPath}\\${subdir}`;
  }

  /**
   * Generate filename with date
   */
  generateFilename(type: 'orders' | 'customers' | 'analytics'): string {
    const format = this.settings.filenameFormat[type];
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return format.replace('{date}', date);
  }

  /**
   * Get full file path for export
   */
  getFullFilePath(type: 'orders' | 'customers' | 'analytics' | 'reports'): string {
    if (type === 'reports') {
      return `${this.getExportPath(type)}\\report-${new Date().toISOString().split('T')[0]}.csv`;
    }
    const filename = this.generateFilename(type);
    return `${this.getExportPath(type)}\\${filename}`;
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ds_export_settings', JSON.stringify(this.settings));
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ds_export_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.settings = { ...this.settings, ...parsed };
        } catch (error) {
          console.warn('Failed to load export settings:', error);
        }
      }
    }
  }

  /**
   * Reset to default settings
   */
  resetToDefaults(): void {
    this.settings = {
      defaultPath: 'D:\\A-Knox\\DS LLC\\DS Website-Next_2\\DS_2\\exports',
      subdirectories: {
        orders: 'orders',
        customers: 'customers',
        analytics: 'analytics', 
        reports: 'reports'
      },
      filenameFormat: {
        orders: 'orders-export-{date}.csv',
        customers: 'customers-export-{date}.csv',
        analytics: 'analytics-report-{date}.csv'
      }
    };
    this.saveSettings();
  }

  /**
   * Validate path exists (for future file system integration)
   */
  async validatePath(path: string): Promise<boolean> {
    // For now, return true - in production this would check if path exists
    return true;
  }

  /**
   * Get suggested paths based on common business locations
   */
  getSuggestedPaths(): string[] {
    return [
      'D:\\A-Knox\\DS LLC\\DS Website-Next_2\\DS_2\\exports',
      'C:\\Users\\Admin\\Documents\\DS LLC\\Exports',
      'D:\\A-Knox\\DS LLC\\Business Files\\Exports',
      'C:\\Users\\Admin\\Desktop\\DS Exports',
      'D:\\A-Knox\\DS LLC\\Reports\\Exports'
    ];
  }
}

// Export singleton instance
export const exportSettings = ExportSettingsManager.getInstance();
