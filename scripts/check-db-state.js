import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

async function check() {
  const fa = await p.feeAssignment.findMany({
    include: { student: true, feeType: true, waivers: true, installments: true, transactions: true }
  });
  
  console.log('=== CURRENT FEE ASSIGNMENTS IN DB ===');
  fa.forEach(f => {
    const paidTxns = f.transactions.filter(t => t.status === 'SUCCESS');
    const totalPaid = paidTxns.reduce((s, t) => s + Number(t.amount), 0);
    console.log({
      student: f.student.studentId + ' - ' + f.student.name,
      fee: f.feeType.name,
      category: f.feeType.category,
      status: f.status,
      original: Number(f.originalAmount),
      adjusted: Number(f.adjustedAmount),
      dueDate: f.dueDate.toISOString().split('T')[0],
      totalPaid,
      installments: f.installments.length,
      waivers: f.waivers.length
    });
  });

  const students = await p.student.findMany({ include: { parentStudents: { include: { parent: true } } } });
  console.log('\n=== STUDENT-PARENT LINKS ===');
  students.forEach(s => {
    const parent = s.parentStudents[0]?.parent;
    console.log(`${s.studentId} (${s.name}) -> Parent: ${parent?.name || 'NO PARENT'} | Email: ${parent?.email || 'N/A'}`);
  });

  await p.$disconnect();
}

check().catch(e => { console.error(e); process.exit(1); });
