
"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useToast } from './use-toast';

const TOKENS_PER_APP_TOKEN = 2000;
export const MINIMUM_TOKEN_CHARGE = 2.0;

export const calculateAppTokens = (apiTokens: number): number => {
  if (apiTokens <= 0) return 0;
  // Calculate proportional tokens, but ensure it's at least a small fraction for display.
  // The actual minimum charge is handled in consumeTokens.
  return Math.max(0.1, apiTokens / TOKENS_PER_APP_TOKEN);
}

const TIER_CONFIG = {
    free: { tokens: 10 },
    pro: { tokens: 20 },
    premium: { tokens: 45 },
};

type Tier = 'Free' | 'Pro' | 'Premium';

type TiersContextType = {
  isPro: boolean;
  isPremium: boolean;
  tokenBalance: number;
  maxTokens: number;
  setTier: (tier: Tier) => void;
  setIsPro: (isPro: boolean) => void;
  setIsPremium: (isPremium: boolean) => void;
  setTokenBalance: React.Dispatch<React.SetStateAction<number>>;
  consumeTokens: (tokensToConsume: number, isAppTokens?: boolean) => boolean;
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
  const [tokenBalance, setTokenBalance] = useState<number>(TIER_CONFIG.pro.tokens);
  const { toast } = useToast();

  const maxTokens = useMemo(() => {
    if (isPremium) return TIER_CONFIG.premium.tokens;
    if (isPro) return TIER_CONFIG.pro.tokens;
    return TIER_CONFIG.free.tokens;
  }, [isPro, isPremium]);

  const setTier = useCallback((tier: Tier) => {
    if (tier === 'Free') {
        setIsPro(false);
        setIsPremium(false);
        setTokenBalance(TIER_CONFIG.free.tokens);
    } else if (tier === 'Pro') {
        setIsPro(true);
        setIsPremium(false);
        setTokenBalance(TIER_CONFIG.pro.tokens);
    } else { // Premium
        setIsPro(true);
        setIsPremium(true);
        setTokenBalance(TIER_CONFIG.premium.tokens);
    }
  }, []);

  const handleSetIsPro = (pro: boolean) => {
    setTier(pro ? 'Pro' : 'Free');
  }
  
  const handleSetIsPremium = (premium: boolean) => {
      if (premium) {
        setTier('Premium');
      } else {
        // Revert to pro if it was active, otherwise free
        setTier(isPro ? 'Pro' : 'Free');
      }
  }

  const consumeTokens = useCallback((tokensToConsume: number, isAppTokens: boolean = false): boolean => {
    let appTokensToConsume = isAppTokens ? tokensToConsume : calculateAppTokens(tokensToConsume);
    // Enforce the minimum token charge, unless the calculated amount is zero.
    if (appTokensToConsume > 0) {
        appTokensToConsume = Math.max(appTokensToConsume, MINIMUM_TOKEN_CHARGE);
    }
    
    const formattedAppTokens = appTokensToConsume.toFixed(1);
    const formattedBalance = tokenBalance.toFixed(1);

    if (tokenBalance < appTokensToConsume) {
        toast({
            variant: "destructive",
            title: "Insufficient Tokens",
            description: `You need ${formattedAppTokens} token(s) for this action, but you only have ${formattedBalance}.`,
        });
        return false;
    }
    
    const newBalance = tokenBalance - appTokensToConsume;
    setTokenBalance(newBalance);
     toast({
        title: "Tokens Consumed",
        description: `${formattedAppTokens} token(s) were used. You have ${newBalance.toFixed(1)} remaining.`,
    });
    return true;
  }, [tokenBalance, toast]);

  return (
    <TiersContext.Provider value={{ 
        isPro, 
        isPremium, 
        tokenBalance,
        maxTokens,
        setTier,
        setIsPro: handleSetIsPro, 
        setIsPremium: handleSetIsPremium,
        setTokenBalance,
        consumeTokens
    }}>
      {children}
    </TiersContext.Provider>
  );
};
