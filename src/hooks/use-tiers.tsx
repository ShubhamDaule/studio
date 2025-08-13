
"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useToast } from './use-toast';

const TOKENS_PER_APP_TOKEN = 2000;

export const calculateAppTokens = (apiTokens: number): number => {
  if (apiTokens <= 0) return 0;
  return Math.max(1, Math.ceil(apiTokens / TOKENS_PER_APP_TOKEN));
}

type TiersContextType = {
  isPro: boolean;
  isPremium: boolean;
  tokenBalance: number;
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
  const [tokenBalance, setTokenBalance] = useState(20); // Default to Pro plan's tokens
  const { toast } = useToast();

  const handleSetIsPro = (pro: boolean) => {
    setIsPro(pro);
    if(pro) setTokenBalance(20);
    else setTokenBalance(5); // Free plan
    if(isPremium) setIsPremium(false);
  }
  
  const handleSetIsPremium = (premium: boolean) => {
      setIsPremium(premium);
      if(premium) {
          setTokenBalance(45);
          setIsPro(true);
      } else {
         handleSetIsPro(isPro); // Re-evaluate based on pro status
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
        setIsPro: handleSetIsPro, 
        setIsPremium: handleSetIsPremium,
        setTokenBalance,
        consumeTokens
    }}>
      {children}
    </TiersContext.Provider>
  );
};
