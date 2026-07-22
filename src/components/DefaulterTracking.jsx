import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Send, 
  Phone, 
  Gavel, 
  BookOpen, 
  Search, 
  CheckSquare, 
  Square,
  AlertCircle,
  Filter,
  ArrowUpDown,
  GraduationCap,
  AlertTriangle
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function DefaulterTracking({ 
  defaulters, 
  onSendReminder, 
  onApplyPenalty, 
  onViewLedger, 
  onBulkAction 
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [sortBy, setSortBy] = useState('amountDesc');

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'mild', label: 'Mild (1–15 days)' },
    { value: 'moderate', label: 'Moderate (16–30 days)' },
    { value: 'severe', label: 'Severe (30+ days)' }
  ];

  const classOptions = [
    { value: 'all', label: 'All Classes' },
    { value: 'Grade 12', label: 'Grade 12' },
    { value: 'Grade 10', label: 'Grade 10' },
    { value: 'Grade 9', label: 'Grade 9' },
    { value: 'Grade 7', label: 'Grade 7' },
    { value: 'Grade 6', label: 'Grade 6' }
  ];

  const sortOptions = [
    { value: 'amountDesc', label: 'Sort: Amount Owed (Highest)' },
    { value: 'daysDesc', label: 'Sort: Days Overdue (Longest)' }
  ];

  // Filter & Sort Logic
  const filteredDefaulters = defaulters
    .filter((def) => {
      const matchesSearch = 
        def.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        def.classGrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        def.parentName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || def.severity === severityFilter;
      const matchesClass = classFilter === 'all' || def.classGrade.includes(classFilter);

      return matchesSearch && matchesSeverity && matchesClass;
    })
    .sort((a, b) => {
      if (sortBy === 'amountDesc') return b.amountOwed - a.amountOwed;
      if (sortBy === 'daysDesc') return b.daysOverdue - a.daysOverdue;
      return 0;
    });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDefaulters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDefaulters.map((d) => d.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="dashboard-section-card" id="defaulters">
      <div className="section-card-header">
        <div className="section-card-title">
          <ShieldAlert size={22} style={{ color: '#E11D48' }} />
          <div>
            <h2>Defaulter Tracking & Follow-up Workspace</h2>
            <p>Monitor overdue student accounts, send reminders & trigger penalty policies</p>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--odoo-purple)' }}>
              {selectedIds.length} Selected
            </span>
            <button className="action-btn-primary" onClick={() => { onBulkAction('remind', selectedIds); setSelectedIds([]); }}>
              <Send size={14} />
              <span>Send Bulk Reminders</span>
            </button>
            <button className="action-btn-secondary" onClick={() => { onBulkAction('penalty', selectedIds); setSelectedIds([]); }}>
              <Gavel size={14} />
              <span>Apply Penalty</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="global-search-box" style={{ flex: 1, minWidth: '220px' }}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search defaulter student or parent name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
          <Search size={16} className="search-icon" />
        </div>

        <CustomSelect 
          options={severityOptions}
          value={severityFilter}
          onChange={setSeverityFilter}
          icon={AlertTriangle}
        />

        <CustomSelect 
          options={classOptions}
          value={classFilter}
          onChange={setClassFilter}
          icon={GraduationCap}
        />

        <CustomSelect 
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
          icon={ArrowUpDown}
        />
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <button 
                  onClick={toggleSelectAll} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {selectedIds.length === filteredDefaulters.length && filteredDefaulters.length > 0 ? (
                    <CheckSquare size={16} style={{ color: 'var(--odoo-purple)' }} />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </th>
              <th>Student & Class</th>
              <th>Fee Types Overdue</th>
              <th>Amount Owed</th>
              <th>Days Overdue</th>
              <th>Severity</th>
              <th>Parent Contact</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDefaulters.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No defaulter records match your search criteria.
                </td>
              </tr>
            ) : (
              filteredDefaulters.map((def) => (
                <tr key={def.id}>
                  <td>
                    <button 
                      onClick={() => toggleSelectRow(def.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {selectedIds.includes(def.id) ? (
                        <CheckSquare size={16} style={{ color: 'var(--odoo-purple)' }} />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>{def.studentName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{def.classGrade} ({def.studentId})</div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {def.feeTypes.map((ft) => (
                        <span 
                          key={ft}
                          style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'var(--bg-canvas)',
                            border: '1px solid var(--border-color)',
                            fontWeight: 500
                          }}
                        >
                          {ft}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td style={{ fontWeight: 700, color: '#9F1239' }}>
                    ₹{(def.amountOwed).toLocaleString('en-IN')}
                  </td>

                  <td>
                    <span style={{ fontWeight: 600 }}>{def.daysOverdue} days</span>
                  </td>

                  <td>
                    <span className={`badge-status ${def.severity}`}>
                      {def.severity === 'severe' && <AlertCircle size={12} />}
                      {def.severity.toUpperCase()}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.82rem' }}>{def.parentName}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--accent-blue-text)' }}>{def.phone}</div>
                  </td>

                  <td>
                    <div className="row-actions-group" style={{ justifyContent: 'flex-end' }}>
                      <button 
                        className="icon-btn-action" 
                        title="Send Email / SMS Reminder"
                        onClick={() => onSendReminder(def)}
                      >
                        <Send size={14} />
                      </button>

                      <a 
                        href={`tel:${def.phone}`}
                        className="icon-btn-action"
                        title="Tap to Call Parent"
                        style={{ textDecoration: 'none' }}
                      >
                        <Phone size={14} />
                      </a>

                      <button 
                        className="icon-btn-action" 
                        title="Apply Late Fee Penalty"
                        onClick={() => onApplyPenalty(def)}
                      >
                        <Gavel size={14} />
                      </button>

                      <button 
                        className="icon-btn-action" 
                        title="View Full Student Financial Ledger"
                        onClick={() => onViewLedger(def.studentId)}
                      >
                        <BookOpen size={14} />
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
