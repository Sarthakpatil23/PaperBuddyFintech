async function runVerificationSuite() {
  console.log('================================================================');
  console.log('  PAPERBUDDY FINTECH — 5 SCENARIOS & BIDIRECTIONAL SYNC TEST   ');
  console.log('================================================================\n');

  const BASE_URL = 'http://localhost:3001';

  // --------------------------------------------------------------------------
  // PART 2: VERIFY DATA VISIBILITY FOR ALL 5 STUDENTS
  // --------------------------------------------------------------------------
  console.log('📋 [PART 2: DATA VISIBILITY AUDIT]');

  // 1. Gurpreet Singh (STU-105)
  try {
    const res = await fetch(`${BASE_URL}/api/parent/data?studentId=STU-105`);
    const data = await res.json();
    const student = data.students[0];
    const fa = student.feeAssignments[0];
    console.log(`  ✅ 1. Gurpreet Singh (STU-105): Status = ${fa.status}, Amount Due = ₹${Number(fa.adjustedAmount).toLocaleString('en-IN')}, Due Date = ${new Date(fa.dueDate).toISOString().split('T')[0]}`);
  } catch (err) {
    console.error('  ❌ Gurpreet audit failed:', err.message);
  }

  // 2. Priya Gupta (STU-104)
  try {
    const res = await fetch(`${BASE_URL}/api/defaulters`);
    const defaulters = await res.json();
    const priyaDef = defaulters.find(d => d.studentId === 'STU-104');
    console.log(`  ✅ 2. Priya Gupta (STU-104): Defaulter Owed = ₹${priyaDef?.amountOwed?.toLocaleString('en-IN')}, Days Overdue = ${priyaDef?.daysOverdue} days, Severity = ${priyaDef?.severity}`);
  } catch (err) {
    console.error('  ❌ Priya audit failed:', err.message);
  }

  // 3. Rohan Verma (STU-103)
  try {
    const resDef = await fetch(`${BASE_URL}/api/defaulters`);
    const defaulters = await resDef.json();
    const rohanDef = defaulters.find(d => d.studentId === 'STU-103');

    const resParent = await fetch(`${BASE_URL}/api/parent/data?studentId=STU-103`);
    const parentData = await resParent.json();
    const notifs = parentData.notifications;

    console.log(`  ✅ 3. Rohan Verma (STU-103): Defaulter Amount = ₹${rohanDef?.amountOwed?.toLocaleString('en-IN')}, Has Penalty = ${rohanDef?.hasPenaltyApplied}, Penalty Notification = "${notifs[0]?.title || 'None'}"`);
  } catch (err) {
    console.error('  ❌ Rohan audit failed:', err.message);
  }

  // 4. Ananya Patel (STU-102)
  try {
    const res = await fetch(`${BASE_URL}/api/parent/data?studentId=STU-102`);
    const data = await res.json();
    const student = data.students[0];
    const fa = student.feeAssignments[0];
    const txn = student.transactions[0];
    console.log(`  ✅ 4. Ananya Patel (STU-102): Overall Fee Status = ${fa.status}, Paid Txn = Receipt #${txn?.receiptNo} (₹${Number(txn?.amount).toLocaleString('en-IN')})`);
  } catch (err) {
    console.error('  ❌ Ananya audit failed:', err.message);
  }

  // 5. Aarav Sharma (STU-101)
  try {
    const res = await fetch(`${BASE_URL}/api/parent/data?studentId=STU-101`);
    const data = await res.json();
    const student = data.students[0];
    const fa = student.feeAssignments[0];
    const waiver = student.waivers[0];
    console.log(`  ✅ 5. Aarav Sharma (STU-101): Original Fee = ₹${Number(fa.originalAmount).toLocaleString('en-IN')}, Waiver = -₹${Number(waiver?.amount).toLocaleString('en-IN')} (${waiver?.reason}), Post-Waiver Adjusted Due = ₹${Number(fa.adjustedAmount).toLocaleString('en-IN')}`);
  } catch (err) {
    console.error('  ❌ Aarav audit failed:', err.message);
  }

  // --------------------------------------------------------------------------
  // PART 3: BIDIRECTIONAL SYNC TESTS (PARENT <-> ADMIN)
  // --------------------------------------------------------------------------
  console.log('\n🔄 [PART 3: BIDIRECTIONAL REAL-TIME SYNC TESTS]');

  // Test 3.1: Parent -> Admin Payment Sync (Gurpreet)
  console.log('  🧪 Test 3.1: Parent paying Gurpreet pending fee...');
  try {
    const resPay = await fetch(`${BASE_URL}/api/transactions/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'STU-105',
        amount: 25000,
        method: 'UPI',
        utrNo: `UTR-GUR-${Date.now().toString().slice(-6)}`,
        payerVPA: 'gurpreet.parent@upi',
      }),
    });
    const payData = await resPay.json();
    if (payData.success) {
      console.log(`    ✅ Success: Receipt #${payData.receiptNo} created for Gurpreet! Status updated live.`);
    } else {
      console.error('    ❌ Payment failed:', payData.error);
    }
  } catch (err) {
    console.error('    ❌ Test 3.1 Request Failed:', err.message);
  }

  // Test 3.2: Parent -> Admin Clearing Rohan Defaulter Status
  console.log('  🧪 Test 3.2: Parent clearing Rohan overdue + penalty fees...');
  try {
    const resPay = await fetch(`${BASE_URL}/api/transactions/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'STU-103',
        amount: 46500,
        method: 'UPI',
        utrNo: `UTR-ROH-${Date.now().toString().slice(-6)}`,
        payerVPA: 'rohan.parent@upi',
      }),
    });
    const payData = await resPay.json();

    const resDef = await fetch(`${BASE_URL}/api/defaulters`);
    const defaulters = await resDef.json();
    const rohanDef = defaulters.find(d => d.studentId === 'STU-103');

    if (payData.success && !rohanDef) {
      console.log(`    ✅ Success: Rohan paid ₹46,500 (Receipt #${payData.receiptNo}). Disappeared from Defaulter Tracking live!`);
    } else {
      console.error('    ❌ Rohan payment or defaulter clearance failed');
    }
  } catch (err) {
    console.error('    ❌ Test 3.2 Request Failed:', err.message);
  }

  // Test 3.3: Admin -> Parent Waiver Application Sync (Ananya)
  console.log('  🧪 Test 3.3: Admin applying ₹5,000 waiver to Ananya...');
  try {
    const resWaiver = await fetch(`${BASE_URL}/api/waivers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'STU-102',
        amount: 5000,
        reason: 'Mid-Term Academic Discount',
        approvedBy: 'School Principal',
      }),
    });
    const waiverData = await resWaiver.json();

    const resParent = await fetch(`${BASE_URL}/api/parent/data?studentId=STU-102`);
    const parentData = await resParent.json();
    const updatedFa = parentData.students[0].feeAssignments[0];

    if (waiverData.success && Number(updatedFa.adjustedAmount) === 35000) {
      console.log(`    ✅ Success: Waiver applied! Ananya's new adjusted balance on Parent Portal = ₹${Number(updatedFa.adjustedAmount).toLocaleString('en-IN')}`);
    } else {
      console.error('    ❌ Admin waiver sync failed');
    }
  } catch (err) {
    console.error('    ❌ Test 3.3 Request Failed:', err.message);
  }

  // Test 3.4: Admin -> Parent New Fee Assignment Sync (Priya)
  console.log('  🧪 Test 3.4: Admin assigning new Sports & Athletics Fee to Priya...');
  try {
    const resFee = await fetch(`${BASE_URL}/api/fee-structures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Annual Sports & Athletics Fee',
        category: 'CUSTOM',
        amount: 4500,
        recurrence: 'ONE_TIME',
        targetScope: 'STUDENT',
        targetStudentIds: ['STU-104'],
      }),
    });
    const feeData = await resFee.json();

    const resParent = await fetch(`${BASE_URL}/api/parent/data?studentId=STU-104`);
    const parentData = await resParent.json();
    const priyaAssignments = parentData.students[0].feeAssignments;
    const sportsFee = priyaAssignments.find(fa => fa.feeType?.name === 'Annual Sports & Athletics Fee');

    if (feeData.success && sportsFee) {
      console.log(`    ✅ Success: New fee "${sportsFee.feeType.name}" (₹${Number(sportsFee.adjustedAmount).toLocaleString('en-IN')}) appeared instantly on Priya's Parent Portal!`);
    } else {
      console.error('    ❌ New fee assignment sync failed');
    }
  } catch (err) {
    console.error('    ❌ Test 3.4 Request Failed:', err.message);
  }

  console.log('\n================================================================\n');
}

runVerificationSuite();
