'use client';

import React, { useState, useEffect } from 'react';
import { exportSettings, ExportSettings } from '@/lib/export-settings';

interface ExportSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ExportSettings) => void;
}

export function ExportSettingsModal({ isOpen, onClose, onSave }: ExportSettingsModalProps) {
  const [settings, setSettings] = useState<ExportSettings>(exportSettings.getSettings());
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(exportSettings.getSettings());
    }
  }, [isOpen]);

  const handleSave = () => {
    exportSettings.updateSettings(settings);
    onSave(settings);
    onClose();
  };

  const handleReset = () => {
    exportSettings.resetToDefaults();
    setSettings(exportSettings.getSettings());
  };

  const suggestedPaths = exportSettings.getSuggestedPaths();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Export Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Default Export Path */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Export Path
            </label>
            <input
              type="text"
              value={settings.defaultPath}
              onChange={(e) => setSettings({ ...settings, defaultPath: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="D:\A-Knox\DS LLC\DS Website-Next_2\DS_2\exports"
            />
            <p className="text-xs text-gray-500 mt-1">
              Base directory where all exports will be saved
            </p>
          </div>

          {/* Suggested Paths */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggested Paths
            </label>
            <div className="space-y-2">
              {suggestedPaths.map((path, index) => (
                <button
                  key={index}
                  onClick={() => setSettings({ ...settings, defaultPath: path })}
                  className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  {path}
                </button>
              ))}
            </div>
          </div>

          {/* Subdirectories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Subdirectories
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Orders</label>
                <input
                  type="text"
                  value={settings.subdirectories.orders}
                  onChange={(e) => setSettings({
                    ...settings,
                    subdirectories: { ...settings.subdirectories, orders: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Customers</label>
                <input
                  type="text"
                  value={settings.subdirectories.customers}
                  onChange={(e) => setSettings({
                    ...settings,
                    subdirectories: { ...settings.subdirectories, customers: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Analytics</label>
                <input
                  type="text"
                  value={settings.subdirectories.analytics}
                  onChange={(e) => setSettings({
                    ...settings,
                    subdirectories: { ...settings.subdirectories, analytics: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Reports</label>
                <input
                  type="text"
                  value={settings.subdirectories.reports}
                  onChange={(e) => setSettings({
                    ...settings,
                    subdirectories: { ...settings.subdirectories, reports: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Filename Formats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Filename Formats
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Orders</label>
                <input
                  type="text"
                  value={settings.filenameFormat.orders}
                  onChange={(e) => setSettings({
                    ...settings,
                    filenameFormat: { ...settings.filenameFormat, orders: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="orders-export-{date}.csv"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Customers</label>
                <input
                  type="text"
                  value={settings.filenameFormat.customers}
                  onChange={(e) => setSettings({
                    ...settings,
                    filenameFormat: { ...settings.filenameFormat, customers: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="customers-export-{date}.csv"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Analytics</label>
                <input
                  type="text"
                  value={settings.filenameFormat.analytics}
                  onChange={(e) => setSettings({
                    ...settings,
                    filenameFormat: { ...settings.filenameFormat, analytics: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="analytics-report-{date}.csv"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Use {'{date}'} for automatic date insertion (YYYY-MM-DD format)
            </p>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Orders:</strong> {exportSettings.getFullFilePath('orders')}</div>
              <div><strong>Customers:</strong> {exportSettings.getFullFilePath('customers')}</div>
              <div><strong>Analytics:</strong> {exportSettings.getFullFilePath('analytics')}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
