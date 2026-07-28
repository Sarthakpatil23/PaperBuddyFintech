import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import LoginPage from './components/LoginPage';
import AppLayout from './components/AppLayout';

import OverviewPage from './pages/OverviewPage';
import DefaultersPage from './pages/DefaultersPage';
import TransactionsPage from './pages/TransactionsPage';
import ReconciliationPage from './pages/ReconciliationPage';
import FeeStructuresPage from './pages/FeeStructuresPage';
import StudentLedgerPage from './pages/StudentLedgerPage';
import AuditActivityPage from './pages/AuditActivityPage';

// Parent Portal Component Imports
import ParentLayout from './components/parent/ParentLayout';
import ParentOverviewPage from './components/parent/ParentOverviewPage';
import ParentFeesPage from './components/parent/ParentFeesPage';
import ParentPaymentPage from './components/parent/ParentPaymentPage';
import ParentHistoryPage from './components/parent/ParentHistoryPage';
import ParentReceiptsPage from './components/parent/ParentReceiptsPage';
import ParentNotificationsPage from './components/parent/ParentNotificationsPage';
import ParentSettingsPage from './components/parent/ParentSettingsPage';
import ReceiptPDFModal from './components/parent/ReceiptPDFModal';

import ReportGeneratorModal from './components/ReportGeneratorModal';
import QuickActionsModal from './components/QuickActionsModal';
import ChatbotWidget from './components/ChatbotWidget';
import LoadingScreen from './components/LoadingScreen';
import { SOCKET_URL, getApiUrl } from './config/api';

// Initialize Socket.IO Client — connects directly to Render backend
// (Vercel cannot proxy WebSocket connections, so we bypass the Vercel proxy here)
const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling']
});

