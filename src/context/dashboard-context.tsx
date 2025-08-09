"use client";
import * as React from 'react';

type DashboardContextType = {
  isUploading: boolean;
  triggerFileUpload: () => void;
  isPro: boolean;
  triggerExport: () => void;
  hasTransactions: boolean;
};

const DashboardContext = React.createContext<DashboardContextType | null>(null);

export function useDashboardContext() {
  const context = React.useContext(DashboardContext);
  if (context === undefined) {
    // Returning a default/mock context if not within a provider
    // This is useful for component previews or stories
    return {
      isUploading: false,
      triggerFileUpload: () => console.log("File upload triggered (mock)"),
      isPro: true,
      triggerExport: () => console.log("Export triggered (mock)"),
      hasTransactions: true,
    };
  }
  return context;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isPro] = React.useState(true); // Mock value
  const [hasTransactions] = React.useState(true); // Mock value

  const triggerFileUpload = () => {
    console.log("Triggering file upload");
    // Mock upload process
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
    }, 3000);
  };

  const triggerExport = () => {
    console.log("Triggering export");
  };

  const value = {
    isUploading,
    triggerFileUpload,
    isPro,
    triggerExport,
    hasTransactions,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
