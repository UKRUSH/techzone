'use client';

import { useState, useEffect } from 'react';
import { useUserData, useUserOrders } from '@/lib/hooks/useUserData';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Package, 
  Star, 
  Heart, 
  Calendar,
  CreditCard,
  Settings,
  Award,
  TrendingUp,
  LogIn,
  Edit,
  Save,
  X,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Shield,
  Crown,
  Camera,
  Gift,
  Clock,
  CheckCircle,
  ShoppingBag,
  Activity,
  Truck,
  XCircle,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { userData, isLoading, error, refetch } = useUserData();
  const { orders: recentOrders, isLoading: ordersLoading, error: ordersError } = useUserOrders({ limit: 5 });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  
  // Local state for immediate UI updates
  const [displayUserData, setDisplayUserData] = useState(null);

  // Debug logging for Recent Activity
  useEffect(() => {
    console.log('🔍 Profile Page - Recent Activity Debug:', {
      sessionStatus: status,
      userEmail: session?.user?.email,
      ordersLoading,
      ordersError,
      recentOrdersCount: recentOrders?.length,
      recentOrders: recentOrders?.slice(0, 2), // Just first 2 for logging
      hasSession: !!session,
      isAuthenticated: status === 'authenticated'
    });
  }, [status, session, ordersLoading, ordersError, recentOrders]);

  // Initialize edit data when userData changes
  useEffect(() => {
    if (userData) {
      setEditData({
        name: userData.name || '',
        // Remove email from edit data to prevent session issues
        phone: userData.phone || '',
        address: userData.address || ''
      });
    }
  }, [userData]);

  // Sync display data with userData
  useEffect(() => {
    if (userData) {
      setDisplayUserData(userData);
    }
  }, [userData]);

  // Clear display data when session changes (sign out/sign in)
  useEffect(() => {
    console.log('👤 Profile page - Session change detected:', {
      status,
      userEmail: session?.user?.email,
      hasUserData: !!userData,
      hasDisplayData: !!displayUserData
    });
    
    if (status === 'unauthenticated') {
      console.log('🚪 User signed out - clearing all profile data');
      setDisplayUserData(null);
      setEditData({});
      setIsEditing(false);
      setUpdateError('');
    } else if (status === 'authenticated' && session?.user?.email) {
      console.log('🔑 User signed in:', session.user.email);
    }
  }, [status, session?.user?.email, userData, displayUserData]);

  // Helper functions for order status
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-400" />;
      case 'processing':
      case 'confirmed':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Package className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing':
      case 'confirmed':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getOrderProgress = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 100;
      case 'shipped':
        return 75;
      case 'processing':
      case 'confirmed':
        return 50;
      case 'pending':
        return 25;
      case 'cancelled':
        return 0;
      default:
        return 25;
    }
  };

  const getStatusMessage = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'Your order has been delivered successfully';
      case 'shipped':
        return 'Your order is on the way';
      case 'processing':
        return 'Your order is being prepared';
      case 'confirmed':
        return 'Your order has been confirmed';
      case 'pending':
        return 'Your order is being processed';
      case 'cancelled':
        return 'This order was cancelled';
      default:
        return 'Order status is being updated';
    }
  };

  // Initialize edit data when user data loads
  useEffect(() => {
    if (userData) {
      setEditData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    }
  }, [userData]);

  const handleEditToggle = () => {
    if (userData) {
      setEditData({
        name: userData.name || '',
        // Remove email from edit to prevent session issues
        phone: userData.phone || '',
        address: userData.address || ''
      });
    }
    setIsEditing(!isEditing);
    setUpdateError('');
  };

  const handleSave = async () => {
    console.log('🚀 Starting profile save...');
    setUpdateLoading(true);
    setUpdateError('');

    // Validate phone number format before sending
    if (editData.phone && !/^0\d{9}$/.test(editData.phone.replace(/\s/g, ''))) {
      setUpdateError('Phone number must be exactly 10 digits starting with 0 (Sri Lankan format)');
      setUpdateLoading(false);
      return;
    }

    console.log('📝 Sending update data:', editData);

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check if response has content before parsing JSON
      let result = {};
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        console.log('📋 Response text:', text);
        if (text.trim()) {
          try {
            result = JSON.parse(text);
            console.log('📋 Parsed response:', result);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response text:', text);
            throw new Error('Invalid response from server');
          }
        }
      } else {
        console.error('Response is not JSON:', contentType);
        throw new Error('Server returned non-JSON response');
      }

      if (response.ok) {
        console.log('✅ Profile updated successfully, refreshing data...');
        
        // Immediately update the displayed user data for instant UI update
        if (result.user && displayUserData) {
          const updatedDisplayData = {
            ...displayUserData,
            name: result.user.name || displayUserData.name,
            phone: result.user.phone || displayUserData.phone,
            address: result.user.address || displayUserData.address,
            updatedAt: new Date().toISOString() // Mark as recently updated
          };
          setDisplayUserData(updatedDisplayData);
          console.log('📋 Display data updated immediately:', updatedDisplayData);
        }
        
        // Update the editData for next edit session
        if (result.user) {
          setEditData({
            name: result.user.name || '',
            phone: result.user.phone || '',
            address: result.user.address || ''
          });
        }
        
        // Exit edit mode
        setIsEditing(false);
        
        // Force refresh the data in the background for consistency
        setTimeout(() => {
          console.log('🔄 Background refresh starting...');
          refetch();
        }, 100);
        
        console.log('✅ Profile update completed - UI updated immediately');
      } else {
        setUpdateError(result.error || `Failed to update profile (${response.status})`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.message.includes('JSON') || error.message.includes('response')) {
        setUpdateError('Server communication error. Please try again.');
      } else {
        setUpdateError('Failed to update profile');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle profile deletion
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteProfile = async () => {
    setDeleteLoading(true);
    setUpdateError('');

    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🗑️ Delete response status:', response.status);
      
      const result = await response.json();
      console.log('🗑️ Delete response:', result);

      if (response.ok) {
        // Sign out after successful deletion
        alert('Profile deleted successfully. You will be signed out.');
        window.location.href = '/auth/signin';
      } else {
        setUpdateError(result.error || 'Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setUpdateError('Failed to delete profile');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-sm border-2 border-yellow-500/40 rounded-3xl shadow-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-6"></div>
            <p className="text-yellow-300 text-lg font-semibold">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-900/90 backdrop-blur-sm border-2 border-yellow-500/40 rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <LogIn className="h-10 w-10 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
            <p className="text-gray-300 mb-6">
              You need to sign in to view your profile.
            </p>
            <Link 
              href="/auth/signin"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
            >
              Sign In to TechZone
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              Test credentials: admin@techzone.com / admin123 or user@techzone.com / user123
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if data loading failed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-32">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-900/90 backdrop-blur-sm border-2 border-red-500/40 rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <X className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button 
              onClick={() => refetch?.()}
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main profile content
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section with Premium Black & Gold Theme */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 border-2 border-yellow-500/40 rounded-3xl shadow-2xl overflow-hidden mb-8">
          {/* Golden Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse"></div>
          <div className="relative px-8 py-12">
            
            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row items-center lg:items-end space-y-6 lg:space-y-0 lg:space-x-8">
              
              {/* Profile Picture */}
              <div className="relative group">
                {userData?.image ? (
                  <div className="relative">
                    <Image
                      src={displayUserData?.image || userData?.image}
                      alt={displayUserData?.name || userData?.name || 'Profile'}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-yellow-400 shadow-2xl shadow-yellow-400/25"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-8 w-8 text-yellow-400" />
                    </div>
                  </div>
                ) : (
                  <div className="w-30 h-30 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-2xl shadow-yellow-400/30 group-hover:shadow-yellow-400/50 transition-shadow">
                    <User className="h-12 w-12 text-black" />
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-8 w-8 text-yellow-400" />
                    </div>
                  </div>
                )}
                
                {/* Loyalty Badge */}
                {userData?.loyaltyLevel && (
                  <div className="absolute -bottom-2 -right-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-2 shadow-lg border-2 border-black">
                      <Crown className="h-5 w-5 text-black" />
                    </div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      {displayUserData?.name || userData?.name || session?.user?.name || 'User'}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start space-x-4 text-yellow-300">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm font-medium">{userData?.email || session?.user?.email}</span>
                      </div>
                      {userData?.loyaltyLevel && (
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4" />
                          <span className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">{displayUserData?.loyaltyLevel || userData?.loyaltyLevel} Member</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-4 lg:mt-0">
                    {!isEditing ? (
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={updateLoading}
                          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 font-bold"
                        >
                          <Save className="h-4 w-4" />
                          <span>{updateLoading ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={handleEditToggle}
                          className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors font-bold"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Loyalty Points Display */}
                {userData?.loyaltyPoints !== undefined && (
                  <div className="bg-gradient-to-r from-yellow-400/20 to-amber-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-4 inline-block">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-2">
                        <Gift className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <p className="text-yellow-300 font-bold text-lg">{displayUserData?.loyaltyPoints || userData?.loyaltyPoints} Points</p>
                        <p className="text-yellow-400/70 text-sm font-medium">Loyalty Rewards</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {updateError && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border-l-4 border-red-500 rounded-lg shadow-sm backdrop-blur-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-red-300 font-medium">{updateError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Personal Information Card */}
            <div className="bg-gradient-to-br from-gray-900/95 via-black/98 to-gray-900/95 border-2 border-yellow-500/40 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <User className="h-5 w-5 text-yellow-400" />
                  <span>Personal Information</span>
                </h2>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-yellow-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-yellow-300 mb-2">Email Address</label>
                    <div className="w-full px-4 py-3 bg-black/60 border-2 border-gray-500/40 rounded-xl text-gray-400">
                      {userData?.email || 'Not set'} 
                      <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-yellow-300 mb-2">Phone Number (Sri Lankan)</label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder-gray-400"
                      placeholder="0771234567"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-yellow-300 mb-2">Address</label>
                    <textarea
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 bg-black/60 border-2 border-yellow-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all resize-none text-white placeholder-gray-400"
                      placeholder="Enter your address"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-400/10 border border-yellow-500/30 rounded-xl">
                    <Mail className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-sm font-medium text-yellow-300">Email</p>
                      <p className="text-white font-medium">{userData?.email || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-yellow-400/10 border border-yellow-500/30 rounded-xl">
                    <Phone className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-sm font-medium text-yellow-300">Phone</p>
                      <p className="text-white font-medium">{displayUserData?.phone || userData?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-yellow-400/10 border border-yellow-500/30 rounded-xl">
                    <MapPin className="h-5 w-5 text-yellow-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-yellow-300">Address</p>
                      <p className="text-white font-medium">{displayUserData?.address || userData?.address || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-yellow-400/10 border border-yellow-500/30 rounded-xl">
                    <Calendar className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-sm font-medium text-yellow-300">Member Since</p>
                      <p className="text-white font-medium">
                        {(displayUserData?.createdAt || userData?.createdAt) ? new Date(displayUserData?.createdAt || userData?.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Status Card */}
            <div className="bg-gradient-to-br from-gray-900/95 via-black/98 to-gray-900/95 border-2 border-yellow-500/40 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span>Account Status</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Account Status</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-bold">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Loyalty Level</span>
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {userData?.loyaltyLevel || 'Bronze'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Orders</span>
                  <span className="text-yellow-300 font-bold">{recentOrders?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Delete Profile Card */}
            <div className="bg-gradient-to-br from-red-900/30 via-red-800/40 to-red-900/30 border-2 border-red-500/40 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-red-400" />
                <span>Danger Zone</span>
              </h3>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">
                  Once you delete your account, there is no going back. This will permanently delete your profile, orders, and all associated data.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-bold"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Profile</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-red-300 font-medium">Are you absolutely sure? This action cannot be undone.</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDeleteProfile}
                        disabled={deleteLoading}
                        className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-bold disabled:opacity-50"
                      >
                        {deleteLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span>{deleteLoading ? 'Deleting...' : 'Yes, Delete Forever'}</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-bold"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Orders Card */}
              <div className="bg-gradient-to-br from-gray-900/95 via-black/98 to-gray-900/95 border-2 border-yellow-500/40 rounded-2xl shadow-2xl p-6 backdrop-blur-sm group hover:border-yellow-400/60 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-300">Total Orders</p>
                    <p className="text-3xl font-bold text-white">{recentOrders?.length || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-3 shadow-lg">
                    <Package className="h-8 w-8 text-black" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-bold">Active</span>
                    <span className="text-gray-400">orders tracking</span>
                  </div>
                </div>
              </div>

              {/* Wishlist Card */}
              <div className="bg-gradient-to-br from-gray-900/95 via-black/98 to-gray-900/95 border-2 border-yellow-500/40 rounded-2xl shadow-2xl p-6 backdrop-blur-sm group hover:border-yellow-400/60 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-300">Wishlist Items</p>
                    <p className="text-3xl font-bold text-white">{userData?.wishlist?.length || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-3 shadow-lg">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/wishlist" 
                    className="text-sm text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
                  >
                    View Wishlist →
                  </Link>
                </div>
              </div>

              {/* Loyalty Points Card */}
              <div className="bg-gradient-to-br from-gray-900/95 via-black/98 to-gray-900/95 border-2 border-yellow-500/40 rounded-2xl shadow-2xl p-6 backdrop-blur-sm group hover:border-yellow-400/60 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-300">Loyalty Points</p>
                    <p className="text-3xl font-bold text-white">{userData?.loyaltyPoints || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-3 shadow-lg">
                    <Star className="h-8 w-8 text-black" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Gift className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-300 font-medium">Redeem for rewards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-gradient-to-br from-gray-900/95 via-black/98 to-gray-900/95 border-2 border-yellow-500/40 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-yellow-400" />
                  <span>Recent Activity</span>
                </h3>
                <Link 
                  href="/orders" 
                  className="text-sm text-yellow-400 hover:text-yellow-300 font-bold transition-colors flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-yellow-400 mr-3" />
                  <p className="text-gray-400">Loading your recent orders...</p>
                </div>
              ) : ordersError ? (
                <div className="text-center py-8">
                  <div className="bg-gradient-to-br from-red-400/20 to-red-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-12 w-12 text-red-400" />
                  </div>
                  <p className="text-white text-lg font-bold mb-2">Unable to load recent activity</p>
                  <p className="text-gray-400 text-sm mb-4">Error: {ordersError}</p>
                  {status === 'unauthenticated' ? (
                    <button 
                      onClick={() => window.location.href = '/auth/signin'}
                      className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </button>
                  ) : (
                    <button 
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                    >
                      <Loader2 className="w-4 h-4 mr-2" />
                      Try Again
                    </button>
                  )}
                </div>
              ) : recentOrders && recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map((order, index) => {
                    // Ensure order has required data
                    const orderNumber = order.orderNumber || order.confirmationNumber || `ORD-${order.id?.slice(-6) || index}`;
                    const orderTotal = order.total || 0;
                    const orderDate = order.date || order.createdAt || new Date();
                    const orderStatus = order.status || 'pending';
                    const orderItems = order.items || [];

                    return (
                      <div key={order.id || index} className="bg-yellow-400/5 border border-yellow-500/20 rounded-xl p-4 hover:bg-yellow-400/10 transition-all duration-200 group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg p-2 shadow-lg">
                              {getStatusIcon(orderStatus)}
                            </div>
                            <div>
                              <p className="font-bold text-white">Order #{orderNumber}</p>
                              <p className="text-sm text-yellow-300">
                                {new Date(orderDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-yellow-300 text-lg">
                              ${orderTotal.toFixed(2)}
                            </p>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(orderStatus)}`}>
                              {getStatusIcon(orderStatus)}
                              <span className="ml-1 capitalize">{orderStatus}</span>
                            </span>
                          </div>
                        </div>

                        {/* Order Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-300">{getStatusMessage(orderStatus)}</span>
                            <span className="text-sm text-yellow-400 font-medium">{getOrderProgress(orderStatus)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${getOrderProgress(orderStatus)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-400 mb-2">Items ({orderItems.length}):</p>
                          {orderItems.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {orderItems.slice(0, 2).map((item, itemIndex) => (
                                <div key={itemIndex} className="bg-gray-800/50 rounded-lg px-3 py-1 border border-gray-700">
                                  <span className="text-xs text-white font-medium">{item.name || item.productName || 'Item'}</span>
                                  <span className="text-xs text-gray-400 ml-2">×{item.quantity || 1}</span>
                                </div>
                              ))}
                              {orderItems.length > 2 && (
                                <div className="bg-gray-800/50 rounded-lg px-3 py-1 border border-gray-700">
                                  <span className="text-xs text-gray-400">+{orderItems.length - 2} more</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-gray-800/50 rounded-lg px-3 py-1 border border-gray-700">
                              <span className="text-xs text-gray-400">No items available</span>
                            </div>
                          )}
                        </div>

                        {/* Additional Info Based on Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            {order.shipping?.trackingNumber && orderStatus !== 'cancelled' && (
                              <div className="flex items-center space-x-1 text-blue-400">
                                <Truck className="w-4 h-4" />
                                <span>Tracking: {order.shipping.trackingNumber}</span>
                              </div>
                            )}
                            {orderStatus === 'delivered' && (
                              <div className="flex items-center space-x-1 text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span>Delivered</span>
                              </div>
                            )}
                            {orderStatus === 'shipped' && (
                              <div className="flex items-center space-x-1 text-blue-400">
                                <Clock className="w-4 h-4" />
                                <span>Est. delivery in 2-3 days</span>
                              </div>
                            )}
                          </div>
                          
                          <Link 
                            href={`/orders`}
                            className="text-sm text-yellow-400 hover:text-yellow-300 font-medium transition-colors opacity-0 group-hover:opacity-100"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <Package className="h-12 w-12 text-yellow-400" />
                  </div>
                  <p className="text-white text-lg font-bold mb-2">No orders yet</p>
                  <p className="text-gray-400 text-sm mb-6">Start shopping to see your order history and progress here</p>
                  <Link 
                    href="/products" 
                    className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Start Shopping
                  </Link>
                </div>
              )}

              {/* Enhanced Debugging Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">🔍 Debug Info:</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Orders loading: {ordersLoading ? 'true' : 'false'}</p>
                    <p>Orders error: {ordersError ? 'true' : 'false'}</p>
                    <p>Recent orders length: {recentOrders?.length || 0}</p>
                    <p>User session status: {status}</p>
                    <p>User ID: {userData?.id || 'null'}</p>
                    {recentOrders && recentOrders.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-yellow-400 hover:text-yellow-300">
                          📋 View First Order Data Structure
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                          {JSON.stringify(recentOrders[0], null, 2)}
                        </pre>
                      </details>
                    )}
                    {ordersError && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-red-400 hover:text-red-300">
                          ❌ View Error Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                          {JSON.stringify(ordersError, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
