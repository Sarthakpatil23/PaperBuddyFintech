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
  Moon
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, theme, toggleTheme }) {
  const [role, setRole] = useState('admin'); // 'admin' | 'cashier' | 'parent'
  const [email, setEmail] = useState('admin@paperbuddy.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Role presets
  const rolePresets = {
    admin: {
      email: 'admin@paperbuddy.edu',
      label: 'School Admin',
      subtext: 'Manage fee structures, waivers & overall school ledger'
    },
    cashier: {
      email: 'finance@paperbuddy.edu',
      label: 'Finance Staff',
      subtext: 'Collect counter cash/cheque & reconcile bank deposits'
    },
    parent: {
      email: 'parent@paperbuddy.edu',
      label: 'Parent / Student',
      subtext: 'View fee balance, receive alerts & pay via UPI/Online'
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setEmail(rolePresets[newRole].email);
    setPassword('••••••••••••');
  };

  const triggerAutofill = () => {
    setEmail(rolePresets[role].email);
    setPassword('paperbuddy2026');
    showToast(`Autofilled credentials for ${rolePresets[role].label}`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email,
        role,
        roleLabel: rolePresets[role].label
      });
    }, 800);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    showToast('Signing in with Google account...');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email: 'admin.google@paperbuddy.edu',
        role: 'admin',
        roleLabel: 'School Admin (Google Auth)'
      });
    }, 1000);
  };

  return (
    <div className="login-page-container">
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

          <button className="help-pill-btn" onClick={() => showToast('PaperBuddy Support Ready')}>
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
                <span>Parent</span>
              </button>
            </div>

            {/* Quick Autofill Banner */}
            <div className="demo-preset-banner">
              <div className="demo-text">
                <Sparkles size={14} />
                <span>Preset: {rolePresets[role].label}</span>
              </div>
              <button 
                type="button" 
                className="demo-autofill-btn"
                onClick={triggerAutofill}
              >
                Auto-fill Demo
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">School Email / User ID</label>
                <div className="input-input-wrapper">
                  <input 
                    type="email" 
                    className="form-input" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@school.edu"
                    required
                  />
                  <Mail className="input-icon" size={18} />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Password</label>
                  <a href="#forgot" className="forgot-password-link" onClick={(e) => { e.preventDefault(); showToast('Reset password link sent to your email.'); }}>
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
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Signing In & Redirecting...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Single Sign-On */}
            <div className="divider-or">
              <span>OR</span>
            </div>

            <button 
              type="button" 
              className="google-sso-btn"
              onClick={handleGoogleAuth}
            >
              <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            <div className="card-footer-prompt">
              New school onboarding? <a href="#register" onClick={(e) => { e.preventDefault(); showToast('Contact sales to register a new school instance.'); }}>Register your institution</a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="notification-toast success">
          <Check size={18} style={{ color: 'var(--accent-blue-text)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
