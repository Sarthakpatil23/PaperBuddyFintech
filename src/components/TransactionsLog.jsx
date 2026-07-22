import React, { useState } from 'react';
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
  Activity
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function TransactionsLog({ 
  transactions, 
  onSelectTransaction, 
  activeFeeFilter 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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
    { value: 'Failed', label: 'Failed' }
  ];

  // Filter Transactions
  const filteredTxns = transactions.filter((txn) => {
    const matchesSearch = 
      txn.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.receiptNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMethod = methodFilter === 'all' || txn.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    const matchesFee = !activeFeeFilter || txn.feeType.includes(activeFeeFilter);

    return matchesSearch && matchesMethod && matchesStatus && matchesFee;
  });

  const exportCSV = () => {
    const headers = 'Transaction ID,Date,Student Name,Fee Type,Amount,Payment Method,Status,Processed By\n';
    const rows = filteredTxns.map((t) => 
      `"${t.id}","${t.dateTime}","${t.studentName}","${t.feeType}",${t.amount},"${t.paymentMethod}","${t.status}","${t.processedBy}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PaperBuddy_Transactions_Export_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="dashboard-section-card" id="transactions">
      <div className="section-card-header">
        <div className="section-card-title">
          <Receipt size={22} style={{ color: 'var(--odoo-purple)' }} />
          <div>
            <h2>Transactions Audit Log</h2>
            <p>Real-time audit trail of all online and offline school fee payments</p>
          </div>
        </div>

        <button className="action-btn-secondary" onClick={exportCSV}>
          <Download size={15} />
          <span>Export Filtered CSV ({filteredTxns.length})</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="filter-bar">
        <div className="global-search-box" style={{ flex: 1, minWidth: '220px' }}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by student name, ID or receipt #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
          <Search size={16} className="search-icon" />
        </div>

        <CustomSelect 
          options={methodOptions}
          value={methodFilter}
          onChange={setMethodFilter}
          icon={CreditCard}
        />

        <CustomSelect 
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          icon={Activity}
        />

        {activeFeeFilter && (
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--odoo-purple)', background: 'var(--odoo-purple-light)', padding: '6px 12px', borderRadius: 'var(--radius-pill)' }}>
            Filtered by Fee: {activeFeeFilter}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Receipt #</th>
              <th>Student Name</th>
              <th>Fee Category</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Processed By</th>
              <th style={{ textAlign: 'right' }}>Receipt Detail</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxns.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No transactions match your current filters.
                </td>
              </tr>
            ) : (
              filteredTxns.map((txn) => (
                <tr 
                  key={txn.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectTransaction(txn)}
                >
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {txn.dateTime}
                  </td>

                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{txn.receiptNo}</span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>{txn.studentName}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{txn.classGrade}</div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{txn.feeType}</span>
                  </td>

                  <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    ₹{(txn.amount).toLocaleString('en-IN')}
                  </td>

                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
                      <CreditCard size={14} style={{ color: 'var(--accent-blue-text)' }} />
                      {txn.paymentMethod}
                    </span>
                  </td>

                  <td>
                    <span className={`badge-status ${txn.status.toLowerCase()}`}>
                      {txn.status === 'Paid' && <CheckCircle2 size={12} />}
                      {txn.status === 'Bounced' && <AlertTriangle size={12} />}
                      {txn.status === 'Failed' && <XCircle size={12} />}
                      {txn.status}
                    </span>
                  </td>

                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {txn.processedBy}
                  </td>

                  <td>
                    <div style={{ textAlign: 'right' }}>
                      <button 
                        className="icon-btn-action"
                        title="View Full Transaction Receipt & Audit Details"
                        style={{ marginLeft: 'auto' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(txn);
                        }}
                      >
                        <Eye size={14} />
                      </button>
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
