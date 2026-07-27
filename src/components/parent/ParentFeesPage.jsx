import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  Coins, 
  CheckSquare, 
  Square,
  BookOpen,
  Bus,
  FlaskConical,
  AlertCircle,
  Download,
  Receipt,
  HelpCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function ParentFeesPage({ selectedChild, feeItems, onSelectForPayment }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'due' | 'overdue' | 'paid'
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const items = feeItems[selectedChild?.id] || [];

  // Compute Quick Stats
  const dueAndOverdueItems = items.filter((i) => i.status === 'Due' || i.status === 'Overdue');
  const overdueItems = items.filter((i) => i.status === 'Overdue');
  const paidItems = items.filter((i) => i.status === 'Paid');
  const upcomingItems = items.filter((i) => i.status === 'Upcoming');

  const totalAmountDue = dueAndOverdueItems.reduce((sum, i) => sum + i.amount + (i.lateFee || 0), 0);
  const totalAmountPaid = paidItems.reduce((sum, i) => sum + i.amount, 0);
  const earliestDueDate = dueAndOverdueItems.length > 0 
    ? dueAndOverdueItems.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0].dueDate
    : 'No Dues';

  // Filtered List
  const filteredItems = items.filter((item) => {
    if (activeTab === 'due') return item.status === 'Due' || item.status === 'Overdue';
    if (activeTab === 'overdue') return item.status === 'Overdue';
    if (activeTab === 'paid') return item.status === 'Paid';
    if (activeTab === 'upcoming') return item.status === 'Upcoming';
    return true;
  });

  const toggleSelectItem = (id) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((i) => i !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const toggleSelectAllDue = () => {
    const dueIds = dueAndOverdueItems.map((i) => i.id);
    if (selectedItemIds.length === dueIds.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(dueIds);
    }
  };

  const selectedTotal = items
    .filter((i) => selectedItemIds.includes(i.id))
    .reduce((sum, i) => sum + i.amount + (i.lateFee || 0), 0);

  const handlePaySelected = () => {
    const selectedObjs = items.filter((i) => selectedItemIds.includes(i.id));
    onSelectForPayment(selectedObjs);
    navigate('/parent/pay');
  };

  const handlePaySingle = (item) => {
    onSelectForPayment([item]);
    navigate('/parent/pay');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Tuition':
        return <BookOpen size={20} style={{ color: 'var(--odoo-purple)' }} />;
      case 'Transport':
        return <Bus size={20} style={{ color: '#0284C7' }} />;
      case 'Custom':
      case 'Lab':
        return <FlaskConical size={20} style={{ color: '#4338CA' }} />;
      case 'Late Fee':
        return <AlertTriangle size={20} style={{ color: '#9F1239' }} />;
      default:
        return <Coins size={20} style={{ color: 'var(--odoo-purple)' }} />;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Paid':
        return { bg: 'var(--status-paid-bg)', text: 'var(--status-paid-text)', label: 'Paid' };
      case 'Due':
        return { bg: 'var(--status-pending-bg)', text: 'var(--status-pending-text)', label: 'Due' };
      case 'Overdue':
        return { bg: 'var(--status-danger-bg)', text: 'var(--status-danger-text)', label: 'Overdue' };
      case 'Upcoming':
        return { bg: '#E0F2FE', text: '#0369A1', label: 'Upcoming' };
      case 'Partial':
        return { bg: '#FEF9C3', text: '#92400E', label: 'Partially Paid' };
      default:
        return { bg: 'var(--status-neutral-bg)', text: 'var(--status-neutral-text)', label: status };
    }
  };

  return (
    <div className="parent-fees-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 1. TOP QUICK STATS SUMMARY CARDS (4 Cards Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="odoo-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: totalAmountDue > 0 ? 'var(--status-danger-bg)' : 'var(--status-paid-bg)', color: totalAmountDue > 0 ? 'var(--status-danger-text)' : 'var(--status-paid-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total Balance Due</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '2px' }}>
              ₹{totalAmountDue.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="odoo-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: overdueItems.length > 0 ? 'var(--status-danger-bg)' : 'var(--bg-canvas)', color: overdueItems.length > 0 ? 'var(--status-danger-text)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Overdue Fee Items</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: overdueItems.length > 0 ? '#9F1239' : 'var(--text-main)', marginTop: '2px' }}>
              {overdueItems.length} Item(s)
            </div>
          </div>
        </div>

        <div className="odoo-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--status-paid-bg)', color: 'var(--status-paid-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total Paid YTD</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--status-paid-text)', marginTop: '2px' }}>
              ₹{totalAmountPaid.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="odoo-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--odoo-purple-light)', color: 'var(--odoo-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Next Fee Due Date</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              {earliestDueDate}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL COLUMN DASHBOARD LAYOUT (Main List on Left 8-Cols, Utility Panel on Right 4-Cols) */}
      <div className="parent-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* LEFT COLUMN: Main Fee List & Selection (8 Cols Desktop / 12 Cols Mobile) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '20px' }} className="grid-left-col">
          
          {/* Header & Filter Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div className="role-tabs-container" style={{ width: 'fit-content', margin: 0 }}>
              <button 
                type="button" 
                className={`role-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <span>All ({items.length})</span>
              </button>

              <button 
                type="button" 
                className={`role-tab-btn ${activeTab === 'due' ? 'active' : ''}`}
                onClick={() => setActiveTab('due')}
              >
                <span>Pending ({dueAndOverdueItems.length})</span>
              </button>

              <button 
                type="button" 
                className={`role-tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}
                onClick={() => setActiveTab('overdue')}
              >
                <span>Overdue ({overdueItems.length})</span>
              </button>

              <button 
                type="button" 
                className={`role-tab-btn ${activeTab === 'paid' ? 'active' : ''}`}
                onClick={() => setActiveTab('paid')}
              >
                <span>Paid ({paidItems.length})</span>
              </button>
            </div>

            {dueAndOverdueItems.length > 0 && (
              <button 
                type="button"
                className="action-btn-secondary"
                onClick={toggleSelectAllDue}
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              >
                {selectedItemIds.length === dueAndOverdueItems.length ? 'Deselect All' : 'Select All Due Items'}
              </button>
            )}
          </div>

          {/* Fee Cards List */}
          {filteredItems.length === 0 ? (
            <div className="odoo-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '16px' }}>
              <CheckCircle2 size={40} style={{ color: 'var(--accent-blue-text)', margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>No fee items match this tab filter</h3>
              <p style={{ fontSize: '0.85rem' }}>Select another filter tab to view all fee categories.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredItems.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                const isPayable = item.status === 'Due' || item.status === 'Overdue' || item.status === 'Partial' || item.status === 'Upcoming';
                const totalItemCost = item.isLateFee ? item.amount : (item.amount + (item.lateFee || 0));
                const badgeStyle = getStatusBadgeStyle(item.status);

                return (
                  <div 
                    key={item.id}
                    className="odoo-card hover-card-row"
                    style={{
                      padding: '22px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                      border: isSelected 
                        ? '2px solid var(--odoo-purple)' 
                        : item.status === 'Overdue' 
                        ? '1.5px solid rgba(244, 63, 94, 0.4)' 
                        : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--odoo-purple-light)' : 'var(--surface-card)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1, minWidth: '280px' }}>
                      {/* Checkbox for batch selection */}
                      {isPayable ? (
                        <button 
                          type="button" 
                          onClick={() => toggleSelectItem(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSelected ? 'var(--odoo-purple)' : 'var(--text-muted)', marginTop: '2px' }}
                        >
                          {isSelected ? <CheckSquare size={22} /> : <Square size={22} />}
                        </button>
                      ) : (
                        <div style={{ width: '22px' }} />
                      )}

                      {/* Category Icon Badge */}
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: 'var(--bg-canvas)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getCategoryIcon(item.category)}
                      </div>

                      {/* Title & Metadata */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--text-main)' }}>{item.title}</span>
                          {item.installmentNumber && (
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--bg-canvas)', color: 'var(--text-secondary)', fontWeight: 700, border: '1px solid var(--border-color)' }}>
                              Installment {item.installmentNumber}/{item.totalInstallments}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                          Category: <strong>{item.category}</strong> • Due Date: <strong>{item.dueDate}</strong>
                        </div>

                        {/* Waiver Description */}
                        {item.waiverAmount > 0 && (
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: '4px', padding: '6px 10px', background: '#F0FDF4', borderRadius: '8px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #BBF7D0' }}>
                            <CheckCircle2 size={13} />
                            <span>Original: ₹{item.originalAmount?.toLocaleString('en-IN')} | Scholarship: -₹{item.waiverAmount.toLocaleString('en-IN')} ({item.waiverReason || 'Waiver Applied'}) | Net Due: ₹{item.adjustedAmount?.toLocaleString('en-IN')}</span>
                          </div>
                        )}

                        {/* Late Fee Badge */}
                        {item.lateFee > 0 && (
                          <div style={{ fontSize: '0.78rem', color: '#9F1239', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={13} />
                            <span>Includes +₹{item.lateFee.toLocaleString('en-IN')} Late Fee Penalty ({item.daysOverdue} days overdue)</span>
                          </div>
                        )}

                        {/* Installment Breakdown */}
                        {item.hasInstallments && item.installments?.length > 0 && (
                          <div style={{ marginTop: '8px', padding: '8px 10px', background: 'var(--bg-canvas)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Installment Schedule</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {item.installments.map((inst) => (
                                <div key={inst.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                                  <span style={{ color: 'var(--text-secondary)' }}>Installment {inst.installmentNo} • Due {inst.dueDate}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <strong style={{ color: 'var(--text-main)' }}>₹{inst.amount.toLocaleString('en-IN')}</strong>
                                    <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800,
                                      background: inst.status === 'Paid' ? 'var(--status-paid-bg)' : inst.status === 'Overdue' ? 'var(--status-danger-bg)' : 'var(--status-pending-bg)',
                                      color: inst.status === 'Paid' ? 'var(--status-paid-text)' : inst.status === 'Overdue' ? 'var(--status-danger-text)' : 'var(--status-pending-text)'
                                    }}>{inst.status}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amount & Action CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.35rem', fontWeight: 900, color: item.status === 'Overdue' ? '#9F1239' : 'var(--text-main)', letterSpacing: '-0.02em' }}>
                          ₹{totalItemCost.toLocaleString('en-IN')}
                        </div>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          display: 'inline-block',
                          background: badgeStyle.bg,
                          color: badgeStyle.text
                        }}>
                          {badgeStyle.label}
                        </span>
                      </div>

                      {isPayable && (
                        <button 
                          type="button" 
                          className="btn-submit-primary"
                          onClick={() => handlePaySingle(item)}
                          style={{ height: '42px', padding: '0 20px', fontSize: '0.86rem', width: 'auto' }}
                        >
                          <span>Pay Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Utility Panel (4 Cols Desktop / 12 Cols Mobile) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} className="grid-right-col">
          
          {/* Payment Summary Box */}
          <div className="odoo-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Coins size={18} style={{ color: 'var(--odoo-purple)' }} />
              <span>Payment Summary</span>
            </h3>

            <div style={{ padding: '16px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pending Fee Line Items:</span>
                <strong style={{ color: 'var(--text-main)' }}>{dueAndOverdueItems.length} Items</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Overdue Penalties:</span>
                <strong style={{ color: overdueItems.length > 0 ? '#9F1239' : 'var(--text-main)' }}>
                  ₹{overdueItems.reduce((s, i) => s + (i.lateFee || 0), 0).toLocaleString('en-IN')}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Total Amount Due:</span>
                <strong style={{ fontWeight: 900, color: 'var(--odoo-purple)', fontSize: '1.1rem' }}>
                  ₹{totalAmountDue.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            {totalAmountDue > 0 && (
              <button 
                type="button" 
                className="btn-submit-primary"
                onClick={() => {
                  onSelectForPayment(dueAndOverdueItems);
                  navigate('/parent/pay');
                }}
                style={{ height: '46px' }}
              >
                <CreditCard size={18} />
                <span>Pay All Pending Fees (₹{totalAmountDue.toLocaleString('en-IN')})</span>
              </button>
            )}
          </div>

          {/* Upcoming Dues Schedule Card */}
          <div className="odoo-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} style={{ color: '#0369A1' }} />
              <span>Upcoming Fee Schedule</span>
            </h3>

            {upcomingItems.length === 0 ? (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No upcoming fee schedules for the remaining academic term.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingItems.map((inst) => (
                  <div key={inst.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.83rem', padding: '10px 12px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{inst.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {inst.dueDate}</div>
                    </div>
                    <strong style={{ color: '#0369A1', fontWeight: 800 }}>₹{inst.amount.toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Parent Actions */}
          <div className="odoo-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: 'var(--odoo-purple)' }} />
              <span>Parent Quick Utilities</span>
            </h3>

            <button 
              type="button" 
              className="action-btn-secondary"
              onClick={() => navigate('/parent/receipts')}
              style={{ justifyContent: 'flex-start', fontSize: '0.82rem', padding: '10px 14px' }}
            >
              <Download size={15} />
              <span>Download Official Fee Receipts (PDF)</span>
            </button>

            <button 
              type="button" 
              className="action-btn-secondary"
              onClick={() => navigate('/parent/history')}
              style={{ justifyContent: 'flex-start', fontSize: '0.82rem', padding: '10px 14px' }}
            >
              <Receipt size={15} />
              <span>View Past Payment History Log</span>
            </button>
          </div>

        </div>

      </div>

      {/* Floating Selected Pay Bar on Checkbox Selection */}
      {selectedItemIds.length > 0 && (
        <div style={{
          position: 'sticky',
          bottom: '24px',
          background: 'var(--surface-card)',
          border: '2px solid var(--odoo-purple)',
          borderRadius: '16px',
          padding: '18px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 40,
          animation: 'fadeInUp 0.2s ease-out'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
              {selectedItemIds.length} fee item(s) selected for checkout
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--odoo-purple)' }}>
              Total: ₹{selectedTotal.toLocaleString('en-IN')}
            </div>
          </div>

          <button 
            type="button" 
            className="btn-submit-primary"
            onClick={handlePaySelected}
            style={{ width: 'auto', padding: '0 28px', height: '48px' }}
          >
            <CreditCard size={18} />
            <span>Proceed to Pay ₹{selectedTotal.toLocaleString('en-IN')}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
