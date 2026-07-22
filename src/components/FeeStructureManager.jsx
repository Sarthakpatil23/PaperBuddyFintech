import React, { useState } from 'react';
import { 
  Coins, 
  Plus, 
  Gavel, 
  Gift, 
  CheckCircle2, 
  Trash2, 
  ShieldCheck 
} from 'lucide-react';

export default function FeeStructureManager({ 
  feeTypes, 
  waivers, 
  onCreateFeeType, 
  onDeactivateFeeType,
  onApplyWaiver 
}) {
  const [activeTab, setActiveTab] = useState('structures'); // 'structures' | 'waivers'
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for New Fee Type
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tuition');
  const [applicableTo, setApplicableTo] = useState('Grades 11, 12');
  const [amount, setAmount] = useState('');
  const [recurrence, setRecurrence] = useState('Quarterly');
  const [dueDateRule, setDueDateRule] = useState('10th of first month');
  const [lateFeeRule, setLateFeeRule] = useState('Flat ₹500 penalty');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    onCreateFeeType({
      id: `FEE-0${feeTypes.length + 1}`,
      name,
      category,
      applicableTo,
      amount: parseFloat(amount),
      recurrence,
      dueDateRule,
      lateFeeRule,
      status: 'Active',
    });

    setName('');
    setAmount('');
    setShowCreateModal(false);
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
          <button className="action-btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            <span>Create Fee Structure</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="role-tabs-container" style={{ width: 'fit-content', marginBottom: '20px' }}>
        <button 
          className={`role-tab-btn ${activeTab === 'structures' ? 'active' : ''}`}
          onClick={() => setActiveTab('structures')}
        >
          <Coins size={14} />
          <span>Active Fee Types ({feeTypes.length})</span>
        </button>

        <button 
          className={`role-tab-btn ${activeTab === 'waivers' ? 'active' : ''}`}
          onClick={() => setActiveTab('waivers')}
        >
          <Gift size={14} />
          <span>Waivers & Scholarships Log ({waivers.length})</span>
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
              {feeTypes.map((fee) => (
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

                  <td>{fee.applicableTo}</td>

                  <td style={{ fontWeight: 700 }}>₹{(fee.amount).toLocaleString('en-IN')}</td>

                  <td>{fee.recurrence}</td>

                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{fee.dueDateRule}</td>

                  <td style={{ fontSize: '0.82rem', color: '#9F1239' }}>{fee.lateFeeRule}</td>

                  <td>
                    <span className="badge-status paid">
                      <CheckCircle2 size={12} />
                      {fee.status}
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
              {waivers.map((wav) => (
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

              <div className="form-group">
                <label className="form-label">Late Fee Penalty Trigger Policy</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Flat ₹500 after 15 days past due"
                  value={lateFeeRule}
                  onChange={(e) => setLateFeeRule(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-submit-primary" style={{ marginTop: '12px' }}>
                Save Fee Structure
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
