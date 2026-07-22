import React, { useState } from 'react';
import { CreditCard, Send, Gavel, Check } from 'lucide-react';

export default function QuickActionsModal({ 
  mode, 
  student, 
  onClose, 
  onSubmitPayment, 
  onSendReminder, 
  onBulkPenalty 
}) {
  const [amount, setAmount] = useState(student?.balanceDue || '');
  const [method, setMethod] = useState('Cash');
  const [feeType, setFeeType] = useState('Tuition Fee (Q2)');
  const [chequeNo, setChequeNo] = useState('');
  const [bankName, setBankName] = useState('');

  const [reminderNote, setReminderNote] = useState('Dear Parent, your school fee balance is due. Please settle via UPI or counter.');
  const [penaltyAmount, setPenaltyAmount] = useState('500');

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (mode === 'recordPayment') {
      onSubmitPayment({
        studentId: student?.id || 'STU-101',
        studentName: student?.name || 'Aarav Sharma',
        classGrade: student?.classGrade || 'Grade 10-A',
        amount: parseFloat(amount),
        paymentMethod: method,
        feeType,
        chequeNo: method === 'Cheque' ? chequeNo : null,
        bankName: method === 'Cheque' ? bankName : null,
      });
    } else if (mode === 'reminder') {
      onSendReminder(student, reminderNote);
    } else if (mode === 'bulkPenalty') {
      onBulkPenalty(penaltyAmount);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {mode === 'recordPayment' && 'Record Counter Cash/Cheque Payment'}
            {mode === 'reminder' && `Send Fee Payment Reminder (${student?.studentName || student?.name || 'Defaulter'})`}
            {mode === 'bulkPenalty' && 'Apply Bulk Late Fee Penalty Policy'}
          </h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleFormSubmit}>
          {mode === 'recordPayment' && (
            <>
              <div className="form-group">
                <label className="form-label">Student</label>
                <input type="text" className="form-input" value={`${student?.name || 'Aarav Sharma'} (${student?.classGrade || 'Grade 10-A'})`} disabled />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="select-filter" value={method} onChange={(e) => setMethod(e.target.value)} style={{ width: '100%', height: '48px' }}>
                    <option value="Cash">Counter Cash</option>
                    <option value="Cheque">Cheque Deposit</option>
                    <option value="UPI">Zero-Fee UPI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              {method === 'Cheque' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Cheque Number</label>
                    <input type="text" className="form-input" placeholder="e.g. CHQ-991022" value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bank Name</label>
                    <input type="text" className="form-input" placeholder="e.g. HDFC Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
                  </div>
                </div>
              )}
            </>
          )}

          {mode === 'reminder' && (
            <div className="form-group">
              <label className="form-label">Custom Reminder Message (Email / SMS)</label>
              <textarea 
                className="form-input" 
                rows={4} 
                style={{ height: '100px', padding: '12px' }}
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
              />
            </div>
          )}

          {mode === 'bulkPenalty' && (
            <div className="form-group">
              <label className="form-label">Penalty Amount to Auto-Apply (₹)</label>
              <input 
                type="number" 
                className="form-input" 
                value={penaltyAmount} 
                onChange={(e) => setPenaltyAmount(e.target.value)} 
                required
              />
            </div>
          )}

          <button type="submit" className="btn-submit-primary" style={{ marginTop: '16px' }}>
            <Check size={18} />
            <span>Confirm & Execute Action</span>
          </button>
        </form>
      </div>
    </div>
  );
}
