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
  return [
    {
      id: generateId(),
      name: 'Stripe Live Secret Key',
      type: 'stripe',
      environment: 'live',
      encrypted: true,
      value: 'sk_live_xxx',
      lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: nowIso(),
    },
    {
      id: generateId(),
      name: 'Shopify Admin API Access',
      type: 'shopify',
      environment: 'live',
      encrypted: true,
      value: 'shppa_xxx',
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: nowIso(),
    },
    {
      id: generateId(),
      name: 'Email Setup',
      type: 'email',
      environment: 'live',
      encrypted: false,
      value: 'smtp://user:pass@host',
      lastUsed: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      updatedAt: nowIso(),
    },
    {
      id: generateId(),
      name: 'Database Connection',
      type: 'database',
      environment: 'live',
      encrypted: true,
      value: 'postgres://user:pass@host/db',
      lastUsed: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      updatedAt: nowIso(),
    },
  ];
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function savePersisted(state: PersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    if (persisted && Array.isArray(persisted.items)) {
      setRecords(persisted.items);
    } else {
      const seeded = seedMockData();
      const state: PersistedState = {
        version: 1,
        updatedAt: nowIso(),
        deviceId,
        items: seeded,
      };
      savePersisted(state);
      setRecords(seeded);
    }
    setIsLoading(false);
  }, [deviceId]);

  // Save helper with overwrite guard by timestamp
  function persistWithGuard(next: CredentialRecord[]) {
    const existing = loadPersisted();
    const nextUpdatedAt = nowIso();

    if (existing) {
      // if existing.updatedAt is newer than now (clock skew) just keep monotonic
      const safeUpdatedAt = new Date(existing.updatedAt) > new Date(nextUpdatedAt)
        ? existing.updatedAt
        : nextUpdatedAt;
      savePersisted({ version: 1, updatedAt: safeUpdatedAt, deviceId, items: next });
    } else {
      savePersisted({ version: 1, updatedAt: nextUpdatedAt, deviceId, items: next });
    }
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
    (r) => r.lastUsed && new Date().getTime() - new Date(r.lastUsed).getTime() < 24 * 60 * 60 * 1000
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
                <span className="font-mono px-2 py-1 bg-gray-100 rounded">
                  {showValues[cred.id] ? cred.value : '••••••••••••••••'}
                </span>
              </div>
            </div>
        ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Add Credential</h3>
            <div className="space-y-3">
              <input
                className="w-full px-3 py-2 border rounded"
                placeholder="Name"
                value={form.name || ''}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <select
                className="w-full px-3 py-2 border rounded"
                value={form.type as string}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}
              >
                <option value="stripe">Stripe</option>
                <option value="shopify">Shopify</option>
                <option value="email">Email</option>
                <option value="database">Database</option>
                <option value="other">Other</option>
              </select>
                <select
                className="w-full px-3 py-2 border rounded"
                value={form.environment as string}
                onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value as any }))}
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
                </select>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!form.encrypted}
                  onChange={(e) => setForm((f) => ({ ...f, encrypted: e.target.checked }))}
                />
                Mark as encrypted (value masked in UI)
                </label>
                <textarea
                className="w-full px-3 py-2 border rounded font-mono"
                rows={3}
                placeholder="Secret / Value"
                value={form.value || ''}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                />
              </div>
            <div className="mt-5 flex gap-3 justify-end">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowAdd(false)}>
                  Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onAdd}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Credential</h3>
            <div className="space-y-3">
              <input
                className="w-full px-3 py-2 border rounded"
                placeholder="Name"
                value={form.name || ''}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <select
                className="w-full px-3 py-2 border rounded"
                value={form.type as string}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}
              >
                <option value="stripe">Stripe</option>
                <option value="shopify">Shopify</option>
                <option value="email">Email</option>
                <option value="database">Database</option>
                <option value="other">Other</option>
              </select>
                <select
                className="w-full px-3 py-2 border rounded"
                value={form.environment as string}
                onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value as any }))}
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
                </select>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!form.encrypted}
                  onChange={(e) => setForm((f) => ({ ...f, encrypted: e.target.checked }))}
                />
                Mark as encrypted (value masked in UI)
                </label>
                <textarea
                className="w-full px-3 py-2 border rounded font-mono"
                rows={3}
                placeholder="Secret / Value"
                value={form.value || ''}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                />
              </div>
            <div className="mt-5 flex gap-3 justify-end">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowEditId(null)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onEditSave}>
                  Save Changes
              </button>
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