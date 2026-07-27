async function runEndToEndWorkflowTests() {
  console.log('====================================================');
  console.log('    PAPERBUDDY FINTECH END-TO-END WORKFLOW TESTS   ');
  console.log('====================================================\n');

  const BASE_URL = 'http://localhost:3001';

  // --- WORKFLOW A: CREATING & ASSIGNING FEES ---
  console.log('🧪 [WORKFLOW A]: Admin Creating Fee Structure & Assigning to Scope...');
  try {
    const resA = await fetch(`${BASE_URL}/api/fee-structures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Term 3 Computer Science Fee',
        category: 'TUITION',
        amount: 15000,
        recurrence: 'ONE_TIME',
        targetScope: 'ALL',
      }),
    });
    const dataA = await resA.json();
    if (dataA.success) {
      console.log(`  ✅ Workflow A Success: Fee "${dataA.feeType.name}" assigned to ${dataA.assignmentsCount} students. Warning: ${dataA.warning || 'None'}`);
    } else {
      console.error('  ❌ Workflow A Error:', dataA.error);
    }
  } catch (err) {
    console.error('  ❌ Workflow A Request Failed:', err.message);
  }

  // --- WORKFLOW B: APPLYING A WAIVER ---
  console.log('\n🧪 [WORKFLOW B]: Admin Applying Fee Waiver...');
  try {
    const resB = await fetch(`${BASE_URL}/api/waivers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'STU-101',
        amount: 3000,
        reason: 'Merit Scholarship Discount',
        approvedBy: 'School Principal',
      }),
    });
    const dataB = await resB.json();
    if (dataB.success) {
      console.log(`  ✅ Workflow B Success: Waiver of ₹${dataB.waiver.amount} applied to ${dataB.feeAssignment.feeType.name}. Adjusted Amount: ₹${dataB.feeAssignment.adjustedAmount}`);
    } else {
      console.error('  ❌ Workflow B Error:', dataB.error);
    }
  } catch (err) {
    console.error('  ❌ Workflow B Request Failed:', err.message);
  }

  // --- WORKFLOW C: MANUAL & AUTOMATED PENALTIES ---
  console.log('\n🧪 [WORKFLOW C]: Admin & Cron Penalty Management...');
  try {
    const resC1 = await fetch(`${BASE_URL}/api/penalties/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'STU-101',
        penaltyAmount: 750,
        reason: 'Overdue Past 15 Days Fine',
        appliedBy: 'Finance Admin',
      }),
    });
    const dataC1 = await resC1.json();
    if (dataC1.success) {
      console.log(`  ✅ Workflow C1 Success: Manual Late Fee of ₹${dataC1.penaltyAssignment.originalAmount} applied to student.`);
    } else {
      console.error('  ❌ Workflow C1 Error:', dataC1.error);
    }

    const resC2 = await fetch(`${BASE_URL}/api/penalty-rules/run-check`, { method: 'POST' });
    const dataC2 = await resC2.json();
    if (dataC2.success) {
      console.log(`  ✅ Workflow C2 Success: Automated Penalty Cron Engine processed ${dataC2.result.processedCount} overdue items, applied ${dataC2.result.appliedCount} penalties.`);
    } else {
      console.error('  ❌ Workflow C2 Error:', dataC2.error);
    }
  } catch (err) {
    console.error('  ❌ Workflow C Request Failed:', err.message);
  }

  // --- WORKFLOW D: PARENT PAYMENT & REAL-TIME SYNC ---
  console.log('\n🧪 [WORKFLOW D]: Parent UPI Payment & Real-Time Sync...');
  try {
    const resD = await fetch(`${BASE_URL}/api/transactions/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'STU-101',
        amount: 12000,
        method: 'UPI',
        utrNo: `UTR${Date.now()}`,
        payerVPA: 'aarav.parent@upi',
        category: 'TUITION',
      }),
    });
    const dataD = await resD.json();
    if (dataD.success) {
      console.log(`  ✅ Workflow D Success: Payment of ₹${dataD.transaction.amount} verified! Receipt #${dataD.receiptNo} generated. Socket broadcast emitted.`);
    } else {
      console.error('  ❌ Workflow D Error:', dataD.error);
    }
  } catch (err) {
    console.error('  ❌ Workflow D Request Failed:', err.message);
  }

  // --- WORKFLOW E: NOTIFICATIONS & REMINDERS ---
  console.log('\n🧪 [WORKFLOW E]: Sending Admin Reminders & Checking Notifications...');
  try {
    const resE = await fetch(`${BASE_URL}/api/reminders/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentIds: ['STU-101', 'STU-102'],
        messageTemplate: 'Urgent Reminder: Please clear outstanding Q2 Tuition Dues before end of week.',
        senderAdmin: 'Finance Admin',
      }),
    });
    const dataE = await resE.json();
    if (dataE.success) {
      console.log(`  ✅ Workflow E Success: ${dataE.message}`);
    } else {
      console.error('  ❌ Workflow E Error:', dataE.error);
    }
  } catch (err) {
    console.error('  ❌ Workflow E Request Failed:', err.message);
  }

  console.log('\n====================================================\n');
}

runEndToEndWorkflowTests();
