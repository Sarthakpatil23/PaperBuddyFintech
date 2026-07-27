import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Check, 
  XCircle, 
  Building2, 
  Coins,
  Download,
  Filter,
  Layers,
  Calendar,
  User,
  CreditCard,
  Search,
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight,
  X
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function ReconciliationWorkspace({ 
  queue, 
  onReconcileEntry, 
  onFlagBounce,
  onResolveFlag,
  onJumpToStudentLedger
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'flagged' | 'reconciled'
  const [selectedIds, setSelectedIds] = useState([]);
  const [methodFilter, setMethodFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [bankRefNo, setBankRefNo] = useState('');
  
  // Flag Discrepancy Modal
  const [flagModalEntry, setFlagModalEntry] = useState(null);
  const [flagReason, setFlagReason] = useState('Cheque Bounced');
  const [bankAmountInput, setBankAmountInput] = useState('');
  const [flagNote, setFlagNote] = useState('');

  // Flag Resolution Modal
  const [resolveModalEntry, setResolveModalEntry] = useState(null);
  const [resolutionType, setResolutionType] = useState('bounced'); // 'bounced' | 'adjust_amount' | 'corrected'
  const [resolutionNote, setResolutionNote] = useState('');

  // Tab Item Filtered Queues
  const safeQueue = useMemo(() => Array.isArray(queue) ? queue : [], [queue]);

  const pendingEntries = useMemo(() => {
    return safeQueue.filter((q) => (q.status === 'PENDING' || q.status === 'pending') && (
      methodFilter === 'all' || q.paymentMethod === methodFilter || q.method === methodFilter
    ) && (
      (q.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.chequeNo && q.chequeNo.toLowerCase().includes(searchQuery.toLowerCase()))
    ));
  }, [safeQueue, methodFilter, searchQuery]);

  const flaggedEntries = useMemo(() => {
    return safeQueue.filter((q) => (q.status === 'FLAGGED' || q.status === 'flagged') && (
      (q.studentName || '').toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [safeQueue, searchQuery]);

  const reconciledEntries = useMemo(() => {
    return safeQueue.filter((q) => (q.status === 'RECONCILED' || q.status === 'reconciled') && (
      (q.studentName || '').toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [safeQueue, searchQuery]);

  // Summary Metrics
  const pendingAmount = safeQueue
    .filter((q) => q.status === 'PENDING' || q.status === 'pending')
    .reduce((sum, q) => sum + (q.amount || 0), 0);

  const flaggedCount = safeQueue.filter((q) => q.status === 'FLAGGED' || q.status === 'flagged').length;
  const reconciledCount = safeQueue.filter((q) => q.status === 'RECONCILED' || q.status === 'reconciled').length;
  const totalOfflineCount = safeQueue.length;
  const reconciledPct = totalOfflineCount > 0 ? Math.round((reconciledCount / totalOfflineCount) * 100) : 100;

  // Checkbox handlers
  const toggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAllPending = () => {
    if (selectedIds.length === pendingEntries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingEntries.map((p) => p.id));
    }
  };

  // Confirm Reconcile Execution
  const executeReconcile = () => {
    if (selectedIds.length === 0) return;
    onReconcileEntry(selectedIds, bankRefNo);
    setSelectedIds([]);
    setBankRefNo('');
    setShowReconcileModal(false);
  };

  // Confirm Flag Discrepancy Submission
  const submitFlagDiscrepancy = () => {
    if (!flagModalEntry) return;
    onFlagBounce({
      ...flagModalEntry,
      flagDetails: {
        reason: flagReason,
        bankAmount: bankAmountInput ? Number(bankAmountInput) : 0,
        note: flagNote,
        flaggedDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
      }
    });
    setFlagModalEntry(null);
    setFlagNote('');
    setBankAmountInput('');
  };

  // Confirm Resolve Submission
  const submitResolution = () => {
    if (!resolveModalEntry) return;
    if (onResolveFlag) {
      onResolveFlag(resolveModalEntry.id, resolutionType, resolutionNote);
    }
    setResolveModalEntry(null);
    setResolutionNote('');
  };

  // Export Reconciliation Report CSV
  const exportReport = () => {
    const headers = 'Reconciliation ID,Txn ID,Date,Student Name,Grade,Method,Cheque No,Bank Name,Amount,Status,Recorded By\n';
    const rows = queue.map((q) => 
      `"${q.id}","${q.txnId}","${q.dateTime}","${q.studentName}","${q.classGrade || ''}","${q.paymentMethod}","${q.chequeNo || ''}","${q.bankName || ''}",${q.amount},"${q.status}","${q.recordedBy}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reconciliation_Report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="dashboard-section-card" id="reconciliation">
      {/* Header */}
      <div className="section-card-header">
        <div className="section-card-title">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-blue-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-blue-text)',
            flexShrink: 0
          }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <h2>Reconciliation</h2>
            <p>Match recorded cash & cheque entries against bank confirmation</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="action-btn-secondary" onClick={exportReport}>
            <Download size={15} />
            <span>Export Reconciliation Report</span>
          </button>

          {selectedIds.length > 0 && activeTab === 'pending' && (
            <button className="action-btn-primary" onClick={() => setShowReconcileModal(true)}>
              <CheckCircle2 size={15} />
              <span>Bulk Reconcile ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Strip (Key Metrics Bar) */}
      <div className="financial-kpi-ribbon" style={{ marginBottom: '20px' }}>
        <div className="kpi-pill-card">
          <div className="kpi-icon-box blue">
            <Coins size={20} />
          </div>
          <div className="kpi-meta-content">
            <span className="kpi-label-text">Unreconciled Offline Amount</span>
            <span className="kpi-value-text">₹{(pendingAmount).toLocaleString('en-IN')}</span>
            <span className="kpi-subtext" style={{ color: 'var(--accent-blue-text)' }}>
              {pendingEntries.length} pending entries
            </span>
          </div>
        </div>

        <div className="kpi-pill-card">
          <div className="kpi-icon-box amber">
            <Clock size={20} />
          </div>
          <div className="kpi-meta-content">
            <span className="kpi-label-text">Pending Reconciliation</span>
            <span className="kpi-value-text">{queue.filter((q) => q.status === 'pending').length} Items</span>
            <span className="kpi-subtext" style={{ color: '#D97706' }}>
              Awaiting bank clearance
            </span>
          </div>
        </div>

        <div className="kpi-pill-card" style={{ borderColor: flaggedCount > 0 ? 'var(--status-danger-bg)' : 'var(--border-color)' }}>
          <div className="kpi-icon-box" style={{ background: '#FFE4E6', color: '#9F1239' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="kpi-meta-content">
            <span className="kpi-label-text">Flagged Discrepancies</span>
            <span className="kpi-value-text" style={{ color: '#9F1239' }}>{flaggedCount} Entries</span>
            <span className="kpi-subtext" style={{ color: '#9F1239' }}>
              Requires admin resolution
            </span>
          </div>
        </div>

        <div className="kpi-pill-card">
          <div className="kpi-icon-box purple">
            <CheckCircle2 size={20} />
          </div>
          <div className="kpi-meta-content">
            <span className="kpi-label-text">Reconciled Progress</span>
            <span className="kpi-value-text">{reconciledPct}% Done</span>
            {/* Completion Progress Bar */}
            <div className="bar-track" style={{ height: '6px', marginTop: '4px' }}>
              <div className="bar-fill-purple" style={{ width: `${reconciledPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '16px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px'
      }}>
        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`granularity-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
            style={{ padding: '6px 16px', fontSize: '0.84rem' }}
          >
            Pending ({queue.filter((q) => q.status === 'pending').length})
          </button>

          <button 
            className={`granularity-btn ${activeTab === 'flagged' ? 'active' : ''}`}
            onClick={() => setActiveTab('flagged')}
            style={{ 
              padding: '6px 16px', 
              fontSize: '0.84rem',
              background: activeTab === 'flagged' ? '#9F1239' : 'transparent',
              color: activeTab === 'flagged' ? 'white' : 'inherit'
            }}
          >
            Flagged ({flaggedCount})
          </button>

          <button 
            className={`granularity-btn ${activeTab === 'reconciled' ? 'active' : ''}`}
            onClick={() => setActiveTab('reconciled')}
            style={{ padding: '6px 16px', fontSize: '0.84rem' }}
          >
            Reconciled ({reconciledCount})
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="global-search-box" style={{ width: '220px' }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search student or cheque #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
            <Search size={15} className="search-icon" />
          </div>

          {activeTab === 'pending' && (
            <select 
              className="select-filter"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              style={{ height: '36px', fontSize: '0.82rem', borderRadius: 'var(--radius-md)', padding: '0 10px', background: 'var(--surface-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            >
              <option value="all">All Payment Methods</option>
              <option value="Cash">Cash Only</option>
              <option value="Cheque">Cheque Only</option>
            </select>
          )}
        </div>
      </div>

      {/* TAB 1: PENDING WORKSPACE */}
      {activeTab === 'pending' && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '38px', textAlign: 'center' }}>
                  <input 
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === pendingEntries.length}
                    onChange={toggleSelectAllPending}
                  />
                </th>
                <th>Entry Date</th>
                <th>Student Name</th>
                <th>Amount</th>
                <th>Method & Cheque Details</th>
                <th>Recorded By</th>
                <th>Days Pending</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={36} style={{ color: 'var(--accent-blue-text)' }} />
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>All caught up! No entries awaiting reconciliation.</div>
                      <div style={{ fontSize: '0.8rem' }}>Every offline cash and cheque deposit has been verified.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingEntries.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isHighPending = (item.daysPending || 1) > 3;

                  return (
                    <tr key={item.id} style={{ background: isSelected ? 'var(--odoo-purple-light)' : 'transparent' }}>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(item.id)}
                        />
                      </td>

                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {item.dateTime}
                      </td>

                      <td>
                        <div 
                          style={{ fontWeight: 600, color: 'var(--odoo-purple)', cursor: 'pointer' }}
                          onClick={() => { if (onJumpToStudentLedger) onJumpToStudentLedger(item.studentId); }}
                        >
                          {item.studentName}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{item.classGrade}</div>
                      </td>

                      <td style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        ₹{(item.amount).toLocaleString('en-IN')}
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{item.paymentMethod}</div>
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
                        <span 
                          className={`badge ${isHighPending ? 'badge-bounced' : 'badge-pending'}`} 
                          style={{ fontSize: '0.76rem' }}
                        >
                          {item.daysPending || 1} day{(item.daysPending || 1) > 1 ? 's' : ''} pending
                        </span>
                      </td>

                      <td>
                        <div className="row-actions-group" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                          <button 
                            className="action-btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            onClick={() => {
                              setSelectedIds([item.id]);
                              setShowReconcileModal(true);
                            }}
                          >
                            <Check size={14} style={{ color: 'var(--accent-blue-text)' }} />
                            Mark Reconciled
                          </button>

                          <button 
                            className="action-btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.78rem', color: '#9F1239', borderColor: '#FFE4E6', background: '#FFF1F2' }}
                            onClick={() => setFlagModalEntry(item)}
                            title="Flag discrepancy or bounced cheque"
                          >
                            <AlertTriangle size={13} />
                            Flag Discrepancy
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: FLAGGED DISCREPANCIES WORKSPACE */}
      {activeTab === 'flagged' && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Recorded Amount</th>
                <th>Bank Actual</th>
                <th>Flag Reason & Notes</th>
                <th>Flagged By & Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flaggedEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={36} style={{ color: 'var(--accent-blue-text)' }} />
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>No discrepancies flagged!</div>
                      <div style={{ fontSize: '0.8rem' }}>There are no active cheque bounces or amount mismatches.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                flaggedEntries.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--odoo-purple)' }}>{item.studentName}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{item.classGrade}</div>
                    </td>

                    <td style={{ fontWeight: 700 }}>₹{(item.amount).toLocaleString('en-IN')}</td>

                    <td>
                      {item.flagDetails?.bankAmount ? (
                        <span style={{ fontWeight: 700, color: '#9F1239' }}>
                          ₹{(item.flagDetails.bankAmount).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>₹0 (Bounced)</span>
                      )}
                    </td>

                    <td>
                      <span className="badge badge-bounced" style={{ fontSize: '0.76rem', marginBottom: '4px' }}>
                        {item.flagDetails?.reason || 'Cheque Bounced'}
                      </span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {item.flagDetails?.note || 'Bounced cheque dishonour memo received'}
                      </div>
                    </td>

                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <div>{item.flagDetails?.flaggedBy || item.recordedBy}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.flagDetails?.flaggedDate || item.dateTime}</div>
                    </td>

                    <td>
                      <div style={{ textAlign: 'right' }}>
                        <button 
                          className="action-btn-primary"
                          style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                          onClick={() => setResolveModalEntry(item)}
                        >
                          Resolve Discrepancy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: RECONCILED HISTORY AUDIT LOG */}
      {activeTab === 'reconciled' && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Entry Date</th>
                <th>Reconciled Date</th>
                <th>Reconciled By</th>
                <th>Bank Reference #</th>
              </tr>
            </thead>
            <tbody>
              {reconciledEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No reconciled entries recorded yet.
                  </td>
                </tr>
              ) : (
                reconciledEntries.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.studentName}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{item.classGrade}</div>
                    </td>

                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      ₹{(item.amount).toLocaleString('en-IN')}
                    </td>

                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '0.78rem' }}>
                        {item.paymentMethod}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.dateTime}</td>

                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {item.reconciledDetails?.reconciledAt || '2026-07-20 10:15'}
                    </td>

                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {item.reconciledDetails?.reconciledBy || item.recordedBy}
                    </td>

                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.82rem', color: 'var(--accent-blue-text)' }}>
                        {item.reconciledDetails?.bankRef || 'STMT-2026-JUL-042'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SINGLE / BULK RECONCILE MODAL */}
      {showReconcileModal && (
        <div className="modal-overlay" onClick={() => setShowReconcileModal(false)}>
          <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={22} style={{ color: 'var(--accent-blue-text)' }} />
                <h3 style={{ margin: 0 }}>Confirm Bank Reconciliation</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowReconcileModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--accent-blue-light)', padding: '14px', borderRadius: 'var(--radius-md)', color: 'var(--accent-blue-text)', fontSize: '0.84rem' }}>
                Reconciling <strong>{selectedIds.length} entry(s)</strong> with total value of <strong>₹{(queue.filter(q => selectedIds.includes(q.id)).reduce((s, q) => s + q.amount, 0)).toLocaleString('en-IN')}</strong>.
              </div>

              <div>
                <label className="form-label">Bank Statement Batch Reference # (Optional)</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. STMT-2026-JUL-045 or SBI-DESK-981"
                  value={bankRefNo}
                  onChange={(e) => setBankRefNo(e.target.value)}
                />
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Attaching a statement reference links these entries in the audit trail.
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="action-btn-secondary" onClick={() => setShowReconcileModal(false)}>
                Cancel
              </button>
              <button className="action-btn-primary" onClick={executeReconcile}>
                Confirm & Reconcile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLAG DISCREPANCY MODAL */}
      {flagModalEntry && (
        <div className="modal-overlay" onClick={() => setFlagModalEntry(null)}>
          <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={22} style={{ color: '#9F1239' }} />
                <h3 style={{ margin: 0 }}>Flag Discrepancy for {flagModalEntry.studentName}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setFlagModalEntry(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {flagReason === 'Cheque Bounced' && (
                <div style={{ background: '#FFE4E6', border: '1px solid #FECDD3', padding: '12px', borderRadius: 'var(--radius-md)', color: '#9F1239', fontSize: '0.82rem' }}>
                  <strong>Financial Warning:</strong> Flagging a bounced cheque will automatically re-open the student's balance for <strong>₹{(flagModalEntry.amount).toLocaleString('en-IN')}</strong> in the Student Ledger and Defaulter tracking list.
                </div>
              )}

              <div>
                <label className="form-label">Discrepancy Reason</label>
                <select 
                  className="form-input"
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                >
                  <option value="Cheque Bounced">Cheque Bounced / Dishonoured</option>
                  <option value="Amount Mismatch">Amount Mismatch with Bank Statement</option>
                  <option value="Duplicate Entry">Duplicate Entry Recorded</option>
                  <option value="Other">Other Discrepancy</option>
                </select>
              </div>

              {flagReason === 'Amount Mismatch' && (
                <div>
                  <label className="form-label">Actual Amount Confirmed by Bank (₹)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    placeholder={`Recorded: ₹${flagModalEntry.amount}`}
                    value={bankAmountInput}
                    onChange={(e) => setBankAmountInput(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="form-label">Mandatory Audit Note</label>
                <textarea 
                  className="form-input"
                  rows={3}
                  placeholder="Enter details from bank statement or dishonour memo..."
                  value={flagNote}
                  onChange={(e) => setFlagNote(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="action-btn-secondary" onClick={() => setFlagModalEntry(null)}>
                Cancel
              </button>
              <button 
                className="action-btn-primary"
                style={{ background: '#9F1239', borderColor: '#9F1239' }}
                disabled={!flagNote.trim()}
                onClick={submitFlagDiscrepancy}
              >
                Submit & Flag Discrepancy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESOLVE DISCREPANCY MODAL */}
      {resolveModalEntry && (
        <div className="modal-overlay" onClick={() => setResolveModalEntry(null)}>
          <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={22} style={{ color: 'var(--odoo-purple)' }} />
                <h3 style={{ margin: 0 }}>Resolve Discrepancy: {resolveModalEntry.studentName}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setResolveModalEntry(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                <div><strong>Original Entry:</strong> ₹{(resolveModalEntry.amount).toLocaleString('en-IN')} ({resolveModalEntry.paymentMethod})</div>
                <div><strong>Flag Reason:</strong> {resolveModalEntry.flagDetails?.reason || 'Cheque Bounced'}</div>
              </div>

              <div>
                <label className="form-label">Resolution Action</label>
                <select 
                  className="form-input"
                  value={resolutionType}
                  onChange={(e) => setResolutionType(e.target.value)}
                >
                  <option value="bounced">Confirm Bounced Cheque (Re-open Student Balance)</option>
                  <option value="adjust_amount">Confirm Bank Amount & Adjust Ledger</option>
                  <option value="corrected">Mark Resolved (Data Entry Error Corrected)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Mandatory Resolution Note</label>
                <textarea 
                  className="form-input"
                  rows={3}
                  placeholder="State the resolution details for audit log..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="action-btn-secondary" onClick={() => setResolveModalEntry(null)}>
                Cancel
              </button>
              <button 
                className="action-btn-primary"
                disabled={!resolutionNote.trim()}
                onClick={submitResolution}
              >
                Save & Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
