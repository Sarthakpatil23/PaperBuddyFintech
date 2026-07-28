import React, { useState, useEffect, useRef } from 'react';
import {
  Building2, ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, Check,
  Sparkles, HelpCircle, UserCheck, Receipt, Coins, BarChart3, Loader2,
  Sun, Moon, GraduationCap, ShieldAlert, Zap, Bot, TrendingUp, Users,
  CreditCard, FileText, Settings, BarChart2, ChevronRight, Menu, X,
  PlayCircle, Landmark, Activity, DollarSign, CheckCircle2, ArrowUpRight,
  Brain, MessageSquare, Database, Bell
} from 'lucide-react';

import BrandLogo from './BrandLogo';

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
      const res = await fetch('/api/auth/login', {
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
        padding: '0 5%',
        background: scrolled
          ? (theme === 'dark' ? 'rgba(15,23,42,0.96)' : 'rgba(255,255,255,0.96)')
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <BrandLogo size={36} />
        </a>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="landing-desktop-nav">
          {['Features', 'Solutions', 'Why Finlyt', 'AI Assistant', 'Resources', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                padding: '8px 14px', borderRadius: '8px', fontSize: '0.88rem',
                fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={e => { e.target.style.color = 'var(--text-main)'; e.target.style.background = 'var(--bg-card)'; }}
              onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.background = 'transparent'; }}
            >{item}</a>
          ))}
        </nav>

        {/* Right CTA Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={toggleTheme} title="Toggle theme" style={{
            padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)',
            background: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', transition: 'all 0.18s ease'
          }}>
            {theme === 'dark' ? <Sun size={16} style={{ color: '#F59E0B' }} /> : <Moon size={16} />}
          </button>

          <button onClick={() => showToast('Finlyt Support is ready to help!', 'info')} style={{
            padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)',
            background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
            fontSize: '0.84rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.18s ease'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            className="landing-desktop-nav"
          >
            <HelpCircle size={15} /> Need Help?
          </button>

          <button onClick={scrollToLogin} style={{
            padding: '9px 20px', borderRadius: '9px',
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
          position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 8999,
          background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)',
          padding: '16px 5%', display: 'flex', flexDirection: 'column', gap: '4px'
        }}>
          {['Features', 'Solutions', 'Why Finlyt', 'AI Assistant', 'Resources', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem',
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
        paddingTop: '68px',
        display: 'flex', alignItems: 'center',
        padding: '36px 5% 48px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-200px', right: '-200px',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(113,75,103,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2,132,199,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1320px', margin: '0 auto', width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 440px',
          gap: '48px', alignItems: 'center'
        }} className="hero-grid">

          {/* Left — Tagline & CTAs */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', borderRadius: '99px',
              background: 'var(--primary-light)', border: '1px solid var(--border)',
              fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)',
              marginBottom: '16px'
            }}>
              <Sparkles size={13} />
              <span>School Finance Management Platform</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 900, lineHeight: 1.08,
              letterSpacing: '-0.04em', margin: '0 0 16px 0',
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
              fontSize: '1.05rem', lineHeight: 1.6,
              color: 'var(--text-muted)', margin: '0 0 24px 0',
              maxWidth: '520px'
            }}>
              Finlyt digitizes your entire school fee lifecycle — from fee configuration and payment collection to reconciliation, reporting, and AI-powered financial intelligence. Everything connected. Nothing missed.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
              <button onClick={scrollToLogin} style={{
                padding: '14px 28px', borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: 'white', border: 'none', cursor: 'pointer',
                fontSize: '0.95rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: 'var(--shadow-primary)',
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-primary)'; }}
              >
                Request Demo <ArrowRight size={17} />
              </button>

              <button onClick={() => showToast('Product demo video coming soon!', 'info')} style={{
                padding: '14px 28px', borderRadius: '10px',
                background: 'transparent', border: '1.5px solid var(--border-color)',
                color: 'var(--text-main)', cursor: 'pointer',
                fontSize: '0.95rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                <PlayCircle size={17} /> Watch Product Demo
              </button>
            </div>

            {/* Statistics */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px'
            }} className="hero-stats-grid">
              {stats.map((s, i) => (
                <div key={i} style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900,
                    letterSpacing: '-0.03em', color: 'var(--text-main)',
                    background: i % 2 === 0
                      ? 'linear-gradient(135deg, var(--primary), var(--destructive))'
                      : 'linear-gradient(135deg, var(--accent), var(--primary))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                  }}>{s.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Login Card (preserved exactly) */}
          <div ref={loginCardRef} className="login-form-panel" style={{ width: '100%' }}>
            <div className="odoo-card">
              <div className="odoo-card-header">
                <h2 className="card-heading">Sign in to Finlyt</h2>
                <p className="card-subtext">Access your school fee portal & financial dashboard</p>
              </div>

              {/* Role Selector Tabs */}
              <div className="role-tabs-container">
                <button
                  type="button"
                  className={`role-tab-btn ${role === 'admin' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('admin')}
                >
                  <Building2 size={15} />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  className={`role-tab-btn ${role === 'parent' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('parent')}
                >
                  <UserCheck size={15} />
                  <span>Student / Parent</span>
                </button>
              </div>

              {/* Role-Based Quick Credentials Banner */}
              {role === 'admin' || role === 'cashier' ? (
                <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9F1239', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} />
                    <span>Admin / Staff Restricted Credentials</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#881337', marginBottom: '8px' }}>
                    Email: <strong>{rolePresets[role].email}</strong> | Pass: <strong>{rolePresets[role].pass}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => autofillAdmin(role)}
                    style={{
                      background: '#9F1239', color: 'white', border: 'none',
                      padding: '4px 10px', borderRadius: '6px',
                      fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Autofill {rolePresets[role].label} Credentials
                  </button>
                </div>
              ) : (
                <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--odoo-purple)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={14} />
                    <span>Student Accounts Database Credentials</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {studentAccounts.map((stu) => (
                      <button
                        key={stu.id}
                        type="button"
                        onClick={() => autofillStudent(stu)}
                        style={{
                          padding: '4px 10px', borderRadius: 'var(--radius-pill)',
                          border: '1px solid var(--border-color)',
                          background: email.toLowerCase() === stu.email.toLowerCase() ? 'var(--odoo-purple)' : 'white',
                          color: email.toLowerCase() === stu.email.toLowerCase() ? 'white' : 'var(--text-main)',
                          fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                        title={`Email: ${stu.email} | Password: ${stu.pass}`}
                      >
                        <span>{stu.name}</span>
                        <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>({stu.id})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    {role === 'parent' ? 'Student Email / Student ID' : 'School Email / User ID'}
                  </label>
                  <div className="input-input-wrapper">
                    <input
                      type="text" className="form-input" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === 'parent' ? 'e.g. aarav.sharma@finlyt.edu or STU-101' : 'e.g. admin@school.edu'}
                      required
                    />
                    <Mail className="input-icon" size={18} />
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label">Password</label>
                    <a href="#forgot" className="forgot-password-link"
                      onClick={(e) => { e.preventDefault(); showToast('Password reset instructions sent to your email.', 'info'); }}>
                      Forgot password?
                    </a>
                  </div>
                  <div className="input-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'} className="form-input"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password" required
                    />
                    <Lock className="input-icon" size={18} />
                    <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={`remember-me-container ${rememberMe ? 'checked' : ''}`} onClick={() => setRememberMe(!rememberMe)}>
                  <div className="custom-checkbox">
                    {rememberMe && <Check size={13} strokeWidth={3} />}
                  </div>
                  <span className="remember-text">Remember this device for 30 days</span>
                </div>

                <button
                  type="submit" className="btn-submit-primary" disabled={isLoading}
                  style={{
                    background: role === 'admin' || role === 'cashier' ? '#9F1239' : 'var(--odoo-purple)',
                    borderColor: role === 'admin' || role === 'cashier' ? '#9F1239' : 'var(--odoo-purple)',
                  }}
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin" size={18} /><span>Verifying Credentials...</span></>
                  ) : (
                    <><span>Sign In to {role === 'parent' ? 'Student Portal' : 'Admin Portal'}</span><ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="divider-or"><span>Or sign in with</span></div>

              <button type="button" className="google-sso-btn" onClick={handleGoogleAuth}>
                <svg width="18" height="18" viewBox="0 0 24 24">
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
        padding: '56px 5%',
        background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(113,75,103,0.02)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '99px', marginBottom: '14px',
              background: 'var(--primary-light)', border: '1px solid var(--border)',
              fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              <Zap size={12} /> Platform Capabilities
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900,
              letterSpacing: '-0.03em', color: 'var(--text-main)',
              margin: '0 0 12px 0', lineHeight: 1.15
            }}>
              Everything You Need.<br />
              <span style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>All in One Platform.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
              Built for schools that want precision, transparency, and speed — without juggling multiple tools.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: '24px 28px', borderRadius: '16px',
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                cursor: 'default', transition: 'all 0.25s ease'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.1)`;
                  e.currentTarget.style.borderColor = f.color + '44';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: f.bg, color: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <f.icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
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
      <section id="solutions" style={{ padding: '56px 5%' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '99px', marginBottom: '14px',
              background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)',
              fontSize: '0.78rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              <Activity size={12} /> Workflow
            </div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900,
              letterSpacing: '-0.03em', color: 'var(--text-main)',
              margin: '0 0 12px 0'
            }}>How It Works</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
              Six seamless steps — from creating a fee structure to auto-updated reports.
            </p>
          </div>

          {/* Timeline — horizontal on desktop, vertical on mobile */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '0',
            position: 'relative'
          }} className="workflow-timeline">
            {/* Connector line - positioned behind circles */}
            <div style={{
              position: 'absolute', top: '36px', left: '8.33%', right: '8.33%',
              height: '3px', background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              zIndex: 1
            }} className="workflow-connector" />

            {workflowSteps.map((step, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', padding: '0 10px', position: 'relative', zIndex: 2
              }}>
                {/* Circle icon - solid background to cover line */}
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'var(--card)',
                  border: '2px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
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
                  <step.icon size={26} style={{ color: 'var(--primary)', transition: 'color 0.2s ease' }} />
                  {/* Step number badge */}
                  <div style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    color: 'white', fontSize: '0.65rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-xs)'
                  }}>
                    {i + 1}
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px', lineHeight: 1.3 }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
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
        padding: '56px 5%',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, rgba(30,27,75,0.6) 0%, rgba(15,23,42,0.8) 100%)'
          : 'linear-gradient(135deg, rgba(30,27,75,0.04) 0%, rgba(2,132,199,0.04) 100%)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center'
          }} className="ai-section-grid">

            {/* Left — AI Robot Illustration */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{
                width: '280px', height: '280px', borderRadius: '28px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #0284C7 100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '14px', position: 'relative', overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(30,27,75,0.35)'
              }}>
                {/* Decorative glow */}
                <div style={{
                  position: 'absolute', top: '-60px', right: '-60px',
                  width: '200px', height: '200px', borderRadius: '50%',
                  background: 'rgba(56,189,248,0.15)', filter: 'blur(40px)'
                }} />

                <div style={{
                  width: '72px', height: '72px', borderRadius: '18px',
                  background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Bot size={36} style={{ color: '#38BDF8' }} />
                </div>

                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'white', letterSpacing: '-0.02em' }}>Finlyt AI</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Powered by Llama 3.3</div>
                </div>

                {/* Floating suggestion pills */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Admin', 'Parent', 'Accountant'].map((role, i) => (
                    <div key={i} style={{
                      padding: '4px 10px', borderRadius: '99px',
                      background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                      fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)'
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
                padding: '6px 16px', borderRadius: '99px', marginBottom: '16px',
                background: 'rgba(30,27,75,0.08)', border: '1px solid rgba(30,27,75,0.15)',
                fontSize: '0.78rem', fontWeight: 700, color: '#312E81', textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>
                <Brain size={12} /> AI-Powered Assistant
              </div>

              <h2 style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 900,
                letterSpacing: '-0.03em', color: 'var(--text-main)',
                margin: '0 0 12px 0', lineHeight: 1.2
              }}>
                Meet <span style={{
                  background: 'linear-gradient(135deg, #312E81, #0284C7)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>Finlyt AI</span>
              </h2>

              <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 20px 0', maxWidth: '440px' }}>
                A role-aware AI assistant that understands your school's financial context — whether you're an administrator reviewing collections, an accountant reconciling statements, a parent checking dues, or management analyzing trends.
              </p>

              {/* Suggestion chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {aiSuggestions.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '12px',
                    background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                    cursor: 'pointer', transition: 'all 0.18s ease'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.background = 'rgba(2,132,199,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                      background: 'rgba(2,132,199,0.1)', color: '#0284C7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <s.icon size={15} />
                    </div>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>{s.text}</span>
                    <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>

              <button onClick={scrollToLogin} style={{
                padding: '12px 24px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #1E1B4B, #0284C7)',
                color: 'white', border: 'none', cursor: 'pointer',
                fontSize: '0.9rem', fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 6px 20px rgba(30,27,75,0.35)',
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(30,27,75,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,27,75,0.35)'; }}
              >
                <Bot size={16} /> Explore AI Assistant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. CTA BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="why-finlyt" style={{ padding: '56px 5%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            padding: 'clamp(36px, 5vw, 56px)',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
            textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            {/* Background decorations */}
            <div style={{
              position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px',
              borderRadius: '50%', background: 'rgba(255,255,255,0.05)'
            }} />
            <div style={{
              position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px',
              borderRadius: '50%', background: 'rgba(255,255,255,0.04)'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '99px', marginBottom: '16px',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>
                <Sparkles size={12} /> Get Started Today
              </div>

              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900,
                letterSpacing: '-0.04em', color: 'white',
                margin: '0 0 14px 0', lineHeight: 1.15
              }}>
                Ready to Transform Your<br />School Finance?
              </h2>

              <p style={{
                fontSize: '1rem', color: 'rgba(255,255,255,0.75)',
                maxWidth: '520px', margin: '0 auto 28px auto', lineHeight: 1.6
              }}>
                Join 150+ schools already using Finlyt. Set up takes less than a day and our team is with you every step of the way.
              </p>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={scrollToLogin} style={{
                  padding: '13px 28px', borderRadius: '10px',
                  background: 'white', color: 'var(--primary)', border: 'none', cursor: 'pointer',
                  fontSize: '0.92rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
                >
                  Request Demo <ArrowRight size={17} />
                </button>

                <button onClick={() => showToast('Our sales team will contact you shortly!', 'info')} style={{
                  padding: '13px 28px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)',
                  color: 'white', cursor: 'pointer',
                  fontSize: '0.92rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                >
                  Contact Sales <ArrowUpRight size={16} />
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
        padding: '44px 5% 24px'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          {/* Top footer columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: '48px', marginBottom: '56px'
          }} className="footer-grid">
            {/* Brand column */}
            <div>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                }}>
                  <Building2 size={20} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  Fin<span style={{ color: 'var(--primary)' }}>lyt</span>
                </span>
              </a>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '260px' }}>
                Modern school finance management — from fee configuration to AI-powered financial intelligence. Trusted by 150+ schools across India.
              </p>
            </div>

            {/* Product column */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Product</div>
              {['Fee Engine', 'Payment Collection', 'Parent Portal', 'Reconciliation', 'Reports & Analytics'].map(item => (
                <a key={item} href="#features" style={{
                  display: 'block', fontSize: '0.86rem', color: 'var(--text-muted)',
                  textDecoration: 'none', padding: '5px 0',
                  transition: 'color 0.15s ease'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</a>
              ))}
            </div>

            {/* Solutions column */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Solutions</div>
              {['CBSE Schools', 'ICSE Schools', 'State Boards', 'International Schools', 'College Finance'].map(item => (
                <a key={item} href="#solutions" style={{
                  display: 'block', fontSize: '0.86rem', color: 'var(--text-muted)',
                  textDecoration: 'none', padding: '5px 0',
                  transition: 'color 0.15s ease'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</a>
              ))}
            </div>

            {/* Resources column */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Resources</div>
              {['Documentation', 'API Reference', 'Changelog', 'Support Center', 'Blog'].map(item => (
                <a key={item} href="#" style={{
                  display: 'block', fontSize: '0.86rem', color: 'var(--text-muted)',
                  textDecoration: 'none', padding: '5px 0',
                  transition: 'color 0.15s ease'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</a>
              ))}
            </div>

            {/* Company column */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Company</div>
              {['About Us', 'Careers', 'Press', 'Partners', 'Contact Us'].map(item => (
                <a key={item} href="#" style={{
                  display: 'block', fontSize: '0.86rem', color: 'var(--text-muted)',
                  textDecoration: 'none', padding: '5px 0',
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
            paddingTop: '28px', borderTop: '1px solid var(--border-color)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '16px'
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              © 2026 Finlyt Technologies Pvt. Ltd. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <a key={item} href="#" style={{
                  fontSize: '0.82rem', color: 'var(--text-muted)',
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
