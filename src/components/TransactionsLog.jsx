import React, { useState, useEffect, useMemo } from 'react';
import { downloadReceiptPDF } from '../utils/pdfReceiptGenerator';
import { 
  Receipt, 
  Search, 
  Download, 
  Eye, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Filter,
  Activity,
  PlusCircle,
  Copy,
  Check,
  RotateCcw,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Layers,
  Building2,
  QrCode,
  Banknote,
  FileText,
  Mail,
  RefreshCw,
  X
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function TransactionsLog({ 
  transactions, 
  onSelectTransaction, 
  activeFeeFilter,
  onRecordPaymentClick,
  onJumpToStudentLedger,
  onRefundTransaction,
  onBulkReconcile
}) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [datePreset, setDatePreset] = useState('all'); // 'all' | 'today' | 'week' | 'month'
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [feeFilter, setFeeFilter] = useState(activeFeeFilter || 'all');
  const [gradeFilter, setGradeFilter] = useState('all');

  // Sorting & Pagination State
  const [sortField, setSortField] = useState('dateTime'); // 'dateTime' | 'amount' | 'studentName'
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection & Modal States
  const [selectedTxnIds, setSelectedTxnIds] = useState([]);
  const [activeDrillDown, setActiveDrillDown] = useState(null);
  const [refundModalTxn, setRefundModalTxn] = useState(null);
  const [refundReason, setRefundReason] = useState('Overcharge Correction');
  const [refundNote, setRefundNote] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Sync prop changes for fee filter
  useEffect(() => {
    if (activeFeeFilter) {
      setFeeFilter(activeFeeFilter);
    }
  }, [activeFeeFilter]);

  // URL Query Sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (methodFilter !== 'all') params.set('method', methodFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (feeFilter !== 'all') params.set('fee', feeFilter);
    if (gradeFilter !== 'all') params.set('grade', gradeFilter);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [searchQuery, methodFilter, statusFilter, feeFilter, gradeFilter]);

  // Filter options
  const methodOptions = [
    { value: 'all', label: 'All Payment Methods' },
    { value: 'UPI', label: 'UPI Rail (Zero-Fee)' },
    { value: 'Cash', label: 'Counter Cash' },
    { value: 'Cheque', label: 'Cheque Deposit' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Paid', label: 'Paid & Cleared' },
    { value: 'Pending', label: 'Pending Clearing' },
    { value: 'Bounced', label: 'Cheque Bounced' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Refunded', label: 'Refunded' }
  ];

  const feeOptions = [
    { value: 'all', label: 'All Fee Categories' },
    { value: 'Tuition Fee (Q2)', label: 'Tuition Fee (Q2)' },
    { value: 'Transport Fee (Q2)', label: 'Transport Fee (Q2)' },
    { value: 'Lab & Custom', label: 'Lab & Custom Fee' },
    { value: 'Late Fee Penalties', label: 'Late Fee Penalties' }
  ];

  const gradeOptions = [
    { value: 'all', label: 'All Grades' },
    { value: 'Grade 12-C', label: 'Grade 12-C' },
    { value: 'Grade 11-A', label: 'Grade 11-A' },
    { value: 'Grade 10-A', label: 'Grade 10-A' },
    { value: 'Grade 10-B', label: 'Grade 10-B' },
    { value: 'Grade 9-B', label: 'Grade 9-B' },
    { value: 'Grade 8-B', label: 'Grade 8-B' },
    { value: 'Grade 7-C', label: 'Grade 7-C' },
    { value: 'Grade 6-A', label: 'Grade 6-A' }
  ];

  const datePresetOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today (Jul 24)' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month (Jul 2026)' }
  ];

  const isAnyFilterActive = 
    searchQuery !== '' || 
    methodFilter !== 'all' || 
    statusFilter !== 'all' || 
    feeFilter !== 'all' || 
    gradeFilter !== 'all' || 
    datePreset !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setMethodFilter('all');
    setStatusFilter('all');
    setFeeFilter('all');
    setGradeFilter('all');
    setDatePreset('all');
    setCurrentPage(1);
  };

  // Copy helper
  const handleCopyReceipt = (text, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter Data Logic
  const filteredTxns = useMemo(() => {
    const safeTxns = Array.isArray(transactions) ? transactions : [];
    return safeTxns.filter((txn) => {
      const matchesSearch = 
        (txn.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.studentId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.receiptNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.id || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMethod = methodFilter === 'all' || txn.paymentMethod === methodFilter;
      const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
      const matchesFee = feeFilter === 'all' || (txn.feeType || '').includes(feeFilter);
      const matchesGrade = gradeFilter === 'all' || txn.classGrade === gradeFilter;

      return matchesSearch && matchesMethod && matchesStatus && matchesFee && matchesGrade;
    });
  }, [transactions, searchQuery, methodFilter, statusFilter, feeFilter, gradeFilter]);

  // Sort Data Logic
  const sortedTxns = useMemo(() => {
    return [...filteredTxns].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTxns, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedTxns.length / pageSize) || 1;
  const paginatedTxns = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTxns.slice(start, start + pageSize);
  }, [sortedTxns, currentPage, pageSize]);

  // Summary Strip Counts
  const totalAmount = filteredTxns.reduce((sum, t) => sum + (t.status !== 'Failed' ? t.amount : 0), 0);
  const paidCount = filteredTxns.filter((t) => t.status === 'Paid').length;
  const pendingCount = filteredTxns.filter((t) => t.status === 'Pending').length;
  const failedCount = filteredTxns.filter((t) => t.status === 'Failed').length;
  const bouncedCount = filteredTxns.filter((t) => t.status === 'Bounced').length;
  const refundedCount = filteredTxns.filter((t) => t.status === 'Refunded').length;

  // Selection Checkbox Handlers
  const toggleSelectAll = () => {
    if (selectedTxnIds.length === paginatedTxns.length) {
      setSelectedTxnIds([]);
    } else {
      setSelectedTxnIds(paginatedTxns.map((t) => t.id));
    }
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    if (selectedTxnIds.includes(id)) {
      setSelectedTxnIds(selectedTxnIds.filter((i) => i !== id));
    } else {
      setSelectedTxnIds([...selectedTxnIds, id]);
    }
  };

  // Export CSV
  const handleExportCSV = (selectedOnly = false) => {
    const targetData = selectedOnly 
      ? transactions.filter((t) => selectedTxnIds.includes(t.id))
      : filteredTxns;

    const headers = 'Transaction ID,Receipt No,Date Time,Student ID,Student Name,Grade,Fee Type,Amount,Payment Method,Status,Processed By,Reconciled\n';
    const rows = targetData.map((t) => 
      `"${t.id}","${t.receiptNo}","${t.dateTime}","${t.studentId}","${t.studentName}","${t.classGrade}","${t.feeType}",${t.amount},"${t.paymentMethod}","${t.status}","${t.processedBy}",${t.reconciled}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PaperBuddy_Transactions_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const submitRefund = () => {
    if (!refundModalTxn) return;
    if (onRefundTransaction) {
      onRefundTransaction(refundModalTxn.id, refundReason, refundNote);
    }
    setRefundModalTxn(null);
    setRefundNote('');
    setActiveDrillDown(null);
  };

  return (
    <div className="dashboard-section-card" id="transactions">
      {/* Page Header */}
      <div className="section-card-header">
        <div className="section-card-title">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--odoo-purple-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--odoo-purple)',
            flexShrink: 0
          }}>
            <Receipt size={22} />
          </div>
          <div>
            <h2>Transactions Log</h2>
            <p>Search, filter, and export every payment recorded in the system</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="action-btn-secondary" onClick={() => handleExportCSV(false)}>
            <Download size={15} />
            <span>Export Filtered CSV</span>
          </button>

          <button className="action-btn-primary" onClick={onRecordPaymentClick}>
            <PlusCircle size={15} />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Strip (Inline Stat Row) */}
      <div className="summary-strip-row" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 16px',
        background: 'var(--bg-canvas)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Filtered Volume</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ₹{(totalAmount).toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }} />

          <div>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Entries</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {filteredTxns.length} Transactions
            </div>
          </div>
        </div>

        {/* Status Count Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-paid" style={{ fontSize: '0.76rem' }}>
            <CheckCircle2 size={12} /> {paidCount} Paid
          </span>
          <span className="badge badge-pending" style={{ fontSize: '0.76rem' }}>
            <Activity size={12} /> {pendingCount} Pending
          </span>
          {bouncedCount > 0 && (
            <span className="badge badge-bounced" style={{ fontSize: '0.76rem' }}>
              <AlertTriangle size={12} /> {bouncedCount} Bounced
            </span>
          )}
          {failedCount > 0 && (
            <span className="badge badge-overdue" style={{ fontSize: '0.76rem' }}>
              <XCircle size={12} /> {failedCount} Failed
            </span>
          )}
          {refundedCount > 0 && (
            <span className="badge badge-neutral" style={{ fontSize: '0.76rem' }}>
              <RotateCcw size={12} /> {refundedCount} Refunded
            </span>
          )}
        </div>
      </div>

      {/* Toolbar & Filters Bar */}
      <div className="filter-bar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {/* Search Box */}
        <div className="global-search-box" style={{ flex: 1, minWidth: '240px' }}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search student, receipt #, or transaction ID..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{ width: '100%' }}
          />
          <Search size={16} className="search-icon" />
        </div>

        {/* Filters */}
        <CustomSelect 
          options={datePresetOptions}
          value={datePreset}
          onChange={(v) => { setDatePreset(v); setCurrentPage(1); }}
          icon={Calendar}
        />

        <CustomSelect 
          options={methodOptions}
          value={methodFilter}
          onChange={(v) => { setMethodFilter(v); setCurrentPage(1); }}
          icon={CreditCard}
        />

        <CustomSelect 
          options={statusOptions}
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
          icon={Activity}
        />

        <CustomSelect 
          options={feeOptions}
          value={feeFilter}
          onChange={(v) => { setFeeFilter(v); setCurrentPage(1); }}
          icon={Layers}
        />

        <CustomSelect 
          options={gradeOptions}
          value={gradeFilter}
          onChange={(v) => { setGradeFilter(v); setCurrentPage(1); }}
          icon={User}
        />

        {isAnyFilterActive && (
          <button 
            className="action-btn-secondary" 
            onClick={clearAllFilters}
            style={{ color: 'var(--status-danger-text)', borderColor: 'var(--status-danger-bg)', fontSize: '0.8rem' }}
          >
            <X size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedTxnIds.length > 0 && (
        <div style={{
          background: 'var(--text-main)',
          color: 'var(--surface-card)',
          padding: '10px 18px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>
            {selectedTxnIds.length} transactions selected
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="action-btn-secondary"
              onClick={() => handleExportCSV(true)}
              style={{ padding: '4px 10px', fontSize: '0.78rem', background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'transparent' }}
            >
              <Download size={14} />
              Export Selected
            </button>

            <button 
              className="action-btn-secondary"
              onClick={() => alert(`Sent digital receipt email to parents for ${selectedTxnIds.length} students!`)}
              style={{ padding: '4px 10px', fontSize: '0.78rem', background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'transparent' }}
            >
              <Mail size={14} />
              Send Email Receipts
            </button>

            <button 
              className="action-btn-secondary"
              onClick={() => setSelectedTxnIds([])}
              style={{ padding: '4px 10px', fontSize: '0.78rem', background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '38px', textAlign: 'center' }}>
                <input 
                  type="checkbox"
                  checked={selectedTxnIds.length > 0 && selectedTxnIds.length === paginatedTxns.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSortToggle('dateTime')}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>Date & Time</span>
                  <ArrowUpDown size={12} style={{ opacity: sortField === 'dateTime' ? 1 : 0.4 }} />
                </div>
              </th>
              <th>Receipt # / ID</th>
              <th 
                style={{ cursor: 'pointer' }}
                onClick={() => handleSortToggle('studentName')}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>Student Details</span>
                  <ArrowUpDown size={12} style={{ opacity: sortField === 'studentName' ? 1 : 0.4 }} />
                </div>
              </th>
              <th>Fee Category</th>
              <th 
                style={{ textAlign: 'right', cursor: 'pointer' }}
                onClick={() => handleSortToggle('amount')}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                  <span>Amount</span>
                  <ArrowUpDown size={12} style={{ opacity: sortField === 'amount' ? 1 : 0.4 }} />
                </div>
              </th>
              <th>Method</th>
              <th>Status</th>
              <th>Processed By</th>
              <th>Reconciliation</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTxns.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <Receipt size={36} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>No transactions found</div>
                    <div style={{ fontSize: '0.82rem' }}>Try clearing filters or searching for a different keyword.</div>
                    {isAnyFilterActive && (
                      <button className="action-btn-secondary" onClick={clearAllFilters} style={{ marginTop: '8px' }}>
                        Clear Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTxns.map((txn) => {
                const isSelected = selectedTxnIds.includes(txn.id);

                return (
                  <tr 
                    key={txn.id}
                    style={{ cursor: 'pointer', background: isSelected ? 'var(--odoo-purple-light)' : 'transparent' }}
                    onClick={() => setActiveDrillDown(txn)}
                  >
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectRow(txn.id, e)}
                      />
                    </td>

                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {txn.dateTime}
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-main)' }}>
                          {txn.receiptNo}
                        </span>
                        <button 
                          className="icon-btn-action" 
                          style={{ padding: '2px', border: 'none' }}
                          title="Copy Receipt #"
                          onClick={(e) => handleCopyReceipt(txn.receiptNo, e)}
                        >
                          {copiedId === txn.receiptNo ? <Check size={12} style={{ color: 'var(--accent-blue-text)' }} /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{txn.id}</div>
                    </td>

                    <td>
                      <div 
                        style={{ fontWeight: 600, color: 'var(--odoo-purple)', cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onJumpToStudentLedger) onJumpToStudentLedger(txn.studentId);
                        }}
                        title="Jump to Student Ledger"
                      >
                        {txn.studentName}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{txn.classGrade}</div>
                    </td>

                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '0.78rem' }}>
                        {txn.feeType}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      ₹{(txn.amount).toLocaleString('en-IN')}
                    </td>

                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                        {txn.paymentMethod === 'UPI' && <QrCode size={14} style={{ color: 'var(--odoo-purple)' }} />}
                        {txn.paymentMethod === 'Cash' && <Banknote size={14} style={{ color: 'var(--accent-blue-text)' }} />}
                        {txn.paymentMethod === 'Cheque' && <FileText size={14} style={{ color: '#D97706' }} />}
                        {txn.paymentMethod}
                      </span>
                    </td>

                    <td>
                      <span className={`badge-status ${txn.status.toLowerCase()}`}>
                        {txn.status === 'Paid' && <CheckCircle2 size={12} />}
                        {txn.status === 'Pending' && <Activity size={12} />}
                        {txn.status === 'Bounced' && <AlertTriangle size={12} />}
                        {txn.status === 'Failed' && <XCircle size={12} />}
                        {txn.status === 'Refunded' && <RotateCcw size={12} />}
                        {txn.status}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {txn.processedBy}
                    </td>

                    <td>
                      {txn.paymentMethod === 'UPI' ? (
                        <span className="badge badge-paid" style={{ fontSize: '0.72rem' }}>
                          Auto UPI
                        </span>
                      ) : txn.reconciled ? (
                        <span className="badge badge-paid" style={{ fontSize: '0.72rem' }}>
                          Reconciled
                        </span>
                      ) : (
                        <span className="badge badge-pending" style={{ fontSize: '0.72rem' }}>
                          Unreconciled
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ textAlign: 'right' }}>
                        <button 
                          className="icon-btn-action"
                          title="View Full Transaction Receipt & Audit Details"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDrillDown(txn);
                          }}
                        >
                          <Eye size={14} />
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

      {/* Pagination Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        <div>
          Showing {sortedTxns.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedTxns.length)} of {sortedTxns.length} transactions
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Rows per page:</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-card)',
                color: 'var(--text-main)',
                fontWeight: 600
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button 
              className="action-btn-secondary"
              style={{ padding: '4px 8px' }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontWeight: 700, padding: '0 6px', color: 'var(--text-main)' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="action-btn-secondary"
              style={{ padding: '4px 8px' }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Row Drill-Down Detail Modal */}
      {activeDrillDown && (
        <div className="modal-overlay" onClick={() => setActiveDrillDown(null)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Receipt size={24} style={{ color: 'var(--odoo-purple)' }} />
                <div>
                  <h3 style={{ margin: 0 }}>Receipt #{activeDrillDown.receiptNo}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Transaction Ref: {activeDrillDown.id}
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveDrillDown(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Student Header Summary */}
              <div style={{
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>STUDENT ACCOUNT</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{activeDrillDown.studentName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {activeDrillDown.classGrade} ({activeDrillDown.studentId})
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>AMOUNT PAID</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--odoo-purple)' }}>
                    ₹{(activeDrillDown.amount).toLocaleString('en-IN')}
                  </div>
                  <span className={`badge-status ${activeDrillDown.status.toLowerCase()}`}>
                    {activeDrillDown.status}
                  </span>
                </div>
              </div>

              {/* Itemized Line Items Table */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem' }}>Itemized Fee Breakdown</h4>
                <div className="data-table-wrapper" style={{ maxHeight: '160px' }}>
                  <table className="data-table" style={{ fontSize: '0.82rem' }}>
                    <thead>
                      <tr>
                        <th>Fee Component</th>
                        <th style={{ textAlign: 'right' }}>Billed Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeDrillDown.items || [{ name: activeDrillDown.feeType, amount: activeDrillDown.amount }]).map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{(item.amount).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Technical Method Details */}
              <div style={{
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontSize: '0.83rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>
                  Payment Technical Specifications ({activeDrillDown.paymentMethod})
                </div>

                {activeDrillDown.paymentMethod === 'UPI' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>UTR Reference #:</span>
                      <strong style={{ fontFamily: 'monospace' }}>{activeDrillDown.utrNo || 'UTR9821039401'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Payer VPA:</span>
                      <strong>{activeDrillDown.payerVPA || 'parent@upi'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Gateway Provider:</span>
                      <strong>{activeDrillDown.gateway || 'Razorpay UPI Webhook'}</strong>
                    </div>
                  </>
                )}

                {activeDrillDown.paymentMethod === 'Cash' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Collected By Staff:</span>
                      <strong>{activeDrillDown.processedBy}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Counter Location:</span>
                      <strong>{activeDrillDown.counterLocation || 'Main Office Desk'}</strong>
                    </div>
                  </>
                )}

                {activeDrillDown.paymentMethod === 'Cheque' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Cheque Number:</span>
                      <strong style={{ fontFamily: 'monospace' }}>{activeDrillDown.chequeNo || 'CHQ-449012'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Drawn Bank:</span>
                      <strong>{activeDrillDown.bankName || 'HDFC Bank'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Deposit Date:</span>
                      <strong>{activeDrillDown.depositDate || '2026-07-22'}</strong>
                    </div>
                  </>
                )}
              </div>

              {/* Status Timeline */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem' }}>Audit Timeline</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                  {(activeDrillDown.history || [{ timestamp: activeDrillDown.dateTime, status: activeDrillDown.status, note: 'Payment recorded in ledger' }]).map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{h.timestamp}</span>
                      <span className={`badge-status ${h.status.toLowerCase()}`}>{h.status}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{h.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <div>
                {activeDrillDown.status === 'Paid' && (
                  <button 
                    className="action-btn-secondary"
                    style={{ color: 'var(--status-danger-text)', borderColor: 'var(--status-danger-bg)' }}
                    onClick={() => setRefundModalTxn(activeDrillDown)}
                  >
                    <RotateCcw size={14} />
                    Issue Refund
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="action-btn-secondary" 
                  onClick={() => downloadReceiptPDF(activeDrillDown)}
                >
                  <Download size={14} />
                  Download PDF Receipt
                </button>

                <button className="action-btn-primary" onClick={() => setActiveDrillDown(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundModalTxn && (
        <div className="modal-overlay" onClick={() => setRefundModalTxn(null)}>
          <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RotateCcw size={20} style={{ color: 'var(--status-danger-text)' }} />
                <h3 style={{ margin: 0 }}>Refund Transaction #{refundModalTxn.receiptNo}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setRefundModalTxn(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#FFE4E6', border: '1px solid #FECDD3', padding: '12px', borderRadius: 'var(--radius-md)', color: '#9F1239', fontSize: '0.82rem' }}>
                <strong>Warning:</strong> Initiating a refund will mark transaction status as <strong>Refunded</strong>, re-open the student's balance for ₹{(refundModalTxn.amount).toLocaleString('en-IN')}, and record an audit log entry.
              </div>

              <div>
                <label className="form-label">Refund Reason</label>
                <select 
                  className="form-input"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                >
                  <option value="Overcharge Correction">Overcharge Correction</option>
                  <option value="Duplicate Payment">Duplicate Payment</option>
                  <option value="Fee Waiver Approved">Fee Waiver Approved</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="form-label">Mandatory Audit Note</label>
                <textarea 
                  className="form-input" 
                  rows={3}
                  placeholder="State the justification for issuing this refund..."
                  value={refundNote}
                  onChange={(e) => setRefundNote(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="action-btn-secondary" onClick={() => setRefundModalTxn(null)}>
                Cancel
              </button>
              <button 
                className="action-btn-primary" 
                style={{ background: '#9F1239', borderColor: '#9F1239' }}
                disabled={!refundNote.trim()}
                onClick={submitRefund}
              >
                Confirm & Issue Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
