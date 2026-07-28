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
  AlertTriangle,
  Link,
  CheckCircle2,
  X,
  Bell,
  Sparkles,
  Zap,
  Check,
  Clock,
  MessageSquare
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function DefaulterTracking({ 
  defaulters, 
  onSendReminder, 
  onApplyPenalty, 
  onViewLedger, 
  onBulkAction,
  onStudentUpdated
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [sortBy, setSortBy] = useState('amountDesc');

  // Modal states
  const [reminderModalDef, setReminderModalDef] = useState(null);
  const [reminderMessage, setReminderMessage] = useState('');
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  const [penaltyModalDef, setPenaltyModalDef] = useState(null);
  const [penaltyAmountInput, setPenaltyAmountInput] = useState('500');
  const [penaltyReasonInput, setPenaltyReasonInput] = useState('Overdue Fee Fine');
  const [isApplyingPenalty, setIsApplyingPenalty] = useState(false);

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
  const safeDefaulters = Array.isArray(defaulters) ? defaulters : [];
  const filteredDefaulters = safeDefaulters
    .filter((def) => {
      const matchesSearch = 
        (def.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (def.classGrade || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (def.parentName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || def.severity === severityFilter;
      const matchesClass = classFilter === 'all' || (def.classGrade || '').includes(classFilter);

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

  const openReminderModal = (def) => {
    setReminderModalDef(def);
    setReminderMessage(`Dear ${def.parentName || 'Parent'}, this is an urgent reminder to clear the overdue fee amount of ₹${def.amountOwed.toLocaleString('en-IN')} for ${def.studentName} (${def.classGrade}). Please pay via the Finlyt Parent Portal.`);
  };

  const handleSendReminderSubmit = async (e) => {
    e.preventDefault();
    if (!reminderModalDef) return;
    setIsSendingReminder(true);

    try {
      const res = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds: [reminderModalDef.studentId],
          messageTemplate: reminderMessage,
          senderAdmin: 'Finance Admin',
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Reminder notification sent successfully to ${reminderModalDef.parentName}!`);
        setReminderModalDef(null);
        if (onStudentUpdated) onStudentUpdated();
      } else {
        alert(data.error || 'Failed to send reminder');
      }
    } catch (err) {
      alert('Server error sending reminder');
    } finally {
      setIsSendingReminder(false);
    }
  };

  const openPenaltyModal = (def) => {
    setPenaltyModalDef(def);
    setPenaltyAmountInput('500');
    setPenaltyReasonInput(`Late Fee Fine for ${def.daysOverdue} days overdue`);
  };

  const handleApplyPenaltySubmit = async (e) => {
    e.preventDefault();
    if (!penaltyModalDef) return;
    setIsApplyingPenalty(true);

    try {
      const res = await fetch('/api/penalties/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: penaltyModalDef.studentId,
          penaltyAmount: Number(penaltyAmountInput),
          reason: penaltyReasonInput,
          appliedBy: 'Finance Admin',
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Manual late fee penalty of ₹${penaltyAmountInput} applied to ${penaltyModalDef.studentName}!`);
        setPenaltyModalDef(null);
        if (onStudentUpdated) onStudentUpdated();
      } else {
        alert(data.error || 'Failed to apply penalty');
      }
    } catch (err) {
      alert('Server error applying penalty');
    } finally {
      setIsApplyingPenalty(false);
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
              <th>Amount Owed (Post-Waiver)</th>
              <th>Days Overdue</th>
              <th>Penalty Status</th>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontWeight: 600 }}>{def.studentName}</div>
                      {def.hasNoParentLinked || !def.hasParent ? (
                        <span style={{ fontSize: '0.72rem', color: '#991B1B', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                          <AlertTriangle size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '3px' }} />
                          No Parent Linked
                        </span>
                      ) : null}
                    </div>
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
                    {def.hasPenaltyApplied ? (
                      <span className="badge-status paid" style={{ fontSize: '0.74rem' }}>
                        <CheckCircle2 size={12} /> Penalty Applied
                      </span>
                    ) : (
                      <span style={{ background: '#F3F4F6', color: '#4B5563', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 600 }}>
                        No Penalty Yet
                      </span>
                    )}
                  </td>

                  <td>
                    <div style={{ fontSize: '0.82rem' }}>{def.parentName}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--accent-blue-text)' }}>{def.phone}</div>
                  </td>

                  <td>
                    <div className="row-actions-group" style={{ justifyContent: 'flex-end' }}>
                      <button 
                        className="icon-btn-action" 
                        title="Send Notification Reminder"
                        onClick={() => openReminderModal(def)}
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
                        title="Apply Manual Penalty"
                        onClick={() => openPenaltyModal(def)}
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

      {/* WORKFLOW E: CLEAN, UNCLUTTERED SEND NOTIFICATION MODAL */}
      {reminderModalDef && (
        <div className="modal-overlay fade-in" onClick={() => setReminderModalDef(null)} style={{ backdropFilter: 'blur(6px)', background: 'rgba(15, 23, 42, 0.65)' }}>
          <div 
            className="modal-card fade-in custom-modal-scroll" 
            style={{ 
              maxWidth: '620px', 
              width: '92%', 
              borderRadius: '20px', 
              boxShadow: '0 25px 50px -12px rgba(113, 75, 103, 0.25)',
              padding: '0',
              overflow: 'hidden',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-color)'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '22px 28px',
              background: 'linear-gradient(135deg, var(--odoo-purple) 0%, #4A2E44 100%)',
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
                  <Bell size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Dispatch Payment Notification</span>
                  </h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Send official in-app reminder, SMS, and email notification to parent
                  </p>
                </div>
              </div>

              <button 
                className="close-btn" 
                onClick={() => setReminderModalDef(null)}
                style={{ color: 'rgba(255, 255, 255, 0.8)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendReminderSubmit} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Defaulter Student Summary Card */}
              <div style={{
                padding: '18px 20px',
                background: 'var(--bg-canvas)',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                      {reminderModalDef.studentName}
                    </span>
                    <span style={{ fontSize: '0.74rem', padding: '2px 9px', borderRadius: '6px', background: 'var(--surface-hover)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                      {reminderModalDef.classGrade}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Parent: <strong>{reminderModalDef.parentName}</strong></span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={13} style={{ color: 'var(--odoo-purple)' }} />
                      {reminderModalDef.phone || '+91 Parent Contact'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                    OVERDUE BALANCE
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--status-danger-text)', marginTop: '2px' }}>
                    ₹{reminderModalDef.amountOwed.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--status-pending-text)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '2px' }}>
                    <Clock size={12} />
                    <span>{reminderModalDef.daysOverdue} days overdue</span>
                  </div>
                </div>
              </div>

              {/* Quick Template Preset Buttons */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Quick Template Presets
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => setReminderMessage(`Dear ${reminderModalDef.parentName || 'Parent'}, this is an urgent reminder to clear the overdue fee amount of ₹${reminderModalDef.amountOwed.toLocaleString('en-IN')} for ${reminderModalDef.studentName} (${reminderModalDef.classGrade}). Please pay via the Parent Portal.`)}
                  >
                    <Zap size={14} style={{ color: '#D97706' }} />
                    <span>Urgent Notice</span>
                  </button>

                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => setReminderMessage(`Hello ${reminderModalDef.parentName || 'Parent'}, friendly follow-up regarding the term fee for ${reminderModalDef.studentName} (${reminderModalDef.classGrade}). Outstanding balance is ₹${reminderModalDef.amountOwed.toLocaleString('en-IN')}. Kindly settle at your earliest convenience.`)}
                  >
                    <MessageSquare size={14} style={{ color: 'var(--accent-blue)' }} />
                    <span>Standard Follow-up</span>
                  </button>

                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => setReminderMessage(`FINAL NOTICE: Fee dues for ${reminderModalDef.studentName} (${reminderModalDef.classGrade}) are ${reminderModalDef.daysOverdue} days overdue (Amount: ₹${reminderModalDef.amountOwed.toLocaleString('en-IN')}). Please clear immediately to avoid late payment penalty fines.`)}
                  >
                    <ShieldAlert size={14} style={{ color: 'var(--status-danger-text)' }} />
                    <span>Final Warning</span>
                  </button>
                </div>
              </div>

              {/* Spacious Editable Reminder Message Textarea */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ margin: 0, fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    Notification Message Content
                  </label>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', background: 'var(--bg-canvas)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    {reminderMessage.length} characters
                  </span>
                </div>
                <textarea 
                  className="clean-notification-textarea" 
                  rows={6}
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  placeholder="Type the notification message to send to the parent..."
                  required
                />
              </div>

              {/* Delivery Channels Info Bar */}
              <div style={{
                padding: '12px 16px',
                background: 'var(--odoo-purple-light)',
                borderRadius: '12px',
                border: '1px solid rgba(113, 75, 103, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.8rem',
                color: 'var(--odoo-purple)'
              }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>
                  Channels: In-App Feed • Real-Time Socket Sync • Tagged SMS & Email
                </span>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  className="action-btn-secondary" 
                  onClick={() => setReminderModalDef(null)}
                  style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.88rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="action-btn-primary" 
                  disabled={isSendingReminder}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    background: 'var(--odoo-purple)',
                    borderColor: 'var(--odoo-purple)',
                    color: 'white',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-primary)'
                  }}
                >
                  <Send size={16} />
                  <span>{isSendingReminder ? 'Dispatching Notification...' : 'Dispatch Notification'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* WORKFLOW C1: MODERN, CLEAN MANUAL PENALTY MODAL */}
      {penaltyModalDef && (
        <div className="modal-overlay fade-in" onClick={() => setPenaltyModalDef(null)} style={{ backdropFilter: 'blur(6px)', background: 'rgba(15, 23, 42, 0.65)' }}>
          <div 
            className="modal-card fade-in custom-modal-scroll" 
            style={{ 
              maxWidth: '600px', 
              width: '92%', 
              borderRadius: '20px', 
              boxShadow: '0 25px 50px -12px rgba(159, 18, 57, 0.25)',
              padding: '0',
              overflow: 'hidden',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-color)'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '22px 28px',
              background: 'linear-gradient(135deg, #881337 0%, #4C0519 100%)',
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
                  <Gavel size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Apply Manual Late Fee Fine
                  </h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Impose policy penalty fine on overdue balance
                  </p>
                </div>
              </div>

              <button 
                className="close-btn" 
                onClick={() => setPenaltyModalDef(null)}
                style={{ color: 'rgba(255, 255, 255, 0.8)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplyPenaltySubmit} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Defaulter Student Summary Card */}
              <div style={{
                padding: '18px 20px',
                background: 'var(--bg-canvas)',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                      {penaltyModalDef.studentName}
                    </span>
                    <span style={{ fontSize: '0.74rem', padding: '2px 9px', borderRadius: '6px', background: 'var(--surface-hover)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                      {penaltyModalDef.classGrade}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Parent: <strong>{penaltyModalDef.parentName}</strong></span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={13} style={{ color: '#9F1239' }} />
                      {penaltyModalDef.phone || '+91 Parent Contact'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                    CURRENT OVERDUE
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--status-danger-text)', marginTop: '2px' }}>
                    ₹{penaltyModalDef.amountOwed.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--status-pending-text)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '2px' }}>
                    <Clock size={12} />
                    <span>{penaltyModalDef.daysOverdue} days overdue</span>
                  </div>
                </div>
              </div>

              {/* Quick Penalty Amount Presets */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Standard Fine Presets
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => { setPenaltyAmountInput('250'); setPenaltyReasonInput('Standard Late Fee Charge (1-15 days overdue)'); }}
                  >
                    <span>₹250 (Standard Fine)</span>
                  </button>

                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => { setPenaltyAmountInput('500'); setPenaltyReasonInput('30+ Days Overdue Administrative Fine'); }}
                  >
                    <span>₹500 (30+ Days Overdue)</span>
                  </button>

                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => { setPenaltyAmountInput('1000'); setPenaltyReasonInput('Severe Delay Policy Penalty Fine'); }}
                  >
                    <span>₹1,000 (Severe Penalty)</span>
                  </button>
                </div>
              </div>

              {/* Penalty Amount & Reason Input Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ margin: 0, fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    Fine Amount (₹)
                  </label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={penaltyAmountInput}
                    onChange={(e) => setPenaltyAmountInput(e.target.value)}
                    placeholder="500"
                    required
                    style={{
                      borderRadius: '12px',
                      padding: '12px 14px',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: '#9F1239',
                      border: '1.5px solid var(--border-color)',
                      background: 'var(--bg-canvas)'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ margin: 0, fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    Audit Justification / Reason
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={penaltyReasonInput}
                    onChange={(e) => setPenaltyReasonInput(e.target.value)}
                    placeholder="State justification..."
                    required
                    style={{
                      borderRadius: '12px',
                      padding: '12px 14px',
                      fontSize: '0.88rem',
                      border: '1.5px solid var(--border-color)',
                      background: 'var(--bg-canvas)'
                    }}
                  />
                </div>
              </div>

              {/* Policy Audit Alert Callout */}
              <div style={{
                padding: '12px 16px',
                background: '#FFE4E6',
                borderRadius: '12px',
                border: '1px solid #FECDD3',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.82rem',
                color: '#9F1239'
              }}>
                <ShieldAlert size={20} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Audit Policy:</strong> Applying a manual penalty increases the student's total due balance, updates their financial ledger timeline, and notifies the parent.
                </span>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  className="action-btn-secondary" 
                  onClick={() => setPenaltyModalDef(null)}
                  style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.88rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="action-btn-primary" 
                  disabled={isApplyingPenalty}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    background: '#9F1239',
                    borderColor: '#9F1239',
                    color: 'white',
                    fontWeight: 700,
                    boxShadow: '0 8px 20px -4px rgba(159, 18, 57, 0.35)'
                  }}
                >
                  <Gavel size={16} />
                  <span>{isApplyingPenalty ? 'Applying Fine...' : 'Apply Late Fee Fine'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
