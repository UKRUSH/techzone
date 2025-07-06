"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { GlobalLoader } from "@/components/ui/loading";

const PageStateContext = createContext();

export function PageStateProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [error, setError] = useState(null);

  const startNavigation = useCallback((page) => {
    setIsNavigating(true);
    setCurrentPage(page);
    setError(null);
  }, []);

  const finishNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  const setPageError = useCallback((error) => {
    setError(error);
    setIsNavigating(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <PageStateContext.Provider 
      value={{ 
        isNavigating, 
        currentPage, 
        error,
        startNavigation, 
        finishNavigation, 
        setPageError,
        clearError
      }}
    >
      {children}
      
      {/* Global navigation overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-black/95 border border-yellow-400/30 rounded-xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
            <GlobalLoader isLoading={true} variant="dots" className="scale-150" />
            <div className="text-center">
              <div className="text-yellow-400 font-medium text-lg mb-2">
                Loading {currentPage}...
              </div>
              <div className="text-gray-400 text-sm">
                Optimizing your experience
              </div>
            </div>
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Global error state */}
      {error && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-red-500/20 border border-red-400/30 rounded-lg p-4 max-w-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-red-400 font-medium mb-1">
                Connection Issue
              </div>
              <div className="text-red-300 text-sm">
                Using cached data
              </div>
            </div>
            <button 
              onClick={clearError}
              className="text-red-400 hover:text-red-300 ml-4"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </PageStateContext.Provider>
  );
}

export function usePageState() {
  const context = useContext(PageStateContext);
  if (!context) {
    throw new Error("usePageState must be used within PageStateProvider");
  }
  return context;
}
