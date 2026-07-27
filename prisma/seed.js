import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding with 5 distinct student fee scenarios...');

  // 0. Clean existing database records in strict foreign key order
  await prisma.notification.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.reconciliationEntry.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.waiver.deleteMany({});
  await prisma.appliedPenalty.deleteMany({});
  await prisma.penaltyRule.deleteMany({});
  await prisma.installment.deleteMany({});
  await prisma.feeAssignment.deleteMany({});
  await prisma.feeType.deleteMany({});
  await prisma.parentStudent.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.parent.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Admin & Staff Users (Admin credentials: admin@school.edu / admin_password_2026)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@school.edu',
      name: 'School Finance Admin',
      password: 'admin_password_2026',
      role: 'ADMIN',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'finance@school.edu',
      name: 'Finance Counter Staff',
      password: 'staff_password_2026',
      role: 'STAFF',
    },
  });

  // 2. Create Parent Users & Parent Entities
  const pUser1 = await prisma.user.create({
    data: { email: 'aarav.sharma@paperbuddy.edu', name: 'Rajesh Sharma (Parent)', password: 'aarav123', role: 'PARENT' },
  });
  const parent1 = await prisma.parent.create({
    data: { userId: pUser1.id, name: 'Rajesh Sharma', email: 'aarav.sharma@paperbuddy.edu', password: 'aarav123', phone: '+91 98765 43210', address: '102 Green Park, Delhi' },
  });

  const pUser2 = await prisma.user.create({
    data: { email: 'ananya.patel@paperbuddy.edu', name: 'Suresh Patel (Parent)', password: 'ananya123', role: 'PARENT' },
  });
  const parent2 = await prisma.parent.create({
    data: { userId: pUser2.id, name: 'Suresh Patel', email: 'ananya.patel@paperbuddy.edu', password: 'ananya123', phone: '+91 98123 45678', address: '77 Saket Sector 4, Delhi' },
  });

  const pUser3 = await prisma.user.create({
    data: { email: 'rohan.verma@paperbuddy.edu', name: 'Vikram Verma (Parent)', password: 'rohan123', role: 'PARENT' },
  });
  const parent3 = await prisma.parent.create({
    data: { userId: pUser3.id, name: 'Vikram Verma', email: 'rohan.verma@paperbuddy.edu', password: 'rohan123', phone: '+91 97654 32109', address: '45 Model Town, Delhi' },
  });

  const pUser4 = await prisma.user.create({
    data: { email: 'priya.gupta@paperbuddy.edu', name: 'Anil Gupta (Parent)', password: 'priya123', role: 'PARENT' },
  });
  const parent4 = await prisma.parent.create({
    data: { userId: pUser4.id, name: 'Anil Gupta', email: 'priya.gupta@paperbuddy.edu', password: 'priya123', phone: '+91 99887 76655', address: '88 Civil Lines, Delhi' },
  });

  const pUser5 = await prisma.user.create({
    data: { email: 'gurpreet.singh@paperbuddy.edu', name: 'Harpreet Singh (Parent)', password: 'gurpreet123', role: 'PARENT' },
  });
  const parent5 = await prisma.parent.create({
    data: { userId: pUser5.id, name: 'Harpreet Singh', email: 'gurpreet.singh@paperbuddy.edu', password: 'gurpreet123', phone: '+91 98450 11223', address: '12 Vikas Marg, Delhi' },
  });

  // 3. Create Student Enrollment Records
  const student1 = await prisma.student.create({ data: { studentId: 'STU-101', name: 'Aarav Sharma', grade: 'Grade 10-A', section: 'A', rollNo: '101' } });
  const student2 = await prisma.student.create({ data: { studentId: 'STU-102', name: 'Ananya Patel', grade: 'Grade 8-B', section: 'B', rollNo: '102' } });
  const student3 = await prisma.student.create({ data: { studentId: 'STU-103', name: 'Rohan Verma', grade: 'Grade 12-C', section: 'C', rollNo: '103' } });
  const student4 = await prisma.student.create({ data: { studentId: 'STU-104', name: 'Priya Gupta', grade: 'Grade 9-A', section: 'A', rollNo: '104' } });
  const student5 = await prisma.student.create({ data: { studentId: 'STU-105', name: 'Gurpreet Singh', grade: 'Grade 11-B', section: 'B', rollNo: '105' } });

  // 4. Link Parent to Student (ParentStudent Join Rows)
  await prisma.parentStudent.createMany({
    data: [
      { parentId: parent1.id, studentId: student1.id },
      { parentId: parent2.id, studentId: student2.id },
      { parentId: parent3.id, studentId: student3.id },
      { parentId: parent4.id, studentId: student4.id },
      { parentId: parent5.id, studentId: student5.id },
    ],
  });

  // Timestamps
  const now = new Date();
  const future15 = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  const future12 = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000);
  const future30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const past10 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const past15 = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // --------------------------------------------------------------------------
  // SCENARIO 1: Gurpreet Singh (STU-105) — Normal pending fee, not yet due
  // --------------------------------------------------------------------------
  const ftGurpreet = await prisma.feeType.create({
    data: { name: 'Term 2 Tuition Fee', category: 'TUITION', amount: 25000, recurrence: 'QUARTERLY', targetScope: 'ALL' },
  });
  const faGurpreet = await prisma.feeAssignment.create({
    data: {
      studentId: student5.id,
      feeTypeId: ftGurpreet.id,
      originalAmount: 25000,
      adjustedAmount: 25000,
      dueDate: future15,
      status: 'PENDING',
    },
  });
  await prisma.auditLog.create({
    data: { actor: 'School Admin', actionType: 'FEE_ASSIGNED', entityType: 'FeeAssignment', entityId: faGurpreet.id, description: 'Assigned Term 2 Tuition Fee (₹25,000) to Gurpreet Singh.' },
  });

  // --------------------------------------------------------------------------
  // SCENARIO 2: Priya Gupta (STU-104) — Overdue fee (past due date, no penalty yet)
  // --------------------------------------------------------------------------
  const ftPriya = await prisma.feeType.create({
    data: { name: 'Q1 Tuition & Lab Fee', category: 'TUITION', amount: 35000, recurrence: 'QUARTERLY', targetScope: 'ALL' },
  });
  const faPriya = await prisma.feeAssignment.create({
    data: {
      studentId: student4.id,
      feeTypeId: ftPriya.id,
      originalAmount: 35000,
      adjustedAmount: 35000,
      dueDate: past10,
      status: 'OVERDUE',
    },
  });
  await prisma.auditLog.create({
    data: { actor: 'School Admin', actionType: 'FEE_ASSIGNED', entityType: 'FeeAssignment', entityId: faPriya.id, description: 'Assigned Q1 Tuition & Lab Fee (₹35,000) to Priya Gupta.' },
  });

  // --------------------------------------------------------------------------
  // SCENARIO 3: Rohan Verma (STU-103) — Overdue fee WITH a penalty/late fee applied
  // --------------------------------------------------------------------------
  const ftRohanTuition = await prisma.feeType.create({
    data: { name: 'Senior Secondary Tuition Fee', category: 'TUITION', amount: 45000, recurrence: 'QUARTERLY', targetScope: 'ALL' },
  });
  const faRohanBase = await prisma.feeAssignment.create({
    data: {
      studentId: student3.id,
      feeTypeId: ftRohanTuition.id,
      originalAmount: 45000,
      adjustedAmount: 45000,
      dueDate: past30,
      status: 'OVERDUE',
    },
  });

  const ftLateFee = await prisma.feeType.create({
    data: { name: 'Late Payment Penalty Fine', category: 'LATE_FEE', amount: 1500, recurrence: 'ONE_TIME', targetScope: 'ALL' },
  });
  const faRohanPenalty = await prisma.feeAssignment.create({
    data: {
      studentId: student3.id,
      feeTypeId: ftLateFee.id,
      originalAmount: 1500,
      adjustedAmount: 1500,
      dueDate: now,
      status: 'OVERDUE',
    },
  });

  const pRuleRohan = await prisma.penaltyRule.create({
    data: { feeTypeId: ftRohanTuition.id, triggerDaysAfterDue: 15, penaltyAmount: 1500, autoApply: true },
  });
  await prisma.appliedPenalty.create({
    data: { feeAssignmentId: faRohanBase.id, penaltyRuleId: pRuleRohan.id },
  });

  await prisma.auditLog.create({
    data: { actor: 'Automated Penalty Engine', actionType: 'AUTO_PENALTY_APPLIED', entityType: 'FeeAssignment', entityId: faRohanPenalty.id, description: 'Auto-applied late payment penalty fine of ₹1,500 to Rohan Verma for Senior Secondary Tuition Fee overdue by 30 days.' },
  });
  await prisma.notification.create({
    data: { recipientType: 'PARENT', recipientId: parent3.id, title: '⚠️ Late Fee Penalty Applied', message: 'A late fee penalty fine of ₹1,500 was applied to Rohan Verma due to 30 days overdue payment.', type: 'late_fee_applied' },
  });

  // --------------------------------------------------------------------------
  // SCENARIO 4: Ananya Patel (STU-102) — Partially paid fee (installment scenario)
  // --------------------------------------------------------------------------
  const ftAnanya = await prisma.feeType.create({
    data: { name: 'Annual Composite School Fee', category: 'TUITION', amount: 40000, recurrence: 'ANNUALLY', targetScope: 'ALL' },
  });
  const faAnanya = await prisma.feeAssignment.create({
    data: {
      studentId: student2.id,
      feeTypeId: ftAnanya.id,
      originalAmount: 40000,
      adjustedAmount: 40000,
      dueDate: future30,
      status: 'PARTIAL',
    },
  });

  const inst1 = await prisma.installment.create({
    data: { feeAssignmentId: faAnanya.id, installmentNo: 1, amount: 20000, dueDate: past15, status: 'PAID' },
  });
  const inst2 = await prisma.installment.create({
    data: { feeAssignmentId: faAnanya.id, installmentNo: 2, amount: 20000, dueDate: future30, status: 'PENDING' },
  });

  const txnAnanya = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-1022',
      txnNumber: 'TXN-99448811',
      studentId: student2.id,
      feeAssignmentId: faAnanya.id,
      amount: 20000,
      method: 'UPI',
      status: 'SUCCESS',
      category: 'TUITION',
      bankReference: 'UPI-9876543210',
      collectedBy: 'System (Online Webhook)',
      remarks: 'Paid Installment 1 of 2 via UPI',
    },
  });

  await prisma.auditLog.create({
    data: { actor: 'Parent (Suresh Patel)', actionType: 'PAYMENT_RECEIVED', entityType: 'Transaction', entityId: txnAnanya.id, description: 'Verified UPI payment of ₹20,000 for Installment 1 for Ananya Patel (Receipt #RCP-2026-1022).' },
  });

  // --------------------------------------------------------------------------
  // SCENARIO 5: Aarav Sharma (STU-101) — Fee with a waiver applied
  // --------------------------------------------------------------------------
  const ftAarav = await prisma.feeType.create({
    data: { name: 'Annual Science & Tech Composite Fee', category: 'TUITION', amount: 30000, recurrence: 'ANNUALLY', targetScope: 'ALL' },
  });
  const faAarav = await prisma.feeAssignment.create({
    data: {
      studentId: student1.id,
      feeTypeId: ftAarav.id,
      originalAmount: 30000,
      adjustedAmount: 24000,
      dueDate: future12,
      status: 'PENDING',
    },
  });

  const waiverAarav = await prisma.waiver.create({
    data: {
      studentId: student1.id,
      feeAssignmentId: faAarav.id,
      amount: 6000,
      reason: 'Merit Excellence Scholarship (20%)',
      approvedBy: 'School Principal',
    },
  });

  await prisma.auditLog.create({
    data: { actor: 'School Principal', actionType: 'WAIVER_APPLIED', entityType: 'Waiver', entityId: waiverAarav.id, description: 'Applied 20% Merit Scholarship waiver of ₹6,000 to Aarav Sharma for Annual Science & Tech Composite Fee.' },
  });
  await prisma.notification.create({
    data: { recipientType: 'PARENT', recipientId: parent1.id, title: '🎁 Fee Waiver Applied', message: 'A 20% Merit Scholarship waiver of ₹6,000 was applied to Aarav Sharma account. New amount due: ₹24,000.', type: 'waiver_applied' },
  });

  // Additional System Audit Record
  await prisma.auditLog.create({
    data: { actor: 'System Seeder', actionType: 'DATABASE_SEEDED', entityType: 'System', entityId: 'SEED-VARIED-2026', description: 'Seeded 5 distinct realistic student scenarios (Gurpreet, Priya, Rohan, Ananya, Aarav).' },
  });

  console.log('✅ Database successfully seeded with 5 distinct student fee scenarios!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
