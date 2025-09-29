'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cloud,
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Database,
  HardDrive,
  Wifi
} from 'lucide-react';

interface BackupTask {
  id: string;
  name: string;
  type: 'database' | 'files' | 'config';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  progress: number;
  size?: string;
}

export default function CloudBackupDashboard() {
  const [backups, setBackups] = useState<BackupTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);

  useEffect(() => {
    // Mock backup data initialization
    const mockBackups: BackupTask[] = [
      {
        id: 'backup-1',
        name: 'Product Database',
        type: 'database',
        status: 'completed',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000), // 2 hours ago + 5 minutes
        progress: 100,
        size: '2.3 MB'
      },
      {
        id: 'backup-2',
        name: 'Image Assets',
        type: 'files',
        status: 'completed',
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        endTime: new Date(Date.now() - 4 * 60 * 60 * 1000 + 12 * 60 * 1000), // 4 hours ago + 12 minutes
        progress: 100,
        size: '45.7 MB'
      },
      {
        id: 'backup-3',
        name: 'Configuration Files',
        type: 'config',
        status: 'running',
        startTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        progress: 67
      }
    ];

    setBackups(mockBackups);
    setLastBackup(new Date(Date.now() - 2 * 60 * 60 * 1000));
    setIsLoading(false);
  }, []);

  const startBackup = async () => {
    const newBackup: BackupTask = {
      id: `backup-${Date.now()}`,
      name: 'Manual Backup',
      type: 'database',
      status: 'running',
      startTime: new Date(),
      progress: 0
    };

    setBackups(prev => [newBackup, ...prev]);
    
    // Mock backup simulation
    setTimeout(() => {
      setBackups(prev => prev.map(b => 
        b.id === newBackup.id 
          ? { ...b, status: 'completed', progress: 100, endTime: new Date(), size: '1.8 MB' }
          : b
      ));
      setLastBackup(new Date());
    }, 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="h-4 w-4 text-blue-600" />;
      case 'files':
        return <HardDrive className="h-4 w-4 text-green-600" />;
      case 'config':
        return <Wifi className="h-4 w-4 text-orange-600" />;
      default:
        return <Cloud className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cloud Backup System</h2>
          <p className="text-gray-600">Automated backup and synchronization for DarkStreet LLC</p>
        </div>
        <button
          onClick={startBackup}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Cloud className="h-4 w-4" />
          <span>Start Backup</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Backups</p>
              <p className="text-2xl font-bold text-gray-900">{backups.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Backup</p>
              <p className="text-lg font-bold text-gray-900">
                {lastBackup ? lastBackup.toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <HardDrive className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">67.8 MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Tasks */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Backups</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {backups.map((backup) => (
            <div key={backup.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(backup.type)}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{backup.name}</h4>
                    <p className="text-sm text-gray-500">
                      Started {backup.startTime.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {backup.status === 'running' && (
                    <div className="text-sm text-gray-600">
                      {backup.progress}% complete
                    </div>
                  )}
                  
                  {backup.status === 'completed' && backup.size && (
                    <div className="text-sm text-gray-600">{backup.size}</div>
                  )}
                  
                  {getStatusIcon(backup.status)}
                </div>
              </div>
              
              {backup.status === 'running' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${backup.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Restore Options</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Download className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Restore Database</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Cloud className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Sync to Cloud</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto Backup</span>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Compression</span>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
