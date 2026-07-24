import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionsLog from '../components/TransactionsLog';

export default function TransactionsPage({ 
  transactions, 
  activeFeeFilter, 
  onRecordPaymentClick, 
  onSelectStudentForLedger, 
  onRefundTransaction, 
  onBulkReconcile 
}) {
  const navigate = useNavigate();

  const handleJumpToLedger = (stuId) => {
    onSelectStudentForLedger(stuId);
    navigate('/student-ledger');
  };

  return (
    <div className="transactions-page-wrapper">
      <TransactionsLog 
        transactions={transactions}
        activeFeeFilter={activeFeeFilter}
        onRecordPaymentClick={onRecordPaymentClick}
        onJumpToStudentLedger={handleJumpToLedger}
        onRefundTransaction={onRefundTransaction}
        onBulkReconcile={onBulkReconcile}
      />
    </div>
  );
}
