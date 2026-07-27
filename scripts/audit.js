import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runAudit() {
  console.log('=== STARTING POST-FIX DATABASE VERIFICATION ===\n');

  const models = [
    { name: 'User', delegate: prisma.user },
    { name: 'Parent', delegate: prisma.parent },
    { name: 'Student', delegate: prisma.student },
    { name: 'ParentStudent', delegate: prisma.parentStudent },
    { name: 'FeeType', delegate: prisma.feeType },
    { name: 'FeeAssignment', delegate: prisma.feeAssignment },
    { name: 'Installment', delegate: prisma.installment },
    { name: 'Transaction', delegate: prisma.transaction },
    { name: 'Waiver', delegate: prisma.waiver },
    { name: 'ReconciliationEntry', delegate: prisma.reconciliationEntry },
    { name: 'AuditLog', delegate: prisma.auditLog },
    { name: 'Notification', delegate: prisma.notification }
  ];

  console.log('--- TABLE ROW COUNTS ---');
  for (const model of models) {
    const count = await model.delegate.count();
    console.log(`Table: ${model.name.padEnd(20)} | Row Count: ${count}`);
  }

  console.log('\n--- VERIFYING STUDENT -> PARENT LINKS ---');
  const students = await prisma.student.findMany({
    include: {
      parentStudents: {
        include: { parent: true }
      }
    }
  });

  let orphanedStudents = 0;
  for (const s of students) {
    const linkedParents = s.parentStudents.map(ps => ps.parent);
    console.log(`Student [${s.studentId}] ${s.name} (${s.grade}) -> Linked Parents (${linkedParents.length}):`);
    if (linkedParents.length === 0) {
      orphanedStudents++;
      console.log(`   ⚠️ NO PARENT LINKED (Orphaned Student)`);
    } else {
      linkedParents.forEach(p => console.log(`   -> Parent ID: ${p.id} | Name: "${p.name}" | Email: "${p.email}"`));
    }
  }

  console.log('\n--- VERIFYING PARENT -> STUDENT LINKS ---');
  const parents = await prisma.parent.findMany({
    include: {
      parentStudents: {
        include: { student: true }
      }
    }
  });

  let orphanedParents = 0;
  for (const p of parents) {
    const linkedStudents = p.parentStudents.map(ps => ps.student);
    console.log(`Parent [${p.id}] ${p.name} (${p.email}) -> Linked Students (${linkedStudents.length}):`);
    if (linkedStudents.length === 0) {
      orphanedParents++;
      console.log(`   ⚠️ NO STUDENT LINKED (Orphaned Parent)`);
    } else {
      linkedStudents.forEach(st => console.log(`   -> Student ID: ${st.studentId} | Name: "${st.name}" | Grade: "${st.grade}"`));
    }
  }

  console.log('\n--- VERIFYING PARENTSTUDENT JOIN TABLE INTEGRITY ---');
  const psCount = await prisma.parentStudent.count();
  console.log(`Total ParentStudent Join Rows: ${psCount}`);

  console.log('\n--- FINAL AUDIT CHECKLIST ---');
  console.log(`[x] Total Student Records: ${students.length}`);
  console.log(`[x] Total Parent Records: ${parents.length}`);
  console.log(`[x] Total Active Links: ${psCount}`);
  console.log(`[${orphanedStudents === 0 ? 'x' : ' '}] Orphaned Students Count: ${orphanedStudents}`);
  console.log(`[${orphanedParents === 0 ? 'x' : ' '}] Orphaned Parents Count: ${orphanedParents}`);

  await prisma.$disconnect();
}

runAudit().catch(err => {
  console.error('Audit Error:', err);
  process.exit(1);
});
