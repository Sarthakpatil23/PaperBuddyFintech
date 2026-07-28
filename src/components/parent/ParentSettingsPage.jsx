import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Check, 
  Building2, 
  Lock, 
  Save 
} from 'lucide-react';

export default function ParentSettingsPage({ parentAccount, selectedChild, onSaveSettings, toastMessage }) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoReceipts, setAutoReceipts] = useState(true);
  const [parentName, setParentName] = useState(parentAccount?.name || 'Parent Account');
  const [parentEmail, setParentEmail] = useState(parentAccount?.email || 'rajesh.sharma@example.com');
  const [parentPhone, setParentPhone] = useState(parentAccount?.phone || '+91 98765 43210');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="parent-settings-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
          Account Settings & Preferences
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your contact information, alert notification channels & security preferences
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* Left Section: Contact & Profile Info (7 Cols) */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="odoo-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} style={{ color: 'var(--odoo-purple)' }} />
              <span>Parent / Guardian Profile</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-input-wrapper">
                <input 
                  type="text" 
                  className="form-input"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                />
                <User className="input-icon" size={18} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Registered Email Address</label>
              <div className="input-input-wrapper">
                <input 
                  type="email" 
                  className="form-input"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  required
                />
                <Mail className="input-icon" size={18} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number for WhatsApp / SMS Fee Alerts</label>
              <div className="input-input-wrapper">
                <input 
                  type="text" 
                  className="form-input"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  required
                />
                <Phone className="input-icon" size={18} />
              </div>
            </div>

            <button type="submit" className="btn-submit-primary" style={{ height: '46px', width: 'fit-content', padding: '0 24px' }}>
              {isSaved ? <Check size={18} /> : <Save size={18} />}
              <span>{isSaved ? 'Changes Saved!' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </div>

        {/* Right Section: Notification Channels & Security (5 Cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="odoo-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={20} style={{ color: 'var(--accent-blue-text)' }} />
              <span>Notification Channels</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>Email Due Reminders</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Receive email 7 days before fee due dates</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={(e) => setEmailAlerts(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>WhatsApp & SMS Alerts</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Receive instant UPI payment confirmations</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={smsAlerts} 
                  onChange={(e) => setSmsAlerts(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>Auto-Generate PDF Receipts</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Email 80G tax receipt on successful payment</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoReceipts} 
                  onChange={(e) => setAutoReceipts(e.target.checked)} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          <div className="odoo-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--odoo-purple)' }} />
              <span>Security & Data Compliance</span>
            </h3>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Your payment credentials and UPI VPAs are processed strictly through RBI-authorized payment aggregators (Razorpay / PhonePe). No card details or banking passwords are stored on Finlyt servers.
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
