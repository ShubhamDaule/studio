
"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

type TiersContextType = {
  isPro: boolean;
  isPremium: boolean;
  setIsPro: (isPro: boolean) => void;
  setIsPremium: (isPremium: boolean) => void;
};

const TiersContext = createContext<TiersContextType | undefined>(undefined);

export const useTiers = () => {
  const context = useContext(TiersContext);
  if (!context) {
    throw new Error('useTiers must be used within a TiersProvider');
  }
  return context;
};

export const TiersProvider = ({ children }: { children: ReactNode }) => {
  const [isPro, setIsPro] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  return (
    <TiersContext.Provider value={{ isPro, isPremium, setIsPro, setIsPremium }}>
      {children}
    </TiersContext.Provider>
  );
};
