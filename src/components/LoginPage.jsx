import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Check, 
  Sparkles, 
  HelpCircle, 
  UserCheck, 
  Receipt, 
  Coins, 
  BarChart3, 
  Loader2,
  Sun,
  Moon,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, theme, toggleTheme }) {
  const [role, setRole] = useState('admin'); // 'admin' | 'cashier' | 'parent'
  const [email, setEmail] = useState('admin@school.edu');
  const [password, setPassword] = useState('admin_password_2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info'); // 'info' | 'error'

  // Database Student Accounts List
  const studentAccounts = [
    { id: 'STU-101', name: 'Aarav Sharma', grade: 'Grade 10-A', email: 'aarav.sharma@paperbuddy.edu', pass: 'aarav123' },
    { id: 'STU-102', name: 'Ananya Patel', grade: 'Grade 8-B', email: 'ananya.patel@paperbuddy.edu', pass: 'ananya123' },
    { id: 'STU-103', name: 'Rohan Verma', grade: 'Grade 12-C', email: 'rohan.verma@paperbuddy.edu', pass: 'rohan123' },
    { id: 'STU-104', name: 'Priya Gupta', grade: 'Grade 9-A', email: 'priya.gupta@paperbuddy.edu', pass: 'priya123' },
    { id: 'STU-105', name: 'Gurpreet Singh', grade: 'Grade 11-B', email: 'gurpreet.singh@paperbuddy.edu', pass: 'gurpreet123' }
  ];

  // Role presets
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
      email: 'aarav.sharma@paperbuddy.edu',
      pass: 'aarav123',
      label: 'Student / Parent Portal',
      subtext: 'View fee balance, receive alerts & pay via UPI/Online'
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'parent') {
      setEmail('aarav.sharma@paperbuddy.edu');
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
        email: 'admin.google@paperbuddy.edu',
        role: 'admin',
        roleLabel: 'School Admin (Google Auth)'
      });
    }, 800);
  };

  return (
    <div className="login-page-container">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="login-toast" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: toastType === 'error' ? '#9F1239' : 'var(--odoo-purple)',
          color: 'white',
          padding: '14px 22px',
          borderRadius: '10px',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '420px'
        }}>
          {toastType === 'error' ? <ShieldAlert size={20} /> : <Sparkles size={20} />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="odoo-navbar">
        <a href="#" className="brand-logo-group">
          <div className="brand-icon-wrapper">
            <Building2 size={24} />
          </div>
          <span className="brand-name">
            PaperBuddy <span>Fintech</span>
          </span>
        </a>

        <div className="nav-links">
          <a href="#features" className="nav-link">Fee Engine</a>
          <a href="#payments" className="nav-link">Omnichannel Pay</a>
          <a href="#reconciliation" className="nav-link">Reconciliation</a>

          {/* Theme Switch Button */}
          <button 
            className="help-pill-btn"
            onClick={toggleTheme}
            title="Toggle Odoo Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun size={15} style={{ color: '#F59E0B' }} /> : <Moon size={15} style={{ color: 'var(--odoo-purple)' }} />}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>

          <button className="help-pill-btn" onClick={() => showToast('PaperBuddy Support Ready', 'info')}>
            <HelpCircle size={16} />
            <span>Need Help?</span>
          </button>
        </div>
      </header>

      {/* Split Content Wrapper */}
      <div className="login-split-wrapper">
        {/* Left Hero Panel */}
        <div className="hero-showcase-panel">
          <div className="hero-tag">
            <Sparkles size={15} />
            <span>Next-Gen School Finance Management</span>
          </div>

          <h1 className="hero-title">
            Digitize your entire <br />
            <span className="highlight">fee lifecycle seamlessly.</span>
          </h1>

          <p className="hero-subtitle">
            From dynamic tuition structures & zero-fee UPI payments to counter cash reconciliation and automated late penalty tracking — all in one single source of truth.
          </p>

          <div className="feature-cards-grid">
            <div className="feature-mini-card">
              <div className="feature-icon-badge purple">
                <Coins size={20} />
              </div>
              <div className="feature-card-title">Dynamic Fee Engine</div>
              <div className="feature-card-desc">
                Custom categories (Tuition, Transport, Late fees), student waivers & auto-penalties.
              </div>
            </div>

            <div className="feature-mini-card">
              <div className="feature-icon-badge teal">
                <Receipt size={20} />
              </div>
              <div className="feature-card-title">Omnichannel Payments</div>
              <div className="feature-card-desc">
                Zero-fee UPI payments, cash counter support & deposit status for cheque clearing.
              </div>
            </div>

            <div className="feature-mini-card">
              <div className="feature-icon-badge teal">
                <BarChart3 size={20} />
              </div>
              <div className="feature-card-title">Bank Reconciliation</div>
              <div className="feature-card-desc">
                Match offline cash/cheque deposits directly against bank statements cleanly.
              </div>
            </div>

            <div className="feature-mini-card">
              <div className="feature-icon-badge purple">
                <ShieldCheck size={20} />
              </div>
              <div className="feature-card-title">Auditable Ledger</div>
              <div className="feature-card-desc">
                Traceable history per student — what’s billed, paid, waived or currently due.
              </div>
            </div>
          </div>
        </div>

        {/* Right Login Form Container */}
        <div className="login-form-panel">
          <div className="odoo-card">
            <div className="odoo-card-header">
              <h2 className="card-heading">Sign in to PaperBuddy</h2>
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
                className={`role-tab-btn ${role === 'cashier' ? 'active' : ''}`}
                onClick={() => handleRoleChange('cashier')}
              >
                <Receipt size={15} />
                <span>Finance</span>
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
                    background: '#9F1239',
                    color: 'white',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
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
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        border: '1px solid var(--border-color)',
                        background: email.toLowerCase() === stu.email.toLowerCase() ? 'var(--odoo-purple)' : 'white',
                        color: email.toLowerCase() === stu.email.toLowerCase() ? 'white' : 'var(--text-main)',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
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
                    type="text" 
                    className="form-input" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'parent' ? 'e.g. aarav.sharma@paperbuddy.edu or STU-101' : 'e.g. admin@school.edu'}
                    required
                  />
                  <Mail className="input-icon" size={18} />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Password</label>
                  <a href="#forgot" className="forgot-password-link" onClick={(e) => { e.preventDefault(); showToast('Password reset instructions sent to your email.', 'info'); }}>
                    Forgot password?
                  </a>
                </div>
                <div className="input-input-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className="input-icon" size={18} />
                  <button 
                    type="button" 
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div 
                className={`remember-me-container ${rememberMe ? 'checked' : ''}`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div className="custom-checkbox">
                  {rememberMe && <Check size={13} strokeWidth={3} />}
                </div>
                <span className="remember-text">Remember this device for 30 days</span>
              </div>

              <button 
                type="submit" 
                className="btn-submit-primary"
                disabled={isLoading}
                style={{
                  background: role === 'admin' || role === 'cashier' ? '#9F1239' : 'var(--odoo-purple)',
                  borderColor: role === 'admin' || role === 'cashier' ? '#9F1239' : 'var(--odoo-purple)',
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {role === 'parent' ? 'Student Portal' : 'Admin Portal'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Single Sign-On */}
            <div className="divider-or">
              <span>Or sign in with</span>
            </div>

            <button 
              type="button" 
              className="google-sso-btn"
              onClick={handleGoogleAuth}
            >
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
    </div>
  );
}
