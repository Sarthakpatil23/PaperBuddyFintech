import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReconciliationWorkspace from '../components/ReconciliationWorkspace';

export default function ReconciliationPage({ 
  queue, 
  onReconcileEntry, 
  onFlagBounce, 
  onResolveFlag, 
  onSelectStudentForLedger 
}) {
  const navigate = useNavigate();

  const handleJumpToLedger = (stuId) => {
    onSelectStudentForLedger(stuId);
    navigate('/student-ledger');
  };

  return (
    <div className="reconciliation-page-wrapper">
      <ReconciliationWorkspace 
        queue={queue}
        onReconcileEntry={onReconcileEntry}
        onFlagBounce={onFlagBounce}
        onResolveFlag={onResolveFlag}
        onJumpToStudentLedger={handleJumpToLedger}
      />
    </div>
  );
}
