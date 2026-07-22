import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  ShieldAlert, 
  Receipt, 
  BarChart3, 
  Coins, 
  UserCheck, 
  Bell, 
  FileText, 
  PlusCircle, 
  LogOut, 
  Check,
  Sun,
  Moon
} from 'lucide-react';

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
import OverviewCards from './components/OverviewCards';
import RevenueCharts from './components/RevenueCharts';
import DefaulterTracking from './components/DefaulterTracking';
import TransactionsLog from './components/TransactionsLog';
import ReconciliationWorkspace from './components/ReconciliationWorkspace';
import FeeStructureManager from './components/FeeStructureManager';
import StudentLedgerView from './components/StudentLedgerView';
import ActivityFeed from './components/ActivityFeed';
import ReportGeneratorModal from './components/ReportGeneratorModal';
import QuickActionsModal from './components/QuickActionsModal';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'dashboard'
  const [authUser, setAuthUser] = useState(null);
  const [activeNav, setActiveNav] = useState('overview');

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
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [defaulters, setDefaulters] = useState(INITIAL_DEFAULTERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [reconciliationQueue, setReconciliationQueue] = useState(INITIAL_RECONCILIATION_QUEUE);
  const [feeTypes, setFeeTypes] = useState(INITIAL_FEE_STRUCTURES);
  const [waivers, setWaivers] = useState(INITIAL_WAIVERS);
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

  const handleJumpToSection = (sectionId) => {
    setActiveNav(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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

  const handleReconcileEntries = (ids) => {
    setReconciliationQueue((prev) => 
      prev.map((q) => ids.includes(q.id) ? { ...q, status: 'reconciled', clearingStatus: 'Bank Reconciled & Cleared' } : q)
    );
    showToast(`Marked ${ids.length} entry(s) as Bank Reconciled.`);
  };

  const handleFlagBounce = (recEntry) => {
    setReconciliationQueue((prev) => 
      prev.map((q) => q.id === recEntry.id ? { ...q, status: 'flagged', clearingStatus: 'Bounced - Discrepancy Flagged' } : q)
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

  // 2. DASHBOARD VIEW (AFTER SUCCESSFUL LOGIN)
  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-icon">
            <Building2 size={20} />
          </div>
          <span className="brand-title">
            PaperBuddy <span>Admin</span>
          </span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item-btn ${activeNav === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveNav('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button 
            className={`nav-item-btn ${activeNav === 'defaulters' ? 'active' : ''}`}
            onClick={() => setActiveNav('defaulters')}
          >
            <ShieldAlert size={18} />
            <span>Defaulter Tracking</span>
            <span className="nav-item-badge">{defaulters.length}</span>
          </button>

          <button 
            className={`nav-item-btn ${activeNav === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveNav('transactions')}
          >
            <Receipt size={18} />
            <span>Transactions Log</span>
          </button>

          <button 
            className={`nav-item-btn ${activeNav === 'reconciliation' ? 'active' : ''}`}
            onClick={() => setActiveNav('reconciliation')}
          >
            <BarChart3 size={18} />
            <span>Reconciliation</span>
          </button>

          <button 
            className={`nav-item-btn ${activeNav === 'fee-structures' ? 'active' : ''}`}
            onClick={() => setActiveNav('fee-structures')}
          >
            <Coins size={18} />
            <span>Fee Structures</span>
          </button>

          <button 
            className={`nav-item-btn ${activeNav === 'student-ledger' ? 'active' : ''}`}
            onClick={() => setActiveNav('student-ledger')}
          >
            <UserCheck size={18} />
            <span>Student Ledger</span>
          </button>

          <button 
            className={`nav-item-btn ${activeNav === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveNav('activity')}
          >
            <Bell size={18} />
            <span>Audit & Activity</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div>User: <strong>{authUser?.email || 'admin@paperbuddy.edu'}</strong></div>
          <div style={{ color: 'var(--accent-blue-text)', fontWeight: 600 }}>Role: {authUser?.roleLabel || 'School Admin'}</div>

          {/* Theme Toggle Switch */}
          <div className="theme-toggle-container">
            <div className="theme-toggle-label">
              {theme === 'dark' ? <Moon size={15} style={{ color: 'var(--odoo-purple)' }} /> : <Sun size={15} style={{ color: '#F59E0B' }} />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <button 
              type="button"
              className={`theme-switch-btn ${theme === 'dark' ? 'dark' : ''}`}
              onClick={toggleTheme}
              title="Toggle Odoo Dark/Light Theme"
            >
              <div className="theme-switch-thumb" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-title-group">
            <h1>School Fee Operations Dashboard</h1>
            <p>Welcome back, <strong>{authUser?.roleLabel || 'School Admin'}</strong> ({authUser?.email})</p>
          </div>

          <div className="header-controls">
            <button 
              className="action-btn-secondary"
              onClick={() => setShowReportModal(true)}
            >
              <FileText size={15} />
              <span>Reports & Export</span>
            </button>

            <button 
              className="action-btn-primary"
              onClick={() => setQuickActionModal({ mode: 'recordPayment' })}
            >
              <PlusCircle size={16} />
              <span>Record Payment</span>
            </button>

            <button 
              className="action-btn-secondary"
              style={{ color: '#9F1239', borderColor: '#FFE4E6', background: '#FFF1F2' }}
              onClick={handleSignOut}
              title="Sign Out to Login Page"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-body">
          {/* Section 1: Overview Stat Cards */}
          <OverviewCards 
            data={overview} 
            onJumpToSection={handleJumpToSection} 
          />

          {/* Section 3: Defaulter Tracking */}
          <DefaulterTracking 
            defaulters={defaulters}
            onSendReminder={handleSendReminder}
            onApplyPenalty={(def) => setQuickActionModal({ mode: 'bulkPenalty', student: def })}
            onViewLedger={(stuId) => {
              setSelectedStudentForLedger(stuId);
              setActiveNav('student-ledger');
            }}
            onBulkAction={handleBulkDefaulterAction}
          />

          {/* Section 2: Revenue Breakdown & Charts */}
          <RevenueCharts 
            onFilterByFeeType={(feeName) => {
              setActiveFeeFilter(feeName);
              setActiveNav('transactions');
            }} 
          />

          {/* Section 5: Reconciliation Workspace */}
          <ReconciliationWorkspace 
            queue={reconciliationQueue}
            onReconcileEntry={handleReconcileEntries}
            onFlagBounce={handleFlagBounce}
          />

          {/* Section 4: Transactions Log */}
          <TransactionsLog 
            transactions={transactions}
            activeFeeFilter={activeFeeFilter}
            onSelectTransaction={(txn) => {
              showToast(`Receipt #${txn.receiptNo} — Status: ${txn.status} (${txn.paymentMethod})`);
            }}
          />

          {/* Section 6: Fee Structure Management */}
          <FeeStructureManager 
            feeTypes={feeTypes}
            waivers={waivers}
            onCreateFeeType={handleCreateFeeType}
            onDeactivateFeeType={handleDeactivateFeeType}
          />

          {/* Section 7: Student Ledger View */}
          <StudentLedgerView 
            students={students}
            selectedStudentId={selectedStudentForLedger}
            onRecordPaymentClick={(stu) => setQuickActionModal({ mode: 'recordPayment', student: stu })}
          />

          {/* Section 9: Notifications / Activity Feed */}
          <ActivityFeed activities={activities} />
        </div>
      </main>

      {/* Report Generator Modal */}
      {showReportModal && (
        <ReportGeneratorModal 
          onClose={() => setShowReportModal(false)}
          onDownloadReport={(cfg) => showToast(`Downloaded ${cfg.reportType} report as ${cfg.format.toUpperCase()}!`)}
        />
      )}

      {/* Quick Action Modal */}
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

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="notification-toast success">
          <Check size={18} style={{ color: 'var(--accent-blue-text)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
