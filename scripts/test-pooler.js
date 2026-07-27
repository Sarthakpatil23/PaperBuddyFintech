import { PrismaClient } from '@prisma/client';

const pooledUrl = "postgresql://neondb_owner:npg_EUzjVOQJF7S1@ep-silent-bird-aygpv521-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";
const directUrl = "postgresql://neondb_owner:npg_EUzjVOQJF7S1@ep-silent-bird-aygpv521.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function testConnections() {
  console.log('Testing Direct URL Connection...');
  const directClient = new PrismaClient({ datasources: { db: { url: directUrl } } });
  try {
    const res = await directClient.student.count();
    console.log('✅ Direct connection successful! Student count:', res);
  } catch (err) {
    console.error('❌ Direct connection failed:', err.message);
  } finally {
    await directClient.$disconnect();
  }

  console.log('\nTesting Pooled URL Connection...');
  const pooledClient = new PrismaClient({ datasources: { db: { url: pooledUrl } } });
  try {
    const res = await pooledClient.student.count();
    console.log('✅ Pooled (-pooler) connection successful! Student count:', res);
  } catch (err) {
    console.error('❌ Pooled connection failed:', err.message);
  } finally {
    await pooledClient.$disconnect();
  }
}

testConnections();
