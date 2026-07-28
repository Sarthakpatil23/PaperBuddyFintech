import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  PlusCircle, 
  Archive,
  RotateCcw,
  Clock,
  AlertTriangle,
  Gift,
  Gavel,
  Link,
  ShieldCheck,
  CheckCircle2,
  X,
  ShieldAlert,
  Phone,
  Sparkles,
  Percent,
  Tag
} from 'lucide-react';

export default function StudentLedgerView({ 
  students, 
  selectedStudentId, 
  onRecordPaymentClick,
  onStudentUpdated
}) {
  const safeStudents = Array.isArray(students) ? students : [];
  const [activeStudentId, setActiveStudentId] = useState(selectedStudentId || (safeStudents[0]?.id) || 'STU-101');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal States
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [showLinkParentModal, setShowLinkParentModal] = useState(false);

  // Form States
  const [waiverType, setWaiverType] = useState('flat');
  const [waiverAmount, setWaiverAmount] = useState('');
  const [waiverPercent, setWaiverPercent] = useState('');
  const [waiverReason, setWaiverReason] = useState('Academic Scholarship');

  const [penaltyAmount, setPenaltyAmount] = useState('500');
  const [penaltyReason, setPenaltyReason] = useState('Late Fee Fine');

  const [parentNameInput, setParentNameInput] = useState('');
  const [parentEmailInput, setParentEmailInput] = useState('');
  const [parentPhoneInput, setParentPhoneInput] = useState('');

  const filteredStudents = safeStudents.filter((s) => {
    const matchesSearch = 
      (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.classGrade || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArchive = showArchived ? true : s.isActive !== false;
    return matchesSearch && matchesArchive;
  });

  const currentStudent = filteredStudents.find((s) => s.id === activeStudentId) || filteredStudents[0] || safeStudents[0] || {
    id: 'STU-101',
    name: 'Student',
    classGrade: 'Grade 10',
    parentName: 'Parent',
    phone: '',
    email: '',
    hasParent: false,
    hasNoParentLinked: true,
    isActive: true,
    totalBilled: 0,
    totalPaid: 0,
    totalWaived: 0,
    balanceDue: 0
  };

  const handleArchiveStudent = async () => {
    if (!window.confirm(`Are you sure you want to archive ${currentStudent.name}? Financial records will be preserved safely.`)) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/students/${currentStudent.id}/archive`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (onStudentUpdated) onStudentUpdated();
      } else {
        alert(data.error || 'Failed to archive student');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreStudent = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/students/${currentStudent.id}/restore`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (onStudentUpdated) onStudentUpdated();
      } else {
        alert(data.error || 'Failed to restore student');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Waiver (Workflow B)
  const handleApplyWaiverSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const payload = {
        studentId: currentStudent.id,
        reason: waiverReason,
        approvedBy: 'School Principal',
      };
      if (waiverType === 'flat') {
        payload.amount = Number(waiverAmount);
      } else {
        payload.percent = Number(waiverPercent);
      }

      const res = await fetch('/api/waivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowWaiverModal(false);
        setWaiverAmount('');
        if (onStudentUpdated) onStudentUpdated();
      } else {
        alert(data.error || 'Failed to apply waiver');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Manual Penalty (Workflow C1)
  const handleApplyPenaltySubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch('/api/penalties/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          penaltyAmount: Number(penaltyAmount),
          reason: penaltyReason,
          appliedBy: 'Finance Admin',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowPenaltyModal(false);
        if (onStudentUpdated) onStudentUpdated();
      } else {
        alert(data.error || 'Failed to apply penalty');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Link Parent Account (Workflow A Step 5)
  const handleLinkParentSubmit = async (e) => {
    e.preventDefault();
    if (!parentEmailInput) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/parents/link-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          parentName: parentNameInput || `Parent of ${currentStudent.name}`,
          parentEmail: parentEmailInput,
          parentPhone: parentPhoneInput || 'N/A',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowLinkParentModal(false);
        setParentEmailInput('');
        if (onStudentUpdated) onStudentUpdated();
      } else {
        alert(data.error || 'Failed to link parent account');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="dashboard-section-card" id="student-ledger">
      <div className="section-card-header">
        <div className="section-card-title">
          <UserCheck size={22} style={{ color: 'var(--odoo-purple)' }} />
          <div>
            <h2>Student Financial Ledger Lookup</h2>
            <p>Single source of truth for individual student billing, payment logs & running balances</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            className="action-btn-secondary" 
            onClick={() => setShowWaiverModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Gift size={15} style={{ color: 'var(--odoo-purple)' }} />
            <span>Apply Waiver</span>
          </button>

          <button 
            className="action-btn-secondary" 
            onClick={() => setShowPenaltyModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Gavel size={15} style={{ color: '#9F1239' }} />
            <span>Apply Penalty</span>
          </button>

          <button 
            className="action-btn-primary" 
            onClick={() => onRecordPaymentClick(currentStudent)}
          >
            <PlusCircle size={16} />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="global-search-box" style={{ width: '100%', maxWidth: '360px' }}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search student by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
          <Search size={16} className="search-icon" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>
            <input 
              type="checkbox" 
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              style={{ accentColor: 'var(--odoo-purple)', width: '16px', height: '16px' }}
            />
            Show Archived Students
          </label>

          {/* Student Quick Select Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filteredStudents.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStudentId(s.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-color)',
                  background: s.id === currentStudent?.id ? 'var(--odoo-purple)' : 'white',
                  color: s.id === currentStudent?.id ? 'white' : 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: s.isActive === false ? 0.6 : 1
                }}
              >
                {s.name} {s.hasNoParentLinked || !s.hasParent ? '⚠️' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Student Ledger Header Card */}
      {currentStudent && (
        <div>
          <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentStudent.name}</div>
                  {currentStudent.isActive === false ? (
                    <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      Archived
                    </span>
                  ) : (
                    <span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      Active
                    </span>
                  )}

                  {/* Workflow A Step 5: Flag No Parent Linked */}
                  {(currentStudent.hasNoParentLinked || !currentStudent.hasParent) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={13} />
                        No Parent Account Linked
                      </span>
                      <button 
                        onClick={() => setShowLinkParentModal(true)}
                        style={{ background: 'var(--odoo-purple)', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Link size={12} />
                        Link Parent
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                  {currentStudent.classGrade} | ID: {currentStudent.id} | Parent: {currentStudent.parentName} ({currentStudent.phone})
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Billed</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{(currentStudent.totalBilled || 0).toLocaleString('en-IN')}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Paid</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-blue-text)' }}>₹{(currentStudent.totalPaid || 0).toLocaleString('en-IN')}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Waived/Discount</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--odoo-purple)' }}>₹{(currentStudent.totalWaived || 0).toLocaleString('en-IN')}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9F1239', fontWeight: 600 }}>Outstanding Balance</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9F1239' }}>₹{(currentStudent.balanceDue || 0).toLocaleString('en-IN')}</div>
                </div>

                {/* Soft Delete Archive Button */}
                <div style={{ marginLeft: '12px', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
                  {currentStudent.isActive !== false ? (
                    <button 
                      onClick={handleArchiveStudent}
                      disabled={isProcessing}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #FECACA',
                        background: '#FEF2F2',
                        color: '#991B1B',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title="Archive student (Soft delete - financial records preserved under Restrict rules)"
                    >
                      <Archive size={15} />
                      <span>Archive Student</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleRestoreStudent}
                      disabled={isProcessing}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #BBF7D0',
                        background: '#F0FDF4',
                        color: '#166534',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <RotateCcw size={15} />
                      <span>Restore Student</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Chronological Timeline View (Workflow C3) */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} />
              Chronological Itemized Financial Timeline
            </h4>

            <div className="ledger-timeline">
              <div className="timeline-node">
                <div className="node-dot" />
                <div className="node-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>Fee Billed: Tuition Fee (Q2)</span>
                    <span style={{ color: 'var(--text-main)' }}>+ ₹25,000</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assigned on Fee Creation | Status: Active</div>
                </div>
              </div>

              {currentStudent.totalWaived > 0 && (
                <div className="timeline-node">
                  <div className="node-dot" style={{ background: 'var(--odoo-purple)' }} />
                  <div className="node-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>Waiver Applied: Academic Discount</span>
                      <span style={{ color: 'var(--odoo-purple)' }}>- ₹{(currentStudent.totalWaived).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Approved by School Principal | Adjusted Balance Updated</div>
                  </div>
                </div>
              )}

              {currentStudent.totalPaid > 0 && (
                <div className="timeline-node">
                  <div className="node-dot" style={{ background: 'var(--accent-blue-text)' }} />
                  <div className="node-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>Payment Verified via UPI</span>
                      <span style={{ color: 'var(--accent-blue-text)' }}>+ ₹{(currentStudent.totalPaid).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WORKFLOW B: MODERN, CLEAN APPLY WAIVER MODAL */}
      {showWaiverModal && (
        <div className="modal-overlay fade-in" onClick={() => setShowWaiverModal(false)} style={{ backdropFilter: 'blur(6px)', background: 'rgba(15, 23, 42, 0.65)' }}>
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
                  <Gift size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Apply Fee Waiver / Scholarship
                  </h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Grant tuition fee discount credit to student account
                  </p>
                </div>
              </div>

              <button 
                className="close-btn" 
                onClick={() => setShowWaiverModal(false)}
                style={{ color: 'rgba(255, 255, 255, 0.8)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplyWaiverSubmit} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Student Financial Summary Card */}
              <div style={{
                padding: '18px 20px',
                background: 'var(--card-nested)',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                      {currentStudent.name}
                    </span>
                    <span style={{ fontSize: '0.74rem', padding: '2px 9px', borderRadius: '6px', background: 'var(--surface-hover)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                      {currentStudent.classGrade || 'Student'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>ID: <strong>{currentStudent.id}</strong></span>
                    <span>•</span>
                    <span>Parent: <strong>{currentStudent.parentName || 'Linked Parent'}</strong></span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                    CURRENT BALANCE
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--odoo-purple)', marginTop: '2px' }}>
                    ₹{(currentStudent.totalDue || 0).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '2px' }}>
                    <Sparkles size={12} style={{ color: 'var(--odoo-purple)' }} />
                    <span>Tuition Eligible</span>
                  </div>
                </div>
              </div>

              {/* Discount Type Segmented Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Select Discount Format
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setWaiverType('flat')}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: waiverType === 'flat' ? '2px solid var(--odoo-purple)' : '1px solid var(--border-color)',
                      background: waiverType === 'flat' ? 'var(--odoo-purple-light)' : 'var(--surface-card)',
                      color: waiverType === 'flat' ? 'var(--odoo-purple)' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <Tag size={16} />
                    <span>Flat Amount (₹)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWaiverType('percent')}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: waiverType === 'percent' ? '2px solid var(--odoo-purple)' : '1px solid var(--border-color)',
                      background: waiverType === 'percent' ? 'var(--odoo-purple-light)' : 'var(--surface-card)',
                      color: waiverType === 'percent' ? 'var(--odoo-purple)' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <Percent size={16} />
                    <span>Percentage (%)</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Quick Preset Scholarships
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => { setWaiverType('flat'); setWaiverAmount('2500'); setWaiverReason('Early Bird Term Scholarship'); }}
                  >
                    <Sparkles size={14} style={{ color: 'var(--odoo-purple)' }} />
                    <span>₹2,500 (Early Bird)</span>
                  </button>

                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => { setWaiverType('flat'); setWaiverAmount('5000'); setWaiverReason('Merit Excellence Scholarship'); }}
                  >
                    <Gift size={14} style={{ color: 'var(--accent-blue)' }} />
                    <span>₹5,000 (Merit Scholarship)</span>
                  </button>

                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => { setWaiverType('percent'); setWaiverPercent('15'); setWaiverReason('Sibling Enrollment Concession'); }}
                  >
                    <Percent size={14} style={{ color: '#D97706' }} />
                    <span>15% Off (Sibling Concession)</span>
                  </button>
                </div>
              </div>

              {/* Waiver Value & Reason Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ margin: 0, fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    {waiverType === 'flat' ? 'Waiver Amount (₹)' : 'Waiver Percentage (%)'}
                  </label>
                  {waiverType === 'flat' ? (
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 5000" 
                      value={waiverAmount} 
                      onChange={(e) => setWaiverAmount(e.target.value)} 
                      required 
                      style={{
                        borderRadius: '12px',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: 'var(--odoo-purple)',
                        border: '1.5px solid var(--border-color)',
                        background: 'var(--bg-canvas)'
                      }}
                    />
                  ) : (
                    <input 
                      type="number" 
                      step="0.1" 
                      className="form-input" 
                      placeholder="e.g. 20" 
                      value={waiverPercent} 
                      onChange={(e) => setWaiverPercent(e.target.value)} 
                      required 
                      style={{
                        borderRadius: '12px',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: 'var(--odoo-purple)',
                        border: '1.5px solid var(--border-color)',
                        background: 'var(--bg-canvas)'
                      }}
                    />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ margin: 0, fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    Mandatory Waiver Reason
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Academic Excellence Scholarship" 
                    value={waiverReason} 
                    onChange={(e) => setWaiverReason(e.target.value)} 
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

              {/* Tuition Policy Callout */}
              <div style={{
                padding: '12px 16px',
                background: 'var(--odoo-purple-light)',
                borderRadius: '12px',
                border: '1px solid rgba(113, 75, 103, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.8rem',
                color: 'var(--odoo-purple)',
                lineHeight: '1.4'
              }}>
                <ShieldCheck size={20} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Tuition Waiver Policy:</strong> Fee waivers apply strictly to Tuition Fees. If current Tuition Fees are paid in full, this discount will be saved and automatically deducted from the student's next Tuition Fee bill.
                </span>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  className="action-btn-secondary" 
                  onClick={() => setShowWaiverModal(false)}
                  style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.88rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="action-btn-primary" 
                  disabled={isProcessing}
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
                  <Gift size={16} />
                  <span>{isProcessing ? 'Applying Waiver...' : 'Confirm & Apply Waiver'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* WORKFLOW C1: MODERN, CLEAN APPLY MANUAL PENALTY MODAL */}
      {showPenaltyModal && (
        <div className="modal-overlay fade-in" onClick={() => setShowPenaltyModal(false)} style={{ backdropFilter: 'blur(6px)', background: 'rgba(15, 23, 42, 0.65)' }}>
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
              background: 'linear-gradient(135deg, var(--destructive) 0%, var(--primary) 100%)',
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
                    Impose policy penalty fine on overdue student balance
                  </p>
                </div>
              </div>

              <button 
                className="close-btn" 
                onClick={() => setShowPenaltyModal(false)}
                style={{ color: 'rgba(255, 255, 255, 0.8)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplyPenaltySubmit} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Student Financial Summary Card */}
              <div style={{
                padding: '18px 20px',
                background: 'var(--card-nested)',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                      {currentStudent.name}
                    </span>
                    <span style={{ fontSize: '0.74rem', padding: '2px 9px', borderRadius: '6px', background: 'var(--surface-hover)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                      {currentStudent.classGrade || 'Student'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>ID: <strong>{currentStudent.id}</strong></span>
                    <span>•</span>
                    <span>Parent: <strong>{currentStudent.parentName || 'Linked Parent'}</strong></span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                    OUTSTANDING BALANCE
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--status-danger-text)', marginTop: '2px' }}>
                    ₹{(currentStudent.totalDue || 0).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--status-pending-text)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '2px' }}>
                    <Clock size={12} />
                    <span>Overdue Account</span>
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
                    onClick={() => { setPenaltyAmount('250'); setPenaltyReason('Standard Late Fee Fine (1-15 days overdue)'); }}
                  >
                    <span>₹250 (Standard Fine)</span>
                  </button>

                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => { setPenaltyAmount('500'); setPenaltyReason('30+ Days Overdue Administrative Fine'); }}
                  >
                    <span>₹500 (30+ Days Overdue)</span>
                  </button>

                  <button
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => { setPenaltyAmount('1000'); setPenaltyReason('Severe Delay Policy Penalty Fine'); }}
                  >
                    <span>₹1,000 (Severe Penalty)</span>
                  </button>
                </div>
              </div>

              {/* Penalty Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ margin: 0, fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    Fine Amount (₹)
                  </label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={penaltyAmount}
                    onChange={(e) => setPenaltyAmount(e.target.value)}
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
                    value={penaltyReason}
                    onChange={(e) => setPenaltyReason(e.target.value)}
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
                  onClick={() => setShowPenaltyModal(false)}
                  style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.88rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="action-btn-primary" 
                  disabled={isProcessing}
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
                  <span>{isProcessing ? 'Applying Fine...' : 'Apply Late Fee Fine'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* WORKFLOW A STEP 5: LINK PARENT ACCOUNT MODAL */}
      {showLinkParentModal && (
        <div className="modal-overlay" onClick={() => setShowLinkParentModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Link Parent Account to {currentStudent.name}</h3>
              <button className="close-btn" onClick={() => setShowLinkParentModal(false)}>✕</button>
            </div>

            <form onSubmit={handleLinkParentSubmit}>
              <div className="form-group">
                <label className="form-label">Parent Full Name</label>
                <input type="text" className="form-input" placeholder="e.g. Rajesh Sharma" value={parentNameInput} onChange={(e) => setParentNameInput(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Parent Email Address</label>
                <input type="email" className="form-input" placeholder="e.g. rajesh.sharma@example.com" value={parentEmailInput} onChange={(e) => setParentEmailInput(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Parent Phone Number</label>
                <input type="text" className="form-input" placeholder="e.g. +91 98765 43210" value={parentPhoneInput} onChange={(e) => setParentPhoneInput(e.target.value)} />
              </div>

              <button type="submit" className="btn-submit-primary" disabled={isProcessing} style={{ marginTop: '12px' }}>
                Link Parent Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
