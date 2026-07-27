import React, { useState } from 'react';
import { downloadReceiptPDF } from '../../utils/pdfReceiptGenerator';
import { 
  Receipt, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight, 
  Calendar, 
  Download,
  TrendingUp,
  FileSpreadsheet,
  Building2,
  ChevronDown
} from 'lucide-react';

export default function ParentHistoryPage({ selectedChild, transactions, onOpenReceipt }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [expandedTxnId, setExpandedTxnId] = useState(null);

  const childTxns = transactions.filter((t) => t.studentId === selectedChild?.id);

  const filteredTxns = childTxns.filter((txn) => {
    const matchesSearch = (txn.feeType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (txn.receiptNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (txn.id || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'All' || (txn.feeType || '').includes(filterCategory);

    return matchesSearch && matchesCategory;
  });

  const paidTxns = childTxns.filter(t => t.status === 'Paid');
  const totalPaid = paidTxns.reduce((sum, t) => sum + t.amount, 0);

  const toggleExpandTxn = (id) => {
    setExpandedTxnId(expandedTxnId === id ? null : id);
  };

  const handleExportStatement = () => {
    alert(`Exported payment ledger statement for ${selectedChild?.name} (PDF / CSV format).`);
  };

  return (
    <div className="parent-history-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 1. TOP QUICK STATS BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="odoo-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--status-paid-bg)', color: 'var(--status-paid-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total Lifetime Paid</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--status-paid-text)', marginTop: '2px' }}>
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="odoo-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--odoo-purple-light)', color: 'var(--odoo-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Verified Receipts</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '2px' }}>
              {paidTxns.length} Verified
            </div>
          </div>
        </div>

        <div className="odoo-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Preferred Gateway</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              Zero-Fee UPI QR
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL COLUMN DASHBOARD LAYOUT (Main List on Left 8-Cols, Analytics on Right 4-Cols) */}
      <div className="parent-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
        
        {/* LEFT COLUMN: Search, Filters & Expandable Transactions (8 Cols Desktop / 12 Cols Mobile) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '20px' }} className="grid-left-col">
          
          {/* Search & Filter Controls */}
          <div className="odoo-card" style={{ padding: '18px', borderRadius: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div className="input-input-wrapper" style={{ flex: 1, minWidth: '240px' }}>
              <input 
                type="text"
                className="form-input"
                placeholder="Search by receipt #, fee title, or TXN ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ height: '42px', fontSize: '0.88rem' }}
              />
              <Search className="input-icon" size={18} />
            </div>

            <select 
              className="form-input" 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ width: '200px', height: '42px', padding: '0 14px', fontSize: '0.86rem' }}
            >
              <option value="All">All Fee Categories</option>
              <option value="Tuition">Tuition Fees</option>
              <option value="Transport">Transport Fees</option>
              <option value="Lab">Lab & Custom Fees</option>
            </select>
          </div>

          {/* Transactions List */}
          {filteredTxns.length === 0 ? (
            <div className="odoo-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '16px' }}>
              <Receipt size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>No transaction history matching criteria</h3>
              <p style={{ fontSize: '0.85rem' }}>Try clearing search keywords or changing category filters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredTxns.map((txn) => {
                const isExpanded = expandedTxnId === txn.id;

                return (
                  <div 
                    key={txn.id}
                    className="odoo-card hover-card-row"
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <div 
                      onClick={() => toggleExpandTxn(txn.id)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: txn.status === 'Paid' ? 'var(--status-paid-bg)' : txn.status === 'Pending' ? 'var(--status-pending-bg)' : 'var(--status-danger-bg)',
                          color: txn.status === 'Paid' ? 'var(--status-paid-text)' : txn.status === 'Pending' ? 'var(--status-pending-text)' : 'var(--status-danger-text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {txn.status === 'Paid' ? <CheckCircle2 size={22} /> : txn.status === 'Pending' ? <Clock size={22} /> : <XCircle size={22} />}
                        </div>

                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{txn.feeType}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {txn.dateTime} • Method: <strong>{txn.paymentMethod}</strong> • Receipt #{txn.receiptNo}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                            ₹{txn.amount.toLocaleString('en-IN')}
                          </div>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: txn.status === 'Paid' ? 'var(--status-paid-bg)' : 'var(--status-pending-bg)',
                            color: txn.status === 'Paid' ? 'var(--status-paid-text)' : 'var(--status-pending-text)'
                          }}>
                            {txn.status}
                          </span>
                        </div>

                        <ChevronDown size={18} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }} />
                      </div>
                    </div>

                    {/* Expandable Transaction Details Drawer */}
                    {isExpanded && (
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: 'var(--bg-canvas)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                          <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Transaction ID:</span>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{txn.id}</div>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Bank Ref / UTR:</span>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{txn.utrNo || txn.chequeNo || 'UTR9821039401'}</div>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Processed By:</span>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{txn.processedBy || 'System Webhook'}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button 
                            type="button" 
                            className="btn-submit-primary"
                            onClick={() => {
                              downloadReceiptPDF(txn, selectedChild);
                              onOpenReceipt(txn);
                            }}
                            style={{ height: '38px', padding: '0 16px', fontSize: '0.82rem', width: 'auto' }}
                          >
                            <Download size={14} />
                            <span>Download Official PDF Receipt</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Financial Analytics & Export Utilities (4 Cols Desktop / 12 Cols Mobile) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }} className="grid-right-col">
          
          {/* Export Statement Card */}
          <div className="odoo-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileSpreadsheet size={18} style={{ color: 'var(--odoo-purple)' }} />
              <span>Statement & Tax Export</span>
            </h3>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Download complete payment ledger statement for reimbursement, income tax filing (80G), or school transfer purposes.
            </p>

            <button 
              type="button" 
              className="action-btn-secondary"
              onClick={handleExportStatement}
              style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '12px 18px', fontWeight: 700 }}
            >
              <Download size={16} />
              <span>Download Statement (PDF / CSV)</span>
            </button>
          </div>

          {/* Payment Method Breakdown Card */}
          <div className="odoo-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={18} style={{ color: '#0369A1' }} />
              <span>Payment Method Stats</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>UPI Payments (Zero Fee)</span>
                <strong style={{ color: 'var(--odoo-purple)' }}>85%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Counter Cash / Cheque</span>
                <strong style={{ color: 'var(--text-secondary)' }}>15%</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
