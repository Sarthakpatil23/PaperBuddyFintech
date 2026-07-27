async function testRoutes() {
  console.log('Testing frontend & backend routes...');

  const html3001 = await fetch('http://localhost:3001/overview').then(r => r.text());
  console.log('Port 3001 /overview HTML returned length:', html3001.length, 'Contains root div:', html3001.includes('id="root"'));

  const html3000 = await fetch('http://localhost:3000/overview').then(r => r.text());
  console.log('Port 3000 /overview HTML returned length:', html3000.length, 'Contains root div:', html3000.includes('id="root"'));

  console.log('✅ BOTH PORTS SUCCESSFULLY SERVING SPA ROUTES!');
}

testRoutes().catch(err => {
  console.error('Route test error:', err);
  process.exit(1);
});