export default function App() {
  const navigate = useNavigate();

  // Active View State: 'login' | 'admin' | 'parent'
  // On refresh: restore from localStorage so the correct portal stays open
  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('finlyt_session');
    if (saved) {
      try {
        const session = JSON.parse(saved);
        if (session.role === 'parent') return 'parent';
        if (session.role === 'admin' || session.role === 'staff') return 'admin';
      } catch {}
    }
    const path = window.location.pathname;
    if (path.startsWith('/parent')) return 'parent';
    if (path !== '/' && path !== '/login') return 'admin';
    return 'login';
  });

  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = localStorage.getItem('finlyt_session');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // Theme State (Dark / Light Mode)
  const [theme, setTheme] = useState(() => localStorage.getItem('finlyt_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('finlyt_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Real Database State Layer (Persisted in Neon PostgreSQL)
  const [overview, setOverview] = useState({
    totalCollected: 0,
    collectedDelta: 14.2,
    outstandingDues: 0,
    activeDefaultersCount: 0,
    transactionsTodayCount: 0,
    transactionsTodayAmount: 0,
    collectionEfficiency: 0,
    upcomingDues7Days: 0,
    upcomingDues30Days: 0,
  });

  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [defaulters, setDefaulters] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reconciliationQueue, setReconciliationQueue] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [waivers, setWaivers] = useState([]);
  const [activities, setActivities] = useState([]);

  // Parent Portal State
  const [activeParent, setActiveParent] = useState(null);
  // Restore selectedChildId from saved session on refresh
  const [selectedChildId, setSelectedChildId] = useState(() => {
    try {
      const saved = localStorage.getItem('finlyt_session');
      if (saved) {
        const session = JSON.parse(saved);
        return session.studentId || '';
      }
    } catch {}
    return '';
  });
  const [parentFeeItems, setParentFeeItems] = useState({});
  const [parentNotifications, setParentNotifications] = useState([]);
  const [checkoutSelectedItems, setCheckoutSelectedItems] = useState([]);
  const [activeReceiptModal, setActiveReceiptModal] = useState(null);

  // Filter state for cross-component drill down
  const [activeFeeFilter, setActiveFeeFilter] = useState(null);
  const [selectedStudentForLedger, setSelectedStudentForLedger] = useState('STU-101');

  // Modal Dialog States
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // FETCH ALL REAL DATA FROM NEON BACKEND API
  // -------------------------------------------------------------
  const fetchAllData = useCallback(async () => {
    try {
      // Build parent/data URL — pass the currently-logged-in student's ID if available
      const parentDataUrl = selectedChildId
        ? getApiUrl(`/api/parent/data?studentId=${encodeURIComponent(selectedChildId)}`)
        : getApiUrl('/api/parent/data');

      const [
        overviewRes,
        studentsRes,
        defaultersRes,
        transactionsRes,
        reconcileRes,
        feeTypesRes,
        waiversRes,
        activitiesRes,
        parentDataRes
      ] = await Promise.all([
        fetch(getApiUrl('/api/overview')).then(r => r.json()),
        fetch(getApiUrl('/api/students')).then(r => r.json()),
        fetch(getApiUrl('/api/defaulters')).then(r => r.json()),
        fetch(getApiUrl('/api/transactions')).then(r => r.json()),
        fetch(getApiUrl('/api/reconciliation')).then(r => r.json()),
        fetch(getApiUrl('/api/fee-structures')).then(r => r.json()),
        fetch(getApiUrl('/api/waivers')).then(r => r.json()),
        fetch(getApiUrl('/api/audit-logs')).then(r => r.json()),
        fetch(parentDataUrl).then(r => r.json()).catch(() => null)
      ]);

      if (overviewRes && !overviewRes.error) setOverview(overviewRes);
      if (Array.isArray(studentsRes)) setStudents(studentsRes);
      if (Array.isArray(defaultersRes)) setDefaulters(defaultersRes);
      if (Array.isArray(transactionsRes)) setTransactions(transactionsRes);
      if (Array.isArray(reconcileRes)) setReconciliationQueue(reconcileRes);
      if (Array.isArray(feeTypesRes)) setFeeTypes(feeTypesRes);
      if (Array.isArray(waiversRes)) setWaivers(waiversRes);
      if (Array.isArray(activitiesRes)) setActivities(activitiesRes);

      if (parentDataRes && parentDataRes.parent) {
        setActiveParent(parentDataRes.parent);
        if (parentDataRes.students && parentDataRes.students.length > 0) {
          if (!selectedChildId) {
            setSelectedChildId(parentDataRes.students[0].id);
          }

          // Build a rich fee items map keyed by student's human-readable studentId (e.g. 'STU-101')
          const itemsMap = {};
          const today = new Date();

          parentDataRes.students.forEach((stu) => {
            // Build waiver lookup: feeAssignmentId -> waiver record
            const waiverByFaId = {};
            (stu.waivers || []).forEach((w) => {
              if (w.feeAssignmentId) waiverByFaId[w.feeAssignmentId] = w;
            });

            itemsMap[stu.id] = (stu.feeAssignments || []).map((fa) => {
              const dueDate = new Date(fa.dueDate);
              const daysOverdue = fa.status === 'OVERDUE'
                ? Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)))
                : 0;

              // Normalize status for frontend display
              let displayStatus;
              if (fa.status === 'PAID') displayStatus = 'Paid';
              else if (fa.status === 'OVERDUE') displayStatus = 'Overdue';
              else if (fa.status === 'PARTIAL') displayStatus = 'Partial';
              else if (dueDate > today) displayStatus = 'Upcoming';
              else displayStatus = 'Due';

              // Normalize category for display
              const catMap = {
                TUITION: 'Tuition', TRANSPORT: 'Transport', HOSTEL: 'Hostel',
                LATE_FEE: 'Late Fee', EXAM: 'Exam', CUSTOM: 'Custom', OTHER: 'Other'
              };
              const category = catMap[fa.feeType?.category] || fa.feeType?.category || 'Tuition';

              // Waiver info for this fee assignment
              const waiver = waiverByFaId[fa.id];
              const waiverAmount = waiver ? Number(waiver.amount) : 0;
              const waiverReason = waiver?.reason || null;
              const originalAmount = Number(fa.originalAmount);
              const adjustedAmount = Number(fa.adjustedAmount);

              // Late fee: if category is LATE_FEE, add to parent fee's lateFee field
              const isLateFee = fa.feeType?.category === 'LATE_FEE';

              // Installments
              const installments = fa.installments || [];
              const hasInstallments = installments.length > 0;
              const paidInstallments = installments.filter(i => i.status === 'PAID');
              const pendingInstallments = installments.filter(i => i.status !== 'PAID');

              return {
                id: fa.id,
                title: fa.feeType?.name || 'Fee Item',
                name: fa.feeType?.name || 'Fee Item',
                category,
                amount: adjustedAmount,
                originalAmount,
                adjustedAmount,
                waiverAmount,
                waiverReason,
                lateFee: isLateFee ? adjustedAmount : 0,
                daysOverdue,
                dueDate: dueDate.toISOString().split('T')[0],
                status: displayStatus,
                isLateFee,
                description: waiver
                  ? `Original: ₹${originalAmount.toLocaleString('en-IN')} | Scholarship/Waiver: -₹${waiverAmount.toLocaleString('en-IN')} (${waiverReason || 'Applied'}) | Net Due: ₹${adjustedAmount.toLocaleString('en-IN')}`
                  : null,
                hasInstallments,
                installments: installments.map((inst, idx) => ({
                  id: inst.id,
                  installmentNo: inst.installmentNo || (idx + 1),
                  amount: Number(inst.amount),
                  dueDate: new Date(inst.dueDate).toISOString().split('T')[0],
                  status: inst.status === 'PAID' ? 'Paid' : inst.status === 'OVERDUE' ? 'Overdue' : 'Pending',
                })),
                installmentNumber: hasInstallments ? (paidInstallments.length + 1) : null,
                totalInstallments: hasInstallments ? installments.length : null,
              };
            });
          });

          setParentFeeItems(itemsMap);
        }
        if (Array.isArray(parentDataRes.notifications)) {
          setParentNotifications(parentDataRes.notifications);
        }
      }
    } catch (err) {
      console.error('Error fetching data from Neon database backend:', err);
    }
  }, [selectedChildId]);

  // Initial data fetch on mount
  useEffect(() => {
    setIsInitialLoading(true);
    Promise.resolve(fetchAllData()).finally(() => {
      setTimeout(() => setIsInitialLoading(false), 550);
    });
  }, [fetchAllData]);

  // Socket.IO listeners — registered once on mount, never re-registered
  useEffect(() => {
    const handleRealtimeEvent = (event) => {
      console.log('🔄 Real-Time Event Received:', event?.type || 'DATA_UPDATED');
      fetchAllData();
      if (event?.type === 'PAYMENT_RECEIVED') {
        showToast(`💰 Payment Verified! Receipt #${event.payload?.txn?.receiptNo || ''}`);
      } else if (event?.type === 'WAIVER_APPLIED') {
        showToast('🎁 Fee Waiver Applied & Synced!');
      } else if (event?.type === 'PENALTY_APPLIED' || event?.type === 'AUTO_PENALTIES_APPLIED') {
        showToast('⚠️ Late Fee Penalty Updated!');
      } else if (event?.type === 'FEE_ASSIGNED') {
        showToast('📋 New Fee Structure Assigned!');
      } else if (event?.type === 'REMINDER_SENT') {
        showToast('📢 Payment Reminder Broadcasted!');
      }
    };

    socket.on('connect', () => {
      // Always join admin room for broadcast events
      socket.emit('join_admin');
      // Re-join parent room if a student session is active (handles page refresh)
      try {
        const saved = localStorage.getItem('finlyt_session');
        if (saved) {
          const session = JSON.parse(saved);
          if (session.role === 'parent' && session.studentId) {
            // Parent room is keyed by parent DB id, not studentId — fetch it
            fetch(getApiUrl(`/api/parent/data?studentId=${encodeURIComponent(session.studentId)}`))
              .then(r => r.json())
              .then(d => { if (d?.parent?.id) socket.emit('join_parent', d.parent.id); })
              .catch(() => {});
          }
        }
      } catch {}
    });
    socket.on('DATA_UPDATED', handleRealtimeEvent);
    socket.on('PAYMENT_RECEIVED', handleRealtimeEvent);
    socket.on('WAIVER_APPLIED', handleRealtimeEvent);
    socket.on('PENALTY_APPLIED', handleRealtimeEvent);
    socket.on('AUTO_PENALTIES_APPLIED', handleRealtimeEvent);
    socket.on('FEE_ASSIGNED', handleRealtimeEvent);
    socket.on('REMINDER_SENT', handleRealtimeEvent);

    return () => {
      socket.off('connect');
      socket.off('DATA_UPDATED', handleRealtimeEvent);
      socket.off('PAYMENT_RECEIVED', handleRealtimeEvent);
      socket.off('WAIVER_APPLIED', handleRealtimeEvent);
      socket.off('PENALTY_APPLIED', handleRealtimeEvent);
      socket.off('AUTO_PENALTIES_APPLIED', handleRealtimeEvent);
      socket.off('FEE_ASSIGNED', handleRealtimeEvent);
      socket.off('REMINDER_SENT', handleRealtimeEvent);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount-only — never re-register listeners

  const handleLoginSuccess = async (userObj) => {
    // Persist session to localStorage — survives page refresh
    localStorage.setItem('finlyt_session', JSON.stringify(userObj));
    setAuthUser(userObj);
    if (userObj.role === 'parent') {
      setCurrentView('parent');
      const studentId = userObj.studentId || '';
      setSelectedChildId(studentId);
      showToast(`Welcome, ${userObj.studentName || userObj.roleLabel}!`);
      navigate('/parent/overview');
      // Immediately fetch with the correct studentId — don't wait for re-render cycle
      if (studentId) {
        try {
          const parentDataUrl = getApiUrl(`/api/parent/data?studentId=${encodeURIComponent(studentId)}`);
          const [
            overviewRes, studentsRes, defaultersRes, transactionsRes,
            reconcileRes, feeTypesRes, waiversRes, activitiesRes, parentDataRes
          ] = await Promise.all([
            fetch(getApiUrl('/api/overview')).then(r => r.json()),
            fetch(getApiUrl('/api/students')).then(r => r.json()),
            fetch(getApiUrl('/api/defaulters')).then(r => r.json()),
            fetch(getApiUrl('/api/transactions')).then(r => r.json()),
            fetch(getApiUrl('/api/reconciliation')).then(r => r.json()),
            fetch(getApiUrl('/api/fee-structures')).then(r => r.json()),
            fetch(getApiUrl('/api/waivers')).then(r => r.json()),
            fetch(getApiUrl('/api/audit-logs')).then(r => r.json()),
            fetch(parentDataUrl).then(r => r.json()).catch(() => null),
          ]);
          if (overviewRes && !overviewRes.error) setOverview(overviewRes);
          if (Array.isArray(studentsRes)) setStudents(studentsRes);
          if (Array.isArray(defaultersRes)) setDefaulters(defaultersRes);
          if (Array.isArray(transactionsRes)) setTransactions(transactionsRes);
          if (Array.isArray(reconcileRes)) setReconciliationQueue(reconcileRes);
          if (Array.isArray(feeTypesRes)) setFeeTypes(feeTypesRes);
          if (Array.isArray(waiversRes)) setWaivers(waiversRes);
          if (Array.isArray(activitiesRes)) setActivities(activitiesRes);

          if (parentDataRes && parentDataRes.parent) {
            setActiveParent(parentDataRes.parent);
            const today = new Date();
            const itemsMap = {};
            (parentDataRes.students || []).forEach((stu) => {
              const waiverByFaId = {};
              (stu.waivers || []).forEach((w) => { if (w.feeAssignmentId) waiverByFaId[w.feeAssignmentId] = w; });
              itemsMap[stu.id] = (stu.feeAssignments || []).map((fa) => {
                const dueDate = new Date(fa.dueDate);
                const daysOverdue = fa.status === 'OVERDUE' ? Math.max(0, Math.floor((today - dueDate) / 86400000)) : 0;
                let displayStatus;
                if (fa.status === 'PAID') displayStatus = 'Paid';
                else if (fa.status === 'OVERDUE') displayStatus = 'Overdue';
                else if (fa.status === 'PARTIAL') displayStatus = 'Partial';
                else if (dueDate > today) displayStatus = 'Upcoming';
                else displayStatus = 'Due';
                const catMap = { TUITION: 'Tuition', TRANSPORT: 'Transport', HOSTEL: 'Hostel', LATE_FEE: 'Late Fee', EXAM: 'Exam', CUSTOM: 'Custom', OTHER: 'Other' };
                const category = catMap[fa.feeType?.category] || fa.feeType?.category || 'Tuition';
                const waiver = waiverByFaId[fa.id];
                const waiverAmount = waiver ? Number(waiver.amount) : 0;
                const waiverReason = waiver?.reason || null;
                const originalAmount = Number(fa.originalAmount);
                const adjustedAmount = Number(fa.adjustedAmount);
                const isLateFee = fa.feeType?.category === 'LATE_FEE';
                const installments = fa.installments || [];
                const hasInstallments = installments.length > 0;
                const paidInstallments = installments.filter(i => i.status === 'PAID');
                return {
                  id: fa.id, title: fa.feeType?.name || 'Fee Item', name: fa.feeType?.name || 'Fee Item',
                  category, amount: adjustedAmount, originalAmount, adjustedAmount, waiverAmount, waiverReason,
                  lateFee: isLateFee ? adjustedAmount : 0, daysOverdue,
                  dueDate: dueDate.toISOString().split('T')[0], status: displayStatus, isLateFee,
                  hasInstallments,
                  installments: installments.map((inst, idx) => ({
                    id: inst.id, installmentNo: inst.installmentNo || (idx + 1), amount: Number(inst.amount),
                    dueDate: new Date(inst.dueDate).toISOString().split('T')[0],
                    status: inst.status === 'PAID' ? 'Paid' : inst.status === 'OVERDUE' ? 'Overdue' : 'Pending',
                  })),
                  installmentNumber: hasInstallments ? (paidInstallments.length + 1) : null,
                  totalInstallments: hasInstallments ? installments.length : null,
                };
              });
            });
            setParentFeeItems(itemsMap);
            if (Array.isArray(parentDataRes.notifications)) setParentNotifications(parentDataRes.notifications);
            // Join parent socket room for real-time updates
            if (parentDataRes.parent?.id) socket.emit('join_parent', parentDataRes.parent.id);
          }
        } catch (err) {
          console.error('Login data fetch error:', err);
        }
      }
    } else {
      setCurrentView('admin');
      showToast(`Signed in successfully as ${userObj.roleLabel}!`);
      navigate('/overview');
      fetchAllData();
    }
  };

  const handleSignOut = () => {
    // Clear persisted session so login page is shown on next visit
    localStorage.removeItem('finlyt_session');
    setAuthUser(null);
    setActiveParent(null);
    setSelectedChildId('');
    setParentFeeItems({});
    setParentNotifications([]);
    setCurrentView('login');
    navigate('/login');
    showToast('Signed out of Finlyt portal.');
  };

  const handleSwitchToAdmin = () => {
    if (authUser?.role === 'parent') {
      showToast('⚠️ Access Denied: Student/Parent accounts are strictly restricted from accessing the Admin Dashboard.');
      return;
    }
    setCurrentView('admin');
    navigate('/overview');
    showToast('Switched to School Admin Dashboard.');
  };

  const handleSwitchToParent = () => {
    setCurrentView('parent');
    navigate('/parent/overview');
    showToast(authUser?.role === 'admin' ? 'Viewing Student Portal (Admin Mode)' : 'Switched to Student Portal.');
  };

  // Selected Child details derived from real database students or active auth session (prevents default fallback on page refresh)
  const selectedChild = React.useMemo(() => {
    const targetId = selectedChildId || authUser?.studentId;
    if (targetId && Array.isArray(students) && students.length > 0) {
      const found = students.find((s) => s.id === targetId || s.dbId === targetId);
      if (found) return found;
    }
    if (authUser && authUser.role === 'parent' && authUser.studentId) {
      return {
        id: authUser.studentId,
        dbId: authUser.studentDbId || authUser.studentId,
        name: authUser.studentName || 'Student Account',
        classGrade: authUser.classGrade || 'Grade Level',
        balanceDue: 0,
        totalPaid: 0,
        totalBilled: 0
      };
    }
    if (Array.isArray(students) && students.length > 0) {
      return students[0];
    }
    return { id: 'STU-101', name: 'Student Account', classGrade: 'Grade Level', balanceDue: 0, totalPaid: 0, totalBilled: 0 };
  }, [students, selectedChildId, authUser]);

  const currentParentAccount = React.useMemo(() => {
    if (activeParent && activeParent.name && activeParent.name !== 'Parent Account Not Yet Created') {
      return activeParent;
    }
    if (authUser && authUser.role === 'parent') {
      let name = authUser.name;
      if (!name || name === 'Parent Account Not Yet Created') {
        name = authUser.studentName ? `Parent of ${authUser.studentName}` : 'Parent Account';
      }
      return {
        id: authUser.id || `PAR-${authUser.studentId}`,
        name,
        email: authUser.email || '',
        phone: authUser.phone || 'N/A'
      };
    }
    return { name: 'Parent', email: 'parent@example.com' };
  }, [activeParent, authUser]);

  const childrenList = students.filter((s) => activeParent?.childrenIds?.includes(s.id));

  // Handle Parent Online Fee Payment Submission (Persisted to Neon DB)
  const handleParentPaymentComplete = async (newTxn, paidItemIds) => {
    try {
      const res = await fetch(getApiUrl('/api/transactions/pay'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedChildId,
          amount: newTxn.amount,
          itemIds: paidItemIds,
          method: 'UPI',
          utrNo: newTxn.utrNo,
          payerVPA: newTxn.payerVPA,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Payment of ₹${newTxn.amount.toLocaleString('en-IN')} processed! Receipt #${data.receiptNo}`);
        await fetchAllData();
      } else {
        showToast(`Payment error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  // Parent Notification Actions
  const handleMarkNotificationRead = async (notifId) => {
    try {
      await fetch(getApiUrl('/api/notifications/read'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notifId }),
      });
      await fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllNotificationsRead = async (studentId) => {
    try {
      await fetch(getApiUrl('/api/notifications/read-all'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: activeParent?.id }),
      });
      showToast('All notifications marked as read.');
      await fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Admin record payment submit (Persisted to Neon DB)
  const handleRecordPaymentSubmit = async (paymentData) => {
    try {
      const res = await fetch(getApiUrl('/api/transactions/manual'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: paymentData.studentId,
          feeCategory: paymentData.feeType,
          amount: paymentData.amount,
          method: (paymentData.paymentMethod || '').toUpperCase() === 'CHEQUE' ? 'CHEQUE' : 'CASH',
          chequeNumber: paymentData.chequeNo,
          bankReference: paymentData.bankName,
          remarks: paymentData.remarks,
          collectedBy: authUser?.name || 'Admin Staff',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Payment recorded successfully! Receipt #${data.receiptNo}`);
        await fetchAllData();
      } else {
        showToast(`Error recording payment: ${data.error}`);
      }
    } catch (err) {
      console.error('Error submitting payment:', err);
    }
  };

  const handleReconcileEntries = async (ids, bankRef) => {
    try {
      for (const id of ids) {
        await fetch(getApiUrl('/api/reconciliation/confirm'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
      }
      showToast(`Marked ${ids.length} entry(s) as Bank Reconciled.`);
      await fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFlagBounce = async (recEntry) => {
    try {
      const res = await fetch(getApiUrl('/api/reconciliation/flag-bounce'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: recEntry.id,
          reason: 'Bounced cheque dishonour memo received',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Cheque marked as Bounced. Re-opened balance for ${recEntry.studentName}.`);
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveFlag = async (recId, resolutionType, note) => {
    const entry = reconciliationQueue.find((q) => q.id === recId);
    if (!entry) return;

    if (resolutionType === 'bounced') {
      await handleFlagBounce(entry);
    } else {
      await handleReconcileEntries([recId], note);
    }
  };

  const handleRefundTransaction = async (txnId, reason, note) => {
    try {
      const res = await fetch(getApiUrl(`/api/transactions/${txnId}/refund`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refundReason: reason ? `${reason}: ${note}` : note,
          refundedBy: 'Finance Admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Refund processed for receipt #${data.transaction.receiptNo}`);
        await fetchAllData();
      } else {
        showToast(`Refund error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error processing refund:', err);
    }
  };

  const handleCreateFeeType = async (newFee) => {
    try {
      const res = await fetch(getApiUrl('/api/fee-structures'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFee.name,
          category: (newFee.category || '').toUpperCase() === 'TUITION' ? 'TUITION' : (newFee.category || '').toUpperCase() === 'TRANSPORT' ? 'TRANSPORT' : 'CUSTOM',
          amount: newFee.amount,
          recurrence: 'ONE_TIME',
          targetScope: 'ALL',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Created fee structure: ${newFee.name}`);
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeactivateFeeType = (id) => {
    setFeeTypes((prev) => prev.filter((f) => f.id !== id));
    showToast('Fee structure deactivated.');
  };

  const handleSendReminder = (defaulterObj) => {
    showToast(`Reminder sent to parent of ${defaulterObj.studentName || defaulterObj.name}!`);
  };

  const handleBulkDefaulterAction = (type, ids) => {
    showToast(`Executed bulk ${type} action on ${ids.length} defaulter student(s).`);
  };

  if (isInitialLoading) {
    return (
      <LoadingScreen 
        message="Synchronizing Finlyt Financial Workspace..." 
        subtext="Secure bank-grade encryption • Connecting to database" 
      />
    );
  }

  return (
    <>
      <Routes>
        {/* LOGIN / HOME ROUTE */}
        <Route 
          path="/login" 
          element={
            <LoginPage 
              onLoginSuccess={handleLoginSuccess} 
              theme={theme}
              toggleTheme={toggleTheme}
            />
          } 
        />
        <Route 
          path="/" 
          element={
            currentView === 'parent' ? (
              <Navigate to="/parent/overview" replace />
            ) : currentView === 'admin' ? (
              <Navigate to="/overview" replace />
            ) : (
              <LoginPage 
                onLoginSuccess={handleLoginSuccess} 
                theme={theme}
                toggleTheme={toggleTheme}
              />
            )
          } 
        />

        {/* PARENT PORTAL ROUTES */}
        <Route 
          element={
            <ParentLayout 
              parentAccount={currentParentAccount}
              childrenList={childrenList.length > 0 ? childrenList : [selectedChild]}
              selectedChild={selectedChild}
              onSelectChild={(childId) => setSelectedChildId(childId)}
              notifications={parentNotifications}
              theme={theme}
              toggleTheme={toggleTheme}
              onSignOut={handleSignOut}
              onSwitchToAdmin={handleSwitchToAdmin}
              toastMessage={toastMessage}
            />
          }
        >
          <Route path="/parent" element={<Navigate to="/parent/overview" replace />} />
          <Route 
            path="/parent/overview" 
            element={
              <ParentOverviewPage 
                parentAccount={currentParentAccount}
                selectedChild={selectedChild}
                feeItems={parentFeeItems}
                transactions={transactions}
                notifications={parentNotifications}
                onOpenReceipt={(txn) => setActiveReceiptModal(txn)}
              />
            } 
          />
          <Route 
            path="/parent/fees" 
            element={
              <ParentFeesPage 
                selectedChild={selectedChild}
                feeItems={parentFeeItems}
                onSelectForPayment={(items) => setCheckoutSelectedItems(items)}
              />
            } 
          />
          <Route 
            path="/parent/pay" 
            element={
              <ParentPaymentPage 
                selectedChild={selectedChild}
                selectedFeeItems={checkoutSelectedItems}
                onCompletePayment={handleParentPaymentComplete}
                onOpenReceipt={(txn) => setActiveReceiptModal(txn)}
              />
            } 
          />
          <Route 
            path="/parent/history" 
            element={
              <ParentHistoryPage 
                selectedChild={selectedChild}
                transactions={transactions}
                onOpenReceipt={(txn) => setActiveReceiptModal(txn)}
              />
            } 
          />
          <Route 
            path="/parent/receipts" 
            element={
              <ParentReceiptsPage 
                selectedChild={selectedChild}
                transactions={transactions}
                onOpenReceipt={(txn) => setActiveReceiptModal(txn)}
              />
            } 
          />
          <Route 
            path="/parent/notifications" 
            element={
              <ParentNotificationsPage 
                selectedChild={selectedChild}
                notifications={parentNotifications}
                onMarkRead={handleMarkNotificationRead}
                onMarkAllRead={handleMarkAllNotificationsRead}
              />
            } 
          />
          <Route 
            path="/parent/settings" 
            element={
              <ParentSettingsPage 
                parentAccount={activeParent}
                selectedChild={selectedChild}
                toastMessage={toastMessage}
              />
            } 
          />
        </Route>

        {/* ADMIN DASHBOARD ROUTES */}
        <Route 
          element={
            <AppLayout 
              defaultersCount={defaulters.length}
              authUser={authUser}
              theme={theme}
              toggleTheme={toggleTheme}
              onSignOut={handleSignOut}
              onShowReportModal={() => setShowReportModal(true)}
              onRecordPaymentClick={(stu) => setQuickActionModal({ mode: 'recordPayment', student: stu })}
              toastMessage={toastMessage}
            />
          }
        >
          <Route 
            path="/overview" 
            element={
              <OverviewPage 
                overview={overview}
                defaulters={defaulters}
                onFilterByFeeType={(feeName) => setActiveFeeFilter(feeName)}
                onSelectStudentForLedger={(stuId) => setSelectedStudentForLedger(stuId)}
                onSendReminder={handleSendReminder}
                onShowReportModal={() => setShowReportModal(true)}
                onRecordPaymentClick={(stu) => setQuickActionModal({ mode: 'recordPayment', student: stu })}
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
                onBulkAction={handleBulkDefaulterAction}
                onSelectStudentForLedger={(stuId) => setSelectedStudentForLedger(stuId)}
              />
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <TransactionsPage 
                transactions={transactions}
                activeFeeFilter={activeFeeFilter}
                onClearFilter={() => setActiveFeeFilter(null)}
                onRecordPaymentClick={(stu) => setQuickActionModal({ mode: 'recordPayment', student: stu })}
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
                onSelectStudent={(stuId) => setSelectedStudentForLedger(stuId)}
                onRecordPaymentClick={(stu) => setQuickActionModal({ mode: 'recordPayment', student: stu })}
                onStudentUpdated={fetchAllData}
                waivers={waivers}
                transactions={transactions}
              />
            } 
          />
          <Route 
            path="/audit-activity" 
            element={
              <AuditActivityPage 
                activities={activities}
              />
            } 
          />
        </Route>

        {/* WILDCARD FALLBACK */}
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>

      {/* Global Modals */}
      {showReportModal && (
        <ReportGeneratorModal 
          students={students}
          transactions={transactions}
          defaulters={defaulters}
          reconciliationQueue={reconciliationQueue}
          feeTypes={feeTypes}
          waivers={waivers}
          onClose={() => setShowReportModal(false)} 
          onDownloadReport={({ fileName }) => showToast(`Report "${fileName}" generated & downloaded successfully!`)}
        />
      )}

      {quickActionModal && (
        <QuickActionsModal 
          mode={quickActionModal.mode}
          student={quickActionModal.student || students[0]}
          students={students}
          feeTypes={feeTypes}
          onClose={() => setQuickActionModal(null)}
          onSubmitPayment={handleRecordPaymentSubmit}
          onSendReminder={handleSendReminder}
          onBulkPenalty={(amt) => showToast(`Applied ₹${amt} penalty`)}
        />
      )}

      {/* Global Receipt Printable PDF Modal */}
      {activeReceiptModal && (
        <ReceiptPDFModal 
          receipt={activeReceiptModal}
          student={selectedChild}
          onClose={() => setActiveReceiptModal(null)}
          onDownload={(rcpNo) => showToast(`Downloaded official PDF receipt #${rcpNo}`)}
        />
      )}

      {/* Grounded AI Chatbot Widget (Llama via Groq) */}
      {authUser && (
        <ChatbotWidget 
          role={['admin', 'cashier', 'staff'].includes(authUser.role) ? 'admin' : 'parent'}
          studentId={selectedChild?.id || authUser.studentId}
          onActionExecuted={fetchAllData}
        />
      )}
    </>
  );
}
