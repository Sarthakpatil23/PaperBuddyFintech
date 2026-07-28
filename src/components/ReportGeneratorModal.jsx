import React, { useState } from 'react';
import { Download, FileText, Calendar, Layers, GraduationCap, FileSpreadsheet, Sparkles, X } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { downloadReportFile } from '../utils/reportGenerator';
import LoadingScreen from './LoadingScreen';

export default function ReportGeneratorModal({ 
  onClose, 
  onDownloadReport, 
  students = [], 
  transactions = [],
  defaulters = [],
  reconciliationQueue = [],
  feeTypes = [],
  waivers = []
}) {
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState('currentMonth');
  const [classFilter, setClassFilter] = useState('all');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypeOptions = [
    { value: 'daily', label: 'Daily Fee Collection Summary' },
    { value: 'defaulter', label: 'Active Defaulter & Penalty Report' },
    { value: 'reconciliation', label: 'Bank & Counter Reconciliation Ledger' },
    { value: 'feetype', label: 'Fee-Category Revenue Analysis' },
    { value: 'student_ledger', label: 'Comprehensive Student Account Ledger' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today (Real-Time)' },
    { value: 'currentMonth', label: 'Current Month (July 2026)' },
    { value: 'lastMonth', label: 'Last Month (June 2026)' },
    { value: 'ytd', label: 'Year to Date (YTD 2026)' }
  ];

  const classFilterOptions = [
    { value: 'all', label: 'All Classes & Grades' },
    { value: 'Grade 12', label: 'Grade 12' },
    { value: 'Grade 10', label: 'Grade 10' },
    { value: 'Grade 9', label: 'Grade 9' },
    { value: 'Grade 7', label: 'Grade 7' },
    { value: 'Grade 6', label: 'Grade 6' }
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const fileName = downloadReportFile({
        reportType,
        dateRange,
        classFilter,
        format,
        students,
        transactions,
        defaulters,
        reconciliationQueue,
        feeTypes,
        waivers
      });

      if (onDownloadReport) {
        onDownloadReport({ reportType, dateRange, classFilter, format, fileName });
      }
    } catch (err) {
      console.error('Report generation error:', err);
    } finally {
      setIsGenerating(false);
      onClose();
    }
  };

  const selectedTemplateLabel = reportTypeOptions.find(o => o.value === reportType)?.label || 'Report';
  const selectedRangeLabel = dateRangeOptions.find(o => o.value === dateRange)?.label || 'Date Range';

  if (isGenerating) {
    return (
      <div className="modal-overlay fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', background: 'rgba(15, 23, 42, 0.65)' }}>
        <LoadingScreen 
          fullScreen={false} 
          message={`Compiling & Exporting ${format.toUpperCase()} Audit Report...`} 
          subtext="Formatting ledgers & triggering browser file download" 
        />
      </div>
    );
  }

  return (
    <div className="modal-overlay fade-in" onClick={onClose} style={{ backdropFilter: 'blur(6px)', background: 'rgba(15, 23, 42, 0.65)' }}>
      <div 
        className="modal-card fade-in custom-modal-scroll" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '580px',
          width: '92%',
          borderRadius: '20px',
          padding: '0',
          overflow: 'hidden',
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '22px 28px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                Generate Financial Audit Report
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Export audit-ready CSV & vector PDF accounting ledgers
              </p>
            </div>
          </div>

          <button 
            type="button"
            className="close-btn" 
            onClick={onClose}
            style={{ color: 'rgba(255, 255, 255, 0.8)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleGenerate} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Select Report Template */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ margin: 0, fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={15} style={{ color: 'var(--primary)' }} />
              <span>Select Report Template</span>
            </label>
            <CustomSelect 
              options={reportTypeOptions}
              value={reportType}
              onChange={setReportType}
              icon={FileText}
              style={{ width: '100%' }}
            />
          </div>

          {/* Grid Filters: Date Range & Class Scope */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ margin: 0, fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} style={{ color: 'var(--primary)' }} />
                <span>Date Range Window</span>
              </label>
              <CustomSelect 
                options={dateRangeOptions}
                value={dateRange}
                onChange={setDateRange}
                icon={Calendar}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ margin: 0, fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={15} style={{ color: 'var(--primary)' }} />
                <span>Class / Grade Scope</span>
              </label>
              <CustomSelect 
                options={classFilterOptions}
                value={classFilter}
                onChange={setClassFilter}
                icon={GraduationCap}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Export Format Segmented Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ margin: 0, fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
              Export File Format
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: format === 'pdf' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: format === 'pdf' ? 'var(--primary-light)' : 'var(--card-nested)',
                  color: format === 'pdf' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.18s ease'
                }}
              >
                <FileText size={18} />
                <span>PDF Executive (.pdf)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: format === 'csv' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: format === 'csv' ? 'var(--primary-light)' : 'var(--card-nested)',
                  color: format === 'csv' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.18s ease'
                }}
              >
                <FileSpreadsheet size={18} />
                <span>CSV Spreadsheet (.csv)</span>
              </button>
            </div>
          </div>

          {/* Dynamic Summary Preview Banner */}
          <div style={{
            padding: '14px 18px',
            background: 'var(--card-nested)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <Sparkles size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Dynamic Selection Preview:</span>
              <div style={{ marginTop: '2px', color: 'var(--text-muted)' }}>
                {selectedTemplateLabel} &bull; {selectedRangeLabel} &bull; {classFilter} &bull; <strong style={{ color: 'var(--primary)' }}>.{format.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button 
            type="submit" 
            className="btn-submit-primary" 
            disabled={isGenerating}
            style={{ height: '48px', marginTop: '4px' }}
          >
            <Download size={18} />
            <span>{isGenerating ? 'Generating File...' : 'Generate & Download Report'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
