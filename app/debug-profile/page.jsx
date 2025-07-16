'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Save, Edit, X } from 'lucide-react';

export default function DebugProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  // Fetch user data
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status, session]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching user data...');
      
      const response = await fetch('/api/user');
      console.log('📊 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('👤 User data received:', data);
        setUserData(data);
        setEditData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      } else {
        const errorData = await response.json();
        console.error('❌ Error fetching user data:', errorData);
        setUpdateError('Failed to load user data');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setUpdateError('Network error while loading user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');
    setDebugInfo(null);

    console.log('💾 Starting profile update...');
    console.log('📝 Edit data to send:', editData);

    try {
      const response = await fetch('/api/debug-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      console.log('📊 Update response status:', response.status);
      
      const result = await response.json();
      console.log('📋 Update response data:', result);

      if (response.ok) {
        setUpdateSuccess('Profile updated successfully!');
        setDebugInfo(result.debug);
        setUserData(result.user);
        setIsEditing(false);
        
        // Also refresh the main user data
        await fetchUserData();
      } else {
        setUpdateError(result.error || 'Failed to update profile');
        setDebugInfo(result);
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      setUpdateError('Network error during update');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    setUpdateError('');
    setUpdateSuccess('');
    setDebugInfo(null);
    
    if (userData && !isEditing) {
      setEditData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-8">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Debug Profile Page</h1>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Status Messages */}
        {updateError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {updateError}
          </div>
        )}
        
        {updateSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {updateSuccess}
          </div>
        )}

        {/* User Info Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-gray-900">{userData?.name || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
              />
            ) : (
              <p className="text-gray-900">{userData?.email || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="0771234567"
              />
            ) : (
              <p className="text-gray-900">{userData?.phone || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.address}
                onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your address"
              />
            ) : (
              <p className="text-gray-900">{userData?.address || 'Not set'}</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={updateLoading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {updateLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {updateLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Debug Information */}
        {debugInfo && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Current User Data */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Current User Data</h3>
          <pre className="text-xs bg-white p-3 rounded border overflow-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
