import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { 
  INITIAL_OVERVIEW, 
  INITIAL_STUDENTS, 
  INITIAL_DEFAULTERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_RECONCILIATION_QUEUE, 
  INITIAL_FEE_STRUCTURES, 
  INITIAL_WAIVERS, 
  INITIAL_ACTIVITY_LOG 
} from './data/mockData';

import LoginPage from './components/LoginPage';
import AppLayout from './components/AppLayout';

import OverviewPage from './pages/OverviewPage';
import DefaultersPage from './pages/DefaultersPage';
import TransactionsPage from './pages/TransactionsPage';
import ReconciliationPage from './pages/ReconciliationPage';
import FeeStructuresPage from './pages/FeeStructuresPage';
import StudentLedgerPage from './pages/StudentLedgerPage';
import AuditActivityPage from './pages/AuditActivityPage';

import ReportGeneratorModal from './components/ReportGeneratorModal';
import QuickActionsModal from './components/QuickActionsModal';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'dashboard'
  const [authUser, setAuthUser] = useState(null);

  // Theme State (Dark / Light Mode)
  const [theme, setTheme] = useState(() => localStorage.getItem('paperbuddy_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('paperbuddy_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Dynamic State Layer
  const [overview, setOverview] = useState(INITIAL_OVERVIEW);
  const [students] = useState(INITIAL_STUDENTS);
  const [defaulters] = useState(INITIAL_DEFAULTERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [reconciliationQueue, setReconciliationQueue] = useState(INITIAL_RECONCILIATION_QUEUE);
  const [feeTypes, setFeeTypes] = useState(INITIAL_FEE_STRUCTURES);
  const [waivers] = useState(INITIAL_WAIVERS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITY_LOG);

  // Filter state for cross-component drill down
  const [activeFeeFilter, setActiveFeeFilter] = useState(null);
  const [selectedStudentForLedger, setSelectedStudentForLedger] = useState('STU-101');

  // Modal Dialog States
  const [showReportModal, setShowReportModal] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLoginSuccess = (userObj) => {
    setAuthUser(userObj);
    setCurrentView('dashboard');
    showToast(`Signed in successfully as ${userObj.roleLabel}!`);
  };

  const handleSignOut = () => {
    setAuthUser(null);
    setCurrentView('login');
    showToast('Signed out of PaperBuddy portal.');
  };

  const handleRecordPaymentSubmit = (paymentData) => {
    const newTxnId = `TXN-${Math.floor(8900 + Math.random() * 1000)}`;
    const newReceiptNo = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTxn = {
      id: newTxnId,
      dateTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      studentId: paymentData.studentId,
      studentName: paymentData.studentName,
      classGrade: paymentData.classGrade,
      feeType: paymentData.feeType,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      status: paymentData.paymentMethod === 'Cheque' ? 'Pending' : 'Paid',
      processedBy: authUser?.email || 'Admin Staff',
      receiptNo: newReceiptNo,
      reconciled: false,
    };

    setTransactions([newTxn, ...transactions]);

    if (paymentData.paymentMethod === 'Cash' || paymentData.paymentMethod === 'Cheque') {
      const newRecEntry = {
        id: `REC-${Math.floor(600 + Math.random() * 900)}`,
        txnId: newTxnId,
        dateTime: newTxn.dateTime,
        studentName: paymentData.studentName,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        recordedBy: authUser?.email || 'Admin Staff',
        chequeNo: paymentData.chequeNo || null,
        bankName: paymentData.bankName || null,
        depositDate: new Date().toISOString().slice(0, 10),
        clearingStatus: paymentData.paymentMethod === 'Cheque' ? 'Deposited - Pending Clearing' : 'Counter Cash Verified',
        status: 'pending',
      };
      setReconciliationQueue([newRecEntry, ...reconciliationQueue]);
    }

    setOverview((prev) => ({
      ...prev,
      totalCollected: prev.totalCollected + paymentData.amount,
      outstandingDues: Math.max(0, prev.outstandingDues - paymentData.amount),
    }));

    setActivities([
      {
        id: `ACT-${Date.now()}`,
        actor: authUser?.email || 'Admin Staff',
        actionType: 'Payment Recorded',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        description: `Recorded ₹${paymentData.amount.toLocaleString('en-IN')} payment (${paymentData.paymentMethod}) for ${paymentData.studentName}.`,
        isAnomaly: false,
      },
      ...activities,
    ]);

    showToast(`Payment recorded successfully! Receipt #${newReceiptNo}`);
  };

  const handleReconcileEntries = (ids, bankRef) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setReconciliationQueue((prev) => 
      prev.map((q) => ids.includes(q.id) ? { 
        ...q, 
        status: 'reconciled', 
        clearingStatus: 'Bank Reconciled & Cleared',
        reconciledDetails: {
          reconciledAt: now,
          reconciledBy: authUser?.email || 'Admin Staff',
          bankRef: bankRef || 'STMT-2026-AUTO'
        }
      } : q)
    );

    const targetTxnIds = reconciliationQueue.filter((q) => ids.includes(q.id)).map((q) => q.txnId);
    setTransactions((prev) =>
      prev.map((t) => targetTxnIds.includes(t.id) ? { ...t, reconciled: true } : t)
    );

    showToast(`Marked ${ids.length} entry(s) as Bank Reconciled.`);
  };

  const handleFlagBounce = (recEntry) => {
    setReconciliationQueue((prev) => 
      prev.map((q) => q.id === recEntry.id ? { 
        ...q, 
        status: 'flagged', 
        clearingStatus: 'Bounced - Discrepancy Flagged',
        flagDetails: recEntry.flagDetails || {
          reason: 'Cheque Bounced',
          note: 'Bounced cheque dishonour memo received',
          flaggedBy: authUser?.email || 'Admin Staff',
          flaggedDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      } : q)
    );

    setTransactions((prev) =>
      prev.map((t) => t.id === recEntry.txnId ? { ...t, status: 'Bounced' } : t)
    );

    setOverview((prev) => ({
      ...prev,
      outstandingDues: prev.outstandingDues + recEntry.amount,
    }));

    setActivities([
      {
        id: `ACT-${Date.now()}`,
        actor: 'Bank Clearing Rail',
        actionType: 'Cheque Bounced',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        description: `Bounced Cheque flagged for ${recEntry.studentName} (₹${recEntry.amount.toLocaleString('en-IN')}). Balance automatically reopened.`,
        isAnomaly: true,
      },
      ...activities,
    ]);

    showToast(`Cheque marked as Bounced. Re-opened balance for ${recEntry.studentName}.`);
  };

  const handleResolveFlag = (recId, resolutionType, note) => {
    const entry = reconciliationQueue.find((q) => q.id === recId);
    if (!entry) return;

    if (resolutionType === 'bounced') {
      handleFlagBounce(entry);
    } else {
      setReconciliationQueue((prev) =>
        prev.map((q) => q.id === recId ? { 
          ...q, 
          status: 'reconciled', 
          clearingStatus: 'Resolved & Bank Reconciled',
          reconciledDetails: {
            reconciledAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            reconciledBy: authUser?.email || 'Admin Staff',
            bankRef: 'RESOLVED-ADJUSTMENT'
          }
        } : q)
      );

      setActivities([
        {
          id: `ACT-${Date.now()}`,
          actor: authUser?.email || 'Admin Staff',
          actionType: 'Discrepancy Resolved',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          description: `Resolved discrepancy for ${entry.studentName} (₹${entry.amount.toLocaleString('en-IN')}). Note: ${note}`,
          isAnomaly: false,
        },
        ...activities,
      ]);

      showToast(`Discrepancy resolved for ${entry.studentName}.`);
    }
  };

  const handleRefundTransaction = (txnId, reason, note) => {
    const txn = transactions.find((t) => t.id === txnId);
    if (!txn) return;

    setTransactions((prev) => 
      prev.map((t) => t.id === txnId ? { 
        ...t, 
        status: 'Refunded', 
        refundDetails: {
          refundedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reason,
          note,
          refundedBy: authUser?.email || 'Admin Staff'
        }
      } : t)
    );

    setOverview((prev) => ({
      ...prev,
      outstandingDues: prev.outstandingDues + txn.amount
    }));

    setActivities([
      {
        id: `ACT-${Date.now()}`,
        actor: authUser?.email || 'Admin Staff',
        actionType: 'Refund Issued',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        description: `Issued refund of ₹${txn.amount.toLocaleString('en-IN')} for receipt #${txn.receiptNo} (${txn.studentName}). Reason: ${reason}. Note: ${note}`,
        isAnomaly: false
      },
      ...activities
    ]);

    showToast(`Refund processed for receipt #${txn.receiptNo}. Reopened ₹${txn.amount.toLocaleString('en-IN')} balance.`);
  };

  const handleCreateFeeType = (newFee) => {
    setFeeTypes([...feeTypes, newFee]);
    showToast(`Created fee structure: ${newFee.name}`);
  };

  const handleDeactivateFeeType = (id) => {
    setFeeTypes(feeTypes.filter((f) => f.id !== id));
    showToast('Fee structure deactivated.');
  };

  const handleSendReminder = (defaulterObj) => {
    showToast(`Reminder sent to parent of ${defaulterObj.studentName || defaulterObj.name}!`);
  };

  const handleBulkDefaulterAction = (type, ids) => {
    showToast(`Executed bulk ${type} action on ${ids.length} defaulter student(s).`);
  };

  // 1. LANDING VIEW: LOGIN PAGE
  if (currentView === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 2. MULTI-PAGE APPLICATION ROUTES WRAPPED IN APPLAYOUT
  return (
    <>
      <Routes>
        <Route 
          element={
            <AppLayout 
              defaultersCount={defaulters.length}
              authUser={authUser}
              theme={theme}
              toggleTheme={toggleTheme}
              onSignOut={handleSignOut}
              onShowReportModal={() => setShowReportModal(true)}
              onRecordPaymentClick={() => setQuickActionModal({ mode: 'recordPayment' })}
              toastMessage={toastMessage}
            />
          }
        >
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route 
            path="/overview" 
            element={
              <OverviewPage 
                overview={overview}
                defaulters={defaulters}
                onFilterByFeeType={(feeName) => setActiveFeeFilter(feeName)}
                onSelectStudentForLedger={(stuId) => setSelectedStudentForLedger(stuId)}
                onSendReminder={handleSendReminder}
              />
            } 
          />
          <Route 
            path="/defaulters" 
            element={
              <DefaultersPage 
                defaulters={defaulters}
                onSendReminder={handleSendReminder}
                onApplyPenalty={(def) => setQuickActionModal({ mode: 'bulkPenalty', student: def })}
                onSelectStudentForLedger={(stuId) => setSelectedStudentForLedger(stuId)}
                onBulkAction={handleBulkDefaulterAction}
              />
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <TransactionsPage 
                transactions={transactions}
                activeFeeFilter={activeFeeFilter}
                onRecordPaymentClick={() => setQuickActionModal({ mode: 'recordPayment' })}
                onSelectStudentForLedger={(stuId) => setSelectedStudentForLedger(stuId)}
                onRefundTransaction={handleRefundTransaction}
                onBulkReconcile={handleReconcileEntries}
              />
            } 
          />
          <Route 
            path="/reconciliation" 
            element={
              <ReconciliationPage 
                queue={reconciliationQueue}
                onReconcileEntry={handleReconcileEntries}
                onFlagBounce={handleFlagBounce}
                onResolveFlag={handleResolveFlag}
                onSelectStudentForLedger={(stuId) => setSelectedStudentForLedger(stuId)}
              />
            } 
          />
          <Route 
            path="/fee-structures" 
            element={
              <FeeStructuresPage 
                feeTypes={feeTypes}
                waivers={waivers}
                onCreateFeeType={handleCreateFeeType}
                onDeactivateFeeType={handleDeactivateFeeType}
              />
            } 
          />
          <Route 
            path="/student-ledger" 
            element={
              <StudentLedgerPage 
                students={students}
                selectedStudentId={selectedStudentForLedger}
                onRecordPaymentClick={(stu) => setQuickActionModal({ mode: 'recordPayment', student: stu })}
              />
            } 
          />
          <Route 
            path="/audit-activity" 
            element={
              <AuditActivityPage activities={activities} />
            } 
          />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>

      {/* Global Report Generator Modal */}
      {showReportModal && (
        <ReportGeneratorModal 
          onClose={() => setShowReportModal(false)}
          onDownloadReport={(cfg) => showToast(`Downloaded ${cfg.reportType} report as ${cfg.format.toUpperCase()}!`)}
        />
      )}

      {/* Global Quick Action Modal */}
      {quickActionModal && (
        <QuickActionsModal 
          mode={quickActionModal.mode}
          student={quickActionModal.student}
          onClose={() => setQuickActionModal(null)}
          onSubmitPayment={handleRecordPaymentSubmit}
          onSendReminder={handleSendReminder}
          onBulkPenalty={(amt) => showToast(`Applied ₹${amt} late fee penalty policy.`)}
        />
      )}
    </>
  );
}
