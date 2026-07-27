import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Plus, 
  Gavel, 
  Gift, 
  CheckCircle2, 
  Trash2, 
  ShieldCheck,
  Play,
  Clock
} from 'lucide-react';

export default function FeeStructureManager({ 
  feeTypes = [], 
  waivers = [], 
  onCreateFeeType, 
  onDeactivateFeeType,
  onApplyWaiver 
}) {
  const safeFeeTypes = Array.isArray(feeTypes) ? feeTypes : [];
  const safeWaivers = Array.isArray(waivers) ? waivers : [];

  const [activeTab, setActiveTab] = useState('structures'); // 'structures' | 'penalties' | 'waivers'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [penaltyRules, setPenaltyRules] = useState([]);
  const [isProcessingPenaltyCheck, setIsProcessingPenaltyCheck] = useState(false);

  // Form State for New Fee Type
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tuition');
  const [applicableTo, setApplicableTo] = useState('Grades 11, 12');
  const [amount, setAmount] = useState('');
  const [recurrence, setRecurrence] = useState('Quarterly');
  const [dueDateRule, setDueDateRule] = useState('10th of first month');
  const [lateFeeRule, setLateFeeRule] = useState('Flat ₹500 penalty');

  // Form State for Penalty Rule
  const [selectedFeeTypeId, setSelectedFeeTypeId] = useState('');
  const [triggerDaysAfterDue, setTriggerDaysAfterDue] = useState('15');
  const [penaltyType, setPenaltyType] = useState('flat'); // 'flat' | 'percent'
  const [penaltyAmountVal, setPenaltyAmountVal] = useState('500');
  const [penaltyPercentVal, setPenaltyPercentVal] = useState('2');
  const [autoApply, setAutoApply] = useState(true);
  const [formError, setFormError] = useState('');

  const fetchPenaltyRules = async () => {
    try {
      const res = await fetch('/api/penalty-rules');
      const data = await res.json();
      if (Array.isArray(data)) setPenaltyRules(data);
    } catch (err) {
      console.error('Error fetching penalty rules:', err);
    }
  };

  useEffect(() => {
    fetchPenaltyRules();
  }, []);

  const [targetScope, setTargetScope] = useState('ALL'); // 'ALL' | 'GRADE' | 'STUDENT'
  const [targetGrade, setTargetGrade] = useState('Grade 10');

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    try {
      const res = await fetch('/api/fee-structures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          amount: parseFloat(amount),
          recurrence: recurrence || 'ONE_TIME',
          targetScope,
          targetGrade,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.warning) {
          alert(`Fee Structure created successfully!\n⚠️ Warning: ${data.warning}`);
        } else {
          alert(`Fee Structure "${name}" assigned successfully to ${data.assignmentsCount} students.`);
        }
        if (onCreateFeeType) onCreateFeeType(data.feeType);
        setName('');
        setAmount('');
        setShowCreateModal(false);
      } else {
        alert(data.error || 'Failed to create fee structure');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  const handleCreatePenaltyRule = async (e) => {
    e.preventDefault();
    setFormError('');

    const feeTypeId = selectedFeeTypeId || (safeFeeTypes[0]?.id);
    if (!feeTypeId) {
      setFormError('Please select a valid fee type.');
      return;
    }

    const payload = {
      feeTypeId,
      triggerDaysAfterDue: parseInt(triggerDaysAfterDue, 10),
      autoApply,
    };

    if (penaltyType === 'flat') {
      if (!penaltyAmountVal || Number(penaltyAmountVal) <= 0) {
        setFormError('Please enter a valid flat penalty amount.');
        return;
      }
      payload.penaltyAmount = Number(penaltyAmountVal);
      payload.penaltyPercent = null;
    } else {
      if (!penaltyPercentVal || Number(penaltyPercentVal) <= 0) {
        setFormError('Please enter a valid penalty percentage.');
        return;
      }
      payload.penaltyPercent = Number(penaltyPercentVal);
      payload.penaltyAmount = null;
    }

    try {
      const res = await fetch('/api/penalty-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setShowPenaltyModal(false);
        fetchPenaltyRules();
      } else {
        setFormError(data.error || 'Failed to create penalty rule');
      }
    } catch (err) {
      setFormError('Server error creating penalty rule');
    }
  };

  const handleDeletePenaltyRule = async (ruleId) => {
    if (!window.confirm('Delete this automated penalty rule?')) return;
    try {
      await fetch(`/api/penalty-rules/${ruleId}`, { method: 'DELETE' });
      fetchPenaltyRules();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunPenaltyJobNow = async () => {
    setIsProcessingPenaltyCheck(true);
    try {
      const res = await fetch('/api/penalty-rules/run-check', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Automated Penalty Engine completed!\nOverdue assignments checked: ${data.result.processedCount}\nPenalties applied: ${data.result.appliedCount}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Error running automated penalty engine job');
    } finally {
      setIsProcessingPenaltyCheck(false);
    }
  };

  return (
    <div className="dashboard-section-card" id="fee-structures">
      <div className="section-card-header">
        <div className="section-card-title">
          <Coins size={22} style={{ color: 'var(--odoo-purple)' }} />
          <div>
            <h2>Fee Structures & Discounts Engine</h2>
            <p>Define custom fee categories, automated late penalty triggers & scholarships</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {activeTab === 'penalties' ? (
            <>
              <button 
                className="action-btn-secondary"
                onClick={handleRunPenaltyJobNow}
                disabled={isProcessingPenaltyCheck}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Play size={14} />
                <span>{isProcessingPenaltyCheck ? 'Running Engine...' : 'Run Daily Check Now'}</span>
              </button>
              <button className="action-btn-primary" onClick={() => setShowPenaltyModal(true)}>
                <Plus size={16} />
                <span>Add Penalty Rule</span>
              </button>
            </>
          ) : (
            <button className="action-btn-primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              <span>Create Fee Structure</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="role-tabs-container" style={{ width: 'fit-content', marginBottom: '20px' }}>
        <button 
          className={`role-tab-btn ${activeTab === 'structures' ? 'active' : ''}`}
          onClick={() => setActiveTab('structures')}
        >
          <Coins size={14} />
          <span>Active Fee Types ({safeFeeTypes.length})</span>
        </button>

        <button 
          className={`role-tab-btn ${activeTab === 'penalties' ? 'active' : ''}`}
          onClick={() => setActiveTab('penalties')}
        >
          <Gavel size={14} />
          <span>Late Penalty Rules ({penaltyRules.length})</span>
        </button>

        <button 
          className={`role-tab-btn ${activeTab === 'waivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('waivers')}
        >
          <Gift size={14} />
          <span>Waivers & Scholarships Log ({safeWaivers.length})</span>
        </button>
      </div>

      {activeTab === 'structures' ? (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fee Name & Category</th>
                <th>Applicable Target</th>
                <th>Amount</th>
                <th>Billing Recurrence</th>
                <th>Due Date Rule</th>
                <th>Late Penalty Trigger</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeFeeTypes.map((fee) => (
                <tr key={fee.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{fee.name}</div>
                    <span 
                      style={{ 
                        fontSize: '0.74rem', 
                        padding: '2px 8px', 
                        borderRadius: 'var(--radius-pill)', 
                        background: 'var(--odoo-purple-light)', 
                        color: 'var(--odoo-purple)',
                        fontWeight: 700
                      }}
                    >
                      {fee.category}
                    </span>
                  </td>

                  <td>{fee.applicableTo || fee.targetScope}</td>

                  <td style={{ fontWeight: 700 }}>₹{(Number(fee.amount)).toLocaleString('en-IN')}</td>

                  <td>{fee.recurrence}</td>

                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{fee.dueDateRule || '30 days from assignment'}</td>

                  <td style={{ fontSize: '0.82rem', color: '#9F1239' }}>{fee.lateFeeRule || 'Rule configured'}</td>

                  <td>
                    <span className="badge-status paid">
                      <CheckCircle2 size={12} />
                      Active
                    </span>
                  </td>

                  <td>
                    <div className="row-actions-group" style={{ justifyContent: 'flex-end' }}>
                      <button 
                        className="icon-btn-action" 
                        title="Deactivate Fee Structure"
                        onClick={() => onDeactivateFeeType(fee.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'penalties' ? (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Associated Fee Type</th>
                <th>Trigger Policy</th>
                <th>Penalty Amount / Rate</th>
                <th>Auto-Apply Cron</th>
                <th>Created Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {penaltyRules.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No penalty rules defined yet. Click "Add Penalty Rule" to configure automated late fee triggers.
                  </td>
                </tr>
              ) : (
                penaltyRules.map((rule) => (
                  <tr key={rule.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{rule.feeType?.name || 'Fee Type'}</div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Category: {rule.feeType?.category}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#9F1239' }}>
                        {rule.triggerDaysAfterDue} days after due date
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {rule.penaltyAmount ? `Flat ₹${Number(rule.penaltyAmount).toLocaleString('en-IN')}` : `${rule.penaltyPercent}% of original fee`}
                    </td>
                    <td>
                      {rule.autoApply ? (
                        <span className="badge-status paid">Auto-Apply Enabled</span>
                      ) : (
                        <span style={{ background: '#F3F4F6', color: '#4B5563', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Manual Review</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(rule.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td>
                      <div className="row-actions-group" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="icon-btn-action" 
                          title="Delete Penalty Rule"
                          onClick={() => handleDeletePenaltyRule(rule.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name & Class</th>
                <th>Fee Category</th>
                <th>Waiver Discount</th>
                <th>Reason</th>
                <th>Approved By (Audit Trail)</th>
                <th>Applied Date</th>
              </tr>
            </thead>
            <tbody>
              {safeWaivers.map((wav) => (
                <tr key={wav.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{wav.studentName}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{wav.classGrade}</div>
                  </td>

                  <td>{wav.feeName}</td>

                  <td style={{ fontWeight: 700, color: 'var(--accent-blue-text)' }}>{wav.amountOrPercent}</td>

                  <td style={{ fontSize: '0.84rem' }}>{wav.reason}</td>

                  <td style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--odoo-purple)' }} />
                    {wav.approvedBy}
                  </td>

                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{wav.appliedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Fee Structure Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Dynamic Fee Structure</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Fee Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Science Lab & Robotics Fee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="select-filter" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', height: '48px' }}>
                    <option value="Tuition">Tuition</option>
                    <option value="Transport">Transport</option>
                    <option value="Late Fee">Late Fee</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="e.g. 12000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Applicable Scope</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Grades 9, 10 or Whole School"
                  value={applicableTo}
                  onChange={(e) => setApplicableTo(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-submit-primary" style={{ marginTop: '12px' }}>
                Save Fee Structure
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FIX 2: Create Penalty Rule Modal */}
      {showPenaltyModal && (
        <div className="modal-overlay" onClick={() => setShowPenaltyModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Configure Automated Penalty Rule</h3>
              <button className="close-btn" onClick={() => setShowPenaltyModal(false)}>✕</button>
            </div>

            {formError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePenaltyRule}>
              <div className="form-group">
                <label className="form-label">Select Base Fee Type</label>
                <select 
                  className="select-filter" 
                  value={selectedFeeTypeId} 
                  onChange={(e) => setSelectedFeeTypeId(e.target.value)}
                  style={{ width: '100%', height: '48px' }}
                >
                  <option value="">-- Choose Fee Type --</option>
                  {safeFeeTypes.map((ft) => (
                    <option key={ft.id} value={ft.dbId || ft.id}>
                      {ft.name} ({ft.category} - ₹{Number(ft.amount).toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trigger Days After Due Date</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="e.g. 15"
                  value={triggerDaysAfterDue}
                  onChange={(e) => setTriggerDaysAfterDue(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Penalty Calculation Type</label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="penaltyType" 
                      value="flat" 
                      checked={penaltyType === 'flat'}
                      onChange={() => setPenaltyType('flat')} 
                    />
                    <span>Flat Amount (₹)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="penaltyType" 
                      value="percent" 
                      checked={penaltyType === 'percent'}
                      onChange={() => setPenaltyType('percent')} 
                    />
                    <span>Percentage (%)</span>
                  </label>
                </div>
              </div>

              {penaltyType === 'flat' ? (
                <div className="form-group">
                  <label className="form-label">Penalty Flat Amount (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="e.g. 500"
                    value={penaltyAmountVal}
                    onChange={(e) => setPenaltyAmountVal(e.target.value)}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Penalty Percentage (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="form-input" 
                    placeholder="e.g. 2.5"
                    value={penaltyPercentVal}
                    onChange={(e) => setPenaltyPercentVal(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                  <input 
                    type="checkbox" 
                    checked={autoApply}
                    onChange={(e) => setAutoApply(e.target.checked)}
                    style={{ accentColor: 'var(--odoo-purple)', width: '16px', height: '16px' }}
                  />
                  Enable Auto-Apply Daily Cron Job
                </label>
              </div>

              <button type="submit" className="btn-submit-primary" style={{ marginTop: '12px' }}>
                Save Penalty Rule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
