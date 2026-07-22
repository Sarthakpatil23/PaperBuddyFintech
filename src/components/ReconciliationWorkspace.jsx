import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Check, 
  XCircle, 
  Building2, 
  Coins 
} from 'lucide-react';

export default function ReconciliationWorkspace({ 
  queue, 
  onReconcileEntry, 
  onFlagBounce 
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  // Summary Metrics
  const pendingAmount = queue
    .filter((q) => q.status === 'pending')
    .reduce((sum, q) => sum + q.amount, 0);

  const flaggedCount = queue.filter((q) => q.status === 'flagged').length;

  const toggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkReconcile = () => {
    if (selectedIds.length === 0) return;
    onReconcileEntry(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="dashboard-section-card" id="reconciliation">
      <div className="section-card-header">
        <div className="section-card-title">
          <BarChart3 size={22} style={{ color: 'var(--accent-blue-text)' }} />
          <div>
            <h2>Bank Deposit & Offline Reconciliation Workspace</h2>
            <p>Verify counter cash slips & track cheque clearing with bank statements</p>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <button className="action-btn-primary" onClick={handleBulkReconcile}>
            <CheckCircle2 size={15} />
            <span>Mark {selectedIds.length} as Bank Reconciled</span>
          </button>
        )}
      </div>

      {/* Summary Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-color)', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Unreconciled Cash/Cheques</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{(pendingAmount).toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div style={{ background: '#FFF1F2', border: '1px solid #FFE4E6', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFE4E6', color: '#9F1239', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#9F1239', textTransform: 'uppercase', fontWeight: 600 }}>Flagged Discrepancies</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9F1239' }}>{flaggedCount} Entries</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>Select</th>
              <th>Entry Date</th>
              <th>Student Name</th>
              <th>Amount</th>
              <th>Method & Cheque #</th>
              <th>Recorded Staff</th>
              <th>Bank Deposit Status</th>
              <th style={{ textAlign: 'right' }}>Reconcile Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  All offline entries are 100% reconciled with bank deposits.
                </td>
              </tr>
            ) : (
              queue.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelectRow(item.id)}
                      disabled={item.status === 'reconciled'}
                    />
                  </td>

                  <td style={{ fontSize: '0.82rem' }}>{item.dateTime}</td>

                  <td style={{ fontWeight: 600 }}>{item.studentName}</td>

                  <td style={{ fontWeight: 700 }}>₹{(item.amount).toLocaleString('en-IN')}</td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.paymentMethod}</div>
                    {item.chequeNo && (
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {item.chequeNo} ({item.bankName})
                      </div>
                    )}
                  </td>

                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {item.recordedBy}
                  </td>

                  <td>
                    <span className={`badge-status ${item.status === 'reconciled' ? 'reconciled' : item.status === 'flagged' ? 'bounced' : 'pending'}`}>
                      {item.clearingStatus}
                    </span>
                  </td>

                  <td>
                    <div className="row-actions-group" style={{ justifyContent: 'flex-end' }}>
                      {item.status !== 'reconciled' && (
                        <button 
                          className="action-btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                          onClick={() => onReconcileEntry([item.id])}
                        >
                          <Check size={14} style={{ color: 'var(--accent-blue-text)' }} />
                          Confirm Match
                        </button>
                      )}

                      {item.paymentMethod === 'Cheque' && item.status !== 'flagged' && (
                        <button 
                          className="action-btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#9F1239', borderColor: '#FFE4E6', background: '#FFF1F2' }}
                          onClick={() => onFlagBounce(item)}
                          title="Flag Bounced Cheque (Re-opens Student Balance)"
                        >
                          <RotateCcw size={13} />
                          Flag Bounced
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
