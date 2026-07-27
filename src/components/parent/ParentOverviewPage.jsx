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
  Bell, 
  ShieldCheck, 
  Coins,
  UserCheck,
  Building2,
  FileText,
  PhoneCall,
  Download,
  HelpCircle
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

  return (
    <div className="parent-overview-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Welcome Greeting Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: 0 }}>
            Welcome back, {parentAccount?.name || 'Parent'} 👋
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Fee portal summary for <strong style={{ color: 'var(--odoo-purple)' }}>{selectedChild?.name || 'Student'}</strong> ({selectedChild?.classGrade || 'Grade 10'})
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--odoo-purple-light)',
            color: 'var(--odoo-purple)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={16} />
            <span>Academic Session 2026-27</span>
          </div>
        </div>
      </div>

      {/* 2-Column Desktop Widescreen Layout Grid */}
      <div className="parent-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* LEFT COLUMN: Main Financial Cards & Dues (8 Cols Desktop / 12 Cols Mobile) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }} className="grid-left-col">
          
          {/* Prominent "AMOUNT DUE" Hero Card (Banking Style) */}
          <div className="amount-due-hero-card" style={{
            background: totalAmountDue > 0 
              ? 'linear-gradient(135deg, var(--odoo-purple) 0%, #4A2E44 100%)' 
              : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            color: 'white',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Subtle Background Radial Glow */}
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.09)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', zIndex: 2 }}>
              <div>
                <div style={{ fontSize: '0.84rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.88, fontWeight: 700 }}>
                  {totalAmountDue > 0 ? 'Total Outstanding Fee Balance' : 'Current Fee Account Status'}
                </div>
                <div style={{ fontSize: '3.2rem', fontWeight: 900, letterSpacing: '-0.03em', marginTop: '6px' }}>
                  ₹{totalAmountDue.toLocaleString('en-IN')}
                </div>
              </div>

              {totalAmountDue > 0 ? (
                <div style={{
                  background: overdueItems.length > 0 ? 'rgba(255, 228, 230, 0.25)' : 'rgba(254, 243, 199, 0.25)',
                  border: overdueItems.length > 0 ? '1px solid rgba(255, 228, 230, 0.4)' : '1px solid rgba(254, 243, 199, 0.4)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {overdueItems.length > 0 ? <AlertTriangle size={16} /> : <Clock size={16} />}
                  <span>{overdueItems.length > 0 ? `${overdueItems.length} Fee Overdue` : `Due by ${earliestDueDate}`}</span>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.22)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} />
                  <span>All Dues Up to Date</span>
                </div>
              )}
            </div>

            {/* Action Bar inside Hero Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', zIndex: 2, paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '0.88rem', opacity: 0.92, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} />
                <span>{totalAmountDue > 0 ? `${dueItems.length} pending item(s). Instant zero-fee UPI settlement.` : 'No dues pending for this student.'}</span>
              </div>

              {totalAmountDue > 0 && (
                <button 
                  type="button"
                  onClick={() => navigate('/parent/pay')}
                  style={{
                    background: 'white',
                    color: 'var(--odoo-purple)',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                    transition: 'transform 0.18s ease'
                  }}
                >
                  <CreditCard size={20} />
                  <span>Pay Now ₹{totalAmountDue.toLocaleString('en-IN')}</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Pending Fee Breakdown (List View) */}
          <div className="odoo-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Coins size={20} style={{ color: 'var(--odoo-purple)' }} />
                  <span>Currently Due & Upcoming Fees</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Itemized breakdown of academic tuition, transport & lab dues</p>
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
              <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={36} style={{ color: 'var(--accent-blue-text)', margin: '0 auto 10px auto' }} />
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>No Pending Fee Line Items</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>All due fee schedules have been cleared.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dueItems.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-canvas)',
                      border: item.status === 'Overdue' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-color)',
                      transition: 'var(--transition-fast)'
                    }}
                    className="hover-card-row"
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: item.status === 'Overdue' ? '#9F1239' : 'var(--text-muted)', marginTop: '2px' }}>
                        Due: <strong>{item.dueDate}</strong> {item.lateFee > 0 && `(Includes +₹${item.lateFee} Late Fee)`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                          ₹{(item.amount + (item.lateFee || 0)).toLocaleString('en-IN')}
                        </div>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: item.status === 'Overdue' ? 'var(--status-danger-bg)' : 'var(--status-pending-bg)',
                          color: item.status === 'Overdue' ? 'var(--status-danger-text)' : 'var(--status-pending-text)'
                        }}>
                          {item.status}
                        </span>
                      </div>

                      <button 
                        type="button" 
                        className="btn-submit-primary"
                        onClick={() => navigate('/parent/pay')}
                        style={{ height: '36px', padding: '0 14px', fontSize: '0.82rem', width: 'auto' }}
                      >
                        Pay Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Payment Activity & Receipts Preview */}
          <div className="odoo-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Receipt size={20} style={{ color: 'var(--odoo-purple)' }} />
                  <span>Recent Payment Receipts</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Verified payment transactions & downloadable PDF receipts</p>
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
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No recent payment transactions recorded for this child yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {childTxns.slice(0, 3).map((txn) => (
                  <div 
                    key={txn.id}
                    onClick={() => onOpenReceipt && onOpenReceipt(txn)}
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                    className="hover-card-row"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'var(--status-paid-bg)',
                        color: 'var(--status-paid-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>{txn.feeType}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {txn.dateTime} • {txn.paymentMethod} • Receipt #{txn.receiptNo}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--accent-blue-text)' }}>
                          ₹{txn.amount.toLocaleString('en-IN')}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--status-paid-text)', fontWeight: 700 }}>{txn.status}</span>
                      </div>
                      <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Student Profile, Installments & Quick Services (4 Cols Desktop / 12 Cols Mobile) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} className="grid-right-col">
          
          {/* Child Student Profile Card */}
          <div className="odoo-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--odoo-purple) 0%, var(--accent-blue) 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 900,
                boxShadow: 'var(--shadow-md)'
              }}>
                {selectedChild?.name ? selectedChild.name.charAt(0) : 'S'}
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {selectedChild?.name}
                </h3>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--odoo-purple)', marginTop: '2px' }}>
                  {selectedChild?.classGrade}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student ID: {selectedChild?.id}</div>
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>School Branch:</span>
                <strong style={{ color: 'var(--text-main)' }}>PaperBuddy Main Campus</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Board:</span>
                <strong style={{ color: 'var(--text-main)' }}>CBSE Senior Secondary</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Parent Guardian:</span>
                <strong style={{ color: 'var(--text-main)' }}>{parentAccount?.name}</strong>
              </div>
            </div>
          </div>

          {/* Installment Timeline Progress Card */}
          <div className="odoo-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={18} style={{ color: 'var(--accent-blue-text)' }} />
              <span>Installment Timeline</span>
            </h3>

            <div style={{ background: 'var(--bg-canvas)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Academic Year Progress</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--odoo-purple)' }}>
                  {paidInstallments} of {totalInstallments} Paid ({installmentPercent}%)
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div style={{ width: '100%', height: '10px', background: 'var(--border-color)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                <div style={{
                  width: `${installmentPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--odoo-purple) 0%, var(--accent-blue) 100%)',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {nextInstallment && (
                <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} style={{ color: 'var(--odoo-purple)' }} />
                  <span>Next Due: <strong>{nextInstallment.title}</strong> (₹{nextInstallment.amount.toLocaleString('en-IN')}) on {nextInstallment.dueDate}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Installment Schedule
              </div>
              {installmentItems.slice(0, 4).map((inst, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: inst.status === 'Paid' ? 'var(--status-paid-bg)' : 'var(--border-color)',
                      color: inst.status === 'Paid' ? 'var(--status-paid-text)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
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

          {/* Quick Parent Services Card */}
          <div className="odoo-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} style={{ color: 'var(--odoo-purple)' }} />
              <span>Parent Quick Services</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                type="button" 
                className="action-btn-secondary"
                onClick={() => navigate('/parent/receipts')}
                style={{ justifyContent: 'flex-start', fontSize: '0.82rem', padding: '10px 14px' }}
              >
                <Download size={15} />
                <span>Annual Fee Tax Certificate (80G)</span>
              </button>

              <button 
                type="button" 
                className="action-btn-secondary"
                onClick={() => navigate('/parent/fees')}
                style={{ justifyContent: 'flex-start', fontSize: '0.82rem', padding: '10px 14px' }}
              >
                <FileText size={15} />
                <span>View Full Fee Structure & Waivers</span>
              </button>

              <button 
                type="button" 
                className="action-btn-secondary"
                onClick={() => alert('School Accounts Support Desk: +91 800 234 5678 or accounts@paperbuddy.edu')}
                style={{ justifyContent: 'flex-start', fontSize: '0.82rem', padding: '10px 14px' }}
              >
                <PhoneCall size={15} />
                <span>School Accounts Helpdesk</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
