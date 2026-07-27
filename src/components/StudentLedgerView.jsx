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
  CheckCircle2
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
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Receipt Verified Online | Real-Time Sync Confirmed</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WORKFLOW B: APPLY WAIVER MODAL */}
      {showWaiverModal && (
        <div className="modal-overlay" onClick={() => setShowWaiverModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply Fee Waiver / Scholarship</h3>
              <button className="close-btn" onClick={() => setShowWaiverModal(false)}>✕</button>
            </div>

            <form onSubmit={handleApplyWaiverSubmit}>
              <div className="form-group">
                <label className="form-label">Student</label>
                <input type="text" className="form-input" value={`${currentStudent.name} (${currentStudent.id})`} disabled />
              </div>

              <div className="form-group">
                <label className="form-label">Discount Type</label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name="wType" value="flat" checked={waiverType === 'flat'} onChange={() => setWaiverType('flat')} />
                    <span>Flat Amount (₹)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name="wType" value="percent" checked={waiverType === 'percent'} onChange={() => setWaiverType('percent')} />
                    <span>Percentage (%)</span>
                  </label>
                </div>
              </div>

              {waiverType === 'flat' ? (
                <div className="form-group">
                  <label className="form-label">Waiver Amount (₹)</label>
                  <input type="number" className="form-input" placeholder="e.g. 5000" value={waiverAmount} onChange={(e) => setWaiverAmount(e.target.value)} required />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Waiver Percentage (%)</label>
                  <input type="number" step="0.1" className="form-input" placeholder="e.g. 20" value={waiverPercent} onChange={(e) => setWaiverPercent(e.target.value)} required />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Mandatory Waiver Reason</label>
                <input type="text" className="form-input" placeholder="e.g. Academic Excellence Scholarship" value={waiverReason} onChange={(e) => setWaiverReason(e.target.value)} required />
              </div>

              <button type="submit" className="btn-submit-primary" disabled={isProcessing} style={{ marginTop: '12px' }}>
                Confirm & Apply Waiver
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WORKFLOW C1: APPLY MANUAL PENALTY MODAL */}
      {showPenaltyModal && (
        <div className="modal-overlay" onClick={() => setShowPenaltyModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply Manual Late Fee Penalty</h3>
              <button className="close-btn" onClick={() => setShowPenaltyModal(false)}>✕</button>
            </div>

            <form onSubmit={handleApplyPenaltySubmit}>
              <div className="form-group">
                <label className="form-label">Student</label>
                <input type="text" className="form-input" value={`${currentStudent.name} (${currentStudent.id})`} disabled />
              </div>

              <div className="form-group">
                <label className="form-label">Late Fee Fine Amount (₹)</label>
                <input type="number" className="form-input" placeholder="e.g. 500" value={penaltyAmount} onChange={(e) => setPenaltyAmount(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Justification</label>
                <input type="text" className="form-input" placeholder="e.g. Overdue past 30 days" value={penaltyReason} onChange={(e) => setPenaltyReason(e.target.value)} required />
              </div>

              <button type="submit" className="btn-submit-primary" disabled={isProcessing} style={{ marginTop: '12px', background: '#9F1239', borderColor: '#9F1239' }}>
                Confirm & Apply Penalty
              </button>
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
