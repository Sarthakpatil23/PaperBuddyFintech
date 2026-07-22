import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  PlusCircle, 
  CreditCard, 
  ShieldCheck, 
  Receipt, 
  Clock 
} from 'lucide-react';

export default function StudentLedgerView({ 
  students, 
  selectedStudentId, 
  onRecordPaymentClick 
}) {
  const [activeStudentId, setActiveStudentId] = useState(selectedStudentId || students[0]?.id || 'STU-101');
  const [searchQuery, setSearchQuery] = useState('');

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const filteredStudents = students.filter((s) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.classGrade.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <button 
          className="action-btn-primary" 
          onClick={() => onRecordPaymentClick(currentStudent)}
        >
          <PlusCircle size={16} />
          <span>Record Counter Payment</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="filter-bar" style={{ marginBottom: '24px' }}>
        <div className="global-search-box" style={{ width: '100%', maxWidth: '400px' }}>
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
                background: s.id === activeStudentId ? 'var(--odoo-purple)' : 'white',
                color: s.id === activeStudentId ? 'white' : 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {s.name} ({s.classGrade})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Student Ledger Header Card */}
      {currentStudent && (
        <div>
          <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentStudent.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  {currentStudent.classGrade} | ID: {currentStudent.id} | Parent: {currentStudent.parentName} ({currentStudent.phone})
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Billed</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{(currentStudent.totalBilled).toLocaleString('en-IN')}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Paid</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-blue-text)' }}>₹{(currentStudent.totalPaid).toLocaleString('en-IN')}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Waived/Discount</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--odoo-purple)' }}>₹{(currentStudent.totalWaived).toLocaleString('en-IN')}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9F1239', fontWeight: 600 }}>Outstanding Balance</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9F1239' }}>₹{(currentStudent.balanceDue).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            {/* Chronological Timeline View */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} />
              Chronological Financial Event Timeline
            </h4>

            <div className="ledger-timeline">
              <div className="timeline-node">
                <div className="node-dot" />
                <div className="node-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>Payment Received via UPI</span>
                    <span style={{ color: 'var(--accent-blue-text)' }}>+ ₹35,000</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Receipt #RCP-2026-0891 | 2026-07-22</div>
                </div>
              </div>

              <div className="timeline-node">
                <div className="node-dot" style={{ background: 'var(--accent-blue)' }} />
                <div className="node-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>Waiver Approved (Sports Scholarship)</span>
                    <span style={{ color: 'var(--odoo-purple)' }}>- ₹5,000</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Approved by Principal Dr. R. K. Kapoor | 2026-07-02</div>
                </div>
              </div>

              <div className="timeline-node">
                <div className="node-dot" style={{ background: '#9F1239' }} />
                <div className="node-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>Quarterly Tuition Billed (Q2)</span>
                    <span style={{ color: '#9F1239' }}>₹45,000 Billed</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Due Date: 10th July 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
