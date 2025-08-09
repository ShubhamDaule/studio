
"use client";

import * as React from "react";

export function AnomalyDetective() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <style>{`
        .detective-head, .detective-body, .detective-hand {
            stroke: #334155; /* slate-700 */
            stroke-width: 2.5;
            fill: #f1f5f9; /* slate-100 */
        }
        .detective-hat, .detective-coat-lapel {
            fill: #a16207; /* yellow-800 */
            stroke: #334155;
            stroke-width: 2;
        }
        .detective-coat {
             fill: #ca8a04; /* yellow-700 */
        }
        .detective-features {
            stroke: #334155; /* slate-700 */
            stroke-width: 1.5;
            fill: none;
            stroke-linecap: round;
        }
        .detective-eyes {
            fill: #334155; /* slate-700 */
        }
        .magnifying-glass-handle {
            fill: #44403c; /* stone-700 */
            stroke: #1c1917; /* stone-900 */
            stroke-width: 1;
        }
        .magnifying-glass-rim {
            fill: none;
            stroke: #a1a1aa; /* zinc-400 */
            stroke-width: 4;
        }
        .magnifying-glass-lens {
            fill: #cffafe; /* cyan-100 */
            opacity: 0.7;
        }
         @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
        }
        .detective-bob {
            animation: bob 3s ease-in-out infinite;
        }
      `}</style>
      <g className="detective-bob" transform="translate(0, 5)">
        {/* Body */}
        <path className="detective-body" d="M 25 95 C 20 70, 20 60, 50 60 C 80 60, 80 70, 75 95 Z" />
        <path className="detective-coat" d="M 27 68 C 22 75, 22 80, 50 80 C 78 80, 78 75, 73 68 Z" />
        <path className="detective-coat-lapel" d="M 40 65 L 30 75 L 70 75 L 60 65 Z" />
        
        {/* Head */}
        <circle className="detective-head" cx="50" cy="40" r="20" />
        
        {/* Hat */}
        <path className="detective-hat" d="M 28 32 C 25 25, 75 25, 72 32 L 68 35 Q 50 30, 32 35 Z" />
        <path className="detective-hat" d="M 25 32 H 75" strokeLinecap="round" />

        {/* Eyes */}
        <circle className="detective-eyes" cx="42" cy="42" r="1.5" />
        <circle className="detective-eyes" cx="58" cy="42" r="1.5" />
        
        {/* Mouth */}
        <path className="detective-features" d="M 48 52 H 52" />

        {/* Magnifying Glass */}
        <g transform="translate(65, 55) rotate(30)">
            <circle className="magnifying-glass-rim" cx="0" cy="0" r="12" />
            <circle className="magnifying-glass-lens" cx="0" cy="0" r="10" />
            <rect className="magnifying-glass-handle" x="-2" y="12" width="4" height="15" rx="2" />
        </g>
      </g>
    </svg>
  );
}
