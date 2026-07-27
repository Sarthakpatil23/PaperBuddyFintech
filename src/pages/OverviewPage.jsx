import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowUpRight, BookOpen, Send, AlertCircle } from 'lucide-react';
import OverviewCards from '../components/OverviewCards';
import RevenueCharts from '../components/RevenueCharts';

export default function OverviewPage({ 
  overview = {}, 
  defaulters = [], 
  onFilterByFeeType, 
  onSelectStudentForLedger,
  onSendReminder
}) {
  const navigate = useNavigate();

  const safeDefaulters = Array.isArray(defaulters) ? defaulters : [];

  // Top 5 Defaulters sorted by amount owed
  const top5Defaulters = [...safeDefaulters]
    .sort((a, b) => (b.amountOwed || 0) - (a.amountOwed || 0))
    .slice(0, 5);

  const handleJumpToSection = (sectionId) => {
    if (sectionId === 'defaulters') {
      navigate('/defaulters');
    } else if (sectionId === 'transactions') {
      navigate('/transactions');
    } else if (sectionId === 'reconciliation') {
      navigate('/reconciliation');
    }
  };

  const handleFeeChartFilter = (feeName) => {
    if (onFilterByFeeType) {
      onFilterByFeeType(feeName);
    }
    navigate('/transactions');
  };

  return (
    <div className="overview-page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Stat Cards Row */}
      <OverviewCards 
        data={overview} 
        onJumpToSection={handleJumpToSection} 
      />

      {/* 2. Revenue Breakdown & Charts */}
      <RevenueCharts 
        onFilterByFeeType={handleFeeChartFilter} 
      />

      {/* 3. Top 5 Defaulters Quick Preview Widget */}
      <div className="dashboard-section-card">
        <div className="section-card-header">
          <div className="section-card-title">
            <ShieldAlert size={22} style={{ color: '#E11D48' }} />
            <div>
              <h2 style={{ fontSize: '1.15rem' }}>Top High-Priority Defaulters</h2>
              <p>Glanceable overview of student accounts with the highest overdue balances</p>
            </div>
          </div>

          <button 
            className="action-btn-secondary"
            onClick={() => navigate('/defaulters')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>View All Defaulters ({safeDefaulters.length})</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="data-table-wrapper" style={{ marginTop: '8px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student & Class</th>
                <th>Overdue Fee Types</th>
                <th>Amount Owed</th>
                <th>Days Overdue</th>
                <th>Severity</th>
                <th>Parent Contact</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {top5Defaulters.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No active defaulters recorded. Great job!
                  </td>
                </tr>
              ) : (
                top5Defaulters.map((def) => (
                  <tr key={def.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{def.studentName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{def.classGrade} ({def.studentId})</div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {(def.feeTypes || []).map((ft, idx) => (
                          <span key={idx} className="badge warning" style={{ fontSize: '0.72rem' }}>
                            {ft}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td style={{ fontWeight: 700, color: '#9F1239' }}>
                      ₹{(def.amountOwed || 0).toLocaleString('en-IN')}
                    </td>

                    <td>
                      <span style={{ fontWeight: 600 }}>{def.daysOverdue} days</span>
                    </td>

                    <td>
                      <span className={`badge ${def.severity === 'severe' ? 'danger' : def.severity === 'moderate' ? 'warning' : 'neutral'}`}>
                        {def.severity?.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{def.parentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{def.phone}</div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button 
                          className="action-btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                          onClick={() => {
                            if (onSelectStudentForLedger) {
                              onSelectStudentForLedger(def.studentId);
                            }
                            navigate('/student-ledger');
                          }}
                        >
                          <BookOpen size={13} />
                          <span>Ledger</span>
                        </button>

                        <button 
                          className="action-btn-primary" 
                          style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                          onClick={() => onSendReminder && onSendReminder(def)}
                        >
                          <Send size={13} />
                          <span>Remind</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
