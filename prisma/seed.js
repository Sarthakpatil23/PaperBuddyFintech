import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with complete data for all students and admin operations...');

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

  // 1. Create Admin & Staff Users
  await prisma.user.create({
    data: {
      email: 'admin@school.edu',
      name: 'School Finance Admin',
      password: 'admin_password_2026',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'finance@school.edu',
      name: 'Finance Counter Staff',
      password: 'staff_password_2026',
      role: 'STAFF',
    },
  });

  // 2. Create Parent Users & Parent Entities
  const parentsData = [
    { email: 'aarav.sharma@paperbuddy.edu', name: 'Rajesh Sharma', phone: '+91 98765 43210', pass: 'aarav123', address: '102 Green Park, Delhi' },
    { email: 'ananya.patel@paperbuddy.edu', name: 'Suresh Patel', phone: '+91 98123 45678', pass: 'ananya123', address: '77 Saket Sector 4, Delhi' },
    { email: 'rohan.verma@paperbuddy.edu', name: 'Vikram Verma', phone: '+91 97654 32109', pass: 'rohan123', address: '45 Model Town, Delhi' },
    { email: 'priya.gupta@paperbuddy.edu', name: 'Anil Gupta', phone: '+91 99887 76655', pass: 'priya123', address: '88 Civil Lines, Delhi' },
    { email: 'gurpreet.singh@paperbuddy.edu', name: 'Harpreet Singh', phone: '+91 98450 11223', pass: 'gurpreet123', address: '12 Vikas Marg, Delhi' },
    { email: 'isha.reddy@paperbuddy.edu', name: 'Venkat Reddy', phone: '+91 97112 33445', pass: 'isha123', address: '54 Jubilee Hills, Hyderabad' },
    { email: 'vihaan.joshi@paperbuddy.edu', name: 'Amit Joshi', phone: '+91 98990 44556', pass: 'vihaan123', address: '19 FC Road, Pune' },
    { email: 'meera.nair@paperbuddy.edu', name: 'Ramesh Nair', phone: '+91 96554 88776', pass: 'meera123', address: '82 MG Road, Bengaluru' },
  ];

  const parentMap = {};
  for (const pd of parentsData) {
    const u = await prisma.user.create({
      data: { email: pd.email, name: `${pd.name} (Parent)`, password: pd.pass, role: 'PARENT' },
    });
    const p = await prisma.parent.create({
      data: { userId: u.id, name: pd.name, email: pd.email, password: pd.pass, phone: pd.phone, address: pd.address },
    });
    parentMap[pd.email] = p;
  }

  // 3. Create Student Enrollment Records (STU-101 through STU-109)
  const studentsData = [
    { studentId: 'STU-101', name: 'Aarav Sharma', grade: 'Grade 10-A', section: 'A', rollNo: '101', parentEmail: 'aarav.sharma@paperbuddy.edu' },
    { studentId: 'STU-102', name: 'Ananya Patel', grade: 'Grade 8-B', section: 'B', rollNo: '102', parentEmail: 'ananya.patel@paperbuddy.edu' },
    { studentId: 'STU-103', name: 'Rohan Verma', grade: 'Grade 12-C', section: 'C', rollNo: '103', parentEmail: 'rohan.verma@paperbuddy.edu' },
    { studentId: 'STU-104', name: 'Diya Gupta', grade: 'Grade 6-A', section: 'A', rollNo: '104', parentEmail: 'priya.gupta@paperbuddy.edu' },
    { studentId: 'STU-105', name: 'Kabir Singh', grade: 'Grade 9-B', section: 'B', rollNo: '105', parentEmail: 'gurpreet.singh@paperbuddy.edu' },
    { studentId: 'STU-106', name: 'Isha Reddy', grade: 'Grade 11-A', section: 'A', rollNo: '106', parentEmail: 'isha.reddy@paperbuddy.edu' },
    { studentId: 'STU-107', name: 'Vihaan Joshi', grade: 'Grade 7-C', section: 'C', rollNo: '107', parentEmail: 'vihaan.joshi@paperbuddy.edu' },
    { studentId: 'STU-108', name: 'Meera Nair', grade: 'Grade 10-B', section: 'B', rollNo: '108', parentEmail: 'meera.nair@paperbuddy.edu' },
    { studentId: 'STU-109', name: 'Ananya Sharma', grade: 'Grade 7-A', section: 'A', rollNo: '109', parentEmail: 'aarav.sharma@paperbuddy.edu' },
  ];

  const studentMap = {};
  for (const sd of studentsData) {
    const s = await prisma.student.create({
      data: { studentId: sd.studentId, name: sd.name, grade: sd.grade, section: sd.section, rollNo: sd.rollNo },
    });
    studentMap[sd.studentId] = s;

    const parent = parentMap[sd.parentEmail];
    if (parent) {
      await prisma.parentStudent.create({
        data: { parentId: parent.id, studentId: s.id },
      });
    }
  }

  // Timestamps
  const now = new Date();
  const future15 = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  const future30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const past10 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const past15 = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // 4. Create Fee Types
  const ftTuitionQ2 = await prisma.feeType.create({
    data: { name: 'Q2 Tuition Fee', category: 'TUITION', amount: 45000, recurrence: 'QUARTERLY', targetScope: 'ALL' },
  });
  const ftTransportQ2 = await prisma.feeType.create({
    data: { name: 'Transport Fee (Q2)', category: 'TRANSPORT', amount: 15000, recurrence: 'QUARTERLY', targetScope: 'ALL' },
  });
  const ftScienceLab = await prisma.feeType.create({
    data: { name: 'Annual Computer & Science Lab Fee', category: 'CUSTOM', amount: 20000, recurrence: 'ANNUALLY', targetScope: 'ALL' },
  });
  const ftAnnualComposite = await prisma.feeType.create({
    data: { name: 'Annual Composite School Fee', category: 'TUITION', amount: 40000, recurrence: 'ANNUALLY', targetScope: 'ALL' },
  });
  const ftLateFee = await prisma.feeType.create({
    data: { name: 'Late Payment Penalty Fine', category: 'LATE_FEE', amount: 1500, recurrence: 'ONE_TIME', targetScope: 'ALL' },
  });

  // 5. Create Fee Assignments & Scenarios for all students

  // STU-101 (Aarav Sharma)
  const faAarav1 = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-101'].id, feeTypeId: ftScienceLab.id, originalAmount: 30000, adjustedAmount: 24000, dueDate: future15, status: 'PENDING' },
  });
  await prisma.waiver.create({
    data: { studentId: studentMap['STU-101'].id, feeAssignmentId: faAarav1.id, amount: 6000, reason: 'Merit Excellence Scholarship (20%)', approvedBy: 'School Principal' },
  });
  const txnAarav = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-0887',
      txnNumber: 'TXN-8905',
      studentId: studentMap['STU-101'].id,
      feeAssignmentId: faAarav1.id,
      amount: 20000,
      method: 'UPI',
      status: 'SUCCESS',
      category: 'CUSTOM',
      bankReference: 'UTR9988112233',
      collectedBy: 'System (Online Webhook)',
      remarks: 'UPI Payment Confirmed via PhonePe',
      dateTime: past10,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnAarav.id, status: 'RECONCILED', notes: 'Matched with HDFC Bank Statement' },
  });

  // STU-102 (Ananya Patel)
  const faAnanya = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-102'].id, feeTypeId: ftAnnualComposite.id, originalAmount: 40000, adjustedAmount: 40000, dueDate: future30, status: 'PARTIAL' },
  });
  await prisma.installment.createMany({
    data: [
      { feeAssignmentId: faAnanya.id, installmentNo: 1, amount: 20000, dueDate: past15, status: 'PAID' },
      { feeAssignmentId: faAnanya.id, installmentNo: 2, amount: 20000, dueDate: future30, status: 'PENDING' },
    ],
  });
  const txnAnanya = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-0891',
      txnNumber: 'TXN-8901',
      studentId: studentMap['STU-102'].id,
      feeAssignmentId: faAnanya.id,
      amount: 36000,
      method: 'UPI',
      status: 'SUCCESS',
      category: 'TUITION',
      bankReference: 'UTR9821039401',
      collectedBy: 'System (Online Webhook)',
      remarks: 'Paid Q2 Tuition via Razorpay UPI',
      dateTime: past10,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnAnanya.id, status: 'RECONCILED', notes: 'Automated Razorpay Reconciliation' },
  });

  // STU-103 (Rohan Verma) - Overdue + Penalty + Bounced Cheque
  const faRohanBase = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-103'].id, feeTypeId: ftTuitionQ2.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: past30, status: 'OVERDUE' },
  });
  const faRohanPenalty = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-103'].id, feeTypeId: ftLateFee.id, originalAmount: 1500, adjustedAmount: 1500, dueDate: now, status: 'OVERDUE' },
  });
  const pRuleRohan = await prisma.penaltyRule.create({
    data: { feeTypeId: ftTuitionQ2.id, triggerDaysAfterDue: 15, penaltyAmount: 1500, autoApply: true },
  });
  await prisma.appliedPenalty.create({
    data: { feeAssignmentId: faRohanBase.id, penaltyRuleId: pRuleRohan.id },
  });
  const txnRohanBounced = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-0888',
      txnNumber: 'TXN-8904',
      studentId: studentMap['STU-103'].id,
      feeAssignmentId: faRohanBase.id,
      amount: 45000,
      method: 'CHEQUE',
      status: 'BOUNCED',
      category: 'TUITION',
      chequeNumber: 'CHQ-981023',
      bankReference: 'ICICI Bank Memo',
      collectedBy: 'Sanjay Kumar (Accounts)',
      remarks: 'Cheque dishonoured: Insufficient Funds',
      dateTime: past10,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnRohanBounced.id, status: 'FLAGGED', chequeDetails: 'CHQ-981023 ICICI Bank', notes: 'Cheque bounced due to insufficient funds' },
  });

  // STU-104 (Diya Gupta)
  const faDiya = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-104'].id, feeTypeId: ftTuitionQ2.id, originalAmount: 35000, adjustedAmount: 35000, dueDate: past10, status: 'OVERDUE' },
  });
  const txnDiya = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-0882',
      txnNumber: 'TXN-8906',
      studentId: studentMap['STU-104'].id,
      feeAssignmentId: faDiya.id,
      amount: 32000,
      method: 'CASH',
      status: 'SUCCESS',
      category: 'TUITION',
      collectedBy: 'Priya Mehta (Counter Staff)',
      remarks: 'Counter cash payment received',
      dateTime: past15,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnDiya.id, status: 'PENDING', notes: 'Pending cash deposit verification' },
  });

  // STU-105 (Kabir Singh)
  const faKabir = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-105'].id, feeTypeId: ftTuitionQ2.id, originalAmount: 25000, adjustedAmount: 25000, dueDate: future15, status: 'PENDING' },
  });
  await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-0889',
      txnNumber: 'TXN-8907',
      studentId: studentMap['STU-105'].id,
      feeAssignmentId: faKabir.id,
      amount: 14000,
      method: 'UPI',
      status: 'FAILED',
      category: 'TRANSPORT',
      bankReference: 'N/A',
      collectedBy: 'System (Online Webhook)',
      remarks: 'Transaction timed out at issuer bank',
      dateTime: past10,
    },
  });

  // STU-106 (Isha Reddy)
  const faIsha = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-106'].id, feeTypeId: ftTuitionQ2.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: past15, status: 'PAID' },
  });
  const txnIsha = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-0892',
      txnNumber: 'TXN-8902',
      studentId: studentMap['STU-106'].id,
      feeAssignmentId: faIsha.id,
      amount: 45000,
      method: 'CASH',
      status: 'SUCCESS',
      category: 'TUITION',
      collectedBy: 'Priya Mehta (Counter Staff)',
      remarks: 'Cash counter collection',
      dateTime: past15,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnIsha.id, status: 'RECONCILED', notes: 'Cash drawer reconciled with bank deposit slip' },
  });

  // STU-107 (Vihaan Joshi)
  const faVihaan = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-107'].id, feeTypeId: ftTransportQ2.id, originalAmount: 32000, adjustedAmount: 32000, dueDate: past10, status: 'PENDING' },
  });
  const txnVihaan = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-0895',
      txnNumber: 'TXN-8908',
      studentId: studentMap['STU-107'].id,
      feeAssignmentId: faVihaan.id,
      amount: 32000,
      method: 'BANK_TRANSFER',
      status: 'PENDING',
      category: 'TRANSPORT',
      bankReference: 'NEFT-99110022',
      collectedBy: 'NEFT Direct Deposit',
      remarks: 'Awaiting bank clearance',
      dateTime: past10,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnVihaan.id, status: 'PENDING', notes: 'NEFT credit verification pending' },
  });

  // STU-108 (Meera Nair)
  const faMeera = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-108'].id, feeTypeId: ftTransportQ2.id, originalAmount: 15000, adjustedAmount: 15000, dueDate: future15, status: 'PENDING' },
  });
  const txnMeera = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-0893',
      txnNumber: 'TXN-8903',
      studentId: studentMap['STU-108'].id,
      feeAssignmentId: faMeera.id,
      amount: 15000,
      method: 'CHEQUE',
      status: 'PENDING',
      category: 'TRANSPORT',
      chequeNumber: 'CHQ-449012',
      bankReference: 'HDFC Bank',
      collectedBy: 'Priya Mehta (Counter Staff)',
      remarks: 'Cheque accepted & deposited',
      dateTime: past10,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnMeera.id, status: 'PENDING', chequeDetails: 'CHQ-449012 HDFC Bank', notes: 'Cheque clearing in progress' },
  });

  // STU-109 (Ananya Sharma)
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-109'].id, feeTypeId: ftTuitionQ2.id, originalAmount: 58000, adjustedAmount: 58000, dueDate: future30, status: 'PENDING' },
  });

  // Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { actor: 'School Admin', actionType: 'FEE_STRUCTURE_CREATED', entityType: 'FeeType', entityId: ftTuitionQ2.id, description: 'Created Q2 Tuition Fee structure (₹45,000)' },
      { actor: 'System Seeder', actionType: 'DATABASE_SEEDED', entityType: 'System', entityId: 'SEED-FULL-2026', description: 'Seeded complete data for all 9 students and admin operations' },
      { actor: 'Automated Penalty Engine', actionType: 'AUTO_PENALTY_APPLIED', entityType: 'FeeAssignment', entityId: faRohanPenalty.id, description: 'Applied late payment penalty fine to Rohan Verma' }
    ]
  });

  // Notifications
  for (const pEmail of Object.keys(parentMap)) {
    const parent = parentMap[pEmail];
    await prisma.notification.create({
      data: {
        recipientType: 'PARENT',
        recipientId: parent.id,
        title: '🔔 Term Fee Notice',
        message: `Dear ${parent.name}, fee statements for 2026 session have been published. Please check your parent portal for breakdown.`,
        type: 'fee_notice',
      },
    });
  }

  console.log('✅ Complete dataset for all 9 students and admin operations successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
