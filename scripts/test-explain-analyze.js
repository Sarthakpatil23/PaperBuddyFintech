import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runExplainAnalyze() {
  console.log('=== RUNNING EXPLAIN ANALYZE ON CORE DATABASE QUERIES ===\n');

  try {
    console.log('1. Query Plan: Student List Fetch (Filtered by isActive)');
    const q1 = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT s.*, p.name as parent_name
      FROM "Student" s
      LEFT JOIN "ParentStudent" ps ON s.id = ps."studentId"
      LEFT JOIN "Parent" p ON ps."parentId" = p.id
      WHERE s."isActive" = true
      ORDER BY s."studentId" ASC;
    `;
    console.log(q1.map(r => r['QUERY PLAN']).join('\n'));

    console.log('\n2. Query Plan: Transactions Log Fetch (Filtered by studentId)');
    const q2 = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT t.*, s.name as student_name
      FROM "Transaction" t
      JOIN "Student" s ON t."studentId" = s.id
      WHERE t."studentId" = 'cms1xnujt000h600x3emaiwyn'
      ORDER BY t."dateTime" DESC;
    `;
    console.log(q2.map(r => r['QUERY PLAN']).join('\n'));

    console.log('\n3. Query Plan: Defaulters Overdue Fetch (Filtered by status = OVERDUE)');
    const q3 = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT fa.*, s.name as student_name
      FROM "FeeAssignment" fa
      JOIN "Student" s ON fa."studentId" = s.id
      WHERE fa.status = 'OVERDUE'::"FeeStatus";
    `;
    console.log(q3.map(r => r['QUERY PLAN']).join('\n'));

    console.log('\n4. Query Plan: Parent Student Linkage Fetch (Filtered by parentId)');
    const q4 = await prisma.$queryRaw`
      EXPLAIN ANALYZE SELECT ps.*, s.name as student_name
      FROM "ParentStudent" ps
      JOIN "Student" s ON ps."studentId" = s.id
      WHERE ps."parentId" = 'cms1xntfd0007600x6n1hua9u';
    `;
    console.log(q4.map(r => r['QUERY PLAN']).join('\n'));

    console.log('\n✅ All EXPLAIN ANALYZE queries executed successfully!');
  } catch (err) {
    console.error('Error running EXPLAIN ANALYZE:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runExplainAnalyze();
