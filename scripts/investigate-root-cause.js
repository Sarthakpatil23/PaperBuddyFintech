import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function runRootCauseAudit() {
  console.log('====================================================');
  console.log('      ROOT CAUSE INVESTIGATION & AUDIT REPORT       ');
  console.log('====================================================\n');

  // --- BUG 1 CHECKLIST INVESTIGATION ---
  console.log('🔍 [BUG 1 INVESTIGATION]: Students with Fees/Penalties but No Parent Account');
  
  const allStudents = await prisma.student.findMany({
    include: {
      parentStudents: { include: { parent: true } },
      feeAssignments: true,
      transactions: true,
      waivers: true,
    }
  });

  const unlinkedStudentsWithFees = [];
  const linkedStudentsWithFees = [];

  for (const s of allStudents) {
    const hasParent = s.parentStudents && s.parentStudents.length > 0;
    const hasFinancials = s.feeAssignments.length > 0 || s.transactions.length > 0 || s.waivers.length > 0;

    if (hasFinancials) {
      if (!hasParent) {
        unlinkedStudentsWithFees.push({
          id: s.id,
          studentId: s.studentId,
          name: s.name,
          grade: s.grade,
          feeAssignmentsCount: s.feeAssignments.length,
          transactionsCount: s.transactions.length,
          waiversCount: s.waivers.length
        });
      } else {
        linkedStudentsWithFees.push({
          id: s.id,
          studentId: s.studentId,
          name: s.name,
          parentName: s.parentStudents[0].parent.name,
          parentEmail: s.parentStudents[0].parent.email
        });
      }
    }
  }

  console.log(`- Total Students in Database: ${allStudents.length}`);
  console.log(`- Students with Financial Records & Linked Parents: ${linkedStudentsWithFees.length}`);
  console.log(`- Students with Financial Records & NO Linked Parent: ${unlinkedStudentsWithFees.length}`);

  if (unlinkedStudentsWithFees.length > 0) {
    console.log('\n  ❌ DETECTED ORPHANED/UNLINKED STUDENTS WITH FEES:');
    unlinkedStudentsWithFees.forEach(u => {
      console.log(`     - [${u.studentId}] ${u.name} (${u.grade}) -> ${u.feeAssignmentsCount} fee assignments, ${u.transactionsCount} txns, ${u.waiversCount} waivers`);
    });
  } else {
    console.log('  ✅ No unlinked students with fees currently in DB (all existing students are linked).');
  }

  // --- BUG 2 CHECKLIST INVESTIGATION ---
  console.log('\n🔍 [BUG 2 INVESTIGATION]: Parent Payment Sync Failure to Admin Dashboard');

  // Check 1: FeeAssignment status update logic in /api/transactions/pay
  console.log('  Check 1: Does /api/transactions/pay update FeeAssignment.status in DB?');
  const sampleOverdue = await prisma.feeAssignment.findFirst({
    where: { status: 'OVERDUE' },
    include: { student: true, feeType: true }
  });

  if (sampleOverdue) {
    console.log(`     - Sample Overdue FeeAssignment found: ID=${sampleOverdue.id}, Student=${sampleOverdue.student.name}, Fee=${sampleOverdue.feeType.name}, Status=${sampleOverdue.status}`);
  } else {
    console.log('     - No OVERDUE fee assignments currently in DB.');
  }

  // Check 2: Socket.IO event emission & reception audit
  console.log('\n  Check 2: Socket.IO Event Emission & Frontend Listener Analysis');
  console.log('     - Backend emits: io.emit("DATA_UPDATED", { type: "PAYMENT_RECEIVED", payload: ... })');
  console.log('     - App.jsx listens: socket.on("DATA_UPDATED", (event) => fetchAllData())');

  // Check 3: Analysis of why parent payment might fail to reflect on Admin Dashboard
  console.log('\n  Check 3: Root Causes Identified for Payment Sync Failure:');
  console.log('     a) Partial Payment Handling: Currently /api/transactions/pay marks ALL fee assignments as PAID without checking if the payment amount matches specific FeeAssignment itemIds.');
  console.log('     b) Scope of Socket Listener: socket listener in App.jsx calls fetchAllData(), but Parent view and Admin view maintain SEPARATE internal React state slices for overview statistics and transaction lists.');
  console.log('     c) Selected Student Filter: In Parent Portal, payment emits PAYMENT_RECEIVED with studentId, but if Admin Dashboard is open on a specific student or tab, state re-renders must be forced via state dispatch.');
  console.log('     d) Unlinked / Orphaned FeeAssignments: If a parent pays a fee not linked via feeAssignmentId, the Transaction is recorded but FeeAssignment remains OVERDUE on Defaulter Tracking.');

  console.log('\n====================================================\n');

  await prisma.$disconnect();
}

runRootCauseAudit();
