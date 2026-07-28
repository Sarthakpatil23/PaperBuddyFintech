import React from 'react';
import BrandLogo from './BrandLogo';

export default function LoadingScreen({ 
  message = "Synchronizing Finlyt Financial Workspace...", 
  subtext = "Secure bank-grade encryption • Connecting to database",
  fullScreen = true,
  progress = null 
}) {
  const content = (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: fullScreen ? '40px 24px' : '32px 20px',
        textAlign: 'center',
        maxWidth: '440px',
        width: '90%',
        margin: '0 auto',
        userSelect: 'none'
      }}
    >
      {/* Orbital Glowing Logo Container */}
      <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        
        {/* Outer Rotating Glowing Ring */}
        <div 
          className="finlyt-spin-ring"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'var(--primary)',
            borderRightColor: 'var(--accent-blue-text, #6C8CE0)',
            borderBottomColor: 'rgba(108, 140, 224, 0.2)',
            borderLeftColor: 'transparent',
            boxShadow: '0 0 20px rgba(108, 140, 224, 0.35)',
            animation: 'finlytSpin 1.1s linear infinite'
          }}
        />

        {/* Center Logo Icon */}
        <div style={{ transform: 'scale(1.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BrandLogo size={42} showText={false} />
        </div>
      </div>

      {/* Brand Title */}
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
        Finlyt <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Intelligence</span>
      </div>

      {/* Status Message */}
      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
        {message}
      </div>

      {/* Modern Gradient Progress Bar */}
      <div style={{ width: '100%', height: '5px', background: 'var(--card-nested)', borderRadius: '999px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
        {progress !== null ? (
          <div 
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: 'linear-gradient(90deg, var(--primary) 0%, #38BDF8 50%, var(--primary) 100%)',
              borderRadius: '999px',
              transition: 'width 0.3s ease'
            }}
          />
        ) : (
          <div 
            className="finlyt-bar-shimmer"
            style={{
              height: '100%',
              width: '45%',
              position: 'absolute',
              background: 'linear-gradient(90deg, transparent 0%, var(--primary) 50%, transparent 100%)',
              borderRadius: '999px',
              animation: 'finlytShimmer 1.4s ease-in-out infinite'
            }}
          />
        )}
      </div>

      {/* Subtext info */}
      {subtext && (
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-paid-text)', display: 'inline-block' }} />
          <span>{subtext}</span>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes finlytSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes finlytShimmer {
          0% { left: -45%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div 
      className="fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'var(--bg-canvas)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {content}
    </div>
  );
}
