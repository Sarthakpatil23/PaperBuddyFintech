import React from 'react';

export default function BrandLogo({ size = 32, showText = true, textStyle = {} }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      {/* Modern Minimal Squircle Finlyt Logo Icon */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="finlyt-brand-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E3A9E" />
            <stop offset="50%" stopColor="#4F67D0" />
            <stop offset="100%" stopColor="#6C8CE0" />
          </linearGradient>
          <linearGradient id="finlyt-brand-spark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <filter id="finlyt-brand-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2E3A9E" floodOpacity="0.3" />
          </filter>
        </defs>

        <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#finlyt-brand-bg)" filter="url(#finlyt-brand-glow)" />
        <rect x="5" y="5" width="54" height="54" rx="15" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.5" fill="none" />

        <rect x="18" y="18" width="6.5" height="28" rx="3.25" fill="#FFFFFF" />
        <path d="M21 21H41C43.2091 21 45 22.7909 45 25C45 27.2091 43.2091 29 41 29H21V21Z" fill="#FFFFFF" />
        <path d="M21 31H35C36.6569 31 38 32.3431 38 34C38 35.6569 36.6569 37 35 37H21V31Z" fill="#FFFFFF" fillOpacity="0.88" />

        <path d="M41 12L48 15.5L41 19L34 15.5L41 12Z" fill="url(#finlyt-brand-spark)" />
      </svg>

      {showText && (
        <span 
          style={{ 
            fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)', 
            fontWeight: 800, 
            fontSize: `${size * 0.62}px`, 
            letterSpacing: '-0.025em',
            color: 'var(--text-main)',
            lineHeight: 1,
            ...textStyle 
          }}
        >
          Finlyt
        </span>
      )}
    </div>
  );
}
