'use client';

import { useState, useEffect } from 'react';
import { useUserData } from '@/lib/hooks/useUserData';
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
  Activity
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { userData, isLoading, error, refetch } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');

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
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    }
    setIsEditing(!isEditing);
    setUpdateError('');
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    setUpdateError('');

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        await refetch(); // Refresh user data
        setIsEditing(false);
      } else {
        const error = await response.json();
        setUpdateError(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError('Failed to update profile');
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

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-32">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              You need to sign in to view your profile.
            </p>
            <Link 
              href="/auth/signin"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Sign In to TechZone
            </Link>
            <p className="text-sm text-gray-500 mt-4">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-32">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => refetch?.()}
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section with Cover Photo */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-12">
            
            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row items-center lg:items-end space-y-6 lg:space-y-0 lg:space-x-8">
              
              {/* Profile Picture */}
              <div className="relative group">
                {userData?.image ? (
                  <div className="relative">
                    <Image
                      src={userData.image}
                      alt={userData.name || 'Profile'}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-white shadow-xl"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-30 h-30 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl group-hover:shadow-2xl transition-shadow">
                    <User className="h-12 w-12 text-white" />
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Loyalty Badge */}
                {userData?.loyaltyLevel && (
                  <div className="absolute -bottom-2 -right-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      {userData?.name || session?.user?.name || 'User'}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start space-x-4 text-blue-100">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{userData?.email || session?.user?.email}</span>
                      </div>
                      {userData?.loyaltyLevel && (
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4" />
                          <span className="text-sm font-medium">{userData.loyaltyLevel} Member</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-4 lg:mt-0">
                    {!isEditing ? (
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={updateLoading}
                          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" />
                          <span>{updateLoading ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={handleEditToggle}
                          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
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
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 inline-block">
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-400 rounded-full p-2">
                        <Gift className="h-5 w-5 text-yellow-900" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">{userData.loyaltyPoints} Points</p>
                        <p className="text-blue-100 text-sm">Loyalty Rewards</p>
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
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-red-700 font-medium">{updateError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Personal Information</span>
                </h2>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number (Sri Lankan)</label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0771234567"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Enter your address"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{userData?.email || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {userData?.phone && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-gray-900">{userData.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {userData?.address && (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="text-gray-900">{userData.address}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <p className="text-gray-900">
                        {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Account Status</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Loyalty Level</span>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {userData?.loyaltyLevel || 'Bronze'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="text-gray-900 font-medium">{userData?.orders?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Orders Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{userData?.orders?.length || 0}</p>
                  </div>
                  <div className="bg-blue-100 rounded-xl p-3">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </div>
              </div>

              {/* Wishlist Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Wishlist Items</p>
                    <p className="text-3xl font-bold text-gray-900">{userData?.wishlist?.length || 0}</p>
                  </div>
                  <div className="bg-red-100 rounded-xl p-3">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/wishlist" 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Wishlist →
                  </Link>
                </div>
              </div>

              {/* Loyalty Points Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Loyalty Points</p>
                    <p className="text-3xl font-bold text-gray-900">{userData?.loyaltyPoints || 0}</p>
                  </div>
                  <div className="bg-yellow-100 rounded-xl p-3">
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Gift className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">Redeem for rewards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Recent Activity</span>
                </h3>
                <Link 
                  href="/orders" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All →
                </Link>
              </div>

              {userData?.orders && userData.orders.length > 0 ? (
                <div className="space-y-4">
                  {userData.orders.slice(0, 3).map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <ShoppingBag className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.id?.slice(-6) || 'N/A'}</p>
                          <p className="text-sm text-gray-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          Rs. {order.total ? order.total.toLocaleString() : 'N/A'}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No orders yet</p>
                  <p className="text-gray-400 text-sm mb-6">Start shopping to see your orders here</p>
                  <Link 
                    href="/products" 
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
