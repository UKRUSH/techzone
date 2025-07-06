"use client";

import { memo } from 'react';
import { Loader2 } from 'lucide-react';

// Global loading component with skeleton states
export const GlobalLoader = memo(function GlobalLoader({ 
  isLoading = false, 
  message = "Loading...",
  className = "",
  variant = "spinner" // spinner, skeleton, dots
}) {
  if (!isLoading) return null;

  if (variant === "skeleton") {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="w-6 h-6 animate-spin text-yellow-400 mr-2" />
      <span className="text-gray-300">{message}</span>
    </div>
  );
});

// Loading overlay for page transitions
export const LoadingOverlay = memo(function LoadingOverlay({ 
  isLoading = false,
  message = "Loading page..."
}) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-r from-black/90 to-black/90 border border-yellow-400/30 rounded-2xl p-8 max-w-md mx-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Please wait</h3>
          <p className="text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  );
});

// Skeleton for product cards
export const ProductCardSkeleton = memo(function ProductCardSkeleton() {
  return (
    <div className="bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 rounded-2xl p-6 animate-pulse">
      <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-5 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-6 bg-gray-700 rounded w-2/3"></div>
        <div className="h-10 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
});

// Skeleton for sidebar
export const SidebarSkeleton = memo(function SidebarSkeleton() {
  return (
    <div className="w-full md:w-80 space-y-6 backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 rounded-2xl p-6 animate-pulse">
      {/* Search skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-700 rounded w-1/2"></div>
        <div className="h-10 bg-gray-700 rounded"></div>
      </div>
      
      {/* Categories skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-700 rounded w-1/3"></div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Brands skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Fast error boundary component
export const ErrorDisplay = memo(function ErrorDisplay({ 
  error,
  onRetry,
  message = "Something went wrong"
}) {
  return (
    <div className="text-center py-8">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{message}</h3>
        <p className="text-gray-400 mb-4 text-sm">
          {error?.message || "Please try again later"}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
});
