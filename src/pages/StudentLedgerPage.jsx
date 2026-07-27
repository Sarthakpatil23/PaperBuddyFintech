import React from 'react';
import StudentLedgerView from '../components/StudentLedgerView';

export default function StudentLedgerPage({ 
  students, 
  selectedStudentId, 
  onRecordPaymentClick,
  onStudentUpdated
}) {
  return (
    <div className="student-ledger-page-wrapper">
      <StudentLedgerView 
        students={students}
        selectedStudentId={selectedStudentId}
        onRecordPaymentClick={onRecordPaymentClick}
        onStudentUpdated={onStudentUpdated}
      />
    </div>
  );
}
