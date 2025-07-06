"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { GlobalLoader } from "@/components/ui/loading";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const pathname = usePathname();

  // Handle route changes
  useEffect(() => {
    setIsLoading(true);
    setLoadingMessage("Loading page...");
    
    // Simulate loading time and then hide loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  const startLoading = (message = "Loading...") => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading, loadingMessage }}>
      {children}
      
      {/* Global loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center">
          <div className="bg-black/95 border border-yellow-400/30 rounded-xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
            <GlobalLoader isLoading={true} variant="dots" className="scale-150" />
            <span className="text-yellow-400 font-medium text-lg">{loadingMessage}</span>
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
