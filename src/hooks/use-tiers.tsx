
"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useToast } from './use-toast';

const TOKENS_PER_APP_TOKEN = 2000;

export const calculateAppTokens = (apiTokens: number): number => {
  if (apiTokens <= 0) return 0;
  return Math.max(1, Math.ceil(apiTokens / TOKENS_PER_APP_TOKEN));
}

const TIER_CONFIG = {
    free: { tokens: 5 },
    pro: { tokens: 20 },
    premium: { tokens: 45 },
};

type TiersContextType = {
  isPro: boolean;
  isPremium: boolean;
  tokenBalance: number;
  maxTokens: number;
  setIsPro: (isPro: boolean) => void;
  setIsPremium: (isPremium: boolean) => void;
  setTokenBalance: React.Dispatch<React.SetStateAction<number>>;
  consumeTokens: (apiTokens: number) => boolean;
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
  const [tokenBalance, setTokenBalance] = useState(TIER_CONFIG.pro.tokens);
  const { toast } = useToast();

  const maxTokens = useMemo(() => {
    if (isPremium) return TIER_CONFIG.premium.tokens;
    if (isPro) return TIER_CONFIG.pro.tokens;
    return TIER_CONFIG.free.tokens;
  }, [isPro, isPremium]);

  const handleSetIsPro = (pro: boolean) => {
    setIsPro(pro);
    setTokenBalance(pro ? TIER_CONFIG.pro.tokens : TIER_CONFIG.free.tokens);
    if (isPremium) setIsPremium(false);
  }
  
  const handleSetIsPremium = (premium: boolean) => {
      setIsPremium(premium);
      if (premium) {
          setTokenBalance(TIER_CONFIG.premium.tokens);
          setIsPro(true);
      } else {
         // Revert to pro if it was active, otherwise free
         setTokenBalance(isPro ? TIER_CONFIG.pro.tokens : TIER_CONFIG.free.tokens);
      }
  }

  const consumeTokens = useCallback((apiTokens: number): boolean => {
    const appTokensToConsume = calculateAppTokens(apiTokens);

    if (tokenBalance < appTokensToConsume) {
        toast({
            variant: "destructive",
            title: "Insufficient Tokens",
            description: `You need ${appTokensToConsume} token(s) for this action, but you only have ${tokenBalance}.`,
        });
        return false;
    }

    setTokenBalance(prev => prev - appTokensToConsume);
     toast({
        title: "Tokens Consumed",
        description: `${appTokensToConsume} token(s) were used. You have ${tokenBalance - appTokensToConsume} remaining.`,
    });
    return true;
  }, [tokenBalance, toast]);

  return (
    <TiersContext.Provider value={{ 
        isPro, 
        isPremium, 
        tokenBalance,
        maxTokens,
        setIsPro: handleSetIsPro, 
        setIsPremium: handleSetIsPremium,
        setTokenBalance,
        consumeTokens
    }}>
      {children}
    </TiersContext.Provider>
  );
};
