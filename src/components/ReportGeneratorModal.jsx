import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function ReportGeneratorModal({ onClose, onDownloadReport }) {
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState('currentMonth');
  const [format, setFormat] = useState('csv');

  const reportTypeOptions = [
    { value: 'daily', label: 'Daily Fee Collection Summary' },
    { value: 'defaulter', label: 'Active Defaulter & Penalty Report' },
    { value: 'reconciliation', label: 'Bank & Counter Reconciliation Ledger' },
    { value: 'feetype', label: 'Fee-Category Revenue Analysis' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'currentMonth', label: 'Current Month (July 2026)' },
    { value: 'lastMonth', label: 'Last Month (June 2026)' },
    { value: 'ytd', label: 'Year to Date (2026)' }
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    onDownloadReport({ reportType, dateRange, format });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} style={{ color: 'var(--odoo-purple)' }} />
            <h3>Generate Financial Audit Report</h3>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleGenerate}>
          <div className="form-group">
            <label className="form-label">Select Report Template</label>
            <CustomSelect 
              options={reportTypeOptions}
              value={reportType}
              onChange={setReportType}
              icon={FileText}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group" style={{ marginTop: '14px' }}>
            <label className="form-label">Date Range Window</label>
            <CustomSelect 
              options={dateRangeOptions}
              value={dateRange}
              onChange={setDateRange}
              icon={Calendar}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group" style={{ marginTop: '14px' }}>
            <label className="form-label">Export File Format</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="role-tab-btn"
                style={{ flex: 1, border: '1px solid var(--border-color)', background: format === 'csv' ? 'var(--odoo-purple-light)' : 'white', color: format === 'csv' ? 'var(--odoo-purple)' : 'inherit', fontWeight: 600 }}
                onClick={() => setFormat('csv')}
              >
                CSV Spreadsheet (.csv)
              </button>
              <button
                type="button"
                className="role-tab-btn"
                style={{ flex: 1, border: '1px solid var(--border-color)', background: format === 'pdf' ? 'var(--odoo-purple-light)' : 'white', color: format === 'pdf' ? 'var(--odoo-purple)' : 'inherit', fontWeight: 600 }}
                onClick={() => setFormat('pdf')}
              >
                PDF Executive Document (.pdf)
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit-primary" style={{ marginTop: '20px' }}>
            <Download size={18} />
            <span>Generate & Download Report</span>
          </button>
        </form>
      </div>
    </div>
  );
}
