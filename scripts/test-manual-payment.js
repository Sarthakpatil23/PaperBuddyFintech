async function testManualPayment() {
  console.log('Testing /api/transactions/manual with human-readable fee category names...');

  const testCases = [
    { name: 'Tuition Fee (Q2)', category: 'Tuition Fee (Q2)', method: 'CASH' },
    { name: 'Transport Fee (Q2)', category: 'Transport Fee (Q2)', method: 'CHEQUE' },
    { name: 'Lab Special Fee', category: 'Lab Special Fee', method: 'CASH' }
  ];

  for (const tc of testCases) {
    try {
      const res = await fetch('http://localhost:3001/api/transactions/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'STU-101',
          feeCategory: tc.category,
          amount: 5000,
          method: tc.method,
          chequeNumber: tc.method === 'CHEQUE' ? 'CHQ-998811' : null,
          bankReference: 'HDFC Bank',
          remarks: `Test ${tc.name} payment`,
          collectedBy: 'Test Runner'
        })
      });

      const data = await res.json();
      if (data.success) {
        console.log(`✅ Success for category "${tc.category}" -> Normalized to Prisma Enum Category "${data.transaction.category}", Receipt: #${data.receiptNo}`);
      } else {
        console.error(`❌ Failed for category "${tc.category}":`, data.error);
      }
    } catch (err) {
      console.error(`❌ Request error for "${tc.category}":`, err.message);
    }
  }
}

testManualPayment();
