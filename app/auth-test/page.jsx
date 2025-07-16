'use client';

import { useSession } from 'next-auth/react';

export default function AuthTestPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        
        <div>
          <strong>Session:</strong> {session ? 'Yes' : 'No'}
        </div>
        
        {session && (
          <div>
            <strong>User:</strong> {JSON.stringify(session.user, null, 2)}
          </div>
        )}
        
        {status === 'unauthenticated' && (
          <div className="text-red-400">
            ❌ Not authenticated - Please sign in first
          </div>
        )}
        
        {status === 'loading' && (
          <div className="text-yellow-400">
            🔄 Loading authentication...
          </div>
        )}
        
        {status === 'authenticated' && (
          <div className="text-green-400">
            ✅ Authenticated successfully
          </div>
        )}
      </div>
    </div>
  );
}
