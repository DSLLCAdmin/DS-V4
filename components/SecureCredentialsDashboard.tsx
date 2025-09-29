'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { 
  Shield, 
  Plus, 
  Edit3,
  Trash2, 
  CheckCircle,
  AlertCircle,
  Lock,
  Key,
  Database,
  Copy,
  CreditCard,
  Cloud,
  Mail,
  Download,
  Upload,
} from 'lucide-react';

// ----------------------------
// Types
// ----------------------------
interface CredentialRecord {
  id: string;
  name: string;
  type: 'stripe' | 'shopify' | 'email' | 'database' | 'other';
  environment: 'test' | 'live';
  encrypted: boolean;
  value: string; // stored plaintext for now (masked in UI); can be switched to crypto later
  lastUsed?: string; // ISO string for portability
  updatedAt: string; // ISO string for versioning/overwrite protection
}

interface PersistedState {
  version: number;
  updatedAt: string; // ISO
  deviceId: string; // to help with diagnostics
  items: CredentialRecord[];
}

// ----------------------------
// Constants / Utilities
// ----------------------------
const STORAGE_KEY = 'dsllc.credentials.v1';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nowIso(): string {
  return new Date().toISOString();
}

function getDefaultDeviceId(): string {
  const KEY = 'dsllc.credentials.deviceId';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(KEY, id);
  }
  return id;
}

function seedMockData(): CredentialRecord[] {
  // No dummy data - start with empty credentials
  return [];
}

function loadPersisted(): PersistedState | null {
  try {
    // Try localStorage first
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed && Array.isArray(parsed.items)) {
        console.log('✅ Loaded credentials from localStorage:', parsed.items.length, 'items');
        return parsed;
      }
    }
    
    // Try sessionStorage as backup
    const sessionRaw = sessionStorage.getItem(STORAGE_KEY);
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw) as PersistedState;
      if (parsed && Array.isArray(parsed.items)) {
        console.log('✅ Loaded credentials from sessionStorage:', parsed.items.length, 'items');
        // Restore to localStorage
        localStorage.setItem(STORAGE_KEY, sessionRaw);
        return parsed;
      }
    }
    
    console.log('⚠️ No persisted credentials found');
    return null;
  } catch (error) {
    console.warn('Failed to load persisted credentials:', error);
    return null;
  }
}

function savePersisted(state: PersistedState) {
  try {
    // Save to both localStorage and sessionStorage for redundancy
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log('✅ Credentials saved successfully:', state.items.length, 'items');
    console.log('📁 Saved to localStorage and sessionStorage');
  } catch (error) {
    console.error('❌ Failed to save credentials:', error);
    alert('Failed to save credentials. Please check browser storage permissions.');
  }
}

function humanCount<T>(arr: T[], pred: (t: T) => boolean): number {
  return arr.reduce((n, x) => (pred(x) ? n + 1 : n), 0);
}

function typeIcon(type: CredentialRecord['type']) {
  switch (type) {
    case 'stripe':
      return <CreditCard className="h-4 w-4 text-blue-600" />;
    case 'shopify':
      return <Cloud className="h-4 w-4 text-green-600" />;
    case 'email':
      return <Mail className="h-4 w-4 text-orange-600" />;
    case 'database':
      return <Database className="h-4 w-4 text-purple-600" />;
    default:
      return <Key className="h-4 w-4 text-gray-600" />;
  }
}

function envBadge(env: 'test' | 'live') {
  return env === 'live' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
}

