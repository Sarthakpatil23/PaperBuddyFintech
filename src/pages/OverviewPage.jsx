import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowUpRight, BookOpen, Send, AlertCircle } from 'lucide-react';
import OverviewCards from '../components/OverviewCards';
import RevenueCharts from '../components/RevenueCharts';

export default function OverviewPage({ 
  overview, 
  defaulters, 
  onFilterByFeeType, 
  onSelectStudentForLedger,
  onSendReminder
}) {
  const navigate = useNavigate();

  // Top 5 Defaulters sorted by amount owed
  const top5Defaulters = [...defaulters]
    .sort((a, b) => b.amountOwed - a.amountOwed)
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
            <span>View All Defaulters ({defaulters.length})</span>
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
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {def.feeTypes.map((ft) => (
                          <span 
                            key={ft}
                            style={{
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'var(--bg-canvas)',
                              border: '1px solid var(--border-color)',
                              fontWeight: 500
                            }}
                          >
                            {ft}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td style={{ fontWeight: 700, color: '#9F1239' }}>
                      ₹{def.amountOwed.toLocaleString('en-IN')}
                    </td>

                    <td>
                      <span style={{ fontWeight: 600 }}>{def.daysOverdue} days</span>
                    </td>

                    <td>
                      <span className={`badge-status ${def.severity}`}>
                        {def.severity === 'severe' && <AlertCircle size={12} />}
                        {def.severity.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.82rem' }}>{def.parentName}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--accent-blue-text)' }}>{def.phone}</div>
                    </td>

                    <td>
                      <div className="row-actions-group" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="icon-btn-action" 
                          title="Send Reminder"
                          onClick={() => onSendReminder(def)}
                        >
                          <Send size={14} />
                        </button>

                        <button 
                          className="icon-btn-action" 
                          title="Open Student Ledger"
                          onClick={() => {
                            onSelectStudentForLedger(def.studentId);
                            navigate('/student-ledger');
                          }}
                        >
                          <BookOpen size={14} />
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
