import React from 'react';
import ActivityFeed from '../components/ActivityFeed';

export default function AuditActivityPage({ activities }) {
  return (
    <div className="audit-activity-page-wrapper">
      <ActivityFeed activities={activities} />
    </div>
  );
}
