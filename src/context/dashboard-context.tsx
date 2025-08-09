
"use client";
import * as React from 'react';

type DashboardContextType = {
  isPro: boolean;
  triggerExport: () => void;
  hasTransactions: boolean;
};

const DashboardContext = React.createContext<DashboardContextType | null>(null);

export function useDashboardContext() {
  const context = React.useContext(DashboardContext);
  if (context === undefined) {
    return {
      isPro: true,
      triggerExport: () => console.log("Export triggered (mock)"),
      hasTransactions: true,
    };
  }
  return context;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isPro] = React.useState(true); // Mock value
  const [hasTransactions] = React.useState(true); // Mock value

  const triggerExport = () => {
    console.log("Triggering export");
  };

  const value = {
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
