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
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed var(--border)', paddingBottom: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Building2 size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--foreground)', margin: 0, letterSpacing: '-0.02em' }}>Finlyt International School</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', margin: '2px 0 0 0' }}>Affiliated to CBSE Board • School Code: PB-89210</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '1px 0 0 0' }}>Campus Road, Knowledge Park II, Tech City • Support: fees@finlyt.edu</p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'var(--status-paid-bg)', color: 'var(--status-paid-text)', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
                  <CheckCircle2 size={13} />
                  <span>PAID RECEIPT</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--foreground)' }}>#{receiptNo}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>Date: {dateTime}</div>
              </div>
            </div>

            {/* Student & Parent Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '16px', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', fontWeight: 700, marginBottom: '4px' }}>Student Details</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)' }}>{studentName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Class: <strong>{classGrade}</strong></div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>Student ID: {student?.id || receipt.studentId || 'STU-101'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', fontWeight: 700, marginBottom: '4px' }}>Parent / Guardian</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)' }}>{parentName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Payment Mode: <strong>{paymentMethod}</strong></div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>Ref / UTR: {utrNo}</div>
              </div>
            </div>

            {/* Fee Items Table */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>#</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Fee Description</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--muted-foreground)' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--foreground)' }}>{item.name || item.title || feeType}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--foreground)' }}>
                        ₹{(item.amount || amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--muted)' }}>
                    <td colSpan="2" style={{ padding: '14px 16px', fontWeight: 800, fontSize: '0.95rem', color: 'var(--foreground)' }}>
                      Total Amount Paid
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                      ₹{amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Verification & Stamp Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <QrCode size={40} style={{ color: 'var(--muted-foreground)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--foreground)' }}>Digitally Verified Receipt</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>Scan QR to verify authentic bank settlement</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--muted-foreground)' }}>Computer Generated Receipt</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>Finlyt Fee System</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

