import React, { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../config/api';
import {
  Building2, ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, Check,
  Sparkles, HelpCircle, UserCheck, Receipt, Coins, BarChart3, Loader2,
  Sun, Moon, GraduationCap, ShieldAlert, Zap, Bot, TrendingUp, Users,
  CreditCard, FileText, Settings, BarChart2, ChevronRight, Menu, X,
  PlayCircle, Landmark, Activity, DollarSign, CheckCircle2, ArrowUpRight,
  Brain, MessageSquare, Database, Bell, Github
} from 'lucide-react';

import BrandLogo from './BrandLogo';
import LoadingScreen from './LoadingScreen';
import ShapeGrid from './ShapeGrid';

export default function LoginPage({ onLoginSuccess, theme, toggleTheme }) {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('admin@school.edu');
  const [password, setPassword] = useState('admin_password_2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loginCardRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const studentAccounts = [
    { id: 'STU-101', name: 'Aarav Sharma',   grade: 'Grade 10-A', email: 'aarav.sharma@finlyt.edu',    pass: 'aarav123' },
    { id: 'STU-102', name: 'Ananya Patel',   grade: 'Grade 8-B',  email: 'ananya.patel@finlyt.edu',    pass: 'ananya123' },
    { id: 'STU-103', name: 'Rohan Verma',    grade: 'Grade 12-C', email: 'rohan.verma@finlyt.edu',     pass: 'rohan123' },
    { id: 'STU-104', name: 'Priya Gupta',    grade: 'Grade 9-A',  email: 'priya.gupta@finlyt.edu',     pass: 'priya123' },
    { id: 'STU-105', name: 'Gurpreet Singh', grade: 'Grade 11-B', email: 'gurpreet.singh@finlyt.edu',  pass: 'gurpreet123' }
  ];

  const rolePresets = {
    admin: {
      email: 'admin@school.edu',
      pass: 'admin_password_2026',
      label: 'School Admin',
      subtext: 'Manage fee structures, waivers & overall school ledger'
    },
    cashier: {
      email: 'finance@school.edu',
      pass: 'staff_password_2026',
      label: 'Finance Staff',
      subtext: 'Collect counter cash/cheque & reconcile bank deposits'
    },
    parent: {
      email: 'aarav.sharma@finlyt.edu',
      pass: 'aarav123',
      label: 'Student / Parent Portal',
      subtext: 'View fee balance, receive alerts & pay via UPI/Online'
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'parent') {
      setEmail('aarav.sharma@finlyt.edu');
      setPassword('aarav123');
    } else {
      setEmail(rolePresets[newRole].email);
      setPassword(rolePresets[newRole].pass);
    }
  };

  const autofillStudent = (stu) => {
    setRole('parent');
    setEmail(stu.email);
    setPassword(stu.pass);
    showToast(`Autofilled credentials for ${stu.name} (${stu.id})`, 'info');
  };

  const autofillAdmin = (adminType) => {
    setRole(adminType);
    setEmail(rolePresets[adminType].email);
    setPassword(rolePresets[adminType].pass);
    showToast(`Autofilled credentials for ${rolePresets[adminType].label}`, 'info');
  };

  const showToast = (msg, type = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        showToast(`Welcome ${data.user.name || data.user.roleLabel}!`, 'info');
        onLoginSuccess(data.user);
      } else {
        showToast(data.error || 'Authentication failed', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('Connection error to auth server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    showToast('Signing in with Google Workspace...', 'info');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: 'admin.google@finlyt.edu',
        role: 'admin',
        roleLabel: 'School Admin (Google Auth)'
      });
    }, 800);
  };

  const scrollToLogin = () => {
    loginCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // ─── DATA ───────────────────────────────────────────────────────────────────
  const features = [
    {
      icon: Coins,
      color: 'var(--primary)',
      bg: 'var(--primary-light)',
      title: 'Dynamic Fee Engine',
      desc: 'Configure custom fee categories — Tuition, Transport, Hostel, Lab — with per-student waivers, instalment schedules, and automated late-penalty rules.'
    },
    {
      icon: CreditCard,
      color: 'var(--accent)',
      bg: 'var(--accent-light)',
      title: 'Unified Transaction Engine',
      desc: 'Accept zero-fee UPI, Razorpay, cash counter, cheque deposit, NEFT/RTGS, and demand drafts — all logged into a single real-time ledger.'
    },
    {
      icon: Users,
      color: '#7C3AED',
      bg: 'rgba(124,58,237,0.1)',
      title: 'Parent Portal',
      desc: 'Parents view live fee balances, upcoming dues, payment history, digital receipts, and pay instantly — from any device, anytime.'
    },
    {
      icon: BarChart2,
      color: '#059669',
      bg: 'rgba(5,150,105,0.1)',
      title: 'Financial Intelligence',
      desc: 'Real-time dashboards, defaulter tracking, collection analytics, bank reconciliation, and audit-grade reports — all in one place.'
    }
  ];

  const workflowSteps = [
    { icon: Settings,      label: 'Create Fee Structure',     desc: 'Define tuition, transport, exam fees and penalty rules' },
    { icon: UserCheck,     label: 'Assign Fees to Students',  desc: 'Bulk or individual assignment with waiver & instalment support' },
    { icon: Bell,          label: 'Parents Receive Dues',     desc: 'Auto-alerts via SMS, email, and in-app notifications' },
    { icon: CreditCard,    label: 'Collect Payments',         desc: 'UPI, Cash, Cheque — all channels captured in real time' },
    { icon: CheckCircle2,  label: 'Auto Reconciliation',      desc: 'Bank statements matched, bounced cheques flagged automatically' },
    { icon: FileText,      label: 'Receipts & Reports',       desc: 'PDF receipts generated; financial reports updated instantly' }
  ];

  const aiSuggestions = [
    { icon: BarChart3,    text: 'Show today\'s collection summary' },
    { icon: Users,        text: 'List pending fee students in Grade 10' },
    { icon: TrendingUp,   text: 'Generate monthly revenue report' },
    { icon: MessageSquare, text: 'Send reminders to all defaulters' }
  ];

  const stats = [
    { value: '150+',  label: 'Schools' },
    { value: '50,000+', label: 'Students' },
    { value: '₹25Cr+', label: 'Fees Processed' },
    { value: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="finlyt-landing" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif", background: 'var(--bg-canvas)', color: 'var(--text-main)', minHeight: '100vh', overflowX: 'hidden' }}>
      {isLoading && (
        <LoadingScreen 
          message="Authenticating Credentials with Finlyt Security..." 
          subtext="Verifying role permissions & initializing workspace..." 
        />
      )}

      {/* ── TOAST ─────────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 99999,
          background: toastType === 'error' ? 'var(--destructive)' : 'var(--primary)',
          color: 'white', padding: '14px 22px', borderRadius: '10px',
          fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '420px',
          animation: 'slideInRight 0.3s ease'
        }}>
          {toastType === 'error' ? <ShieldAlert size={20} /> : <Sparkles size={20} />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          1. NAVIGATION BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
        padding: '0 6%',
        background: scrolled
          ? (theme === 'dark' ? 'rgba(15,23,42,0.96)' : 'rgba(255,255,255,0.96)')
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        height: '74px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <BrandLogo size={38} />
        </a>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="landing-desktop-nav">
          {['Features', 'Solutions', 'Why Finlyt', 'AI Assistant', 'Resources', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                padding: '8px 16px', borderRadius: '10px', fontSize: '0.88rem',
                fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={e => { e.target.style.color = 'var(--text-main)'; e.target.style.background = 'var(--bg-card)'; }}
              onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.background = 'transparent'; }}
            >{item}</a>
          ))}
        </nav>

        {/* Right CTA Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* GitHub Repository Link */}
          <a
            href="https://github.com/Sarthakpatil23/PaperBuddyFintech"
            target="_blank"
            rel="noopener noreferrer"
            title="View GitHub Repository"
            style={{
              padding: '9px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.86rem',
              fontWeight: 600,
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <Github size={17} />
            <span className="landing-desktop-nav">GitHub</span>
          </a>

          <button onClick={toggleTheme} title="Toggle theme" style={{
            padding: '9px', borderRadius: '10px', border: '1px solid var(--border-color)',
            background: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', transition: 'all 0.18s ease'
          }}>
            {theme === 'dark' ? <Sun size={17} style={{ color: '#F59E0B' }} /> : <Moon size={17} />}
          </button>

          <button onClick={() => showToast('Finlyt Support is ready to help!', 'info')} style={{
            padding: '9px 16px', borderRadius: '10px', border: '1px solid var(--border-color)',
            background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
            fontSize: '0.86rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.18s ease'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            className="landing-desktop-nav"
          >
            <HelpCircle size={15} /> Need Help?
          </button>

          <button onClick={scrollToLogin} style={{
            padding: '10px 22px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            color: 'white', border: 'none', cursor: 'pointer',
            fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '7px',
            boxShadow: 'var(--shadow-primary)',
            transition: 'all 0.2s ease'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-primary)'; }}
          >
            Sign In <ArrowRight size={15} />
          </button>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="landing-mobile-only" style={{
            padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)',
            background: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'pointer'
          }}>
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: '74px', left: 0, right: 0, zIndex: 8999,
          background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)',
          padding: '20px 6%', display: 'flex', flexDirection: 'column', gap: '6px'
        }}>
          <a
            href="https://github.com/Sarthakpatil23/PaperBuddyFintech"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px 16px', borderRadius: '10px', fontSize: '0.92rem',
              fontWeight: 600, color: 'var(--primary)', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--primary-light)', marginBottom: '8px'
            }}
          >
            <Github size={18} />
            <span>GitHub Repository</span>
          </a>
          {['Features', 'Solutions', 'Why Finlyt', 'AI Assistant', 'Resources', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '12px 16px', borderRadius: '10px', fontSize: '0.92rem',
                fontWeight: 500, color: 'var(--text-main)', textDecoration: 'none',
                transition: 'background 0.15s ease'
              }}
            >{item}</a>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          2. HERO SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        paddingTop: '74px',
        display: 'flex', alignItems: 'center',
        padding: '64px 6% 88px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Interactive ShapeGrid Animated Canvas Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: theme === 'dark' ? 0.85 : 0.65,
          zIndex: 0,
          pointerEvents: 'auto'
        }}>
          <ShapeGrid 
            speed={0.5} 
            squareSize={44}
            direction="diagonal"
            borderColor={theme === 'dark' ? 'rgba(108, 140, 224, 0.16)' : 'rgba(46, 58, 158, 0.12)'}
            hoverFillColor={theme === 'dark' ? 'rgba(108, 140, 224, 0.38)' : 'rgba(46, 58, 158, 0.22)'}
            shape="square"
            hoverTrailAmount={6}
          />
        </div>

        {/* Radial Ambient Glow Overlays */}
        <div style={{
          position: 'absolute', top: '-180px', right: '-180px',
          width: '720px', height: '720px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,140,224,0.12) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 1
        }} />
        <div style={{
          position: 'absolute', bottom: '-120px', left: '-120px',
          width: '560px', height: '560px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,58,158,0.08) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 1
        }} />

        <div style={{
          maxWidth: '1360px', margin: '0 auto', width: '100%',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) 500px',
          gap: '56px', alignItems: 'center',
          position: 'relative', zIndex: 2
        }} className="hero-grid">

          {/* Left — Tagline & CTAs */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '7px 16px', borderRadius: '99px',
              background: 'var(--primary-light)', border: '1px solid var(--border)',
              fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              <Sparkles size={14} />
              <span>School Finance Management Platform</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)',
              fontWeight: 900, lineHeight: 1.1,
              letterSpacing: '-0.035em', margin: '0 0 20px 0',
              color: 'var(--text-main)'
            }}>
              Smart School<br />
              Finance.<br />
              <span style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Simplified.</span>
            </h1>

            <p style={{
              fontSize: '1.08rem', lineHeight: 1.65,
              color: 'var(--text-muted)', margin: '0 0 32px 0',
              maxWidth: '560px'
            }}>
              Finlyt digitizes your entire school fee lifecycle — from fee configuration and payment collection to reconciliation, reporting, and AI-powered financial intelligence. Everything connected. Nothing missed.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '44px' }}>
              <button onClick={scrollToLogin} style={{
                padding: '15px 32px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: 'white', border: 'none', cursor: 'pointer',
                fontSize: '0.96rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '9px',
                boxShadow: 'var(--shadow-primary)',
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-primary)'; }}
              >
                Request Demo <ArrowRight size={18} />
              </button>

              <button onClick={() => showToast('Product demo video coming soon!', 'info')} style={{
                padding: '15px 28px', borderRadius: '12px',
                background: 'transparent', border: '1.5px solid var(--border-color)',
                color: 'var(--text-main)', cursor: 'pointer',
                fontSize: '0.96rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                <PlayCircle size={18} /> Watch Product Demo
              </button>
            </div>

            {/* Statistics */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px'
            }} className="hero-stats-grid">
              {stats.map((s, i) => (
                <div key={i} style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 900,
                    letterSpacing: '-0.03em', color: 'var(--text-main)',
                    background: i % 2 === 0
                      ? 'linear-gradient(135deg, var(--primary), var(--destructive))'
                      : 'linear-gradient(135deg, var(--accent), var(--primary))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                  }}>{s.value}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Login Card (broader & spacious) */}
          <div ref={loginCardRef} className="login-form-panel" style={{ width: '100%', maxWidth: '500px', padding: 0 }}>
            <div className="odoo-card">
              <div className="odoo-card-header" style={{ marginBottom: '24px' }}>
                <h2 className="card-heading" style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>Sign in to Finlyt</h2>
                <p className="card-subtext" style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Access your school fee portal & financial dashboard</p>
              </div>

              {/* Role Selector Tabs */}
              <div className="role-tabs-container" style={{ padding: '5px', borderRadius: '14px', marginBottom: '24px', gap: '6px' }}>
                <button
                  type="button"
                  className={`role-tab-btn ${role === 'admin' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('admin')}
                  style={{ padding: '10px 16px', fontSize: '0.88rem', fontWeight: 600, borderRadius: '10px' }}
                >
                  <Building2 size={16} />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  className={`role-tab-btn ${role === 'parent' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('parent')}
                  style={{ padding: '10px 16px', fontSize: '0.88rem', fontWeight: 600, borderRadius: '10px' }}
                >
                  <UserCheck size={16} />
                  <span>Student / Parent</span>
                </button>
              </div>

              {/* Role-Based Quick Credentials Banner */}
              {role === 'admin' || role === 'cashier' ? (
                <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '14px', padding: '14px 16px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9F1239', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} />
                    <span>Admin / Staff Restricted Credentials</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#881337', marginBottom: '10px', lineHeight: 1.5 }}>
                    Email: <strong>{rolePresets[role].email}</strong> | Pass: <strong>{rolePresets[role].pass}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => autofillAdmin(role)}
                    style={{
                      background: '#9F1239', color: 'white', border: 'none',
                      padding: '6px 14px', borderRadius: '8px',
                      fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    Autofill {rolePresets[role].label} Credentials
                  </button>
                </div>
              ) : (
                <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '14px 16px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--odoo-purple)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={15} />
                    <span>Student Accounts Database Credentials</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {studentAccounts.map((stu) => (
                      <button
                        key={stu.id}
                        type="button"
                        onClick={() => autofillStudent(stu)}
                        style={{
                          padding: '6px 13px', borderRadius: '99px',
                          border: '1px solid var(--border-color)',
                          background: email.toLowerCase() === stu.email.toLowerCase() ? 'var(--odoo-purple)' : 'var(--surface-card)',
                          color: email.toLowerCase() === stu.email.toLowerCase() ? 'white' : 'var(--text-main)',
                          fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '5px',
                          transition: 'all 0.18s ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                        }}
                        title={`Email: ${stu.email} | Password: ${stu.pass}`}
                      >
                        <span>{stu.name}</span>
                        <span style={{ opacity: 0.75, fontSize: '0.72rem' }}>({stu.id})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    {role === 'parent' ? 'Student Email / Student ID' : 'School Email / User ID'}
                  </label>
                  <div className="input-input-wrapper">
                    <input
                      type="text" className="form-input" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === 'parent' ? 'e.g. aarav.sharma@finlyt.edu or STU-101' : 'e.g. admin@school.edu'}
                      style={{ height: '50px', borderRadius: '12px', paddingLeft: '46px', fontSize: '0.95rem' }}
                      required
                    />
                    <Mail className="input-icon" size={18} style={{ left: '16px' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="form-label-row">
                    <label className="form-label" style={{ fontSize: '0.88rem', fontWeight: 600 }}>Password</label>
                    <a href="#forgot" className="forgot-password-link" style={{ fontSize: '0.84rem', fontWeight: 600 }}
                      onClick={(e) => { e.preventDefault(); showToast('Password reset instructions sent to your email.', 'info'); }}>
                      Forgot password?
                    </a>
                  </div>
                  <div className="input-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'} className="form-input"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{ height: '50px', borderRadius: '12px', paddingLeft: '46px', fontSize: '0.95rem' }}
                      required
                    />
                    <Lock className="input-icon" size={18} style={{ left: '16px' }} />
                    <button type="button" className="toggle-password-btn" style={{ right: '14px' }} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={`remember-me-container ${rememberMe ? 'checked' : ''}`} onClick={() => setRememberMe(!rememberMe)} style={{ marginBottom: '24px', gap: '10px' }}>
                  <div className="custom-checkbox" style={{ width: '20px', height: '20px', borderRadius: '6px' }}>
                    {rememberMe && <Check size={14} strokeWidth={3} />}
                  </div>
                  <span className="remember-text" style={{ fontSize: '0.88rem', fontWeight: 500 }}>Remember this device for 30 days</span>
                </div>

                <button
                  type="submit" className="btn-submit-primary" disabled={isLoading}
                  style={{
                    height: '52px', borderRadius: '12px', fontSize: '0.96rem', fontWeight: 700, gap: '10px',
                    background: role === 'admin' || role === 'cashier' ? '#9F1239' : 'var(--odoo-purple)',
                    borderColor: role === 'admin' || role === 'cashier' ? '#9F1239' : 'var(--odoo-purple)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
                  }}
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin" size={19} /><span>Verifying Credentials...</span></>
                  ) : (
                    <><span>Sign In to {role === 'parent' ? 'Student Portal' : 'Admin Portal'}</span><ArrowRight size={19} /></>
                  )}
                </button>
              </form>

              <div className="divider-or" style={{ margin: '24px 0', fontSize: '0.82rem', fontWeight: 600 }}><span>Or sign in with</span></div>

              <button type="button" className="google-sso-btn" onClick={handleGoogleAuth} style={{ height: '50px', borderRadius: '12px', fontSize: '0.92rem', fontWeight: 600, gap: '12px' }}>
                <svg width="19" height="19" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign in with Google Workspace</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. FEATURES SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{
        padding: '96px 6%',
        background: theme === 'dark' ? 'rgba(255,255,255,0.015)' : 'rgba(113,75,103,0.02)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '7px 16px', borderRadius: '99px', marginBottom: '16px',
              background: 'var(--primary-light)', border: '1px solid var(--border)',
              fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              <Zap size={13} /> Platform Capabilities
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 900,
              letterSpacing: '-0.035em', color: 'var(--text-main)',
              margin: '0 0 16px 0', lineHeight: 1.15
            }}>
              Everything You Need.<br />
              <span style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>All in One Platform.</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.65 }}>
              Built for schools that want precision, transparency, and speed — without juggling multiple tools.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px'
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: '36px 32px', borderRadius: '20px',
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                cursor: 'default', transition: 'all 0.25s ease'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.08)`;
                  e.currentTarget.style.borderColor = f.color + '44';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: f.bg, color: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <f.icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="solutions" style={{ padding: '96px 6%' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '7px 16px', borderRadius: '99px', marginBottom: '16px',
              background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)',
              fontSize: '0.78rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              <Activity size={13} /> Workflow
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', fontWeight: 900,
              letterSpacing: '-0.035em', color: 'var(--text-main)',
              margin: '0 0 16px 0', lineHeight: 1.15
            }}>How It Works</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.65 }}>
              Six seamless steps — from creating a fee structure to auto-updated reports.
            </p>
          </div>

          {/* Timeline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '16px',
            position: 'relative'
          }} className="workflow-timeline">
            {/* Connector line */}
            <div style={{
              position: 'absolute', top: '40px', left: '8.33%', right: '8.33%',
              height: '3px', background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              zIndex: 1
            }} className="workflow-connector" />

            {workflowSteps.map((step, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', padding: '0 8px', position: 'relative', zIndex: 2
              }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'var(--card)',
                  border: '2px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  zIndex: 3
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--primary), var(--accent))';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.querySelectorAll('svg').forEach(s => s.style.color = 'white');
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--card)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.querySelectorAll('svg').forEach(s => s.style.color = 'var(--primary)');
                  }}
                >
                  <step.icon size={28} style={{ color: 'var(--primary)', transition: 'color 0.2s ease' }} />
                  <div style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    color: 'white', fontSize: '0.7rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-xs)'
                  }}>
                    {i + 1}
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px', lineHeight: 1.35 }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. MEET FINLYT AI
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="ai-assistant" style={{
        padding: '96px 6%',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, rgba(30,27,75,0.6) 0%, rgba(15,23,42,0.8) 100%)'
          : 'linear-gradient(135deg, rgba(30,27,75,0.04) 0%, rgba(2,132,199,0.04) 100%)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '64px', alignItems: 'center'
          }} className="ai-section-grid">

            {/* Left — AI Visual */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{
                width: '320px', height: '320px', borderRadius: '32px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #0284C7 100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '16px', position: 'relative', overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(30,27,75,0.35)'
              }}>
                <div style={{
                  position: 'absolute', top: '-60px', right: '-60px',
                  width: '220px', height: '220px', borderRadius: '50%',
                  background: 'rgba(56,189,248,0.18)', filter: 'blur(40px)'
                }} />

                <div style={{
                  width: '80px', height: '80px', borderRadius: '22px',
                  background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Bot size={40} style={{ color: '#38BDF8' }} />
                </div>

                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'white', letterSpacing: '-0.02em' }}>Finlyt AI</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginTop: '3px' }}>Powered by Llama 3.3</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Admin', 'Parent', 'Accountant'].map((role, i) => (
                    <div key={i} style={{
                      padding: '5px 12px', borderRadius: '99px',
                      background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
                      fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)'
                    }}>
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — AI Content */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '7px 16px', borderRadius: '99px', marginBottom: '16px',
                background: 'rgba(30,27,75,0.08)', border: '1px solid rgba(30,27,75,0.15)',
                fontSize: '0.78rem', fontWeight: 700, color: '#312E81', textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>
                <Brain size={13} /> AI-Powered Assistant
              </div>

              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900,
                letterSpacing: '-0.035em', color: 'var(--text-main)',
                margin: '0 0 16px 0', lineHeight: 1.2
              }}>
                Meet <span style={{
                  background: 'linear-gradient(135deg, #312E81, #0284C7)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>Finlyt AI</span>
              </h2>

              <p style={{ fontSize: '1.02rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 28px 0', maxWidth: '480px' }}>
                A role-aware AI assistant that understands your school's financial context — whether you're an administrator reviewing collections, an accountant reconciling statements, a parent checking dues, or management analyzing trends.
              </p>

              {/* Suggestion chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {aiSuggestions.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 20px', borderRadius: '14px',
                    background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                    cursor: 'pointer', transition: 'all 0.18s ease'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.background = 'rgba(2,132,199,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                      background: 'rgba(2,132,199,0.1)', color: '#0284C7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <s.icon size={16} />
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{s.text}</span>
                    <ArrowRight size={15} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>

              <button onClick={scrollToLogin} style={{
                padding: '14px 28px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #1E1B4B, #0284C7)',
                color: 'white', border: 'none', cursor: 'pointer',
                fontSize: '0.92rem', fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: '9px',
                boxShadow: '0 6px 20px rgba(30,27,75,0.35)',
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(30,27,75,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,27,75,0.35)'; }}
              >
                <Bot size={17} /> Explore AI Assistant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. CTA BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="why-finlyt" style={{ padding: '96px 6%' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            padding: '64px 48px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
            textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px',
              borderRadius: '50%', background: 'rgba(255,255,255,0.06)'
            }} />
            <div style={{
              position: 'absolute', bottom: '-60px', left: '-60px', width: '280px', height: '280px',
              borderRadius: '50%', background: 'rgba(255,255,255,0.04)'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '7px 16px', borderRadius: '99px', marginBottom: '18px',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)', textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>
                <Sparkles size={13} /> Get Started Today
              </div>

              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900,
                letterSpacing: '-0.04em', color: 'white',
                margin: '0 0 16px 0', lineHeight: 1.15
              }}>
                Ready to Transform Your<br />School Finance?
              </h2>

              <p style={{
                fontSize: '1.08rem', color: 'rgba(255,255,255,0.85)',
                maxWidth: '560px', margin: '0 auto 36px auto', lineHeight: 1.65
              }}>
                Join 150+ schools already using Finlyt. Set up takes less than a day and our team is with you every step of the way.
              </p>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={scrollToLogin} style={{
                  padding: '15px 32px', borderRadius: '12px',
                  background: 'white', color: 'var(--primary)', border: 'none', cursor: 'pointer',
                  fontSize: '0.94rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: '9px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
                >
                  Request Demo <ArrowRight size={18} />
                </button>

                <button onClick={() => showToast('Our sales team will contact you shortly!', 'info')} style={{
                  padding: '15px 32px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)',
                  color: 'white', cursor: 'pointer',
                  fontSize: '0.94rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                >
                  Contact Sales <ArrowUpRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          7. FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer id="contact" style={{
        borderTop: '1px solid var(--border-color)',
        background: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(248,250,252,1)',
        padding: '80px 6% 36px'
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          {/* Top footer columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2.2fr 1fr 1fr 1fr 1fr',
            gap: '48px', marginBottom: '64px'
          }} className="footer-grid">
            {/* Brand column */}
            <div>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '18px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                }}>
                  <Building2 size={22} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  Fin<span style={{ color: 'var(--primary)' }}>lyt</span>
                </span>
              </a>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '280px' }}>
                Modern school finance management — from fee configuration to AI-powered financial intelligence. Trusted by 150+ schools across India.
              </p>
            </div>

            {/* Product column */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Product</div>
              {['Fee Engine', 'Payment Collection', 'Parent Portal', 'Reconciliation', 'Reports & Analytics'].map(item => (
                <a key={item} href="#features" style={{
                  display: 'block', fontSize: '0.88rem', color: 'var(--text-muted)',
                  textDecoration: 'none', padding: '6px 0',
                  transition: 'color 0.15s ease'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</a>
              ))}
            </div>

            {/* Solutions column */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Solutions</div>
              {['CBSE Schools', 'ICSE Schools', 'State Boards', 'International Schools', 'College Finance'].map(item => (
                <a key={item} href="#solutions" style={{
                  display: 'block', fontSize: '0.88rem', color: 'var(--text-muted)',
                  textDecoration: 'none', padding: '6px 0',
                  transition: 'color 0.15s ease'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</a>
              ))}
            </div>

            {/* Resources column */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Resources</div>
              {['Documentation', 'API Reference', 'Changelog', 'Support Center', 'Blog'].map(item => (
                <a key={item} href="#" style={{
                  display: 'block', fontSize: '0.88rem', color: 'var(--text-muted)',
                  textDecoration: 'none', padding: '6px 0',
                  transition: 'color 0.15s ease'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</a>
              ))}
            </div>

            {/* Company column */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>Company</div>
              {['About Us', 'Careers', 'Press', 'Partners', 'Contact Us'].map(item => (
                <a key={item} href="#" style={{
                  display: 'block', fontSize: '0.88rem', color: 'var(--text-muted)',
                  textDecoration: 'none', padding: '6px 0',
                  transition: 'color 0.15s ease'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</a>
              ))}
            </div>
          </div>

          {/* Bottom footer bar */}
          <div style={{
            paddingTop: '32px', borderTop: '1px solid var(--border-color)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '16px'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              © 2026 Finlyt Technologies Pvt. Ltd. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '28px' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <a key={item} href="#" style={{
                  fontSize: '0.85rem', color: 'var(--text-muted)',
                  textDecoration: 'none', transition: 'color 0.15s ease'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
