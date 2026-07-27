import React, { useEffect } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  QrCode 
} from 'lucide-react';
import { downloadReceiptPDF } from '../../utils/pdfReceiptGenerator';

export default function ReceiptPDFModal({ receipt, student, onClose, onDownload }) {
  if (!receipt) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadReceiptPDF(receipt, student);
    if (onDownload) {
      onDownload(receiptNo);
    }
  };

  const studentName = receipt.studentName || student?.name || 'Student Account';
  const classGrade = receipt.classGrade || student?.classGrade || student?.grade || 'Grade Level';
  const parentName = receipt.parentName || student?.parentName || 'Parent Account';
  const receiptNo = receipt.receiptNo || 'RCP-2026-0891';
  const dateTime = receipt.dateTime || new Date().toISOString().replace('T', ' ').slice(0, 16);
  const amount = receipt.amount || 0;
  const paymentMethod = receipt.paymentMethod || 'UPI';
  const utrNo = receipt.utrNo || receipt.chequeNo || 'UTR9821039401';
  const feeType = receipt.feeType || 'Tuition Fee (Q2)';
  const items = receipt.items || [{ name: feeType, amount: amount }];

  return (
    <div 
      className="modal-backdrop fade-in" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div 
        className="receipt-modal-box" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '680px', 
          width: '94vw', 
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          padding: '0', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header Action Bar */}
        <div className="receipt-modal-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--odoo-purple)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Official School Fee Receipt</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button" 
              className="action-btn-secondary"
              onClick={handlePrint}
              style={{ height: '36px', padding: '0 12px', fontSize: '0.82rem' }}
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button 
              type="button" 
              className="action-btn-primary"
              onClick={handleDownload}
              style={{ height: '36px', padding: '0 14px', fontSize: '0.82rem', background: 'var(--odoo-purple)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            <button 
              type="button" 
              className="icon-btn-ghost"
              onClick={onClose}
              style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable PDF Receipt Content Container */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div className="printable-receipt-card" style={{ padding: '32px 36px', background: 'white', color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
            
            {/* Receipt Top Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed #E2E8F0', paddingBottom: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #714B67 0%, #0284C7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Building2 size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>PaperBuddy International School</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 0 0' }}>Affiliated to CBSE Board • School Code: PB-89210</p>
                  <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '1px 0 0 0' }}>Campus Road, Knowledge Park II, Tech City • Support: fees@paperbuddy.edu</p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: '#E0F2FE', color: '#0369A1', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
                  <CheckCircle2 size={13} />
                  <span>PAID RECEIPT</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>#{receiptNo}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Date: {dateTime}</div>
              </div>
            </div>

            {/* Student & Parent Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '16px', background: '#F8F9FA', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 700, marginBottom: '4px' }}>Student Details</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{studentName}</div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>Class: <strong>{classGrade}</strong></div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Student ID: {student?.id || receipt.studentId || 'STU-101'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 700, marginBottom: '4px' }}>Parent / Guardian</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{parentName}</div>
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>Payment Mode: <strong>{paymentMethod}</strong></div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Ref / UTR: {utrNo}</div>
              </div>
            </div>

            {/* Fee Items Table */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em', color: '#475569' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>#</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Fee Description</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>{item.name || item.title || feeType}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                        ₹{(item.amount || amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid #CBD5E1', background: '#F8F9FA' }}>
                    <td colSpan="2" style={{ padding: '14px 16px', fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                      Total Amount Paid
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, fontSize: '1.1rem', color: '#714B67' }}>
                      ₹{amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Verification & Stamp Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', background: '#F8F9FA', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <QrCode size={40} style={{ color: '#475569' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>Digitally Verified Receipt</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Scan QR to verify authentic bank settlement</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: '#64748B' }}>Computer Generated Receipt</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#714B67', marginTop: '2px' }}>PaperBuddy Fee System</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

