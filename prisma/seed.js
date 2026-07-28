import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Wiping all existing database records...');

  // 0. Clean existing database records in strict foreign key dependency order
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

  console.log('✨ Database cleared completely. Populating fresh defaulter & payable fee records for ALL students...');

  // 1. Create Core Admin & Staff Users
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

  // 2. Create Parent Users & Parent Profiles
  const parentsData = [
    { email: 'aarav.sharma@paperbuddy.edu', name: 'Rajesh Sharma', phone: '+91 98765 43210', pass: 'aarav123', address: '102 Green Park, Delhi' },
    { email: 'ananya.patel@paperbuddy.edu', name: 'Suresh Patel', phone: '+91 98123 45678', pass: 'ananya123', address: '77 Saket Sector 4, Delhi' },
    { email: 'rohan.verma@paperbuddy.edu', name: 'Vikram Verma', phone: '+91 97654 32109', pass: 'rohan123', address: '45 Model Town, Delhi' },
    { email: 'priya.gupta@paperbuddy.edu', name: 'Anil Gupta', phone: '+91 99887 76655', pass: 'priya123', address: '88 Civil Lines, Delhi' },
    { email: 'gurpreet.singh@paperbuddy.edu', name: 'Harpreet Singh', phone: '+91 98450 11223', pass: 'gurpreet123', address: '12 Vikas Marg, Delhi' },
    { email: 'isha.reddy@paperbuddy.edu', name: 'Venkat Reddy', phone: '+91 97112 33445', pass: 'isha123', address: '54 Jubilee Hills, Hyderabad' },
    { email: 'vihaan.joshi@paperbuddy.edu', name: 'Amit Joshi', phone: '+91 98990 44556', pass: 'vihaan123', address: '19 FC Road, Pune' },
    { email: 'meera.nair@paperbuddy.edu', name: 'Ramesh Nair', phone: '+91 96554 88776', pass: 'meera123', address: '82 MG Road, Bengaluru' },
    { email: 'kapoor.family@paperbuddy.edu', name: 'Sanjay Kapoor', phone: '+91 95432 11009', pass: 'kapoor123', address: '30 Defence Colony, Delhi' },
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

  // 3. Create Student Enrollment Records (STU-101 to STU-110)
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
    { studentId: 'STU-110', name: 'Reyansh Kapoor', grade: 'Grade 11-B', section: 'B', rollNo: '110', parentEmail: 'kapoor.family@paperbuddy.edu' },
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

  // Reference dates
  const now = new Date();
  const future15 = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  const future30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const past10 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const past20 = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);
  const past35 = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);

  // 4. Create Fee Types
  const ftTuitionQ1 = await prisma.feeType.create({
    data: { name: 'Q1 Tuition Fee', category: 'TUITION', amount: 45000, recurrence: 'QUARTERLY', targetScope: 'ALL' },
  });
  const ftTuitionQ2 = await prisma.feeType.create({
    data: { name: 'Q2 Tuition Fee', category: 'TUITION', amount: 45000, recurrence: 'QUARTERLY', targetScope: 'ALL' },
  });
  const ftTransportQ1 = await prisma.feeType.create({
    data: { name: 'Q1 Transport Fee', category: 'TRANSPORT', amount: 12000, recurrence: 'QUARTERLY', targetScope: 'ALL' },
  });
  const ftTransportQ2 = await prisma.feeType.create({
    data: { name: 'Q2 Transport Fee', category: 'TRANSPORT', amount: 12000, recurrence: 'QUARTERLY', targetScope: 'ALL' },
  });
  const ftLabFee = await prisma.feeType.create({
    data: { name: 'Computer & Science Lab Fee', category: 'CUSTOM', amount: 15000, recurrence: 'ANNUALLY', targetScope: 'ALL' },
  });
  const ftAnnualDev = await prisma.feeType.create({
    data: { name: 'Annual Development Fee', category: 'TUITION', amount: 35000, recurrence: 'ANNUALLY', targetScope: 'ALL' },
  });
  const ftLateFee = await prisma.feeType.create({
    data: { name: 'Late Payment Penalty Fine', category: 'LATE_FEE', amount: 1500, recurrence: 'ONE_TIME', targetScope: 'ALL' },
  });
  const ftExamFee = await prisma.feeType.create({
    data: { name: 'Term Examination Fee', category: 'EXAM', amount: 3500, recurrence: 'QUARTERLY', targetScope: 'ALL' },
  });
  const ftSportsFee = await prisma.feeType.create({
    data: { name: 'Sports & Cultural Activities Fee', category: 'CUSTOM', amount: 8000, recurrence: 'ANNUALLY', targetScope: 'ALL' },
  });

  // Penalty Rules
  const pRuleTuition = await prisma.penaltyRule.create({
    data: { feeTypeId: ftTuitionQ1.id, triggerDaysAfterDue: 15, penaltyAmount: 1500, autoApply: true },
  });

  // 5. Create Fee Assignments & Scenarios FOR EVERY SINGLE STUDENT
  // (Every student gets AT LEAST 1 OVERDUE fee to make them a defaulter, plus PENDING/PARTIAL fees to test payments!)

  // STU-101 (Aarav Sharma) - OVERDUE (Defaulter) + PENDING (Payable) + WAIVER
  const faAaravOverdue = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-101'].id, feeTypeId: ftTuitionQ1.id, originalAmount: 45000, adjustedAmount: 36000, dueDate: past20, status: 'OVERDUE' },
  });
  await prisma.waiver.create({
    data: { studentId: studentMap['STU-101'].id, feeAssignmentId: faAaravOverdue.id, amount: 9000, percent: 20, reason: 'Merit Academic Scholarship (20%)', approvedBy: 'Principal Dr. Sharma' },
  });
  const txnAarav = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-1001',
      txnNumber: 'TXN-9001',
      studentId: studentMap['STU-101'].id,
      feeAssignmentId: faAaravOverdue.id,
      amount: 20000,
      method: 'UPI',
      status: 'SUCCESS',
      category: 'TUITION',
      bankReference: 'UPI-987112001',
      collectedBy: 'Razorpay Gateway',
      remarks: 'Partial Payment via PhonePe',
      dateTime: past10,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnAarav.id, status: 'RECONCILED', notes: 'Automated Razorpay HDFC Sync' },
  });

  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-101'].id, feeTypeId: ftLabFee.id, originalAmount: 15000, adjustedAmount: 15000, dueDate: future15, status: 'PENDING' },
  });

  // STU-102 (Ananya Patel) - OVERDUE (Defaulter) + PENDING (Payable)
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-102'].id, feeTypeId: ftTransportQ1.id, originalAmount: 12000, adjustedAmount: 12000, dueDate: past35, status: 'OVERDUE' },
  });
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-102'].id, feeTypeId: ftTuitionQ2.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: future15, status: 'PENDING' },
  });

  // STU-103 (Rohan Verma) - OVERDUE (Defaulter + Bounced Cheque) + PENDING (Payable)
  const faRohanOverdue = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-103'].id, feeTypeId: ftTuitionQ1.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: past35, status: 'OVERDUE' },
  });
  const faRohanPenalty = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-103'].id, feeTypeId: ftLateFee.id, originalAmount: 1500, adjustedAmount: 1500, dueDate: past10, status: 'OVERDUE' },
  });
  await prisma.appliedPenalty.create({
    data: { feeAssignmentId: faRohanOverdue.id, penaltyRuleId: pRuleTuition.id },
  });
  const txnRohanBounced = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-1004',
      txnNumber: 'TXN-9004',
      studentId: studentMap['STU-103'].id,
      feeAssignmentId: faRohanOverdue.id,
      amount: 45000,
      method: 'CHEQUE',
      status: 'BOUNCED',
      category: 'TUITION',
      chequeNumber: 'CHQ-889102',
      bankReference: 'ICICI Bank Memo #409',
      collectedBy: 'Accounts Counter',
      remarks: 'Cheque dishonoured by bank: Insufficient Funds',
      dateTime: past20,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnRohanBounced.id, status: 'FLAGGED', chequeDetails: 'CHQ-889102 ICICI', notes: 'Flagged for cheque bounce recovery follow-up' },
  });
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-103'].id, feeTypeId: ftTransportQ2.id, originalAmount: 12000, adjustedAmount: 12000, dueDate: future30, status: 'PENDING' },
  });

  // STU-104 (Diya Gupta) - OVERDUE (Defaulter) + PARTIAL (Payable)
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-104'].id, feeTypeId: ftAnnualDev.id, originalAmount: 35000, adjustedAmount: 35000, dueDate: past20, status: 'OVERDUE' },
  });
  const faDiyaPartial = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-104'].id, feeTypeId: ftTuitionQ2.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: future15, status: 'PARTIAL' },
  });
  const txnDiya = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-1005',
      txnNumber: 'TXN-9005',
      studentId: studentMap['STU-104'].id,
      feeAssignmentId: faDiyaPartial.id,
      amount: 25000,
      method: 'CASH',
      status: 'SUCCESS',
      category: 'TUITION',
      collectedBy: 'Priya Counter Staff',
      remarks: 'Counter Cash partial payment',
      dateTime: past10,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnDiya.id, status: 'PENDING', notes: 'Pending cash drawer match' },
  });

  // STU-105 (Kabir Singh) - OVERDUE (Defaulter) + PENDING (Payable)
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-105'].id, feeTypeId: ftTuitionQ1.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: past20, status: 'OVERDUE' },
  });
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-105'].id, feeTypeId: ftExamFee.id, originalAmount: 3500, adjustedAmount: 3500, dueDate: future30, status: 'PENDING' },
  });

  // STU-106 (Isha Reddy) - OVERDUE (Defaulter) + PENDING (Payable) + PAID
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-106'].id, feeTypeId: ftSportsFee.id, originalAmount: 8000, adjustedAmount: 8000, dueDate: past10, status: 'OVERDUE' },
  });
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-106'].id, feeTypeId: ftTuitionQ2.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: future15, status: 'PENDING' },
  });
  const faIshaPaid = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-106'].id, feeTypeId: ftTuitionQ1.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: past35, status: 'PAID' },
  });
  const txnIsha = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-1006',
      txnNumber: 'TXN-9006',
      studentId: studentMap['STU-106'].id,
      feeAssignmentId: faIshaPaid.id,
      amount: 45000,
      method: 'BANK_TRANSFER',
      status: 'SUCCESS',
      category: 'TUITION',
      bankReference: 'NEFT-AXIS-9921',
      collectedBy: 'NEFT Direct Sync',
      remarks: 'NEFT Direct Bank Credit',
      dateTime: past20,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnIsha.id, status: 'RECONCILED', notes: 'Matched with Axis Bank Statement' },
  });

  // STU-107 (Vihaan Joshi) - OVERDUE (Defaulter) + PENDING (Payable)
  const faVihaanOverdue = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-107'].id, feeTypeId: ftTransportQ1.id, originalAmount: 12000, adjustedAmount: 12000, dueDate: past10, status: 'OVERDUE' },
  });
  const txnVihaan = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-1007',
      txnNumber: 'TXN-9007',
      studentId: studentMap['STU-107'].id,
      feeAssignmentId: faVihaanOverdue.id,
      amount: 12000,
      method: 'BANK_TRANSFER',
      status: 'PENDING',
      category: 'TRANSPORT',
      bankReference: 'NEFT-SBI-441029',
      collectedBy: 'Pending NEFT System',
      remarks: 'Awaiting NEFT clearance',
      dateTime: past10,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnVihaan.id, status: 'PENDING', notes: 'Pending NEFT bank confirmation' },
  });
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-107'].id, feeTypeId: ftTuitionQ2.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: future30, status: 'PENDING' },
  });

  // STU-108 (Meera Nair) - OVERDUE (Defaulter) + PENDING (Payable)
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-108'].id, feeTypeId: ftLabFee.id, originalAmount: 15000, adjustedAmount: 15000, dueDate: past20, status: 'OVERDUE' },
  });
  const faMeeraTuition = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-108'].id, feeTypeId: ftTuitionQ2.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: future15, status: 'PENDING' },
  });
  const txnMeera = await prisma.transaction.create({
    data: {
      receiptNo: 'RCP-2026-1008',
      txnNumber: 'TXN-9008',
      studentId: studentMap['STU-108'].id,
      feeAssignmentId: faMeeraTuition.id,
      amount: 45000,
      method: 'CHEQUE',
      status: 'PENDING',
      category: 'TUITION',
      chequeNumber: 'CHQ-551029',
      bankReference: 'HDFC Bank Clearances',
      collectedBy: 'Counter Staff',
      remarks: 'Cheque accepted at desk',
      dateTime: past10,
    },
  });
  await prisma.reconciliationEntry.create({
    data: { transactionId: txnMeera.id, status: 'PENDING', chequeDetails: 'CHQ-551029 HDFC', notes: 'Cheque in clearing process' },
  });

  // STU-109 (Ananya Sharma) - OVERDUE (Defaulter + Waiver) + PENDING (Payable)
  const faAnanya2Overdue = await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-109'].id, feeTypeId: ftAnnualDev.id, originalAmount: 35000, adjustedAmount: 24500, dueDate: past20, status: 'OVERDUE' },
  });
  await prisma.waiver.create({
    data: { studentId: studentMap['STU-109'].id, feeAssignmentId: faAnanya2Overdue.id, amount: 10500, percent: 30, reason: 'Sibling Concession Waiver (30%)', approvedBy: 'Accounts Committee' },
  });
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-109'].id, feeTypeId: ftTransportQ2.id, originalAmount: 12000, adjustedAmount: 12000, dueDate: future30, status: 'PENDING' },
  });

  // STU-110 (Reyansh Kapoor) - OVERDUE (Defaulter) + PENDING (Payable)
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-110'].id, feeTypeId: ftTuitionQ1.id, originalAmount: 45000, adjustedAmount: 45000, dueDate: past20, status: 'OVERDUE' },
  });
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-110'].id, feeTypeId: ftLateFee.id, originalAmount: 1500, adjustedAmount: 1500, dueDate: past10, status: 'OVERDUE' },
  });
  await prisma.feeAssignment.create({
    data: { studentId: studentMap['STU-110'].id, feeTypeId: ftExamFee.id, originalAmount: 3500, adjustedAmount: 3500, dueDate: future15, status: 'PENDING' },
  });

  // 6. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { actor: 'School Admin', actionType: 'DATABASE_DEFAULTER_SEED', entityType: 'System', entityId: 'SEED-ALL-DEFAULTERS-2026', description: 'Assigned overdue fee assignments to all 10 students and active payable dues for payment testing' },
      { actor: 'Accounts Counter', actionType: 'CHEQUE_FLAGGED', entityType: 'Transaction', entityId: txnRohanBounced.id, description: 'Flagged bounced cheque #CHQ-889102 for Rohan Verma' },
      { actor: 'Scholarship Desk', actionType: 'WAIVER_APPROVED', entityType: 'Waiver', entityId: 'W-AARAV-101', description: 'Approved 20% Merit Scholarship for Aarav Sharma' },
    ],
  });

  // 7. System Notifications for Parents
  for (const pEmail of Object.keys(parentMap)) {
    const parent = parentMap[pEmail];
    await prisma.notification.create({
      data: {
        recipientType: 'PARENT',
        recipientId: parent.id,
        title: '⚠️ Overdue Fee & Defaulter Alert',
        message: `Dear ${parent.name}, overdue fee statements have been issued. Please clear your outstanding balance online to avoid late penalties.`,
        type: 'fee_notice',
      },
    });
  }

  console.log('✅ ALL 10 STUDENTS successfully assigned OVERDUE (Defaulter) and PAYABLE fees!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