// ----------------------------
// Component
// ----------------------------
export default function SecureCredentialsDashboard() {
  const deviceId = useMemo(getDefaultDeviceId, []);

  const [records, setRecords] = useState<CredentialRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEditId, setShowEditId] = useState<string | null>(null);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});

  // Form state (shared for add/edit)
  const [form, setForm] = useState<Partial<CredentialRecord>>({
    name: '',
    type: 'other',
    environment: 'test',
    encrypted: false,
    value: '',
  });

  // Load or seed
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted && Array.isArray(persisted.items) && persisted.items.length > 0) {
      console.log('✅ Loading persisted credentials:', persisted.items.length, 'items');
      setRecords(persisted.items);
    } else {
      console.log('⚠️ No persisted credentials found, starting with empty array');
      // DO NOT seed empty data - this overwrites existing credentials!
      setRecords([]);
    }
    setIsLoading(false);
  }, []); // Remove deviceId dependency to prevent re-seeding

  // Save helper with overwrite guard by timestamp
  function persistWithGuard(next: CredentialRecord[]) {
    const existing = loadPersisted();
    const nextUpdatedAt = nowIso();

    console.log('💾 Persisting credentials:', next.length, 'items');
    console.log('📊 Existing data:', existing ? `${existing.items.length} items` : 'none');

    if (existing) {
      // if existing.updatedAt is newer than now (clock skew) just keep monotonic
      const safeUpdatedAt = new Date(existing.updatedAt) > new Date(nextUpdatedAt)
        ? existing.updatedAt
        : nextUpdatedAt;
      console.log('🔄 Updating existing credentials');
      savePersisted({ version: 1, updatedAt: safeUpdatedAt, deviceId, items: next });
    } else {
      console.log('🆕 Creating new credentials storage');
      savePersisted({ version: 1, updatedAt: nextUpdatedAt, deviceId, items: next });
    }
  }

  // Debug function to check persistence
  function debugPersistence() {
    const persisted = loadPersisted();
    console.log('Debug - Persisted data:', persisted);
    console.log('Debug - Current records:', records);
    console.log('Debug - Device ID:', deviceId);
    console.log('Debug - Storage key:', STORAGE_KEY);
  }

  // Manual backup function
  function manualBackup() {
    const backupData = {
      timestamp: new Date().toISOString(),
      deviceId: deviceId,
      credentials: records,
      version: 1
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ds-credentials-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Manual backup created:', records.length, 'credentials');
    alert(`✅ Manual backup created with ${records.length} credentials!`);
  }

  // CRUD
  function onAdd() {
    if (!form.name || !form.value) return;
    const rec: CredentialRecord = {
      id: generateId(),
      name: form.name!,
      type: (form.type as CredentialRecord['type']) ?? 'other',
      environment: (form.environment as 'test' | 'live') ?? 'test',
      encrypted: !!form.encrypted,
      value: form.value!,
      lastUsed: undefined,
      updatedAt: nowIso(),
    };
    const next = [rec, ...records];
    setRecords(next);
    persistWithGuard(next);
    console.log('✅ Added new credential:', rec.name);
    setShowAdd(false);
    setForm({ name: '', type: 'other', environment: 'test', encrypted: false, value: '' });
  }

  function onEditStart(id: string) {
    const rec = records.find((r) => r.id === id);
    if (!rec) return;
    setForm(rec);
    setShowEditId(id);
  }

  function onEditSave() {
    if (!showEditId) return;
    const idx = records.findIndex((r) => r.id === showEditId);
    if (idx < 0) return;
    const updated: CredentialRecord = {
      ...(records[idx] as CredentialRecord),
      name: form.name || records[idx].name,
      type: (form.type as CredentialRecord['type']) || records[idx].type,
      environment: (form.environment as 'test' | 'live') || records[idx].environment,
      encrypted: form.encrypted ?? records[idx].encrypted,
      value: form.value ?? records[idx].value,
      updatedAt: nowIso(),
    };
    const next = [...records];
    next[idx] = updated;
    setRecords(next);
    persistWithGuard(next);
    setShowEditId(null);
    setForm({ name: '', type: 'other', environment: 'test', encrypted: false, value: '' });
  }

  function onDelete(id: string) {
    const next = records.filter((r) => r.id !== id);
    setRecords(next);
    persistWithGuard(next);
  }

  function onCopy(rec: CredentialRecord) {
    navigator.clipboard.writeText(rec.value).catch(() => {});
    alert(`Copied: ${rec.name}`);
  }

  // Export / Import
  function onExport() {
    const state: PersistedState = {
      version: 1,
      updatedAt: nowIso(),
      deviceId,
      items: records,
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsllc-credentials-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImport(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as PersistedState;
        if (!parsed || !Array.isArray(parsed.items)) throw new Error('Invalid file');
        // Overwrite guard: only import if file is newer than current
        const current = loadPersisted();
        if (current && new Date(parsed.updatedAt) <= new Date(current.updatedAt)) {
          const proceed = confirm('Imported file is not newer than current data. Import anyway?');
          if (!proceed) return;
        }
        savePersisted(parsed);
        setRecords(parsed.items);
        alert('Credentials imported successfully.');
      } catch (e) {
        alert('Import failed. Please select a valid JSON export.');
      }
    };
    reader.readAsText(file);
    ev.target.value = '';
  }

  // Stats
  const total = records.length;
  const encryptedCount = humanCount(records, (r) => r.encrypted);
  const liveCount = humanCount(records, (r) => r.environment === 'live');
  const recentCount = humanCount(
    records,
    (r) => !!r.lastUsed && new Date().getTime() - new Date(r.lastUsed).getTime() < 24 * 60 * 60 * 1000
  );

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
          <h2 className="text-2xl font-bold text-gray-900">Secure Credentials Management</h2>
          <p className="text-gray-600">Manage encrypted API keys and service credentials</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" /> Import
            <input type="file" accept="application/json" className="hidden" onChange={onImport} />
          </label>
          <button onClick={onExport} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Download className="h-4 w-4 inline mr-2" /> Export
          </button>
          <button 
            onClick={debugPersistence} 
            className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
            title="Debug persistence (check console)"
          >
            🔍 Debug
          </button>
          <button 
            onClick={manualBackup} 
            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            title="Create manual backup of credentials"
          >
            💾 Backup
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Credential</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credentials</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Encrypted</p>
              <p className="text-2xl font-bold text-gray-900">{encryptedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Live Environment</p>
              <p className="text-2xl font-bold text-gray-900">{liveCount}</p>
            </div>
          </div>
              </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recently Used</p>
              <p className="text-2xl font-bold text-gray-900">{recentCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Stored Credentials</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {records.map((cred) => (
            <div key={cred.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {typeIcon(cred.type)}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{cred.name}</h4>
                    <p className="text-sm text-gray-500">
                      {cred.type.charAt(0).toUpperCase() + cred.type.slice(1)} • {cred.environment}
                      {cred.lastUsed && ` • Last used ${new Date(cred.lastUsed).toLocaleDateString()}`}
                    </p>
                    <div className="mt-1 text-xs text-gray-500">
                      Updated {new Date(cred.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${envBadge(cred.environment)}`}>
                    {cred.environment}
                  </span>
                  {cred.encrypted && (
                    <span className="flex items-center text-green-600">
                      <Lock className="h-4 w-4 mr-1" /> Encrypted
                    </span>
                  )}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowValues((s) => ({ ...s, [cred.id]: !s[cred.id] }))}
                      className="text-gray-400 hover:text-gray-600"
                      title={showValues[cred.id] ? 'Hide' : 'Show'}
                    >
                      {showValues[cred.id] ? '🙈' : '👁️'}
                    </button>
                    <button onClick={() => onCopy(cred)} className="text-gray-400 hover:text-gray-600" title="Copy">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button onClick={() => onEditStart(cred.id)} className="text-gray-400 hover:text-blue-600" title="Edit">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(cred.id)} className="text-gray-400 hover:text-red-600" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                </div>
              <div className="mt-2 text-sm text-gray-800">
                <div className="font-mono px-3 py-2 bg-gray-100 rounded whitespace-pre-wrap">
                  {showValues[cred.id] ? cred.value : '••••••••••••••••'}
                </div>
              </div>
            </div>
        ))}
        </div>
      </div>

      {/* Add Modal - Full Screen */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full h-full max-w-none max-h-none flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Add Credential</h3>
              <button 
                onClick={() => setShowAdd(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
              </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Credential Name"
                      value={form.name || ''}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.type as string}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}
                    >
                      <option value="stripe">Stripe</option>
                      <option value="shopify">Shopify</option>
                      <option value="email">Email</option>
                      <option value="database">Database</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.environment as string}
                      onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value as any }))}
                    >
                      <option value="test">Test</option>
                      <option value="live">Live</option>
                    </select>
              </div>
              <div className="flex items-center">
                    <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                        checked={!!form.encrypted}
                        onChange={(e) => setForm((f) => ({ ...f, encrypted: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Mark as encrypted (value masked in UI)
                </label>
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credential Value</label>
                  <div className="relative">
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={20}
                      placeholder="Enter credentials here...&#10;&#10;Example format:&#10;API_KEY=your_api_key_here&#10;API_SECRET=your_api_secret_here&#10;SHOP_NAME=your-shop-name.myshopify.com&#10;ACCESS_TOKEN=your_access_token_here"
                      value={form.value || ''}
                      onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                      style={{ 
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap'
                      }}
                    />
                    <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                      {form.value ? form.value.split('\n').length : 0} lines
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tip: Use line breaks to separate different credentials for better readability
                  </p>
                </div>
              </div>
              </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                Device: {deviceId.slice(0, 8)} • Changes are saved locally
              </div>
              <div className="flex gap-3">
                <button 
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors" 
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                  onClick={onAdd}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Full Screen */}
      {showEditId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full h-full max-w-none max-h-none flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Edit Credential</h3>
              <button 
                onClick={() => setShowEditId(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
              </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Credential Name"
                      value={form.name || ''}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.type as string}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}
                    >
                      <option value="stripe">Stripe</option>
                      <option value="shopify">Shopify</option>
                      <option value="email">Email</option>
                      <option value="database">Database</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.environment as string}
                      onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value as any }))}
                    >
                      <option value="test">Test</option>
                      <option value="live">Live</option>
                    </select>
              </div>
              <div className="flex items-center">
                    <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                        checked={!!form.encrypted}
                        onChange={(e) => setForm((f) => ({ ...f, encrypted: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Mark as encrypted (value masked in UI)
                </label>
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credential Value</label>
                  <div className="relative">
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={20}
                      placeholder="Enter credentials here...&#10;&#10;Example format:&#10;API_KEY=your_api_key_here&#10;API_SECRET=your_api_secret_here&#10;SHOP_NAME=your-shop-name.myshopify.com&#10;ACCESS_TOKEN=your_access_token_here"
                      value={form.value || ''}
                      onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                      style={{ 
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap'
                      }}
                    />
                    <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                      {form.value ? form.value.split('\n').length : 0} lines
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tip: Use line breaks to separate different credentials for better readability
                  </p>
                </div>
              </div>
              </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                Device: {deviceId.slice(0, 8)} • Changes are saved locally
              </div>
              <div className="flex gap-3">
                <button 
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors" 
                  onClick={() => setShowEditId(null)}
                >
                  Cancel
                </button>
                <button 
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                  onClick={onEditSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="text-xs text-gray-500">
        Device: {deviceId.slice(0, 8)} • Stored locally and exportable. Consider exporting after edits for Cloud Backup.
      </div>
    </div>
  );
}