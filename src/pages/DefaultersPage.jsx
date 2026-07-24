import React from 'react';
import { useNavigate } from 'react-router-dom';
import DefaulterTracking from '../components/DefaulterTracking';

export default function DefaultersPage({ 
  defaulters, 
  onSendReminder, 
  onApplyPenalty, 
  onSelectStudentForLedger, 
  onBulkAction 
}) {
  const navigate = useNavigate();

  const handleViewLedger = (stuId) => {
    onSelectStudentForLedger(stuId);
    navigate('/student-ledger');
  };

  return (
    <div className="defaulters-page-wrapper">
      <DefaulterTracking 
        defaulters={defaulters}
        onSendReminder={onSendReminder}
        onApplyPenalty={onApplyPenalty}
        onViewLedger={handleViewLedger}
        onBulkAction={onBulkAction}
      />
    </div>
  );
}
