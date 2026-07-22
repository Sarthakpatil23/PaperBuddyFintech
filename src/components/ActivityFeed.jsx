import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw, 
  Coins 
} from 'lucide-react';

export default function ActivityFeed({ activities }) {
  return (
    <div className="dashboard-section-card" id="activity-feed">
      <div className="section-card-header">
        <div className="section-card-title">
          <Bell size={22} style={{ color: 'var(--odoo-purple)' }} />
          <div>
            <h2>Real-time Audit & Activity Feed</h2>
            <p>System events, administrative approvals & anomaly alerts</p>
          </div>
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {activities.length} Recent Events
        </span>
      </div>

      <div className="activity-feed-list">
        {activities.map((act) => (
          <div key={act.id} className={`activity-item ${act.isAnomaly ? 'anomaly' : ''}`}>
            <div className="activity-icon">
              {act.isAnomaly ? (
                <AlertTriangle size={18} style={{ color: '#E11D48' }} />
              ) : act.actionType.includes('Penalty') ? (
                <Coins size={18} style={{ color: 'var(--odoo-purple)' }} />
              ) : act.actionType.includes('Waiver') ? (
                <ShieldCheck size={18} style={{ color: 'var(--accent-blue-text)' }} />
              ) : (
                <CheckCircle2 size={18} style={{ color: 'var(--accent-blue-text)' }} />
              )}
            </div>

            <div className="activity-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{act.actionType}</span>
                {act.isAnomaly && (
                  <span className="badge-status severe" style={{ fontSize: '0.7rem' }}>ANOMALY ALERT</span>
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>{act.description}</p>
              <div className="activity-meta">
                <span>Actor: <strong>{act.actor}</strong></span>
                <span>•</span>
                <span>{act.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
