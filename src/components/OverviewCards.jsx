import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Receipt, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

export default function OverviewCards({ data, onJumpToSection }) {
  const [revenueRange, setRevenueRange] = useState('MTD'); // 'Today' | 'MTD' | 'YTD'
  const [upcomingRange, setUpcomingRange] = useState(7); // 7 | 30

  // Revenue dynamic display based on range selection
  const getRevenueValue = () => {
    if (revenueRange === 'Today') return '₹1,85,000';
    if (revenueRange === 'YTD') return '₹84,50,000';
    return `₹${(data.totalCollected).toLocaleString('en-IN')}`;
  };

  return (
    <div className="stat-cards-grid">
      {/* 1. Total Revenue Collected */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-label">Total Revenue Collected</span>
          <div className="stat-icon-wrapper blue">
            <TrendingUp size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div className="stat-card-value" style={{ marginBottom: 0 }}>{getRevenueValue()}</div>
          <span className="stat-delta-pill">
            <TrendingUp size={12} />
            +{data.collectedDelta}%
          </span>
        </div>

        <div className="stat-card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Period:</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['Today', 'MTD', 'YTD'].map((r) => (
              <button 
                key={r}
                className="time-range-toggle-btn"
                style={{ 
                  background: revenueRange === r ? 'var(--odoo-purple)' : 'transparent',
                  color: revenueRange === r ? 'white' : 'var(--text-secondary)',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => setRevenueRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Total Outstanding Dues */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-label">Total Outstanding Dues</span>
          <div className="stat-icon-wrapper" style={{ background: '#FFE4E6', color: '#9F1239' }}>
            <AlertTriangle size={18} />
          </div>
        </div>
        <div className="stat-card-value">₹{(data.outstandingDues).toLocaleString('en-IN')}</div>
        <div className="stat-card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Excludes ₹8,000 waived</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#9F1239' }}>Action required</span>
        </div>
      </div>

      {/* 3. Active Defaulters */}
      <div 
        className="stat-card" 
        style={{ cursor: 'pointer' }}
        onClick={() => onJumpToSection('defaulters')}
      >
        <div className="stat-card-header">
          <span className="stat-card-label">Active Defaulters</span>
          <div className="stat-icon-wrapper" style={{ background: '#FFE4E6', color: '#9F1239' }}>
            <ShieldAlert size={18} />
          </div>
        </div>
        <div className="stat-card-value">{data.activeDefaultersCount} Students</div>
        <div className="stat-card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
          <span className="stat-delta-pill down">
            <TrendingDown size={12} />
            High Priority
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--odoo-purple)', fontWeight: 600, fontSize: '0.78rem' }}>
            View All <ArrowUpRight size={14} />
          </span>
        </div>
      </div>

      {/* 4. Transactions Today */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-label">Transactions Today</span>
          <div className="stat-icon-wrapper blue">
            <Receipt size={18} />
          </div>
        </div>
        <div className="stat-card-value">{data.transactionsTodayCount} Txns</div>
        <div className="stat-card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-blue-text)' }}>
            ₹{(data.transactionsTodayAmount).toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>40 Paid / 2 Failed</span>
        </div>
      </div>

      {/* 5. Collection Efficiency % */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-label">Collection Efficiency</span>
          <div className="stat-icon-wrapper blue">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="stat-card-value">{data.collectionEfficiency}%</div>
        <div className="stat-card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
          <span className="stat-delta-pill">
            Target: 85%
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Billed vs Collected</span>
        </div>
      </div>

      {/* 6. Upcoming Dues */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-label">Upcoming Dues</span>
          <div className="stat-icon-wrapper">
            <Clock size={18} />
          </div>
        </div>
        <div className="stat-card-value">
          ₹{(upcomingRange === 7 ? data.upcomingDues7Days : data.upcomingDues30Days).toLocaleString('en-IN')}
        </div>
        <div className="stat-card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Window:</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[7, 30].map((days) => (
              <button 
                key={days}
                className="time-range-toggle-btn"
                style={{ 
                  background: upcomingRange === days ? 'var(--odoo-purple)' : 'transparent',
                  color: upcomingRange === days ? 'white' : 'var(--text-secondary)',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => setUpcomingRange(days)}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
