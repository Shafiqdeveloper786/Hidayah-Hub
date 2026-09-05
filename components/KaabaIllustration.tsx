/**
 * Minimalist, respectful Kaaba illustration used in the hero banner.
 * Pure SVG — no external assets. The geometry is stylised (elevation,
 * hizam band, door) with a soft gold halo for a premium, peaceful feel.
 */

import { cn } from "@/lib/utils";

export function KaabaIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      role="img"
      aria-label="Stylised illustration of the Holy Kaaba with Minarets"
    >
      <defs>
        <radialGradient id="k-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bfa059" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#bfa059" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="k-cube-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E2638" />
          <stop offset="100%" stopColor="#111622" />
        </linearGradient>
        <linearGradient id="k-belt-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9C7C3E" />
          <stop offset="50%" stopColor="#E2C580" />
          <stop offset="100%" stopColor="#9C7C3E" />
        </linearGradient>
        <linearGradient id="k-minaret-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2D6C1" />
          <stop offset="100%" stopColor="#C4B496" />
        </linearGradient>
      </defs>

      {/* Gold background glow */}
      <circle cx="170" cy="120" r="110" fill="url(#k-glow)" />

      {/* Minarets on the Right */}
      <g id="minarets" opacity="0.95">
        {/* Far right minaret */}
        <rect x="270" y="55" width="14" height="135" rx="3" fill="url(#k-minaret-grad)" />
        <path d="M267 55 L277 30 L287 55 Z" fill="#bfa059" />
        <circle cx="277" cy="26" r="2.5" fill="#E2C580" />
        {/* Minaret balconies */}
        <rect x="266" y="85" width="22" height="6" rx="2" fill="#1A202C" opacity="0.8" />
        <rect x="267" y="130" width="20" height="5" rx="2" fill="#1A202C" opacity="0.8" />

        {/* Near minaret */}
        <rect x="238" y="70" width="16" height="120" rx="3" fill="url(#k-minaret-grad)" />
        <path d="M234 70 L246 42 L258 70 Z" fill="#bfa059" />
        <circle cx="246" cy="38" r="3" fill="#E2C580" />
        {/* Minaret balconies */}
        <rect x="233" y="100" width="26" height="7" rx="2" fill="#1A202C" opacity="0.8" />
        <rect x="235" y="145" width="22" height="6" rx="2" fill="#1A202C" opacity="0.8" />
      </g>

      {/* Base platform shadow */}
      <ellipse cx="170" cy="205" rx="145" ry="16" fill="#1A202C" opacity="0.12" />

      {/* Kaaba Main Cube */}
      <rect x="40" y="85" width="165" height="110" rx="4" fill="url(#k-cube-grad)" />
      
      {/* Cube roof highlight line */}
      <line x1="40" y1="85" x2="205" y2="85" stroke="#3F5270" strokeWidth="2" />

      {/* Kaaba Golden Belt (Hizam) */}
      <rect x="40" y="112" width="165" height="12" fill="url(#k-belt-grad)" />
      <line x1="40" y1="118" x2="205" y2="118" stroke="#685023" strokeWidth="0.8" opacity="0.7" />

      {/* Kaaba Golden Door */}
      <rect x="125" y="134" width="34" height="55" rx="3" fill="url(#k-belt-grad)" stroke="#1A202C" strokeWidth="1" />
      <line x1="142" y1="134" x2="142" y2="189" stroke="#685023" strokeWidth="0.8" />
      <circle cx="134" cy="162" r="2" fill="#1A202C" />

      {/* Crescent on top of Kaaba */}
      <path d="M122.5 73 a5 5 0 1 0 3 8 a4 4 0 0 1 -3 -8Z" fill="#E2C580" />
    </svg>
  );
}