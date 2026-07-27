import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  CreditCard, 
  Receipt, 
  AlertTriangle, 
  Megaphone, 
  Check,
  ShieldAlert,
  Inbox,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export default function ParentNotificationsPage({
  selectedChild,
  notifications,
  onMarkRead,
  onMarkAllRead
}) {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'unread' | 'due' | 'payment'

  const childNotifs = notifications.filter((n) => n.studentId === selectedChild?.id);

  const filteredNotifs = childNotifs.filter((n) => {
    if (filterTab === 'unread') return !n.read;
    if (filterTab === 'due') return n.type === 'due_reminder';
    if (filterTab === 'payment') return n.type === 'payment_success' || n.type === 'receipt_ready';
    return true;
  });

  const unreadCount = childNotifs.filter((n) => !n.read).length;
  const dueRemindersCount = childNotifs.filter((n) => n.type === 'due_reminder').length;
  const paymentReceiptsCount = childNotifs.filter((n) => n.type === 'payment_success' || n.type === 'receipt_ready').length;

  const getNotifIcon = (type) => {
    switch (type) {
      case 'due_reminder':
        return <AlertTriangle size={20} style={{ color: '#92400E' }} />;
      case 'payment_success':
        return <CreditCard size={20} style={{ color: '#0369A1' }} />;
      case 'receipt_ready':
        return <Receipt size={20} style={{ color: 'var(--odoo-purple)' }} />;
      case 'cheque_update':
        return <AlertTriangle size={20} style={{ color: '#9F1239' }} />;
      default:
        return <Megaphone size={20} style={{ color: '#0284C7' }} />;
    }
  };

  return (
    <div className="parent-notifications-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 1. TOP QUICK STATS BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="odoo-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: unreadCount > 0 ? 'var(--odoo-purple-light)' : 'var(--bg-canvas)', color: unreadCount > 0 ? 'var(--odoo-purple)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Inbox size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Unread Alerts</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '2px' }}>
              {unreadCount} Notification(s)
            </div>
          </div>
        </div>

        <div className="odoo-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--status-pending-bg)', color: 'var(--status-pending-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Fee Reminders</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--status-pending-text)', marginTop: '2px' }}>
              {dueRemindersCount} Active
            </div>
          </div>
        </div>

        <div className="odoo-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--status-paid-bg)', color: 'var(--status-paid-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Receipt Alerts</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--status-paid-text)', marginTop: '2px' }}>
              {paymentReceiptsCount} Verified
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL COLUMN DASHBOARD LAYOUT (Notification Feed 8-Cols, Summary & Preferences 4-Cols) */}
      <div className="parent-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* LEFT COLUMN: Notification Feed (8 Cols Desktop / 12 Cols Mobile) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '20px' }} className="grid-left-col">
          
          {/* Header Bar & Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div className="role-tabs-container" style={{ width: 'fit-content', margin: 0 }}>
              <button 
                type="button" 
                className={`role-tab-btn ${filterTab === 'all' ? 'active' : ''}`}
                onClick={() => setFilterTab('all')}
              >
                <span>All ({childNotifs.length})</span>
              </button>

              <button 
                type="button" 
                className={`role-tab-btn ${filterTab === 'unread' ? 'active' : ''}`}
                onClick={() => setFilterTab('unread')}
              >
                <span>Unread ({unreadCount})</span>
              </button>

              <button 
                type="button" 
                className={`role-tab-btn ${filterTab === 'due' ? 'active' : ''}`}
                onClick={() => setFilterTab('due')}
              >
                <span>Fee Reminders</span>
              </button>

              <button 
                type="button" 
                className={`role-tab-btn ${filterTab === 'payment' ? 'active' : ''}`}
                onClick={() => setFilterTab('payment')}
              >
                <span>Payments & Receipts</span>
              </button>
            </div>

            {unreadCount > 0 && (
              <button 
                type="button" 
                className="action-btn-secondary"
                onClick={() => onMarkAllRead(selectedChild?.id)}
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              >
                <CheckCheck size={16} />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>

          {/* Notifications Feed Cards */}
          {filteredNotifs.length === 0 ? (
            <div className="odoo-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '16px' }}>
              <Bell size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>No notifications found</h3>
              <p style={{ fontSize: '0.85rem' }}>Your notification Feed is completely clear!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredNotifs.map((notif) => (
                <div 
                  key={notif.id}
                  className="odoo-card hover-card-row"
                  onClick={() => onMarkRead(notif.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                    borderLeft: notif.read ? '1px solid var(--border-color)' : '4px solid var(--odoo-purple)',
                    background: notif.read ? 'var(--surface-card)' : 'var(--odoo-purple-light)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'var(--surface-card)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {getNotifIcon(notif.type)}
                    </div>

                    <div>
                      <div style={{ fontWeight: notif.read ? 600 : 800, fontSize: '0.98rem', color: 'var(--text-main)' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                        {notif.message}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />{notif.timestamp}</span>
                        <span>• Channel: <strong>{notif.channel || 'in-app'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {!notif.read && (
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--odoo-purple)', flexShrink: 0, marginTop: '6px' }} title="Unread Alert" />
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Summary & Channel Controls (4 Cols Desktop / 12 Cols Mobile) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} className="grid-right-col">
          
          {/* Notification Summary Panel */}
          <div className="odoo-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} style={{ color: 'var(--odoo-purple)' }} />
              <span>Feed Summary</span>
            </h3>

            <div style={{ padding: '16px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Feed Items:</span>
                <strong style={{ color: 'var(--text-main)' }}>{childNotifs.length} Alerts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Unread Alerts:</span>
                <strong style={{ color: unreadCount > 0 ? 'var(--odoo-purple)' : 'var(--text-main)' }}>{unreadCount} Unread</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fee Reminders:</span>
                <strong style={{ color: 'var(--status-pending-text)' }}>{dueRemindersCount} Active</strong>
              </div>
            </div>

            {unreadCount > 0 && (
              <button 
                type="button" 
                className="btn-submit-primary"
                onClick={() => onMarkAllRead(selectedChild?.id)}
                style={{ height: '42px', fontSize: '0.85rem' }}
              >
                <CheckCheck size={16} />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>

          {/* Delivery Channels Card */}
          <div className="odoo-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} style={{ color: '#0369A1' }} />
              <span>Future-Ready Delivery</span>
            </h3>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              All fee notifications are recorded with channel tags (<code style={{ background: 'var(--bg-canvas)', padding: '2px 6px', borderRadius: '4px' }}>in-app</code>) and are ready for instant Push, SMS, and WhatsApp dispatch integrations.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
