"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({ children }) {
  // Create a client with INSTANT settings - NO network delays
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Cache FOREVER for instant responses
        staleTime: Infinity, // Never consider data stale
        // Keep in cache FOREVER
        cacheTime: Infinity,
        // INSTANT timeout - fail immediately if not cached
        timeout: 100, // 100ms max - if not cached, fail fast
        // NEVER retry - use cached data only
        retry: false,
        // Never refetch - use cache only
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        // Always use cached data
        keepPreviousData: true,
        // Cache-first mode for instant responses
        networkMode: 'offlineFirst',
        // Return cached data immediately
        suspense: false,
      },
      mutations: {
        retry: 0,
        networkMode: 'offlineFirst',
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
