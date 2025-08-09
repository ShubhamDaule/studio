
"use client";

import * as React from "react";

export function FinancialCoach() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <style>{`
        .coach-head, .coach-body {
            stroke: #334155; /* slate-700 */
            stroke-width: 2.5;
            fill: #f1f5f9; /* slate-100 */
        }
        .coach-hair {
            fill: #334155; /* slate-700 */
        }
        .coach-features {
            stroke: #334155; /* slate-700 */
            stroke-width: 1.5;
            fill: none;
            stroke-linecap: round;
        }
        .coach-eyes {
            fill: #334155; /* slate-700 */
        }
        .coach-shirt {
            fill: hsl(var(--primary));
        }
        .coach-tie {
            fill: hsl(var(--accent));
            stroke: #334155;
            stroke-width: 1.5;
        }
        @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
        }
        .coach-bob {
            animation: bob 3s ease-in-out infinite;
        }
      `}</style>
      <g className="coach-bob">
        {/* Body */}
        <path className="coach-body" d="M 25 95 C 20 70, 20 60, 50 60 C 80 60, 80 70, 75 95 Z" />
        
        {/* Shirt */}
        <path className="coach-shirt" d="M 27 68 C 22 75, 22 80, 50 80 C 78 80, 78 75, 73 68 Z" />
        <path className="coach-shirt" d="M 40 60 L 30 70 L 70 70 L 60 60 Z" />
        
        {/* Tie */}
        <path className="coach-tie" d="M 50 68 L 45 78 L 50 85 L 55 78 Z" />
        
        {/* Head */}
        <circle className="coach-head" cx="50" cy="40" r="20" />
        
        {/* Hair */}
        <path className="coach-hair" d="M 35 25 Q 50 15, 65 25 L 68 35 Q 50 30, 32 35 Z" />
        
        {/* Eyes */}
        <circle className="coach-eyes" cx="42" cy="40" r="1.5" />
        <circle className="coach-eyes" cx="58" cy="40" r="1.5" />
        
        {/* Smile */}
        <path className="coach-features" d="M 45 48 Q 50 52, 55 48" />
      </g>
    </svg>
  );
}
