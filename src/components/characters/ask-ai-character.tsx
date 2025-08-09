
"use client";

import * as React from "react";

export function AskAiCharacter() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <style>{`
        .ai-char-head, .ai-char-body {
            stroke: #334155; /* slate-700 */
            stroke-width: 2.5;
            fill: #f1f5f9; /* slate-100 */
        }
        .ai-char-hair {
            fill: #4b5563; /* gray-600 */
        }
        .ai-char-features {
            stroke: #334155; /* slate-700 */
            stroke-width: 1.5;
            fill: none;
            stroke-linecap: round;
        }
        .ai-char-eyes {
            fill: #334155; /* slate-700 */
        }
        .ai-char-shirt {
            fill: hsl(var(--primary));
            opacity: 0.8;
        }
        .ai-char-glasses {
            stroke: #334155;
            stroke-width: 2.5;
            fill: none;
        }
        .ai-char-lightbulb-base {
            fill: #a1a1aa; /* zinc-400 */
        }
        .ai-char-lightbulb-glass {
            fill: #fefce8; /* yellow-50 */
            stroke: #facc15; /* yellow-400 */
            stroke-width: 1.5;
        }
        .ai-char-lightbulb-glow {
            fill: #fde047; /* yellow-300 */
            opacity: 0.5;
            filter: blur(2px);
        }
        @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
        }
        @keyframes glow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
        }
        .ai-char-bob {
            animation: bob 3s ease-in-out infinite;
        }
        .ai-char-glow-animate {
            animation: glow 2s ease-in-out infinite;
        }
      `}</style>
      <g className="ai-char-bob" transform="translate(0, 5)">
        {/* Body */}
        <path className="ai-char-body" d="M 25 95 C 20 70, 20 60, 50 60 C 80 60, 80 70, 75 95 Z" />
        
        {/* Shirt */}
        <path className="ai-char-shirt" d="M 27 68 C 22 75, 22 80, 50 80 C 78 80, 78 75, 73 68 Z" />
        <path className="ai-char-shirt" d="M 40 60 L 30 70 L 70 70 L 60 60 Z" />
        
        {/* Head */}
        <circle className="ai-char-head" cx="50" cy="40" r="20" />
        
        {/* Hair */}
        <path className="ai-char-hair" d="M 30 22 Q 50 15, 70 22 L 68 35 Q 50 30, 32 35 Z" />
        
        {/* Glasses */}
        <circle className="ai-char-glasses" cx="42" cy="40" r="6" />
        <circle className="ai-char-glasses" cx="58" cy="40" r="6" />
        <path className="ai-char-glasses" d="M 48 40 H 52" />
        
        {/* Eyes */}
        <circle className="ai-char-eyes" cx="42" cy="40" r="1.5" />
        <circle className="ai-char-eyes" cx="58" cy="40" r="1.5" />

        {/* Mouth */}
        <path className="ai-char-features" d="M 48 50 Q 50 52, 52 50" />
      </g>
       {/* Lightbulb */}
      <g transform="translate(65, 15)">
          <circle className="ai-char-lightbulb-glow ai-char-glow-animate" cx="0" cy="0" r="12" />
          <path className="ai-char-lightbulb-glass" d="M 0 -12 C 8 -12, 8 -4, 5 0 L -5 0 C -8 -4, -8 -12, 0 -12 Z" />
          <rect className="ai-char-lightbulb-base" x="-4" y="0" width="8" height="4" rx="1"/>
      </g>
    </svg>
  );
}
