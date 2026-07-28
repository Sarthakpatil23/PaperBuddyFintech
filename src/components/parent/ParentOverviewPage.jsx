import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  Receipt, 
  ShieldCheck, 
  Coins,
  History,
  Download,
  FileText,
  PhoneCall,
  HelpCircle,
  TrendingUp,
  UserCheck,
  Building2
} from 'lucide-react';

export default function ParentOverviewPage({
  parentAccount,
  selectedChild,
  feeItems,
  transactions,
  notifications,
  onOpenReceipt
}) {
  const navigate = useNavigate();

  const childFees = (feeItems && selectedChild?.id && feeItems[selectedChild.id]) || [];
  const childTxns = (transactions || []).filter((t) => t.studentId === selectedChild?.id);

  // Compute Outstanding Dues & Overdue Status
  const dueItems = childFees.filter((item) => item.status === 'Due' || item.status === 'Overdue' || item.status === 'Pending');
  const overdueItems = childFees.filter((item) => item.status === 'Overdue');
  
  const totalAmountDue = dueItems.reduce((sum, item) => sum + (item.amount || 0) + (item.lateFee || 0), 0);
  
  // Earliest due date
  const sortedDueItems = [...dueItems].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const earliestDueDate = sortedDueItems.length > 0 && sortedDueItems[0].dueDate
    ? sortedDueItems[0].dueDate
    : 'No Dues Pending';

  // Installment Progress
  const installmentItems = childFees.filter((item) => item.installmentNumber != null);
  const paidInstallments = installmentItems.filter((item) => item.status === 'Paid').length;
  const totalInstallments = installmentItems.length > 0 ? installmentItems.length : 4;
  const installmentPercent = totalInstallments > 0 ? Math.round((paidInstallments / totalInstallments) * 100) : 100;
  const nextInstallment = installmentItems.find((item) => item.status === 'Due' || item.status === 'Upcoming' || item.status === 'Pending');
  // Instant Parent Display Name resolution (prevents delay/flicker)
  const parentDisplayName = (parentAccount?.name && parentAccount.name !== 'Parent Account Not Yet Created')
    ? parentAccount.name
    : (selectedChild?.name ? `Parent of ${selectedChild.name}` : 'Parent');

  return (
    <div className="parent-overview-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Unified SaaS Parent Dashboard Hero Card */}
      <div className={`compact-fee-summary-card ${totalAmountDue === 0 ? 'clear' : ''}`} style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', zIndex: 2 }}>
          
          {/* Header Row: Greeting & Student Subtitle & Academic Session Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.025em', margin: 0 }}>
                Welcome back, {parentDisplayName} 👋
              </h1>
              <div style={{ fontSize: '0.84rem', opacity: 0.9, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Student: <strong>{selectedChild?.name || 'Student'}</strong> ({selectedChild?.classGrade || 'Grade Level'})</span>
              </div>
            </div>

            <div style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: 'white',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={14} />
              <span>Session 2026-27</span>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.16)', width: '100%' }} />

          {/* Financial Balance & Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85, fontWeight: 700 }}>
                {totalAmountDue > 0 ? 'Total Outstanding Balance' : 'Account Financial Status'}
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, letterSpacing: '-0.03em', marginTop: '2px', lineHeight: 1.1 }}>
                ₹{totalAmountDue.toLocaleString('en-IN')}
              </div>
              <div className="summary-meta-pills" style={{ marginTop: '8px' }}>
                {totalAmountDue > 0 ? (
                  <>
                    <span className="summary-pill-item">
                      <Clock size={13} />
                      <span>{overdueItems.length > 0 ? `${overdueItems.length} Fee Overdue` : `Due by ${earliestDueDate}`}</span>
                    </span>
                    <span className="summary-pill-item">
                      <Sparkles size={13} />
                      <span>{dueItems.length} Pending Item(s)</span>
                    </span>
                    <span className="summary-pill-item">
                      Zero-fee UPI Settlement
                    </span>
                  </>
                ) : (
                  <span className="summary-pill-item">
                    <CheckCircle2 size={13} />
                    <span>All Fee Schedules Settled</span>
                  </span>
                )}
              </div>
            </div>

            {totalAmountDue > 0 && (
              <button 
                type="button"
                className="summary-action-btn"
                onClick={() => navigate('/parent/pay')}
              >
                <CreditCard size={18} />
                <span>Pay Dues ₹{totalAmountDue.toLocaleString('en-IN')}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Modern Quick Actions Grid */}
      <div className="quick-actions-section">
        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 700 }}>
          Quick Actions
        </div>

        <div className="quick-actions-grid">
          <div className="quick-action-card" onClick={() => navigate('/parent/pay')}>
            <div className="quick-action-icon">
              <CreditCard size={20} />
            </div>
            <div className="quick-action-text">
              <span className="quick-action-title">Pay Fees Now</span>
              <span className="quick-action-subtitle">Instant UPI & Netbanking</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div className="quick-action-card" onClick={() => navigate('/parent/receipts')}>
            <div className="quick-action-icon">
              <Download size={20} />
            </div>
            <div className="quick-action-text">
              <span className="quick-action-title">Tax Receipts (80G)</span>
              <span className="quick-action-subtitle">Download PDF certificates</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div className="quick-action-card" onClick={() => navigate('/parent/fees')}>
            <div className="quick-action-icon">
              <Coins size={20} />
            </div>
            <div className="quick-action-text">
              <span className="quick-action-title">Fee Structures</span>
              <span className="quick-action-subtitle">Tuition, Transport & Waivers</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div className="quick-action-card" onClick={() => navigate('/parent/history')}>
            <div className="quick-action-icon">
              <History size={20} />
            </div>
            <div className="quick-action-text">
              <span className="quick-action-title">Payment History</span>
              <span className="quick-action-subtitle">Verified transaction log</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout Grid */}
      <div className="parent-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* LEFT COLUMN: Pending Fees Breakdown & Recent Receipts (8 Cols Desktop / 12 Cols Mobile) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }} className="grid-left-col">
          
          {/* Currently Due & Upcoming Fees List */}
          <div className="dashboard-section-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Coins size={18} style={{ color: 'var(--odoo-purple)' }} />
                  <span>Currently Due & Upcoming Fees</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Itemized breakdown of academic tuition, transport & lab dues</p>
              </div>

              <button 
                type="button" 
                className="action-link-btn"
                onClick={() => navigate('/parent/fees')}
              >
                <span>Full Breakdown</span>
                <ArrowRight size={14} className="arrow-icon" />
              </button>
            </div>

            {dueItems.length === 0 ? (
              <div style={{ padding: '28px', textAlign: 'center', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                <CheckCircle2 size={32} style={{ color: 'var(--accent-blue-text)', margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>No Pending Fee Line Items</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>All scheduled fee items for {selectedChild?.name || 'this student'} have been cleared.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dueItems.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-canvas)',
                      border: item.status === 'Overdue' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-color)',
                      transition: 'var(--transition-fast)'
                    }}
                    className="hover-card-row"
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: item.status === 'Overdue' ? '#9F1239' : 'var(--text-muted)', marginTop: '2px' }}>
                        Due: <strong>{item.dueDate}</strong> {item.lateFee > 0 && `(Includes +₹${item.lateFee} Late Fee)`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                          ₹{(item.amount + (item.lateFee || 0)).toLocaleString('en-IN')}
                        </div>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: item.status === 'Overdue' ? 'var(--status-danger-bg)' : 'var(--status-pending-bg)',
                          color: item.status === 'Overdue' ? 'var(--status-danger-text)' : 'var(--status-pending-text)'
                        }}>
                          {item.status}
                        </span>
                      </div>

                      <button 
                        type="button" 
                        className="action-btn-primary"
                        onClick={() => navigate('/parent/pay')}
                        style={{ height: '34px', padding: '0 12px', fontSize: '0.8rem' }}
                      >
                        Pay Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Payment Receipts Preview */}
          <div className="dashboard-section-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Receipt size={18} style={{ color: 'var(--odoo-purple)' }} />
                  <span>Recent Payment Receipts</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Verified transactions & downloadable receipts</p>
              </div>

              <button 
                type="button" 
                className="action-link-btn"
                onClick={() => navigate('/parent/history')}
              >
                <span>View History</span>
                <ArrowRight size={14} className="arrow-icon" />
              </button>
            </div>

            {childTxns.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)' }}>
                No recent payment transactions recorded for this child yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {childTxns.slice(0, 3).map((txn) => (
                  <div 
                    key={txn.id}
                    onClick={() => onOpenReceipt && onOpenReceipt(txn)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                    className="hover-card-row"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--status-paid-bg)',
                        color: 'var(--status-paid-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>{txn.feeType}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                          {txn.dateTime} • {txn.paymentMethod} • Receipt #{txn.receiptNo}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--accent-blue-text)' }}>
                          ₹{txn.amount.toLocaleString('en-IN')}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--status-paid-text)', fontWeight: 700 }}>{txn.status}</span>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Student Profile & Installment Timeline (4 Cols Desktop / 12 Cols Mobile) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} className="grid-right-col">
          
          {/* Well-Aligned Student Profile Card */}
          <div className="dashboard-section-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--odoo-purple) 0%, var(--accent-blue) 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-xs)'
              }}>
                {selectedChild?.name ? selectedChild.name.charAt(0) : 'S'}
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {selectedChild?.name}
                </h3>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--odoo-purple)', marginTop: '1px' }}>
                  {selectedChild?.classGrade}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Student ID: {selectedChild?.id}</div>
              </div>
            </div>

            <div style={{ padding: '12px 14px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Campus:</span>
                <strong style={{ color: 'var(--text-main)' }}>Finlyt Main Branch</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Board:</span>
                <strong style={{ color: 'var(--text-main)' }}>CBSE Senior Secondary</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Guardian:</span>
                <strong style={{ color: 'var(--text-main)' }}>{parentAccount?.name}</strong>
              </div>
            </div>
          </div>

          {/* Installment Progress Card */}
          <div className="dashboard-section-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} style={{ color: 'var(--accent-blue-text)' }} />
                <span>Installment Progress</span>
              </h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--odoo-purple)' }}>
                {paidInstallments}/{totalInstallments} Paid ({installmentPercent}%)
              </span>
            </div>

            <div style={{ background: 'var(--bg-canvas)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              {/* Visual Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                <div style={{
                  width: `${installmentPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--odoo-purple) 0%, var(--accent-blue) 100%)',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {nextInstallment && (
                <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} style={{ color: 'var(--odoo-purple)' }} />
                  <span>Next Due: <strong>{nextInstallment.title}</strong> (₹{nextInstallment.amount.toLocaleString('en-IN')}) on {nextInstallment.dueDate}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {installmentItems.slice(0, 4).map((inst, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: inst.status === 'Paid' ? 'var(--status-paid-bg)' : 'var(--border-color)',
                      color: inst.status === 'Paid' ? 'var(--status-paid-text)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 800
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{inst.title}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: inst.status === 'Paid' ? 'var(--status-paid-text)' : 'var(--text-secondary)' }}>
                    ₹{inst.amount.toLocaleString('en-IN')} ({inst.status})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Helpdesk Info Box */}
          <div className="dashboard-section-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-canvas)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--odoo-purple-light)', color: 'var(--odoo-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <HelpCircle size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)' }}>School Accounts Desk</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '1px' }}>fees@finlyt.edu • +91 (080) 4567-8900</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
