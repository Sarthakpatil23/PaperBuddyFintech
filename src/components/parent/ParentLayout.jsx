import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  History, 
  Receipt, 
  Bell, 
  ChevronDown, 
  User, 
  Sun, 
  Moon, 
  LogOut, 
  Shield, 
  Building2, 
  Check, 
  Sparkles, 
  Settings, 
  PanelLeftClose, 
  PanelLeftOpen, 
  ChevronRight 
} from 'lucide-react';

const ROUTE_BREADCRUMBS = {
  '/parent/overview': { title: 'Dashboard', section: 'Overview' },
  '/parent/fees': { title: 'Fees & Dues Breakdown', section: 'Billing' },
  '/parent/pay': { title: 'Online Fee Payment', section: 'Checkout' },
  '/parent/history': { title: 'Payment History Log', section: 'Records' },
  '/parent/receipts': { title: 'Digital Tax Receipts', section: 'Documents' },
  '/parent/notifications': { title: 'Alerts & Reminders', section: 'Feed' },
  '/parent/settings': { title: 'Account Settings', section: 'Preferences' }
};

export default function ParentLayout({
  parentAccount,
  childrenList,
  selectedChild,
  onSelectChild,
  notifications,
  theme,
  toggleTheme,
  onSignOut,
  onSwitchToAdmin,
  toastMessage
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showChildDropdown, setShowChildDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read && n.studentId === selectedChild?.id).length;
  const currentMeta = ROUTE_BREADCRUMBS[location.pathname] || { title: 'Parent Portal', section: 'Overview' };

  return (
    <div className="parent-portal-wrapper" style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-canvas)' }}>
      
      {/* 1. DESKTOP COLLAPSIBLE SIDEBAR (Hidden on Mobile) */}
      <aside 
        className={`parent-collapsible-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}
        style={{
          width: isSidebarCollapsed ? '80px' : '270px',
          background: 'var(--surface-card)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 60,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div>
          {/* Sidebar Top Branding & Collapse Button */}
          <div style={{
            height: '70px',
            padding: isSidebarCollapsed ? '0 16px' : '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <div 
              onClick={() => navigate('/parent/overview')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--odoo-purple) 0%, var(--accent-blue) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(113, 75, 103, 0.25)'
              }}>
                <Building2 size={22} />
              </div>

              {!isSidebarCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.1 }}>
                    PaperBuddy <span style={{ color: 'var(--odoo-purple)' }}>Parent</span>
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>School Fee Portal</span>
                </div>
              )}
            </div>

            {/* Desktop Sidebar Collapse Toggle */}
            <button 
              type="button"
              className="icon-btn-ghost sidebar-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-canvas)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          {/* Navigation Links List */}
          <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <NavLink 
              to="/parent/overview" 
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}
            >
              <Home size={19} />
              {!isSidebarCollapsed && <span>Overview</span>}
            </NavLink>

            <NavLink 
              to="/parent/fees" 
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}
            >
              <CreditCard size={19} />
              {!isSidebarCollapsed && <span>Fees & Dues</span>}
            </NavLink>

            <NavLink 
              to="/parent/pay" 
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}
            >
              <Sparkles size={19} />
              {!isSidebarCollapsed && <span>Make Payment</span>}
            </NavLink>

            <NavLink 
              to="/parent/history" 
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}
            >
              <History size={19} />
              {!isSidebarCollapsed && <span>Payment History</span>}
            </NavLink>

            <NavLink 
              to="/parent/receipts" 
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}
            >
              <Receipt size={19} />
              {!isSidebarCollapsed && <span>Digital Receipts</span>}
            </NavLink>

            <NavLink 
              to="/parent/notifications" 
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Bell size={19} />
                {unreadCount > 0 && isSidebarCollapsed && (
                  <span className="sidebar-dot-badge" />
                )}
              </div>
              {!isSidebarCollapsed && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                  <span>Alerts & Reminders</span>
                  {unreadCount > 0 && <span className="nav-item-badge">{unreadCount}</span>}
                </div>
              )}
            </NavLink>

            <NavLink 
              to="/parent/settings" 
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}
            >
              <Settings size={19} />
              {!isSidebarCollapsed && <span>Settings</span>}
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Bottom Profile & Controls */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Parent User Avatar Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-color)',
            justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
          }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--odoo-purple) 0%, var(--accent-blue) 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.88rem',
              flexShrink: 0
            }}>
              {parentAccount?.name ? parentAccount.name.charAt(0) : 'P'}
            </div>

            {!isSidebarCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {parentAccount?.name || 'Parent Account'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {parentAccount?.phone || '+91 98765 43210'}
                </div>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button 
              type="button" 
              onClick={onSignOut}
              style={{
                width: '100%',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #FFE4E6',
                background: '#FFF1F2',
                color: '#9F1239',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'var(--transition-fast)'
              }}
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN RIGHT DASHBOARD AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        
        {/* Sticky Top Header Bar (Fully Responsive on Mobile & Desktop) */}
        <header className="parent-topbar">
          
          {/* MOBILE BRAND LOGO & TITLE (Visible ONLY on Mobile < 768px) */}
          <div className="mobile-brand-header-group" onClick={() => navigate('/parent/overview')} style={{ cursor: 'pointer' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, var(--odoo-purple) 0%, var(--accent-blue) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0
            }}>
              <Building2 size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              PaperBuddy
            </span>
          </div>

          {/* DESKTOP TITLE BLOCK (Visible ONLY on Desktop ≥ 768px) */}
          <div className="desktop-header-title-group topbar-title-block">
            <h2 className="topbar-page-title">
              {currentMeta.title}
            </h2>
            {(parentAccount?.name || selectedChild) && (
              <div className="topbar-page-subtitle">
                {parentAccount?.name && (
                  <span className="topbar-subtitle-name">{parentAccount.name}</span>
                )}
                {parentAccount?.name && selectedChild && (
                  <span className="topbar-subtitle-sep">·</span>
                )}
                {selectedChild && (
                  <span className="topbar-subtitle-student">
                    {selectedChild.name}
                    <span className="topbar-subtitle-grade"> ({selectedChild.classGrade})</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Controls Bar (Bell, Theme Toggle) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* Notification Bell Button */}
            <button 
              type="button"
              className="icon-btn-ghost"
              onClick={() => navigate('/parent/notifications')}
              style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="View Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#9F1239',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button 
              type="button"
              className="icon-btn-ghost"
              onClick={toggleTheme}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Toggle Light/Dark Mode"
            >
              {theme === 'dark' ? <Sun size={17} style={{ color: '#F59E0B' }} /> : <Moon size={17} style={{ color: 'var(--odoo-purple)' }} />}
            </button>
          </div>
        </header>

        {/* Dynamic Route Body Container */}
        <main className="parent-body-container" style={{ flex: 1, padding: '32px 40px 90px 40px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION (Hidden on Desktop) */}
      <nav className="parent-mobile-bottom-nav">
        <NavLink 
          to="/parent/overview" 
          className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}
        >
          <Home size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink 
          to="/parent/fees" 
          className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}
        >
          <CreditCard size={20} />
          <span>Fees</span>
        </NavLink>

        <NavLink 
          to="/parent/pay" 
          className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}
        >
          <Sparkles size={20} />
          <span>Pay</span>
        </NavLink>

        <NavLink 
          to="/parent/receipts" 
          className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}
        >
          <Receipt size={20} />
          <span>Receipts</span>
        </NavLink>

        <NavLink 
          to="/parent/notifications" 
          className={({ isActive }) => `mobile-nav-tab ${isActive ? 'active' : ''}`}
        >
          <div style={{ position: 'relative' }}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="mobile-tab-badge">{unreadCount}</span>
            )}
          </div>
          <span>Alerts</span>
        </NavLink>
      </nav>

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
