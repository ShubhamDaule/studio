
"use client";

import React, { useEffect, useState } from 'react';

const AskAiCharacter = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="w-20 h-20 bg-gray-200 rounded-full" />;
    }

    return (
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-80 animate-pulse"></div>
            <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
                 <svg
                    width="40"
                    height="40"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary"
                    >
                    <rect width="32" height="32" rx="8" fill="currentColor" />
                    <path
                        d="M9 22V17"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M16 22V10"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M23 22V14"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
};

export { AskAiCharacter };
