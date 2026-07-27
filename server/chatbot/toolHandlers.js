// Tool Execution Handlers (Read-Only & Server-Side Scoped)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function executeAdminTool(name, argsInput) {
  const args = argsInput && typeof argsInput === 'object' ? argsInput : {};

  switch (name) {
    case 'getDefaulters': {
      const overdueAssignments = await prisma.feeAssignment.findMany({
        where: { status: 'OVERDUE', student: { isActive: true } },
        include: {
          student: true,
          feeType: true,
          appliedPenalties: true
        }
      });

      const now = new Date();
      const defaultersMap = {};

      for (const fa of overdueAssignments) {
        const sId = fa.student.studentId;
        const daysDiff = Math.max(1, Math.floor((now - new Date(fa.dueDate)) / (1000 * 60 * 60 * 24)));
        const severity = daysDiff > 30 ? 'severe' : daysDiff > 15 ? 'moderate' : 'mild';

        if (args.severity && args.severity !== severity) continue;
        if (args.minDaysOverdue && daysDiff < args.minDaysOverdue) continue;
        if (args.classGrade && !fa.student.grade.toLowerCase().includes(args.classGrade.toLowerCase())) continue;

        if (!defaultersMap[sId]) {
          defaultersMap[sId] = {
            studentId: sId,
            studentName: fa.student.name,
            classGrade: fa.student.grade,
            amountOwed: Number(fa.adjustedAmount),
            feeTypes: [fa.feeType.name],
            daysOverdue: daysDiff,
            severity: severity
          };
        } else {
          defaultersMap[sId].amountOwed += Number(fa.adjustedAmount);
          defaultersMap[sId].feeTypes.push(fa.feeType.name);
        }
      }

      return Object.values(defaultersMap);
    }

    case 'getStudentLedger': {
      const targetId = args.studentId || 'STU-101';
      const student = await prisma.student.findFirst({
        where: { OR: [{ studentId: targetId }, { id: targetId }, { name: { contains: targetId, mode: 'insensitive' } }] },
        include: {
          parentStudents: { include: { parent: true } },
          feeAssignments: { include: { feeType: true } },
          transactions: { orderBy: { dateTime: 'desc' } },
          waivers: true
        }
      });

      if (!student) return { error: `Student "${targetId}" not found in system` };

      const totalBilled = student.feeAssignments.reduce((sum, fa) => sum + Number(fa.originalAmount), 0);
      const totalWaived = student.waivers.reduce((sum, w) => sum + Number(w.amount), 0);
      const totalPaid = student.transactions.filter(t => ['SUCCESS', 'RECONCILED'].includes(t.status)).reduce((sum, t) => sum + Number(t.amount), 0);
      const balanceDue = Math.max(0, totalBilled - totalWaived - totalPaid);

      return {
        studentId: student.studentId,
        studentName: student.name,
        classGrade: student.grade,
        totalBilled,
        totalWaived,
        totalPaid,
        balanceDue,
        feeAssignmentsCount: student.feeAssignments.length,
        transactionsCount: student.transactions.length
      };
    }

    case 'getRevenueSummary': {
      const transactions = await prisma.transaction.findMany({
        where: { status: { in: ['SUCCESS', 'RECONCILED'] } }
      });
      const totalCollected = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

      const feeAssignments = await prisma.feeAssignment.findMany({
        where: { student: { isActive: true } }
      });
      const totalBilled = feeAssignments.reduce((sum, fa) => sum + Number(fa.adjustedAmount), 0);

      const waivers = await prisma.waiver.findMany({
        where: { student: { isActive: true } }
      });
      const totalWaived = waivers.reduce((sum, w) => sum + Number(w.amount), 0);

      const outstandingDues = Math.max(0, totalBilled - totalCollected - totalWaived);
      const efficiency = totalBilled > 0 ? Number(((totalCollected / totalBilled) * 100).toFixed(1)) : 0;

      return {
        totalCollected,
        totalBilled,
        totalWaived,
        outstandingDues,
        collectionEfficiency: `${efficiency}%`,
        totalTransactionsCount: transactions.length
      };
    }

    case 'getReconciliationStatus': {
      const pendingEntries = await prisma.reconciliationEntry.findMany({
        where: { status: 'PENDING' },
        include: { transaction: true }
      });
      const flaggedEntries = await prisma.reconciliationEntry.findMany({
        where: { status: 'FLAGGED' },
        include: { transaction: true }
      });
      const reconciledEntries = await prisma.reconciliationEntry.findMany({
        where: { status: 'RECONCILED' }
      });

      const pendingAmount = pendingEntries.reduce((sum, r) => sum + Number(r.transaction.amount), 0);

      return {
        pendingCount: pendingEntries.length,
        pendingAmount,
        flaggedCount: flaggedEntries.length,
        reconciledCount: reconciledEntries.length
      };
    }

    case 'getTransactions': {
      const where = {};
      if (args.status) where.status = args.status;
      if (args.method) where.method = args.method;
      if (args.searchQuery) {
        where.OR = [
          { receiptNo: { contains: args.searchQuery, mode: 'insensitive' } },
          { student: { name: { contains: args.searchQuery, mode: 'insensitive' } } }
        ];
      }

      const txns = await prisma.transaction.findMany({
        where,
        take: 10,
        orderBy: { dateTime: 'desc' },
        include: { student: true }
      });

      return txns.map(t => ({
        receiptNo: t.receiptNo,
        studentName: t.student.name,
        amount: Number(t.amount),
        method: t.method,
        status: t.status,
        dateTime: t.dateTime.toISOString().slice(0, 10)
      }));
    }

    case 'proposeAction': {
      return {
        isProposal: true,
        actionType: args.actionType || 'send_reminder',
        targetStudentId: args.targetStudentId || 'STU-101',
        targetStudentName: args.targetStudentName || args.targetStudentId || 'Aarav Sharma',
        amount: args.amount || 0,
        reason: args.reason || 'Requested via AI Assistant proposal'
      };
    }

    default:
      throw new Error(`Unknown admin tool: ${name}`);
  }
}

