'use client';

import { useSession } from 'next-auth/react';

export default function SimpleProfileTest() {
  const { data: session, status } = useSession();

  console.log('Profile Test - Status:', status);
  console.log('Profile Test - Session:', session);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-yellow-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">❌ Not Authenticated</h1>
          <p className="text-gray-300">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-yellow-400 mb-8">✅ Profile Page Working</h1>
          
          <div className="bg-gray-900 border border-yellow-400/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Session Information</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {session?.user?.email}</p>
              <p><strong>Name:</strong> {session?.user?.name || 'Not set'}</p>
              <p><strong>Image:</strong> {session?.user?.image || 'Not set'}</p>
            </div>
          </div>
          
          <div className="mt-6 text-green-400">
            The profile page is working correctly! 
            The issue was likely with the NextAuth URL configuration.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-400">Unknown Status</h1>
        <p>Status: {status}</p>
      </div>
    </div>
  );
}
