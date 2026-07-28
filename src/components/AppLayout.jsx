import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  ShieldAlert, 
  Receipt, 
  BarChart3, 
  Coins, 
  UserCheck, 
  Bell, 
  FileText, 
  PlusCircle, 
  LogOut, 
  Sun, 
  Moon,
  Check
} from 'lucide-react';

const ROUTE_META = {
  '/overview': {
    title: 'School Fee Operations Overview',
    subtitle: 'High-level summary of fee collections, defaulter alerts, and daily metrics'
  },
  '/defaulters': {
    title: 'Defaulter Tracking & Follow-up Workspace',
    subtitle: 'Monitor overdue student accounts, send reminders & trigger penalty policies'
  },
  '/transactions': {
    title: 'Transactions Log & Receipt Audit',
    subtitle: 'Complete historical record of student payments with filters and drill-down'
  },
  '/reconciliation': {
    title: 'Bank Reconciliation Workspace',
    subtitle: 'Match cash and cheque collections against bank deposits and resolve discrepancies'
  },
  '/fee-structures': {
    title: 'Fee Structures & Waiver Policies',
    subtitle: 'Manage fee categories, late payment rules, and concession waivers'
  },
  '/student-ledger': {
    title: 'Student Financial Ledger Lookup',
    subtitle: 'Single source of truth for individual student billing, payment logs & running balances'
  },
  '/audit-activity': {
    title: 'System Audit & Activity Feed',
    subtitle: 'Real-time chronological log of administrative actions, payments, and flagged anomalies'
  }
};

export default function AppLayout({ 
  defaultersCount, 
  authUser, 
  theme, 
  toggleTheme, 
  onSignOut, 
  onShowReportModal, 
  onRecordPaymentClick,
  toastMessage
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentMeta = ROUTE_META[location.pathname] || {
    title: 'School Fee Operations Portal',
    subtitle: 'Welcome to Finlyt Admin Operations'
  };

  return (
    <div className="dashboard-layout">
      {/* Shared Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header" onClick={() => navigate('/overview')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <Building2 size={20} />
          </div>
          <span className="brand-title">
            Finlyt <span>Admin</span>
          </span>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/overview" 
            className={({ isActive }) => `nav-item-btn ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </NavLink>

          <NavLink 
            to="/defaulters" 
            className={({ isActive }) => `nav-item-btn ${isActive ? 'active' : ''}`}
          >
            <ShieldAlert size={18} />
            <span>Defaulter Tracking</span>
            {defaultersCount > 0 && (
              <span className="nav-item-badge">{defaultersCount}</span>
            )}
          </NavLink>

          <NavLink 
            to="/transactions" 
            className={({ isActive }) => `nav-item-btn ${isActive ? 'active' : ''}`}
          >
            <Receipt size={18} />
            <span>Transactions Log</span>
          </NavLink>

          <NavLink 
            to="/reconciliation" 
            className={({ isActive }) => `nav-item-btn ${isActive ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span>Reconciliation</span>
          </NavLink>

          <NavLink 
            to="/fee-structures" 
            className={({ isActive }) => `nav-item-btn ${isActive ? 'active' : ''}`}
          >
            <Coins size={18} />
            <span>Fee Structures</span>
          </NavLink>

          <NavLink 
            to="/student-ledger" 
            className={({ isActive }) => `nav-item-btn ${isActive ? 'active' : ''}`}
          >
            <UserCheck size={18} />
            <span>Student Ledger</span>
          </NavLink>

          <NavLink 
            to="/audit-activity" 
            className={({ isActive }) => `nav-item-btn ${isActive ? 'active' : ''}`}
          >
            <Bell size={18} />
            <span>Audit & Activity</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div>User: <strong>{authUser?.email || 'admin@finlyt.edu'}</strong></div>
          <div style={{ color: 'var(--accent-blue-text)', fontWeight: 600 }}>Role: {authUser?.roleLabel || 'School Admin'}</div>

          {/* Theme Toggle Switch */}
          <div className="theme-toggle-container">
            <div className="theme-toggle-label">
              {theme === 'dark' ? <Moon size={15} style={{ color: 'var(--odoo-purple)' }} /> : <Sun size={15} style={{ color: '#F59E0B' }} />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <button 
              type="button"
              className={`theme-switch-btn ${theme === 'dark' ? 'dark' : ''}`}
              onClick={toggleTheme}
              title="Toggle Dark/Light Theme"
            >
              <div className="theme-switch-thumb" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-title-group">
            <h1>{currentMeta.title}</h1>
            <p>{currentMeta.subtitle}</p>
          </div>

          <div className="header-controls">
            <button 
              className="action-btn-secondary"
              onClick={onShowReportModal}
            >
              <FileText size={15} />
              <span>Reports & Export</span>
            </button>

            <button 
              className="action-btn-primary"
              onClick={onRecordPaymentClick}
            >
              <PlusCircle size={16} />
              <span>Record Payment</span>
            </button>

            <button 
              className="action-btn-secondary"
              style={{ color: 'var(--destructive)', borderColor: 'var(--border)', background: 'var(--destructive-light)' }}
              onClick={onSignOut}
              title="Sign Out to Login Page"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content Outlet */}
        <div className="page-body route-page-container">
          <Outlet />
        </div>
      </main>

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