export async function executeParentTool(name, argsInput, studentIdInput) {
  const args = argsInput && typeof argsInput === 'object' ? argsInput : {};
  let studentId = studentIdInput;

  // Fallback student ID resolution if not passed in session
  if (!studentId) {
    const defaultStudent = await prisma.student.findFirst({ where: { isActive: true } });
    if (defaultStudent) {
      studentId = defaultStudent.id;
    }
  }

  if (!studentId) {
    return { error: 'No student account linked to this session.' };
  }

  // Find student DB record
  const student = await prisma.student.findFirst({
    where: { OR: [{ id: studentId }, { studentId: studentId }] },
    include: {
      parentStudents: { include: { parent: true } }
    }
  });

  if (!student) {
    return { error: 'Linked student record not found.' };
  }

  switch (name) {
    case 'getOutstandingFees': {
      const pendingFees = await prisma.feeAssignment.findMany({
        where: {
          studentId: student.id,
          status: { in: ['PENDING', 'OVERDUE', 'PARTIAL'] }
        },
        include: { feeType: true }
      });

      const items = pendingFees.map(fa => ({
        feeAssignmentId: fa.id,
        title: fa.feeType.name,
        category: fa.feeType.category,
        amount: Number(fa.adjustedAmount),
        dueDate: fa.dueDate.toISOString().slice(0, 10),
        status: fa.status
      }));

      const totalOutstanding = items.reduce((sum, i) => sum + i.amount, 0);

      return {
        studentId: student.studentId,
        studentName: student.name,
        totalOutstanding,
        outstandingCount: items.length,
        items
      };
    }

    case 'getPaymentHistory': {
      const limit = args.limit || 5;
      const txns = await prisma.transaction.findMany({
        where: {
          studentId: student.id,
          status: { in: ['SUCCESS', 'RECONCILED'] }
        },
        take: limit,
        orderBy: { dateTime: 'desc' },
        include: { feeAssignment: { include: { feeType: true } } }
      });

      return txns.map(t => ({
        receiptNo: t.receiptNo,
        feeTitle: t.feeAssignment?.feeType?.name || t.category,
        amount: Number(t.amount),
        method: t.method,
        date: t.dateTime.toISOString().slice(0, 10),
        status: 'Paid & Verified'
      }));
    }

    case 'getFeeExplanation': {
      const feeAssignment = await prisma.feeAssignment.findFirst({
        where: {
          studentId: student.id,
          ...(args.feeAssignmentId ? { id: args.feeAssignmentId } : {})
        },
        include: {
          feeType: true,
          waivers: true,
          appliedPenalties: { include: { penaltyRule: true } },
          transactions: { where: { status: { in: ['SUCCESS', 'RECONCILED'] } } }
        }
      });

      if (!feeAssignment) {
        return { error: 'No matching fee assignment record found.' };
      }

      const original = Number(feeAssignment.originalAmount);
      const totalWaivers = feeAssignment.waivers.reduce((sum, w) => sum + Number(w.amount), 0);
      const totalPaid = feeAssignment.transactions.reduce((sum, t) => sum + Number(t.amount), 0);
      const netDue = Number(feeAssignment.adjustedAmount) - totalPaid;

      return {
        feeTitle: feeAssignment.feeType.name,
        category: feeAssignment.feeType.category,
        originalAmount: original,
        waiversApplied: totalWaivers,
        netAdjustedAmount: Number(feeAssignment.adjustedAmount),
        totalPaid,
        remainingBalanceDue: Math.max(0, netDue),
        dueDate: feeAssignment.dueDate.toISOString().slice(0, 10),
        status: feeAssignment.status
      };
    }

    case 'proposePaymentNavigation': {
      return {
        isNavigation: true,
        url: '/parent/pay',
        buttonText: 'Proceed to Payment Checkout',
        feeAssignmentId: args.feeAssignmentId || null
      };
    }

    default:
      throw new Error(`Unknown parent tool: ${name}`);
  }
}
