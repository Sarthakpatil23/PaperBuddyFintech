import React, { useState } from 'react';
import { downloadReceiptPDF } from '../../utils/pdfReceiptGenerator';
import { 
  Receipt, 
  Download, 
  Search, 
  Printer, 
  Building2, 
  ShieldCheck, 
  Eye, 
  CheckCircle2 
} from 'lucide-react';

export default function ParentReceiptsPage({ selectedChild, transactions, onOpenReceipt }) {
  const [searchTerm, setSearchTerm] = useState('');

  const childTxns = transactions.filter((t) => t.studentId === selectedChild?.id && t.status === 'Paid');

  const filteredReceipts = childTxns.filter((t) => {
    return (t.receiptNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
           (t.feeType || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="parent-receipts-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            Digital Tax & Fee Receipts
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Official verified payment receipts for <strong style={{ color: 'var(--odoo-purple)' }}>{selectedChild?.name}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-blue-text)', background: 'var(--accent-blue-light)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
          <ShieldCheck size={15} />
          <span>CBSE Tax Exemption Compliant Receipts</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="odoo-card" style={{ padding: '16px' }}>
        <div className="input-input-wrapper">
          <input 
            type="text"
            className="form-input"
            placeholder="Search by receipt number (e.g. RCP-2026-0891)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ height: '42px', fontSize: '0.88rem' }}
          />
          <Search className="input-icon" size={16} />
        </div>
      </div>

      {/* Receipts Grid / Cards */}
      {filteredReceipts.length === 0 ? (
        <div className="odoo-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Receipt size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700 }}>No paid receipts available</h3>
          <p style={{ fontSize: '0.85rem' }}>Receipts become available immediately once a fee payment is confirmed.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredReceipts.map((receipt) => (
            <div 
              key={receipt.id}
              className="odoo-card hover-card-row"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                border: '1px solid var(--border-color)',
                transition: 'var(--transition-fast)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--odoo-purple-light)',
                    color: 'var(--odoo-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Receipt size={20} />
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--status-paid-bg)',
                    color: 'var(--status-paid-text)'
                  }}>
                    VERIFIED
                  </span>
                </div>

                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>#{receipt.receiptNo}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--odoo-purple)', marginTop: '2px' }}>{receipt.feeType}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Date: {receipt.dateTime}</div>

                <div style={{ marginTop: '14px', fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  ₹{receipt.amount.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  type="button"
                  className="action-btn-secondary"
                  onClick={() => onOpenReceipt(receipt)}
                  style={{ flex: 1, fontSize: '0.8rem', height: '36px', justifyContent: 'center' }}
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </button>

                <button 
                  type="button"
                  className="action-btn-primary"
                  onClick={() => {
                    downloadReceiptPDF(receipt, selectedChild);
                    onOpenReceipt(receipt);
                  }}
                  style={{ flex: 1, fontSize: '0.8rem', height: '36px', justifyContent: 'center' }}
                >
                  <Download size={14} />
                  <span>PDF Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
