'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminTabInfo } from '@/components/AdminLayout';
import { SecureCredentialsDashboard } from '@/components/SecureCredentialsDashboard';
import { Shield, AlertTriangle, Lock, Eye, EyeOff } from 'lucide-react';

export default function SecureCredentialsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState<Date | null>(null);

  // Enhanced security PIN for credentials access
  const SECURE_PIN = 'DS24_SECURE_CREDS';
  const MAX_ATTEMPTS = 3;
  const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    // Check if user is already locked out
    const savedLockTime = localStorage.getItem('ds_credentials_lock_time');
    if (savedLockTime) {
      const lockTimestamp = new Date(savedLockTime);
      const now = new Date();
      const timeDiff = now.getTime() - lockTimestamp.getTime();
      
      if (timeDiff < LOCK_DURATION) {
        setIsLocked(true);
        setLockTime(lockTimestamp);
        const remainingTime = LOCK_DURATION - timeDiff;
        setTimeout(() => {
          setIsLocked(false);
          setLockTime(null);
          localStorage.removeItem('ds_credentials_lock_time');
        }, remainingTime);
      } else {
        localStorage.removeItem('ds_credentials_lock_time');
      }
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin === SECURE_PIN) {
      setIsAuthenticated(true);
      setAttempts(0);
      setPin('');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setLockTime(new Date());
        localStorage.setItem('ds_credentials_lock_time', new Date().toISOString());
      }
      
      setPin('');
    }
  };

  const getRemainingLockTime = () => {
    if (!lockTime) return 0;
    const now = new Date();
    const timeDiff = now.getTime() - lockTime.getTime();
    return Math.max(0, LOCK_DURATION - timeDiff);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLocked) {
    const remainingTime = getRemainingLockTime();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Lock className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Locked</h1>
            <p className="text-gray-600 mb-4">
              Too many failed attempts. Please wait before trying again.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-medium">
                Time remaining: {formatTime(remainingTime)}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              This page contains sensitive business credentials and is protected by enhanced security.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Secure Credentials Access</h1>
              <p className="text-gray-600">
                Enter your secure PIN to access business credentials
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secure PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter secure PIN"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {attempts > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <p className="text-red-800 text-sm">
                      Invalid PIN. {MAX_ATTEMPTS - attempts} attempts remaining.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Access Credentials
              </button>
            </form>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Security Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This page contains sensitive business credentials including API keys, 
                    account numbers, and other critical information. Access is logged and monitored.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout currentPage="credentials">
      <AdminTabInfo tabId="credentials" />

      <SecureCredentialsDashboard onRefresh={() => {}} />
    </AdminLayout>
  );
}
