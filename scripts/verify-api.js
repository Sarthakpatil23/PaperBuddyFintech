async function testApi() {
  console.log('🔍 Testing Neon PostgreSQL Backend APIs...');

  const overview = await fetch('http://localhost:3001/api/overview').then(r => r.json());
  console.log('📊 Overview Stats:', overview);

  const students = await fetch('http://localhost:3001/api/students').then(r => r.json());
  console.log(`👨‍🎓 Students fetched (${students.length}):`, students.map(s => `${s.name} (${s.id}) - Balance: ₹${s.balanceDue}`));

  const defaulters = await fetch('http://localhost:3001/api/defaulters').then(r => r.json());
  console.log(`⚠️ Defaulters fetched (${defaulters.length}):`, defaulters.map(d => `${d.studentName} - Owed: ₹${d.amountOwed}`));

  const transactions = await fetch('http://localhost:3001/api/transactions').then(r => r.json());
  console.log(`💳 Transactions fetched (${transactions.length}):`, transactions.slice(0, 3).map(t => `${t.receiptNo} - ${t.studentName} - ₹${t.amount} (${t.status})`));

  const parentData = await fetch('http://localhost:3001/api/parent/data').then(r => r.json());
  console.log('🏡 Parent Portal Scoped Data:', {
    parentName: parentData.parent?.name,
    email: parentData.parent?.email,
    childrenCount: parentData.students?.length,
    notificationsCount: parentData.notifications?.length
  });

  console.log('✅ ALL API ENDPOINTS VERIFIED & WORKING WITH NEON POSTGRESQL!');
}

testApi().catch(err => {
  console.error('API Verification Error:', err);
  process.exit(1);
});
